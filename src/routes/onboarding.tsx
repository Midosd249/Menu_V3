import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyCustomerAccessStatus } from "@/lib/menu/platform-onboarding";
import { getMyStudio } from "@/lib/menu/owner";
import { LangToggle } from "@/components/lang-toggle";
import { LoadingState, ErrorState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

type AccessStatus = "none" | "pending" | "approved" | "converted" | "rejected";

function Onboarding() {
  const { lang } = useLang();
  const { user, isPending } = useCurrentUserState();
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState("");
  const [hasTenant, setHasTenant] = useState(false);
  const [status, setStatus] = useState<AccessStatus>("none");

  const checkAccess = useCallback(async () => {
    if (!user) {
      setChecking(false);
      return;
    }
    setChecking(true);
    setCheckError("");
    try {
      const studio = await getMyStudio();
      if (!studio.ok) {
        setCheckError(studio.error);
        return;
      }
      if ("tenant" in studio.data && studio.data.tenant) {
        setHasTenant(true);
        return;
      }
      const access = await getMyCustomerAccessStatus();
      if (!access.ok) {
        setCheckError(access.error);
        return;
      }
      setStatus(access.data.status);
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : "تعذر التحقق من حالة الحساب");
    } finally {
      setChecking(false);
    }
  }, [user]);

  useEffect(() => {
    void checkAccess();
  }, [checkAccess]);

  if (isPending || checking) return <LoadingState />;
  if (!user) return <RedirectToSignIn />;
  if (hasTenant) return <Navigate to="/studio" replace />;
  if (checkError) return <ErrorState message={checkError} onRetry={() => void checkAccess()} />;

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
      approvedBody: "Your request is approved. Use the registration link sent by the platform owner with the account matching the email used in your request.",
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

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
      <section className="w-full max-w-lg rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold">{copy.brand}</Link>
          <LangToggle />
        </div>
        <div className="mt-8 grid gap-3">
          <p className="text-sm font-medium text-accent">{copy.title}</p>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="text-sm leading-6 text-muted">{body}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {status === "none" ? <Button asChild><Link to="/">{copy.request}</Link></Button> : null}
          {status === "converted" ? <Button asChild><Link to="/studio">{lang === "ar" ? "فتح الاستوديو" : "Open Studio"}</Link></Button> : null}
          <Button type="button" variant="outline" onClick={() => void checkAccess}>{copy.refresh}</Button>
        </div>
        <p className="mt-5 text-xs leading-5 text-muted">{copy.signOutHint}</p>
      </section>
    </main>
  );
}
