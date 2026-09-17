import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyStudio } from "@/lib/menu/owner";
import { getSelfServeWorkspaceEligibility, provisionCustomerWorkspace, selfServeWorkspaceSetupSchema } from "@/lib/menu/self-serve-provisioning";
import { LangToggle } from "@/components/lang-toggle";
import { LoadingState, ErrorState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

type BusinessType = "restaurant" | "cafe" | "bakery" | "dessert" | "food_truck" | "other";

function Onboarding() {
  const { lang } = useLang();
  const { user, isPending } = useCurrentUserState();
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState("");
  const [hasTenant, setHasTenant] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [provisioned, setProvisioned] = useState(false);

  const checkAccess = useCallback(async () => {
    if (!user) { setChecking(false); return; }
    setChecking(true);
    setCheckError("");
    try {
      const studio = await getMyStudio();
      if (!studio.ok) { setCheckError(studio.error); return; }
      if ("tenant" in studio.data && studio.data.tenant) { setHasTenant(true); return; }
      const result = await getSelfServeWorkspaceEligibility();
      if (!result.ok) { setCheckError(result.error); return; }
      setEligible(result.data.eligible);
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر التحقق من الحساب" : "Could not verify the account"));
    } finally {
      setChecking(false);
    }
  }, [lang, user]);

  useEffect(() => { void checkAccess(); }, [checkAccess]);

  if (isPending || checking) return <LoadingState label={lang === "ar" ? "جارٍ التحقق…" : "Checking…"} />;
  if (!user) return <RedirectToSignIn />;
  if (hasTenant || provisioned) return <Navigate to="/studio" replace />;
  if (checkError) return <ErrorState message={checkError} onRetry={() => void checkAccess()} />;
  if (!eligible) return <ErrorState message={lang === "ar" ? "أكمل رقم الجوال السعودي في الحساب قبل إنشاء مساحة العمل." : "Complete your Saudi phone number before creating the workspace."} onRetry={() => void checkAccess()} />;

  return <SelfServeWorkspaceSetup busy={busy} setBusy={setBusy} error={formError} setError={setFormError} onProvisioned={() => setProvisioned(true)} />;
}

function SelfServeWorkspaceSetup({ busy, setBusy, error, setError, onProvisioned }: { busy: boolean; setBusy: (value: boolean) => void; error: string; setError: (value: string) => void; onProvisioned: () => void }) {
  const { lang } = useLang();
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const businessTypes: Array<[BusinessType, string, string]> = [
    ["restaurant", "مطعم", "Restaurant"], ["cafe", "كافيه", "Café"], ["bakery", "مخبز", "Bakery"],
    ["dessert", "حلويات", "Dessert"], ["food_truck", "عربة طعام", "Food truck"], ["other", "نشاط آخر", "Other"],
  ];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const data = { nameAr: String(form.get("nameAr") ?? "").trim(), nameEn: String(form.get("nameEn") ?? "").trim() || undefined, businessType, descriptionAr: String(form.get("descriptionAr") ?? "").trim() || undefined };
    const parsed = selfServeWorkspaceSetupSchema.safeParse(data);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message = issue?.path[0] === "nameAr" ? (lang === "ar" ? "أدخل اسم البراند." : "Enter the brand name.") : issue?.path[0] === "nameEn" ? (lang === "ar" ? "تحقق من الاسم بالإنجليزية." : "Check the English brand name.") : issue?.path[0] === "descriptionAr" ? (lang === "ar" ? "تحقق من الوصف المختصر." : "Check the short description.") : (lang === "ar" ? "اختر نوع النشاط." : "Choose a business type.");
      setError(message);
      return;
    }
    setBusy(true); setError("");
    try {
      const result = await provisionCustomerWorkspace({ data: parsed.data });
      if (!result.ok) throw new Error(result.error);
      onProvisioned();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : (lang === "ar" ? "تعذر إنشاء مساحة العمل." : "We couldn't create the workspace."));
    } finally { setBusy(false); }
  }

  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <section className="w-full max-w-xl rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">Menu V3</Link><LangToggle /></div>
      <div className="mt-8 grid gap-2"><p className="text-sm font-medium text-accent">{lang === "ar" ? "الخطوة الثانية" : "Step 2"}</p><h1 className="font-display text-2xl font-semibold">{lang === "ar" ? "جهّز مساحة عملك" : "Set up your workspace"}</h1><p className="text-sm leading-6 text-muted">{lang === "ar" ? "لا توجد موافقة يدوية. بعد إنشاء الحساب، جهّز مساحة عملك وادخل مباشرة إلى الاستوديو." : "There is no manual approval. After creating your account, set up your workspace and go directly to Studio."}</p></div>
      <form className="mt-7 grid gap-4" onSubmit={submit} noValidate>
        <Field label={lang === "ar" ? "اسم البراند أو المطعم" : "Brand / restaurant name"}><Input name="nameAr" required minLength={2} maxLength={80} autoComplete="organization" /></Field>
        <Field label={lang === "ar" ? "الاسم بالإنجليزية (اختياري)" : "English name (optional)"}><Input name="nameEn" maxLength={80} autoComplete="organization" /></Field>
        <div className="grid gap-2"><label className="text-sm font-medium">{lang === "ar" ? "نوع النشاط" : "Business type"}</label><div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label={lang === "ar" ? "نوع النشاط" : "Business type"}>{businessTypes.map(([value, ar, en]) => <button key={value} type="button" disabled={busy} aria-pressed={businessType === value} onClick={() => setBusinessType(value)} className={`min-h-11 rounded-xl border px-3 py-3 text-sm transition ${businessType === value ? "border-foreground bg-foreground text-background" : "border-line bg-white"}`}>{lang === "ar" ? ar : en}</button>)}</div></div>
        <Field label={lang === "ar" ? "وصف مختصر (اختياري)" : "Short description (optional)"}><textarea name="descriptionAr" rows={3} maxLength={160} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:ring-2" /></Field>
        {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}<Button type="submit" disabled={busy} className="mt-2 w-full">{busy ? (lang === "ar" ? "جارٍ إنشاء مساحة العمل…" : "Creating workspace…") : (lang === "ar" ? "إنشاء مساحة العمل والمتابعة" : "Create workspace & continue")}</Button>
      </form>
      <p className="mt-5 text-xs leading-5 text-muted">{lang === "ar" ? "يتم إنشاء مساحة واحدة للحساب من خلال الخادم فقط. لا يتم إنشاء منيو أو شعار أو بيانات دفع في هذه الخطوة." : "One workspace is provisioned for the account by the server. This step does not create a menu, logo, or billing data."}</p>
    </section>
  </main>;
}
