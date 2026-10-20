import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { acceptTeamInvitation, getTeamInvitationPreview, type TeamInvitationPreview } from "@/lib/menu/team-invitations";

export const Route = createFileRoute("/invite/$token")({ component: InvitePage });

function InvitePage() {
  const { token } = Route.useParams();
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<TeamInvitationPreview | null>(null);
  const [previewError, setPreviewError] = useState("");
  const [previewLoading, setPreviewLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setPreviewLoading(true);
    setPreviewError("");
    setPreview(null);
    void getTeamInvitationPreview({ data: { token } }).then((result) => {
      if (!active) return;
      if (result.ok) setPreview(result.data.invitation);
      else setPreviewError(lang === "ar" ? result.error : result.code === "not_found" ? "This invitation link is invalid." : "We could not load this invitation. Please try again.");
    }).catch(() => {
      if (active) setPreviewError(lang === "ar" ? "تعذر الاتصال بالخادم. حاول مرة أخرى." : "Could not reach the server. Please try again.");
    }).finally(() => {
      if (active) setPreviewLoading(false);
    });
    return () => { active = false; };
  }, [lang, token]);

  if (isPending || previewLoading) return <LoadingState label={lang === "ar" ? "جارٍ التحقق من الدعوة…" : "Checking invitation…"} />;

  async function accept() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await acceptTeamInvitation({ data: { token } });
      if (result.ok) {
        await navigate({ to: "/studio", replace: true });
        return;
      }
      setError(lang === "ar" ? result.error : result.code === "unavailable" ? "We could not accept the invitation right now. Please try again." : "This invitation is invalid, expired, already used, or does not match the signed-in account.");
    } catch {
      setError(lang === "ar" ? "تعذر الاتصال بالخادم لقبول الدعوة. حاول مرة أخرى." : "Could not reach the server to accept the invitation. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (previewError || !preview) return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink"><section className="w-full max-w-md rounded-2xl border border-line bg-white p-6"><h1 className="font-display text-2xl font-semibold">{lang === "ar" ? "تعذر فتح الدعوة" : "Unable to open invitation"}</h1><p className="mt-3 text-sm text-bad" role="alert">{previewError || (lang === "ar" ? "رابط الدعوة غير صالح." : "This invitation link is invalid.")}</p><Link to="/" className="mt-4 inline-block text-sm underline">{lang === "ar" ? "العودة إلى الصفحة الرئيسية" : "Return home"}</Link></section></main>;

  const roleLabel = preview.role === "admin" ? (lang === "ar" ? "مدير" : "Admin") : (lang === "ar" ? "محرر" : "Editor");
  const tenantName = lang === "ar" ? preview.tenantNameAr : (preview.tenantNameEn || preview.tenantNameAr);
  const statusLabel = preview.status === "pending" ? (lang === "ar" ? "بانتظار القبول" : "Pending acceptance") : preview.status === "expired" ? (lang === "ar" ? "انتهت الصلاحية" : "Expired") : preview.status === "revoked" ? (lang === "ar" ? "أُلغيت الدعوة" : "Invitation revoked") : (lang === "ar" ? "استُخدمت الدعوة" : "Invitation already used");
  const emailMatches = Boolean(user?.primaryEmail && user.primaryEmail.trim().toLowerCase() === preview.email.trim().toLowerCase());
  const canAccept = preview.status === "pending" && Boolean(user) && emailMatches;

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
      <section className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Menuun</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">{lang === "ar" ? "دعوة للانضمام إلى فريق نشاط" : "Invitation to join a business team"}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{lang === "ar" ? "أنت مدعو للانضمام إلى النشاط التالي. لن تنضم إلا بعد تسجيل الدخول وقبول الدعوة." : "You have been invited to join the business below. You will join only after signing in and explicitly accepting."}</p>
        <dl className="mt-5 grid gap-3 rounded-xl border border-line bg-sand/20 p-4 text-sm">
          <div><dt className="text-muted">{lang === "ar" ? "النشاط" : "Business"}</dt><dd className="mt-1 font-semibold">{tenantName}</dd></div>
          <div><dt className="text-muted">{lang === "ar" ? "البريد المدعو" : "Invited email"}</dt><dd className="mt-1 break-all font-medium">{preview.email}</dd></div>
          <div><dt className="text-muted">{lang === "ar" ? "الدور" : "Role"}</dt><dd className="mt-1 font-medium">{roleLabel}</dd></div>
          <div><dt className="text-muted">{lang === "ar" ? "الحالة" : "Status"}</dt><dd className="mt-1 font-medium">{statusLabel}</dd></div>
          <div><dt className="text-muted">{lang === "ar" ? "تنتهي في" : "Expires"}</dt><dd className="mt-1">{new Date(preview.expiresAt).toLocaleString(lang === "ar" ? "ar-SA" : "en")}</dd></div>
        </dl>
        {preview.status !== "pending" ? <p className="mt-4 rounded-xl border border-bad/30 bg-bad/5 p-3 text-sm text-bad" role="alert">{statusLabel}</p> : null}
        {user && !emailMatches ? <div className="mt-4 grid gap-2"><p className="rounded-xl border border-bad/30 bg-bad/5 p-3 text-sm text-bad" role="alert">{lang === "ar" ? "البريد الحالي لا يطابق الدعوة. سجّل الخروج ثم استخدم الحساب المرتبط بالبريد المدعو." : "The signed-in email does not match this invitation. Sign out and use the account associated with the invited email."}</p><Button type="button" variant="outline" onClick={() => void signOut("/login?invite=" + encodeURIComponent(token))}>{lang === "ar" ? "تبديل الحساب" : "Switch account"}</Button></div> : null}
        {error ? <p className="mt-4 rounded-xl border border-bad/30 bg-bad/5 p-3 text-sm text-bad" role="alert">{error}</p> : null}
        {!user ? <div className="mt-5 grid gap-2"><a className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper" href={"/login?invite=" + encodeURIComponent(token)}>{lang === "ar" ? "تسجيل الدخول" : "Sign in"}</a><a className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-medium" href={"/login?mode=signup&invite=" + encodeURIComponent(token)}>{lang === "ar" ? "إنشاء حساب جديد" : "Create an account"}</a></div> : null}
        {canAccept ? <div className="mt-5 flex gap-2"><Button type="button" disabled={busy} onClick={() => void accept()}>{busy ? (lang === "ar" ? "جارٍ القبول…" : "Accepting…") : (lang === "ar" ? "قبول الدعوة والانضمام" : "Accept and join")}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => window.location.assign("/studio")}>{lang === "ar" ? "ليس الآن" : "Not now"}</Button></div> : null}
      </section>
    </main>
  );
}
