import { useEffect, useState } from "react";
import { Check, Eye, Save } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { useStudio } from "@/lib/menu/studio";
import { MENU_THEMES, type ThemeKey } from "@/lib/theme";
import { saveTenantTheme } from "@/lib/theme/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studio/design")({ component: DesignPage });

function DesignPage() {
  const { lang } = useLang();
  const { snapshot, reload } = useStudio();
  const [selected, setSelected] = useState<ThemeKey>(snapshot.tenant.themeKey);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSelected(snapshot.tenant.themeKey);
  }, [snapshot.tenant.themeKey]);

  const saved = snapshot.tenant.themeKey;
  const dirty = selected !== saved;

  async function save() {
    if (!dirty || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await saveTenantTheme({ data: { themeKey: selected } });
      if (!result.ok) {
        setMessage(result.error);
        return;
      }

      // The server already invalidates its public-menu cache. Clear the browser
      // performance cache too so the same browser does not briefly render an
      // older published menu after a successful theme change.
      if (typeof window !== "undefined") {
        for (let i = window.sessionStorage.length - 1; i >= 0; i -= 1) {
          const key = window.sessionStorage.key(i);
          if (key?.startsWith("menu-v3:public:")) window.sessionStorage.removeItem(key);
        }
      }

      // Reload from the server rather than trusting the selected client state.
      // This makes the UI's Saved state evidence-based.
      await reload();
      setMessage(lang === "ar" ? "تم حفظ القالب ونشره للمنيو." : "Theme saved and published to the menu.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : lang === "ar" ? "تعذر الحفظ" : "Unable to save theme");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6">
      <header className="grid gap-2">
        <p className="text-sm font-medium text-accent">{lang === "ar" ? "التصميم" : "Design"}</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {lang === "ar" ? "اختر شخصية المنيو" : "Choose your menu personality"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              {lang === "ar" ? "المعاينة مؤقتة. لا يتغير المنيو المنشور حتى تضغط حفظ." : "Preview is temporary. The published menu changes only after Save."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full border px-3 py-2 text-xs", dirty ? "border-accent bg-accent/5 text-accent" : "border-line text-muted")}>
              {dirty ? (lang === "ar" ? "تغييرات غير محفوظة" : "Unsaved changes") : (lang === "ar" ? "محفوظ" : "Saved")}
            </span>
            <button type="button" onClick={save} disabled={!dirty || busy} className="inline-flex h-10 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-50">
              <Save className="size-4" />
              {busy ? (lang === "ar" ? "جارٍ الحفظ…" : "Saving…") : (lang === "ar" ? "حفظ" : "Save")}
            </button>
          </div>
        </div>
        {message ? <p role="status" className="text-sm text-muted" aria-live="polite">{message}</p> : null}
      </header>

      <section aria-label={lang === "ar" ? "قوالب التصميم" : "Theme options"} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MENU_THEMES.map((theme, index) => {
          const isSelected = selected === theme.key;
          const isSaved = saved === theme.key;
          return (
            <article key={theme.key} className={cn("overflow-hidden rounded-2xl border bg-paper transition", isSelected ? "border-ink ring-2 ring-ink/10" : "border-line hover:border-ink/30")}>
              <button type="button" onClick={() => setSelected(theme.key)} aria-pressed={isSelected} className="block w-full text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset">
                <div className={cn("menu-theme-preview", theme.preview.className)} aria-hidden="true">
                  <div className="preview-orb" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{lang === "ar" ? theme.name.ar : theme.name.en}</strong>
                </div>
                <div className="grid gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold">{lang === "ar" ? theme.name.ar : theme.name.en}</h2>
                    {isSaved ? <span className="inline-flex items-center gap-1 rounded-full bg-good/10 px-2 py-1 text-[11px] text-good"><Check className="size-3" />{lang === "ar" ? "الحالي" : "Current"}</span> : null}
                  </div>
                  <p className="text-sm leading-6 text-muted">{lang === "ar" ? theme.description.ar : theme.description.en}</p>
                  {isSelected && !isSaved ? <span className="text-xs font-medium text-accent">{lang === "ar" ? "محدد" : "Selected"}</span> : null}
                </div>
              </button>
              <div className="border-t border-line p-3">
                <Link to="/studio/preview" search={{ theme: theme.key }} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-line text-sm text-ink-soft hover:bg-sand">
                  <Eye className="size-4" />
                  {lang === "ar" ? "معاينة" : "Preview"}
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
