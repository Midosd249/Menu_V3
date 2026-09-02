import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LangToggle } from "@/components/lang-toggle";
import { Flash, LoadingState, ErrorState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { createRestaurant, getMyStudio, seedStarterItems, updateTenant } from "@/lib/menu/owner";
import { slugify } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState("");
  const [hasTenant, setHasTenant] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    nameAr: "",
    nameEn: "",
    city: "الرياض",
    slug: "",
    whatsapp: "",
    branchNameAr: "الفرع الرئيسي",
    branchNameEn: "Main branch",
    addressAr: "",
  });
  const [items, setItems] = useState([
    { categoryAr: "القهوة", categoryEn: "Coffee", nameAr: "", nameEn: "", price: "" },
    { categoryAr: "المخبوزات", categoryEn: "Bakery", nameAr: "", nameEn: "", price: "" },
    { categoryAr: "المطبخ", categoryEn: "Kitchen", nameAr: "", nameEn: "", price: "" },
  ]);

  const checkStudio = useCallback(async () => {
    if (!user) {
      setChecking(false);
      return;
    }
    setChecking(true);
    setCheckError("");
    try {
      const result = await getMyStudio();
      if (!result.ok) {
        setCheckError(result.error);
        return;
      }
      setHasTenant("tenant" in result.data && Boolean(result.data.tenant));
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : t(copy.state.error, lang));
    } finally {
      setChecking(false);
    }
  }, [user, lang]);

  useEffect(() => {
    void checkStudio();
  }, [checkStudio]);

  if (isPending || checking) return <LoadingState />;
  if (!user) return <RedirectToSignIn />;
  if (checkError) {
    return <ErrorState message={checkError} onRetry={() => void checkStudio()} />;
  }
  if (hasTenant) return <Navigate to="/studio" replace />;

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function finish(publish: boolean) {
    if (busy) return;
    setBusy(true);
    setError("");
    setOk(false);
    try {
      const created = await createRestaurant({
        data: {
          nameAr: form.nameAr.trim(),
          nameEn: form.nameEn.trim() || undefined,
          slug: (form.slug.trim() || slugify(form.nameEn || form.nameAr)) || undefined,
          city: form.city.trim() || undefined,
          branchNameAr: form.branchNameAr.trim(),
          branchNameEn: form.branchNameEn.trim() || undefined,
          addressAr: form.addressAr.trim() || undefined,
          whatsapp: form.whatsapp.trim() || undefined,
        },
      });
      if (!created.ok) {
        setError(created.error);
        return;
      }

      const starter = items
        .filter((row) => row.nameAr.trim() && Number(row.price) >= 0 && row.price !== "")
        .map((row) => ({
          categoryAr: row.categoryAr,
          categoryEn: row.categoryEn,
          nameAr: row.nameAr.trim(),
          nameEn: row.nameEn.trim(),
          price: Number(row.price),
        }));

      if (starter.length) {
        const seeded = await seedStarterItems({ data: { items: starter } });
        if (!seeded.ok) {
          setError(seeded.error);
          return;
        }
      }

      if (publish) {
        const published = await updateTenant({ data: { isPublished: true } });
        if (!published.ok) {
          setError(published.error);
          return;
        }
      }

      setOk(true);
      await navigate({ to: "/studio", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t(copy.state.error, lang));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-dvh max-w-lg content-start gap-6 px-5 py-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold">
          {t(copy.brand, lang)}
        </Link>
        <LangToggle />
      </div>
      <div>
        <h1 className="font-display text-2xl font-semibold">{t(copy.onboarding.title, lang)}</h1>
        <p className="mt-1 text-sm text-muted">
          {step + 1} / 3 · {t([copy.onboarding.step1, copy.onboarding.step2, copy.onboarding.step3][step], lang)}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2" aria-label={`${step + 1} / 3`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 rounded-full ${i <= step ? "bg-accent" : "bg-sand"}`} />
        ))}
      </div>

      {step === 0 ? (
        <div className="grid gap-3">
          <Field label={t(copy.onboarding.restaurantAr, lang)}>
            <Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} required />
          </Field>
          <Field label={t(copy.onboarding.restaurantEn, lang)}>
            <Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
          </Field>
          <Field label={t(copy.studio.city, lang)}>
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
          </Field>
          <Field label={t(copy.studio.whatsapp, lang)}>
            <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} inputMode="tel" placeholder="9665XXXXXXXX" />
          </Field>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-3">
          <Field label={t(copy.studio.nameAr, lang)}>
            <Input value={form.branchNameAr} onChange={(e) => set("branchNameAr", e.target.value)} />
          </Field>
          <Field label={t(copy.studio.nameEn, lang)}>
            <Input value={form.branchNameEn} onChange={(e) => set("branchNameEn", e.target.value)} />
          </Field>
          <Field label={t(copy.studio.address, lang)}>
            <Input value={form.addressAr} onChange={(e) => set("addressAr", e.target.value)} />
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4">
          <p className="text-sm text-muted">{lang === "ar" ? "أضف ثلاثة أصناف للبداية، أو اتركها فارغة." : "Add three starter items, or leave them blank."}</p>
          {items.map((row, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-line p-3">
              <Input
                placeholder={t(copy.studio.nameAr, lang)}
                value={row.nameAr}
                onChange={(e) => setItems((prev) => prev.map((r, idx) => (idx === i ? { ...r, nameAr: e.target.value } : r)))}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder={t(copy.studio.price, lang)}
                  inputMode="decimal"
                  value={row.price}
                  onChange={(e) => setItems((prev) => prev.map((r, idx) => (idx === i ? { ...r, price: e.target.value } : r)))}
                />
                <Input
                  placeholder={lang === "ar" ? "التصنيف" : "Category"}
                  value={row.categoryAr}
                  onChange={(e) => setItems((prev) => prev.map((r, idx) => (idx === i ? { ...r, categoryAr: e.target.value } : r)))}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Flash error={error} ok={ok} />
      <div className="flex flex-wrap gap-2">
        {step > 0 ? (
          <Button type="button" variant="outline" disabled={busy} onClick={() => setStep(step - 1)}>
            {t(copy.onboarding.back, lang)}
          </Button>
        ) : null}
        {step < 2 ? (
          <Button
            type="button"
            disabled={busy || (step === 0 && form.nameAr.trim().length < 2)}
            onClick={() => setStep(step + 1)}
          >
            {t(copy.onboarding.continue, lang)}
          </Button>
        ) : (
          <>
            <Button type="button" variant="outline" disabled={busy} onClick={() => void finish(false)}>
              {t(copy.onboarding.skipItems, lang)}
            </Button>
            <Button type="button" disabled={busy} onClick={() => void finish(true)}>
              {busy ? t(copy.state.loading, lang) : t(copy.onboarding.finish, lang)}
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
