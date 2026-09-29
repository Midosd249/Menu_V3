import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flash } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { updateTenant } from "@/lib/menu/owner";
import { authClient } from "@/lib/auth/client";
import { useStudio, useStudioFlash } from "@/lib/menu/studio";

export const Route = createFileRoute("/studio/settings")({ component: SettingsPage });



function AccountSecurity({ lang }: { lang: "ar" | "en" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function requestClosure(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (!window.confirm(lang === "ar" ? "سيتم بدء حذف حسابك بشكل نهائي. هل تريد المتابعة؟" : "This starts permanent account deletion. Continue?")) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await authClient.deleteUser(password ? { password, callbackURL: "/login?mode=signup" } : { callbackURL: "/login?mode=signup" });
      if (result.error) throw new Error(result.error.message ?? "Unable to process the request.");
      setMessage(lang === "ar" ? "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. اتبع الرابط لإكمال العملية." : "A confirmation email was sent. Follow the link to complete the process.");
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر بدء العملية." : "Unable to start the request."));
    } finally { setBusy(false); }
  }

  return <section className="grid gap-3 rounded-xl border border-bad/30 p-5">
    <h2 className="font-medium">{lang === "ar" ? "أمان الحساب" : "Account security"}</h2>
    <p className="text-sm leading-6 text-muted">{lang === "ar" ? "يمكن للحسابات غير المرتبطة بمساحة مطعم طلب حذف الحساب نهائيًا. الحساب المرتبط بمطعم يحتاج أولًا إلى نقل أو إغلاق مساحة العمل." : "Accounts without a restaurant workspace can request permanent account deletion. Restaurant-linked accounts must first transfer or close the workspace."}</p>
    <form className="grid gap-3" onSubmit={requestClosure}>
      <Field label={lang === "ar" ? "كلمة المرور (إن كانت لديك)" : "Password (if you have one)"}><Input name="password" type="password" autoComplete="current-password" /></Field>
      {message ? <p className="text-sm text-ink-soft" role="status">{message}</p> : null}
      {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
      <Button type="submit" disabled={busy} variant="outline">{busy ? (lang === "ar" ? "جارٍ المعالجة…" : "Processing…") : (lang === "ar" ? "حذف الحساب" : "Delete account")}</Button>
    </form>
  </section>;
}

function SettingsPage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const flash = useStudioFlash();
  const tenant = snapshot.tenant;
  const publicHref = `/m/${tenant.slug}${snapshot.branches[0] ? `/${snapshot.branches[0].slug}` : ""}`;

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t(copy.nav.settings, lang)}</h1>
        <p className="text-sm text-muted">
          {tenant.isPublished ? t(copy.state.published, lang) : t(copy.state.draft, lang)}
        </p>
      </div>

      <section className="grid gap-3 rounded-xl border border-line p-5">
        <h2 className="font-medium">{lang === "ar" ? "الفوترة" : "Billing"}</h2>
        <p className="text-sm text-ink-soft">
          {lang === "ar"
            ? "راجع خطتك وفواتير الاشتراك الصادرة، ثم اطبع الفاتورة أو شاركها عبر واتساب. لا يوجد تحصيل تلقائي من هذه الصفحة."
            : "Review your plan and issued subscription invoices, then print or share an invoice through WhatsApp. No automatic collection happens here."}
        </p>
        <div>
          <Button asChild variant="outline">
            <Link to="/studio/billing">{lang === "ar" ? "فتح الفوترة والفواتير" : "Open billing & invoices"}</Link>
          </Button>
        </div>
      </section>

      <section id="publishing" className="grid scroll-mt-6 gap-3 rounded-xl border border-line p-5">
        <h2 className="font-medium">{lang === "ar" ? "النشر" : "Publishing"}</h2>
        <p className="text-sm text-ink-soft">
          {tenant.isPublished
            ? lang === "ar"
              ? "المنيو ظاهر للضيوف عبر الرابط ورمز QR."
              : "Guests can open this menu from the link and QR."
            : lang === "ar"
              ? "المسودة غير مرئية للضيوف. انشر عندما تكون جاهزاً."
              : "Drafts are hidden from guests. Publish when you are ready."}
        </p>
        <Flash error={flash.error} ok={flash.ok} />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={flash.busy}
            onClick={() => void flash.run(() => updateTenant({ data: { isPublished: !tenant.isPublished } }))}
          >
            {tenant.isPublished ? t(copy.studio.unpublish, lang) : t(copy.studio.publish, lang)}
          </Button>
          <Button asChild variant="outline">
            <Link to="/studio/preview">{t(copy.studio.previewDraft, lang)}</Link>
          </Button>
          {tenant.isPublished ? (
            <Button asChild variant="outline">
              <a href={publicHref}>{t(copy.studio.openMenu, lang)}</a>
            </Button>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 rounded-xl border border-line p-5">
        <h2 className="font-medium">{t(copy.studio.slug, lang)}</h2>
        <Field label={lang === "ar" ? "الرابط العام" : "Public URL"}>
          <Input readOnly value={typeof window !== "undefined" ? `${window.location.origin}${publicHref}` : publicHref} />
        </Field>
        <p className="text-xs text-muted">
          {lang === "ar" ? "تغيير الرابط غير متاح بعد النشر لتفادي كسر رموز QR المطبوعة." : "The slug stays stable so printed QR codes keep working."}
        </p>
      </section>

      <AccountSecurity lang={lang} />

      <section className="grid gap-2 rounded-xl border border-line p-5 text-sm text-ink-soft">
        <p>{lang === "ar" ? "صلاحيتك:" : "Your role:"} {snapshot.role}</p>
        <p>{snapshot.members.length} {lang === "ar" ? "أعضاء" : "members"}</p>
      </section>
    </div>
  );
}
