import { createFileRoute, Link } from "@tanstack/react-router";
import { Flash } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { updateTenant } from "@/lib/menu/owner";
import { useStudio, useStudioFlash } from "@/lib/menu/studio";

export const Route = createFileRoute("/studio/settings")({ component: SettingsPage });

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

      <section className="grid gap-2 rounded-xl border border-line p-5 text-sm text-ink-soft">
        <p>{lang === "ar" ? "صلاحيتك:" : "Your role:"} {snapshot.role}</p>
        <p>{snapshot.members.length} {lang === "ar" ? "أعضاء" : "members"}</p>
      </section>
    </div>
  );
}
