import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyCustomerAccessStatus } from "@/lib/menu/platform-onboarding";
import { activateApprovedWorkspace, getMyActivationRequest, submitActivationRequest, type CustomerActivationRequest } from "@/lib/menu/customer-lifecycle";
import { getMyStudio } from "@/lib/menu/owner";
import { provisionCustomerWorkspace, selfServeWorkspaceSetupSchema } from "@/lib/menu/self-serve-provisioning";
import { LangToggle } from "@/components/lang-toggle";
import { LoadingState, ErrorState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

type AccessStatus = "none" | "pending" | "action_required" | "approved" | "converted" | "rejected";
type BusinessType = "restaurant" | "cafe" | "bakery" | "dessert" | "food_truck" | "other";

function Onboarding() {
  const { lang } = useLang();
  const { user, isPending } = useCurrentUserState();
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState("");
  const [hasTenant, setHasTenant] = useState(false);
  const [status, setStatus] = useState<AccessStatus>("none");
  const [request, setRequest] = useState<CustomerActivationRequest | null>(null);
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
      const [access, activation] = await Promise.all([getMyCustomerAccessStatus(), getMyActivationRequest()]);
      if (!access.ok) { setCheckError(access.error); return; }
      if (!activation.ok) { setCheckError(activation.error); return; }
      setStatus(access.data.status);
      setRequest(activation.data);
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر التحقق من حالة الحساب" : "Could not verify your account status"));
    } finally {
      setChecking(false);
    }
  }, [lang, user]);

  useEffect(() => { void checkAccess(); }, [checkAccess]);

  if (isPending || checking) return <LoadingState label={lang === "ar" ? "جارٍ التحقق…" : "Checking…"} />;
  if (!user) return <RedirectToSignIn />;
  if (hasTenant || provisioned) return <Navigate to="/studio" replace />;
  if (checkError) return <ErrorState message={checkError} onRetry={() => void checkAccess()} />;

  if (status === "none") {
    return <SelfServeWorkspaceSetup busy={busy} setBusy={setBusy} error={formError} setError={setFormError} onProvisioned={() => setProvisioned(true)} />;
  }

  return <CustomerLifecycleView lang={lang} status={status} request={request} busy={busy} setBusy={setBusy} error={formError} setError={setFormError} refresh={checkAccess} />;
}

function SelfServeWorkspaceSetup({ busy, setBusy, error, setError, onProvisioned }: { busy: boolean; setBusy: (value: boolean) => void; error: string; setError: (value: string) => void; onProvisioned: () => void }) {
  const { lang } = useLang();
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const businessTypes: Array<[BusinessType, string, string]> = [
    ["restaurant", "مطعم", "Restaurant"],
    ["cafe", "كافيه", "Café"],
    ["bakery", "مخبز", "Bakery"],
    ["dessert", "حلويات", "Dessert"],
    ["food_truck", "عربة طعام", "Food truck"],
    ["other", "نشاط آخر", "Other"],
  ];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const data = {
      nameAr: String(form.get("nameAr") ?? "").trim(),
      nameEn: String(form.get("nameEn") ?? "").trim() || undefined,
      businessType,
      descriptionAr: String(form.get("descriptionAr") ?? "").trim() || undefined,
    };
    const parsed = selfServeWorkspaceSetupSchema.safeParse(data);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message = issue?.path[0] === "nameAr"
        ? (lang === "ar" ? "أدخل اسم البراند." : "Enter the brand name.")
        : issue?.path[0] === "nameEn"
          ? (lang === "ar" ? "تحقق من الاسم بالإنجليزية." : "Check the English brand name.")
          : issue?.path[0] === "descriptionAr"
            ? (lang === "ar" ? "تحقق من الوصف المختصر." : "Check the short description.")
            : (lang === "ar" ? "اختر نوع النشاط." : "Choose a business type.");
      setError(message);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await provisionCustomerWorkspace({ data: parsed.data });
      if (!result.ok) throw new Error(result.error);
      onProvisioned();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : (lang === "ar" ? "تعذر إنشاء مساحة العمل." : "We couldn't create the workspace."));
    } finally {
      setBusy(false);
    }
  }

  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <section className="w-full max-w-xl rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">Menu V3</Link><LangToggle /></div>
      <div className="mt-8 grid gap-2">
        <p className="text-sm font-medium text-accent">{lang === "ar" ? "الخطوة الثانية" : "Step 2"}</p>
        <h1 className="font-display text-2xl font-semibold">{lang === "ar" ? "جهّز مساحة عملك" : "Set up your workspace"}</h1>
        <p className="text-sm leading-6 text-muted">{lang === "ar" ? "نحتاج المعلومات الأساسية فقط للبدء. يمكنك إكمال الشعار وباقي التفاصيل لاحقًا من الاستوديو." : "We only need the essentials to get started. You can complete the logo and other details later in Studio."}</p>
      </div>
      <form className="mt-7 grid gap-4" onSubmit={submit} noValidate>
        <Field label={lang === "ar" ? "اسم البراند أو المطعم" : "Brand / restaurant name"}><Input name="nameAr" required minLength={2} maxLength={80} autoComplete="organization" /></Field>
        <Field label={lang === "ar" ? "الاسم بالإنجليزية (اختياري)" : "English name (optional)"}><Input name="nameEn" maxLength={80} autoComplete="organization" /></Field>
        <div className="grid gap-2">
          <label className="text-sm font-medium">{lang === "ar" ? "نوع النشاط" : "Business type"}</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label={lang === "ar" ? "نوع النشاط" : "Business type"}>
            {businessTypes.map(([value, ar, en]) => <button key={value} type="button" disabled={busy} aria-pressed={businessType === value} onClick={() => setBusinessType(value)} className={`min-h-11 rounded-xl border px-3 py-3 text-sm transition ${businessType === value ? "border-foreground bg-foreground text-background" : "border-line bg-white"}`}>{lang === "ar" ? ar : en}</button>)}
          </div>
        </div>
        <Field label={lang === "ar" ? "وصف مختصر (اختياري)" : "Short description (optional)"}><textarea name="descriptionAr" rows={3} maxLength={160} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:ring-2" /></Field>
        {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
        <Button type="submit" disabled={busy} className="mt-2 w-full">{busy ? (lang === "ar" ? "جارٍ إنشاء مساحة العمل…" : "Creating workspace…") : (lang === "ar" ? "إنشاء مساحة العمل والمتابعة" : "Create workspace & continue")}</Button>
      </form>
      <p className="mt-5 text-xs leading-5 text-muted">{lang === "ar" ? "يتم إنشاء مساحة واحدة للحساب من خلال الخادم فقط. لا يتم إنشاء منيو أو شعار أو بيانات دفع في هذه الخطوة." : "One workspace is provisioned for the account by the server. This step does not create a menu, logo, or billing data."}</p>
    </section>
  </main>;
}

function CustomerLifecycleView({ lang, status, request, busy, setBusy, error, setError, refresh }: { lang: "ar" | "en"; status: AccessStatus; request: CustomerActivationRequest | null; busy: boolean; setBusy: (value: boolean) => void; error: string; setError: (value: string) => void; refresh: () => Promise<void> }) {
  const [businessType, setBusinessType] = useState<BusinessType>(request?.businessType ?? "restaurant");
  const [brandNameAr, setBrandNameAr] = useState(request?.brandNameAr ?? "");
  const [brandNameEn, setBrandNameEn] = useState(request?.brandNameEn ?? "");
  const [descriptionAr, setDescriptionAr] = useState(request?.descriptionAr ?? "");
  const types: Array<[BusinessType, string, string]> = [
    ["restaurant", "مطعم", "Restaurant"], ["cafe", "كافيه", "Café"], ["bakery", "مخبز", "Bakery"],
    ["dessert", "حلويات", "Dessert"], ["food_truck", "عربة طعام", "Food truck"], ["other", "نشاط آخر", "Other"],
  ];

  useEffect(() => {
    if (!request) return;
    setBusinessType(request.businessType);
    setBrandNameAr(request.brandNameAr);
    setBrandNameEn(request.brandNameEn);
    setDescriptionAr(request.descriptionAr);
  }, [request?.id]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const result = await submitActivationRequest({ data: { nameAr: brandNameAr, nameEn: brandNameEn || undefined, businessType, descriptionAr: descriptionAr || undefined } });
      if (!result.ok) throw new Error(result.error);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر إرسال الطلب" : "Could not submit the request"));
    } finally { setBusy(false); }
  }

  async function activate() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const result = await activateApprovedWorkspace();
      if (!result.ok) throw new Error(result.error);
      window.location.href = "/studio";
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر تفعيل مساحة العمل" : "Could not activate the workspace"));
    } finally { setBusy(false); }
  }

  const copy = lang === "ar" ? {
    title: "تفعيل مساحة عملك",
    noneTitle: "أرسل طلب التفعيل",
    noneBody: "أنشئ حسابك أولًا. بعد إرسال بيانات البراند سيظهر الطلب مباشرة في مركز اعتماد المنصة. لن يتم إنشاء مساحة مطعم قبل موافقة الإدارة.",
    pendingTitle: "طلبك قيد المراجعة",
    pendingBody: "تم استلام طلب التفعيل. يمكنك تسجيل الدخول لاحقًا لمتابعة الحالة؛ لا يمكن دخول الاستوديو قبل الاعتماد.",
    actionTitle: "نحتاج معلومات إضافية",
    actionBody: "راجعت الإدارة طلبك وتحتاج إلى تعديل البيانات قبل إعادة إرساله.",
    approvedTitle: "تم اعتماد طلبك",
    approvedBody: "تم اعتماد الطلب. فعّل مساحة العمل الآن، وبعدها يمكنك الدخول إلى الاستوديو وإكمال إعداد البراند والمنيو.",
    rejectedTitle: "لم تتم الموافقة على الطلب",
    rejectedBody: "يمكنك إرسال الطلب مرة أخرى بعد مراجعة ملاحظات الإدارة.",
    convertedTitle: "مساحتك جاهزة",
    convertedBody: "تم تفعيل مساحة العمل لهذا الحساب.",
    brand: "Menu V3",
    brandName: "اسم البراند",
    english: "الاسم بالإنجليزية (اختياري)",
    type: "نوع النشاط",
    description: "وصف مختصر (اختياري)",
    submit: request ? "إعادة إرسال طلب التفعيل" : "إرسال طلب التفعيل",
    activate: "تفعيل مساحة العمل",
    studio: "فتح الاستوديو",
    refresh: "تحديث الحالة",
    reason: request?.decisionReason ? `ملاحظة الإدارة: ${request.decisionReason}` : "",
  } : {
    title: "Activate your workspace",
    noneTitle: "Submit activation request",
    noneBody: "Create your account first. After you submit your brand details, the request appears in Platform Admin. No restaurant workspace is created before approval.",
    pendingTitle: "Your request is under review",
    pendingBody: "Your activation request was received. You can sign in again later to check the status; Studio remains unavailable until approval.",
    actionTitle: "Action required",
    actionBody: "The platform team reviewed your request and needs updated information before it can be resubmitted.",
    approvedTitle: "Your request is approved",
    approvedBody: "Your request is approved. Activate the workspace now, then enter Studio to finish your brand and menu setup.",
    rejectedTitle: "The request was not approved",
    rejectedBody: "You can submit the request again after reviewing the platform team's notes.",
    convertedTitle: "Your workspace is ready",
    convertedBody: "This account already has an activated workspace.",
    brand: "Menu V3",
    brandName: "Brand name",
    english: "English name (optional)",
    type: "Business type",
    description: "Short description (optional)",
    submit: request ? "Resubmit activation request" : "Submit activation request",
    activate: "Activate workspace",
    studio: "Open Studio",
    refresh: "Refresh status",
    reason: request?.decisionReason ? `Admin note: ${request.decisionReason}` : "",
  };

  const showForm = status === "action_required" || status === "rejected";
  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <section className="w-full max-w-xl rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">{copy.brand}</Link><LangToggle /></div>
      <div className="mt-8 grid gap-2"><p className="text-sm font-medium text-accent">{copy.title}</p><h1 className="font-display text-2xl font-semibold">{status === "pending" ? copy.pendingTitle : status === "action_required" ? copy.actionTitle : status === "approved" ? copy.approvedTitle : status === "rejected" ? copy.rejectedTitle : copy.convertedTitle}</h1><p className="text-sm leading-6 text-muted">{status === "pending" ? copy.pendingBody : status === "action_required" ? copy.actionBody : status === "approved" ? copy.approvedBody : status === "rejected" ? copy.rejectedBody : copy.convertedBody}</p>{copy.reason ? <p className="rounded-xl border border-line bg-sand/30 p-3 text-sm leading-6">{copy.reason}</p> : null}</div>
      {showForm ? <form className="mt-7 grid gap-4" onSubmit={submit}><Field label={copy.brandName}><Input required minLength={2} maxLength={80} value={brandNameAr} onChange={(e) => setBrandNameAr(e.target.value)} /></Field><Field label={copy.english}><Input maxLength={80} value={brandNameEn} onChange={(e) => setBrandNameEn(e.target.value)} /></Field><div className="grid gap-2"><label className="text-sm font-medium">{copy.type}</label><div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label={copy.type}>{types.map(([value, ar, en]) => <button key={value} type="button" disabled={busy} aria-pressed={businessType === value} onClick={() => setBusinessType(value)} className={`min-h-11 rounded-xl border px-3 py-3 text-sm transition ${businessType === value ? "border-foreground bg-foreground text-background" : "border-line bg-white"}`}>{lang === "ar" ? ar : en}</button>)}</div></div><Field label={copy.description}><textarea rows={3} maxLength={160} value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:ring-2" /> </Field>{error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}<Button type="submit" disabled={busy} className="w-full">{busy ? "…" : copy.submit}</Button></form> : null}
      {status === "approved" ? <div className="mt-7 grid gap-2"><Button disabled={busy} className="w-full" onClick={() => void activate()}>{busy ? "…" : copy.activate}</Button></div> : null}
      {status === "converted" ? <Button className="mt-7 w-full" onClick={() => { window.location.href = "/studio"; }}>{copy.studio}</Button> : null}
      <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => void refresh()}>{copy.refresh}</Button>
      <p className="mt-5 text-xs leading-5 text-muted">{lang === "ar" ? "مسار اعتماد العملاء الحالي محفوظ للحسابات المرتبطة بطلبات سابقة. الحسابات الجديدة بدون طلب اعتماد تستخدم الإعداد الذاتي الآمن." : "The existing approval path remains protected for accounts linked to prior requests. New accounts without an approval request use secure self-serve setup."}</p>
    </section>
  </main>;
}
