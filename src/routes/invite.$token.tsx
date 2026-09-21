import { useEffect, useState } from "react";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { acceptTeamInvitation } from "@/lib/menu/team-invitations";

export const Route = createFileRoute("/invite/$token")({ component: InvitePage });

function InvitePage() {
  const { token } = Route.useParams();
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      window.location.assign(`/login?invite=${encodeURIComponent(token)}`);
    }
  }, [isPending, token, user]);

  if (isPending || !user) return <LoadingState label={lang === "ar" ? "جارٍ التحقق من الدعوة…" : "Checking invitation…"} />;

  async function accept() {
    if (busy) return;
    setBusy(true);
    setError("");
    const result = await acceptTeamInvitation({ data: { token } });
    if (result.ok) {
      await navigate({ to: "/studio", replace: true });
    } else {
      setError(result.error);
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
      <section className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Menu V3</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">{lang === "ar" ? "دعوة إلى فريق النشاط" : "Team invitation"}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{lang === "ar" ? "هذه الدعوة مرتبطة ببريد حسابك ويمكن استخدامها مرة واحدة قبل انتهاء صلاحيتها." : "This invitation is bound to your account email and can be used once before it expires."}</p>
        {error ? <p className="mt-4 rounded-xl border border-bad/30 bg-bad/5 p-3 text-sm text-bad" role="alert">{error}</p> : null}
        <div className="mt-5 flex gap-2">
          <Button type="button" disabled={busy} onClick={() => void accept()}>{busy ? (lang === "ar" ? "جارٍ القبول…" : "Accepting…") : (lang === "ar" ? "قبول الدعوة" : "Accept invitation")}</Button>
          <Button type="button" variant="outline" disabled={busy} onClick={() => window.location.assign("/studio")}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
        </div>
      </section>
    </main>
  );
}
