import { useState } from "react";
import { Clock3, Copy, MapPin, Phone } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Flash, Sheet } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { DEFAULT_HOURS } from "@/lib/menu/hours";
import { copy as copyText, t } from "@/lib/menu/i18n";
import { deleteBranch, getBranchHours, saveBranch } from "@/lib/menu/owner";
import { useStudio, useStudioFlash } from "@/lib/menu/studio";
import type { Branch, BranchHour } from "@/lib/menu/types";
import { weekdayLabel } from "@/lib/utils";

export const Route = createFileRoute("/studio/branches")({ component: BranchesPage });

type DraftHour = Omit<BranchHour, "branchId">;
type Draft = {
  id?: string;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  mapsUrl: string;
  phone: string;
  isActive: boolean;
  hours: DraftHour[];
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
      hours: hoursRes.ok && hoursRes.data.hours.length
        ? hoursRes.data.hours.map(({ branchId: _branchId, ...rest }) => rest)
        : DEFAULT_HOURS.map((h) => ({ ...h })),
    });
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Studio</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{t(copyText.nav.branches, lang)}</h1>
          <p className="mt-1 text-sm text-muted">
            {lang === "ar" ? "الموقع وساعات التشغيل لكل فرع في مكان واحد." : "Location and operating hours for every branch in one place."}
          </p>
        </div>
        <Button type="button" onClick={() => setDraft(emptyDraft())}>
          {t(copyText.studio.addBranch, lang)}
        </Button>
      </div>

      <Flash error={flash.error} ok={flash.ok} />

      <ul className="grid gap-3">
        {snapshot.branches.map((branch) => (
          <li key={branch.id} className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{lang === "ar" ? branch.nameAr : branch.nameEn || branch.nameAr}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${branch.isActive ? "bg-good/10 text-good" : "bg-bad/10 text-bad"}`}>
                    {branch.isActive ? (lang === "ar" ? "نشط" : "Active") : lang === "ar" ? "متوقف" : "Inactive"}
                  </span>
                </div>
                <div className="mt-2 grid gap-1 text-sm text-muted sm:grid-cols-2 sm:gap-x-5">
                  {branch.addressAr || branch.addressEn ? <span className="inline-flex min-w-0 items-center gap-2"><MapPin className="size-3.5 shrink-0" />{branch.addressAr || branch.addressEn}</span> : null}
                  {branch.phone ? <span className="inline-flex items-center gap-2"><Phone className="size-3.5 shrink-0" />{branch.phone}</span> : null}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => void openEdit(branch)}>
                  {lang === "ar" ? "إدارة الفرع" : "Manage branch"}
                </Button>
                {snapshot.branches.length > 1 ? (
                  <Button type="button" size="sm" variant="ghost" onClick={() => setPendingId(branch.id)}>
                    {t(copyText.studio.delete, lang)}
                  </Button>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {draft ? (
        <Sheet title={draft.id ? (lang === "ar" ? "إدارة الفرع" : "Manage branch") : t(copyText.studio.addBranch, lang)} onClose={() => setDraft(null)}>
          <BranchForm
            draft={draft}
            setDraft={setDraft}
            busy={flash.busy}
            error={flash.error}
            ok={flash.ok}
            onSave={async () => {
              const saved = await flash.run(() =>
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
              if (saved) setDraft(null);
            }}
          />
        </Sheet>
      ) : null}

      {pendingId ? (
        <Sheet title={t(copyText.studio.confirmDelete, lang)} onClose={() => setPendingId(null)}>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="danger"
              disabled={flash.busy}
              onClick={async () => {
                const deleted = await flash.run(() => deleteBranch({ data: { id: pendingId } }));
                if (deleted) setPendingId(null);
              }}
            >
              {t(copyText.studio.yesDelete, lang)}
            </Button>
            <Button type="button" variant="outline" onClick={() => setPendingId(null)}>
              {t(copyText.studio.cancel, lang)}
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
  setDraft: (draft: Draft) => void;
  busy: boolean;
  error: string;
  ok: boolean;
  onSave: () => void;
}) {
  const { lang } = useLang();
  const setHour = (weekday: number, patch: Partial<DraftHour>) => {
    setDraft({ ...draft, hours: draft.hours.map((hour) => hour.weekday === weekday ? { ...hour, ...patch } : hour) });
  };
  const copyHours = (source: DraftHour) => {
    setDraft({
      ...draft,
      hours: draft.hours.map((hour) => hour.weekday === source.weekday ? hour : {
        ...hour,
        opensAt: source.opensAt,
        closesAt: source.closesAt,
        isClosed: source.isClosed,
      }),
    });
  };

  return (
    <div className="grid gap-5">
      <section className="grid gap-3">
        <div>
          <h2 className="text-sm font-semibold">{lang === "ar" ? "بيانات الفرع" : "Branch details"}</h2>
          <p className="mt-1 text-xs leading-5 text-muted">{lang === "ar" ? "هذه المعلومات تظهر للعميل عند توفرها." : "These details appear to customers when provided."}</p>
        </div>
        <Field label={t(copyText.studio.nameAr, lang)}><Input value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} /></Field>
        <Field label={t(copyText.studio.nameEn, lang)}><Input value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} /></Field>
        <Field label={t(copyText.studio.address, lang)}><Input value={draft.addressAr} onChange={(e) => setDraft({ ...draft, addressAr: e.target.value })} /></Field>
        <Field label={lang === "ar" ? "العنوان بالإنجليزية" : "Address in English"}><Input value={draft.addressEn} onChange={(e) => setDraft({ ...draft, addressEn: e.target.value })} /></Field>
        <Field label={t(copyText.studio.maps, lang)}><Input value={draft.mapsUrl} onChange={(e) => setDraft({ ...draft, mapsUrl: e.target.value })} inputMode="url" placeholder="https://maps.google.com/..." /></Field>
        <Field label={t(copyText.studio.phone, lang)}><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} inputMode="tel" /></Field>
        <label className="flex min-h-11 items-center gap-3 rounded-xl border border-line px-3 text-sm">
          <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
          <span>{lang === "ar" ? "الفرع متاح للعملاء" : "Branch is available to customers"}</span>
        </label>
      </section>

      <section className="grid gap-3 border-t border-line pt-5">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand"><Clock3 className="size-5" /></div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">{t(copyText.studio.hours, lang)}</h2>
            <p className="mt-1 text-xs leading-5 text-muted">{lang === "ar" ? "حدد حالة كل يوم والوقت بدقة. استخدم نسخ الساعات لتجنب إعادة الإدخال." : "Set each day's status and times precisely. Copy hours to avoid repetitive entry."}</p>
          </div>
        </div>

        <div className="grid gap-2">
          {draft.hours.map((hour) => (
            <div key={hour.weekday} className={`rounded-2xl border p-3 ${hour.isClosed ? "border-line bg-sand/30" : "border-line bg-paper"}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{weekdayLabel(hour.weekday, lang)}</p>
                    <p className="mt-0.5 text-xs text-muted">{hour.isClosed ? (lang === "ar" ? "لا يستقبل العملاء" : "Closed") : `${formatTime(hour.opensAt)} – ${formatTime(hour.closesAt)}`}</p>
                  </div>
                  <div className="flex rounded-xl border border-line bg-paper p-1" role="group" aria-label={weekdayLabel(hour.weekday, lang)}>
                    <button type="button" aria-pressed={!hour.isClosed} onClick={() => setHour(hour.weekday, { isClosed: false })} className={`min-h-9 rounded-lg px-3 text-xs font-medium ${!hour.isClosed ? "bg-ink text-paper" : "text-muted hover:bg-sand"}`}>
                      {lang === "ar" ? "مفتوح" : "Open"}
                    </button>
                    <button type="button" aria-pressed={hour.isClosed} onClick={() => setHour(hour.weekday, { isClosed: true })} className={`min-h-9 rounded-lg px-3 text-xs font-medium ${hour.isClosed ? "bg-ink text-paper" : "text-muted hover:bg-sand"}`}>
                      {lang === "ar" ? "مغلق" : "Closed"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:w-64">
                  <label className="grid gap-1 text-[11px] text-muted">
                    <span>{lang === "ar" ? "يفتح" : "Opens"}</span>
                    <Input type="time" className="h-10" disabled={hour.isClosed} value={hour.opensAt ?? "07:00"} onChange={(e) => setHour(hour.weekday, { opensAt: e.target.value })} />
                  </label>
                  <label className="grid gap-1 text-[11px] text-muted">
                    <span>{lang === "ar" ? "يغلق" : "Closes"}</span>
                    <Input type="time" className="h-10" disabled={hour.isClosed} value={hour.closesAt ?? "00:00"} onChange={(e) => setHour(hour.weekday, { closesAt: e.target.value })} />
                  </label>
                </div>

                <button type="button" onClick={() => copyHours(hour)} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-line px-3 text-xs font-medium hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" title={lang === "ar" ? "نسخ هذه الساعات إلى بقية الأيام" : "Copy these hours to the other days"}>
                  <Copy className="size-3.5" />
                  <span>{lang === "ar" ? "تطبيق على الكل" : "Apply to all"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Flash error={error} ok={ok} />
      <Button type="button" disabled={busy || !draft.nameAr.trim()} onClick={onSave}>
        {busy ? t(copyText.state.loading, lang) : t(copyText.studio.save, lang)}
      </Button>
    </div>
  );
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 || 12;
  return `${normalized}:${String(minute).padStart(2, "0")} ${suffix}`;
}
