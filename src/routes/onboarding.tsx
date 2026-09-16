import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyCustomerAccessStatus } from "@/lib/menu/platform-onboarding";
import { getMyStudio } from "@/lib/menu/owner";
import { createSelfServeWorkspace } from "@/lib/menu/self-serve-onboarding";
import { LangToggle } from "@/components/lang-toggle";
import { LoadingState, ErrorState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

type AccessStatus = "none" | "pending" | "approved" | "converted" | "rejected";
type BusinessType = "restaurant" | "cafe" | "bakery" | "dessert" | "food_truck" | "other";

function isSelfServeMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("new") === "1";
}

function Onboarding() {
  const { lang } = useLang();
  const { user, isPending } = useCurrentUserState();
  const selfServe = isSelfServeMode();
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState("");
  const [hasTenant, setHasTenant] = useState(false);
  const [status, setStatus] = useState<AccessStatus>("none");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const checkAccess = useCallback(async () => {
    if (!user) { setChecking(false); return; }
    setChecking(true);
    setCheckError("");
    try {
      const studio = await getMyStudio();
      if (!studio.ok) { setCheckError(studio.error); return; }
      if ("tenant" in studio.data && studio.data.tenant) { setHasTenant(true); return; }
      if (selfServe) return;
      const access = await getMyCustomerAccessStatus();
      if (!access.ok) { setCheckError(access.error); return; }
      setStatus(access.data.status);
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : "تعذر التحقق من حالة الحساب");
    } finally {
      setChecking(false);
    }
  }, [selfServe, user]);

  useEffect(() => { void checkAccess(); }, [checkAccess]);

  if (isPending || checking) return <LoadingState />;
  if (!user) return <RedirectToSignIn />;
  if (hasTenant) return <Navigate to="/studio" replace />;
  if (checkError) return <ErrorState message={checkError} onRetry={() => void checkAccess()} />;

  if (selfServe) {
    return <SelfServeBrandSetup busy={busy} setBusy={setBusy} error={formError} setError={setFormError} />;
  }

  const copy = {
    ar: {
      brand: "Menu V3",
      title: "مساحة العميل بانتظار الاعتماد",
      noneTitle: "ابدأ بطلب الخدمة",
      noneBody: "الحساب وحده لا ينشئ مساحة مطعم. أرسل طلب الخدمة من الموقع، ثم يراجعه مالك المنصة قبل إنشاء مساحة العمل.",
      pendingTitle: "تم استلام طلبك",
      pendingBody: "طلبك قيد المراجعة. بعد الاعتماد ستصلك تعليمات ورابط التسجيل الآمن لإنشاء مساحة مطعمك.",
      approvedTitle: "تم اعتماد طلبك",
      approvedBody: "طلبك معتمد. استخدم رابط التسجيل الذي أرسلته إدارة المنصة بالحساب المرتبط بالبريد الذي قدمته في الطلب.",
      rejectedTitle: "لم تتم الموافقة على الطلب",
      rejectedBody: "يمكنك التواصل مع إدارة المنصة إذا أردت إعادة مراجعة الطلب.",
      convertedTitle: "مساحة العميل موجودة بالفعل",
      convertedBody: "هذا الحساب سبق ربطه بمساحة مطعم. أعد فتح الاستوديو.",
      request: "طلب الخدمة",
      refresh: "تحديث الحالة",
      signOutHint: "يمكنك العودة للموقع في أي وقت.",
    },
    en: {
      brand: "Menu V3",
      title: "Customer workspace awaiting approval",
      noneTitle: "Start with a service request",
      noneBody: "An account alone does not create a restaurant workspace. Submit a service request from the website, then the platform owner reviews it before workspace creation.",
      pendingTitle: "Your request was received",
      pendingBody: "Your request is under review. After approval, you will receive secure registration instructions and a link to create your restaurant workspace.",
      approvedTitle: "Your request is approved",
      approvedBody: "Your request is approved. Use the registration link sent by the platform owner with the account matching the email used in the request.",
      rejectedTitle: "The request was not approved",
      rejectedBody: "Contact the platform owner if you want the request reviewed again.",
      convertedTitle: "A customer workspace already exists",
      convertedBody: "This account has already been linked to a restaurant workspace. Open Studio again.",
      request: "Request service",
      refresh: "Refresh status",
      signOutHint: "You can return to the website at any time.",
    },
  }[lang];
  const title = status === "none" ? copy.noneTitle : status === "pending" ? copy.pendingTitle : status === "approved" ? copy.approvedTitle : status === "rejected" ? copy.rejectedTitle : copy.convertedTitle;
  const body = status === "none" ? copy.noneBody : status === "pending" ? copy.pendingBody : status === "approved" ? copy.approvedBody : status === "rejected" ? copy.rejectedBody : copy.convertedBody;

  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <section className="w-full max-w-lg rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">{copy.brand}</Link><LangToggle /></div>
      <div className="mt-8 grid gap-3"><p className="text-sm font-medium text-accent">{copy.title}</p><h1 className="font-display text-2xl font-semibold">{title}</h1><p className="text-sm leading-6 text-muted">{body}</p></div>
      <div className="mt-6 flex flex-wrap gap-2">{status === "none" ? <Button asChild><Link to="/">{copy.request}</Link></Button> : null}{status === "converted" ? <Button asChild><Link to="/studio">{lang === "ar" ? "فتح الاستوديو" : "Open Studio"}</Link></Button> : null}<Button type="button" variant="outline" onClick={() => void checkAccess()}>{copy.refresh}</Button></div>
      <p className="mt-5 text-xs leading-5 text-muted">{copy.signOutHint}</p>
    </section>
  </main>;
}

function SelfServeBrandSetup({ busy, setBusy, error, setError }: { busy: boolean; setBusy: (value: boolean) => void; error: string; setError: (value: string) => void }) {
  const { lang } = useLang();
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const [created, setCreated] = useState(false);
  const businessTypes: Array<[BusinessType, string, string]> = [
    ["restaurant", "مطعم", "Restaurant"],
    ["cafe", "كافيه", "Café"],
    ["bakery", "مخبز", "Bakery"],
    ["dessert", "حلويات", "Dessert"],
    ["food_truck", "عربة طعام", "Food truck"],
    ["other", "نشاط آخر", "Other"],
  ];

  if (created) return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink"><section className="w-full max-w-lg rounded-3xl border border-line bg-white p-7 shadow-sm"><p className="text-sm font-medium text-accent">{lang === "ar" ? "تم إنشاء البراند" : "Brand created"}</p><h1 className="mt-2 font-display text-2xl font-semibold">{lang === "ar" ? "مساحتك جاهزة" : "Your workspace is ready"}</h1><p className="mt-3 text-sm leading-6 text-muted">{lang === "ar" ? "سنكمل معك داخل الاستوديو خطوة بخطوة لبناء المنيو." : "We will continue inside Studio, step by step, to build your menu."}</p><Button className="mt-6 w-full" onClick={() => { window.location.href = "/studio"; }}>{lang === "ar" ? "دخول الاستوديو" : "Open Studio"}</Button></section></main>;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const result = await createSelfServeWorkspace({ data: {
        nameAr: String(form.get("nameAr") ?? "").trim(),
        nameEn: String(form.get("nameEn") ?? "").trim() || undefined,
        businessType,
        descriptionAr: String(form.get("descriptionAr") ?? "").trim() || undefined,
      } });
      if (!result.ok) throw new Error(result.error);
      setCreated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر إنشاء البراند" : "Could not create the brand"));
    } finally { setBusy(false); }
  }

  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink"><section className="w-full max-w-xl rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8"><div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">Menu V3</Link><LangToggle /></div><div className="mt-8 grid gap-2"><p className="text-sm font-medium text-accent">{lang === "ar" ? "الخطوة الثانية" : "Step 2"}</p><h1 className="font-display text-2xl font-semibold">{lang === "ar" ? "أنشئ البراند" : "Create your brand"}</h1><p className="text-sm leading-6 text-muted">{lang === "ar" ? "هذه المعلومات أساسية فقط. يمكنك إكمال الشعار والتفاصيل الأخرى لاحقًا من الاستوديو." : "Only the essentials are required now. You can complete the logo and other details later in Studio."}</p></div><form className="mt-7 grid gap-4" onSubmit={submit}><Field label={lang === "ar" ? "اسم البراند" : "Brand name"}><Input name="nameAr" required minLength={2} maxLength={80} autoComplete="organization" /></Field><Field label={lang === "ar" ? "الاسم بالإنجليزية (اختياري)" : "English name (optional)"}><Input name="nameEn" maxLength={80} /></Field><div className="grid gap-2"><label className="text-sm font-medium">{lang === "ar" ? "نوع النشاط" : "Business type"}</label><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{businessTypes.map(([value, ar, en]) => <button key={value} type="button" disabled={busy} onClick={() => setBusinessType(value)} className={`rounded-xl border px-3 py-3 text-sm transition ${businessType === value ? "border-foreground bg-foreground text-background" : "border-line bg-white"}`}>{lang === "ar" ? ar : en}</button>)}</div></div><Field label={lang === "ar" ? "وصف مختصر (اختياري)" : "Short description (optional)"}><textarea name="descriptionAr" rows={3} maxLength={160} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:ring-2" /></Field>{error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}<Button type="submit" disabled={busy} className="mt-2 w-full">{busy ? (lang === "ar" ? "جارٍ إنشاء البراند..." : "Creating brand...") : (lang === "ar" ? "إنشاء البراند والمتابعة" : "Create brand & continue")}</Button></form><p className="mt-5 text-xs leading-5 text-muted">{lang === "ar" ? "الشعار اختياري ويمكن إضافته لاحقًا من إعدادات البراند. لا يوجد SMS OTP في هذه المرحلة." : "The logo is optional and can be added later from Brand settings. No SMS OTP is used at this stage."}</p></section></main>;
}
