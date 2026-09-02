import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Flash, Sheet } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { DEFAULT_HOURS } from "@/lib/menu/hours";
import { copy, t } from "@/lib/menu/i18n";
import { deleteBranch, getBranchHours, saveBranch } from "@/lib/menu/owner";
import { useStudio, useStudioFlash } from "@/lib/menu/studio";
import type { Branch, BranchHour } from "@/lib/menu/types";
import { weekdayLabel } from "@/lib/utils";

export const Route = createFileRoute("/studio/branches")({ component: BranchesPage });

type Draft = {
  id?: string;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  mapsUrl: string;
  phone: string;
  isActive: boolean;
  hours: Array<Omit<BranchHour, "branchId">>;
};

function emptyDraft(): Draft {
  return {
    nameAr: "",
    nameEn: "",
    addressAr: "",
    addressEn: "",
    mapsUrl: "",
    phone: "",
    isActive: true,
    hours: DEFAULT_HOURS.map((h) => ({ ...h })),
  };
}

function BranchesPage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const flash = useStudioFlash();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function openEdit(branch: Branch) {
    const hoursRes = await getBranchHours({ data: { branchId: branch.id } });
    setDraft({
      id: branch.id,
      nameAr: branch.nameAr,
      nameEn: branch.nameEn,
      addressAr: branch.addressAr,
      addressEn: branch.addressEn,
      mapsUrl: branch.mapsUrl,
      phone: branch.phone,
      isActive: branch.isActive,
      hours: hoursRes.ok && hoursRes.data.hours.length ? hoursRes.data.hours.map(({ branchId: _b, ...rest }) => rest) : DEFAULT_HOURS.map((h) => ({ ...h })),
    });
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t(copy.nav.branches, lang)}</h1>
          <p className="text-sm text-muted">{snapshot.branches.length} {t(copy.studio.branches, lang)}</p>
        </div>
        <Button type="button" onClick={() => setDraft(emptyDraft())}>
          {t(copy.studio.addBranch, lang)}
        </Button>
      </div>
      <Flash error={flash.error} ok={flash.ok} />
      <ul className="grid gap-3">
        {snapshot.branches.map((b) => (
          <li key={b.id} className="grid gap-2 rounded-xl border border-line p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{lang === "ar" ? b.nameAr : b.nameEn || b.nameAr}</p>
                <p className="text-sm text-muted">{b.addressAr || b.addressEn || "—"}</p>
                <p className="text-xs text-muted">/{snapshot.tenant.slug}/{b.slug}</p>
              </div>
              <span className={`text-xs ${b.isActive ? "text-good" : "text-bad"}`}>
                {b.isActive ? (lang === "ar" ? "نشط" : "Active") : lang === "ar" ? "متوقف" : "Inactive"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => void openEdit(b)}>
                {lang === "ar" ? "تعديل" : "Edit"}
              </Button>
              {snapshot.branches.length > 1 ? (
                <Button type="button" size="sm" variant="ghost" onClick={() => setPendingId(b.id)}>
                  {t(copy.studio.delete, lang)}
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {draft ? (
        <Sheet title={draft.id ? (lang === "ar" ? "تعديل فرع" : "Edit branch") : t(copy.studio.addBranch, lang)} onClose={() => setDraft(null)}>
          <BranchForm
            draft={draft}
            setDraft={setDraft}
            busy={flash.busy}
            error={flash.error}
            ok={flash.ok}
            onSave={async () => {
              const ok = await flash.run(() =>
                saveBranch({
                  data: {
                    id: draft.id,
                    nameAr: draft.nameAr.trim(),
                    nameEn: draft.nameEn.trim(),
                    addressAr: draft.addressAr.trim(),
                    addressEn: draft.addressEn.trim(),
                    mapsUrl: draft.mapsUrl.trim(),
                    phone: draft.phone.trim(),
                    isActive: draft.isActive,
                    hours: draft.hours.map((h) => ({
                      weekday: h.weekday,
                      opensAt: h.opensAt,
                      closesAt: h.closesAt,
                      isClosed: h.isClosed,
                    })),
                  },
                }),
              );
              if (ok) setDraft(null);
            }}
          />
        </Sheet>
      ) : null}

      {pendingId ? (
        <Sheet title={t(copy.studio.confirmDelete, lang)} onClose={() => setPendingId(null)}>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="danger"
              disabled={flash.busy}
              onClick={async () => {
                const ok = await flash.run(() => deleteBranch({ data: { id: pendingId } }));
                if (ok) setPendingId(null);
              }}
            >
              {t(copy.studio.yesDelete, lang)}
            </Button>
            <Button type="button" variant="outline" onClick={() => setPendingId(null)}>
              {t(copy.studio.cancel, lang)}
            </Button>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}

function BranchForm({
  draft,
  setDraft,
  busy,
  error,
  ok,
  onSave,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  busy: boolean;
  error: string;
  ok: boolean;
  onSave: () => void;
}) {
  const { lang } = useLang();
  useEffect(() => {
    /* keep hours array stable */
  }, []);
  return (
    <div className="grid gap-3">
      <Field label={t(copy.studio.nameAr, lang)}>
        <Input value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} />
      </Field>
      <Field label={t(copy.studio.nameEn, lang)}>
        <Input value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
      </Field>
      <Field label={t(copy.studio.address, lang)}>
        <Input value={draft.addressAr} onChange={(e) => setDraft({ ...draft, addressAr: e.target.value })} />
      </Field>
      <Field label={t(copy.studio.phone, lang)}>
        <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} inputMode="tel" />
      </Field>
      <Field label={t(copy.studio.maps, lang)}>
        <Input value={draft.mapsUrl} onChange={(e) => setDraft({ ...draft, mapsUrl: e.target.value })} />
      </Field>
      <label className="flex h-11 items-center gap-2 text-sm">
        <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
        {lang === "ar" ? "فرع نشط" : "Active branch"}
      </label>
      <p className="text-sm font-medium">{t(copy.studio.hours, lang)}</p>
      <div className="grid gap-2">
        {draft.hours.map((h) => (
          <div key={h.weekday} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!h.isClosed}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    hours: draft.hours.map((x) => (x.weekday === h.weekday ? { ...x, isClosed: !e.target.checked } : x)),
                  })
                }
              />
              {weekdayLabel(h.weekday, lang)}
            </label>
            <Input
              type="time"
              className="h-10"
              disabled={h.isClosed}
              value={h.opensAt ?? "07:00"}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hours: draft.hours.map((x) => (x.weekday === h.weekday ? { ...x, opensAt: e.target.value } : x)),
                })
              }
            />
            <Input
              type="time"
              className="h-10"
              disabled={h.isClosed}
              value={h.closesAt ?? "00:00"}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hours: draft.hours.map((x) => (x.weekday === h.weekday ? { ...x, closesAt: e.target.value } : x)),
                })
              }
            />
          </div>
        ))}
      </div>
      <Flash error={error} ok={ok} />
      <Button type="button" disabled={busy || !draft.nameAr.trim()} onClick={onSave}>
        {busy ? t(copy.state.loading, lang) : t(copy.studio.save, lang)}
      </Button>
    </div>
  );
}
