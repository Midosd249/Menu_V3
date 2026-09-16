import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyCustomerAccessStatus } from "@/lib/menu/platform-onboarding";
import { activateApprovedWorkspace, getMyActivationRequest, submitActivationRequest, type CustomerActivationRequest } from "@/lib/menu/customer-lifecycle";
import { getMyStudio } from "@/lib/menu/owner";
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
      setCheckError(err instanceof Error ? err.message : "تعذر التحقق من حالة الحساب");
    } finally {
      setChecking(false);
    }
  }, [user]);

  useEffect(() => { void checkAccess(); }, [checkAccess]);

  if (isPending || checking) return <LoadingState />;
  if (!user) return <RedirectToSignIn />;
  if (hasTenant) return <Navigate to="/studio" replace />;
  if (checkError) return <ErrorState message={checkError} onRetry={() => void checkAccess()} />;

  return <CustomerLifecycleView lang={lang} status={status} request={request} busy={busy} setBusy={setBusy} error={formError} setError={setFormError} refresh={checkAccess} />;
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

  const showForm = status === "none" || status === "action_required" || status === "rejected";
  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <section className="w-full max-w-xl rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">{copy.brand}</Link><LangToggle /></div>
      <div className="mt-8 grid gap-2"><p className="text-sm font-medium text-accent">{copy.title}</p><h1 className="font-display text-2xl font-semibold">{status === "none" ? copy.noneTitle : status === "pending" ? copy.pendingTitle : status === "action_required" ? copy.actionTitle : status === "approved" ? copy.approvedTitle : status === "rejected" ? copy.rejectedTitle : copy.convertedTitle}</h1><p className="text-sm leading-6 text-muted">{status === "none" ? copy.noneBody : status === "pending" ? copy.pendingBody : status === "action_required" ? copy.actionBody : status === "approved" ? copy.approvedBody : status === "rejected" ? copy.rejectedBody : copy.convertedBody}</p>{copy.reason ? <p className="rounded-xl border border-line bg-sand/30 p-3 text-sm leading-6">{copy.reason}</p> : null}</div>
      {showForm ? <form className="mt-7 grid gap-4" onSubmit={submit}><Field label={copy.brandName}><Input required minLength={2} maxLength={80} value={brandNameAr} onChange={(e) => setBrandNameAr(e.target.value)} /></Field><Field label={copy.english}><Input maxLength={80} value={brandNameEn} onChange={(e) => setBrandNameEn(e.target.value)} /></Field><div className="grid gap-2"><label className="text-sm font-medium">{copy.type}</label><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{types.map(([value, ar, en]) => <button key={value} type="button" disabled={busy} onClick={() => setBusinessType(value)} className={`rounded-xl border px-3 py-3 text-sm transition ${businessType === value ? "border-foreground bg-foreground text-background" : "border-line bg-white"}`}>{lang === "ar" ? ar : en}</button>)}</div></div><Field label={copy.description}><textarea rows={3} maxLength={160} value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:ring-2" /></Field>{error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}<Button type="submit" disabled={busy} className="w-full">{busy ? "…" : copy.submit}</Button></form> : null}
      {status === "approved" ? <div className="mt-7 grid gap-2"><Button disabled={busy} className="w-full" onClick={() => void activate()}>{busy ? "…" : copy.activate}</Button></div> : null}
      {status === "converted" ? <Button className="mt-7 w-full" onClick={() => { window.location.href = "/studio"; }}>{copy.studio}</Button> : null}
      <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => void refresh()}>{copy.refresh}</Button>
      <p className="mt-5 text-xs leading-5 text-muted">{lang === "ar" ? "تسجيل الدخول ينشئ الحساب فقط. الاعتماد والتفعيل مرحلتان منفصلتان." : "Signing up creates the account only. Approval and workspace activation are separate stages."}</p>
    </section>
  </main>;
}
