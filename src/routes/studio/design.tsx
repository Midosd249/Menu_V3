import { useEffect, useState } from "react";
import { Check, Eye, Save, Sparkles } from "lucide-react";
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
      if (typeof window !== "undefined") {
        for (let i = window.sessionStorage.length - 1; i >= 0; i -= 1) {
          const key = window.sessionStorage.key(i);
          if (key?.startsWith("menu-v3:public:")) window.sessionStorage.removeItem(key);
        }
      }
      await reload();
      setMessage(lang === "ar" ? "تم حفظ التصميم ونشره للمنيو." : "Design saved and published to the menu.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : lang === "ar" ? "تعذر الحفظ" : "Unable to save design");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-7">
      <header className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          <Sparkles className="size-4" />
          <span>{lang === "ar" ? "استوديو التصميم" : "Design Studio"}</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              {lang === "ar" ? "اختر تجربة بصرية، لا مجرد لون" : "Choose a visual experience, not a color skin"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              {lang === "ar"
                ? "كل تصميم يغيّر الإيقاع، التخطيط، الصور، البطاقات، الحركة والتفاصيل البصرية مع الحفاظ على بيانات المنيو نفسها."
                : "Each design changes rhythm, layout, imagery, cards, motion and visual details while keeping the same menu data."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full border px-3 py-2 text-xs", dirty ? "border-accent bg-accent/5 text-accent" : "border-line text-muted")}>
              {dirty ? (lang === "ar" ? "تغييرات غير محفوظة" : "Unsaved changes") : (lang === "ar" ? "التصميم الحالي" : "Current design")}
            </span>
            <button type="button" onClick={save} disabled={!dirty || busy} className="inline-flex h-10 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-50">
              <Save className="size-4" />
              {busy ? (lang === "ar" ? "جارٍ النشر…" : "Publishing…") : (lang === "ar" ? "نشر التصميم" : "Publish design")}
            </button>
          </div>
        </div>
        {message ? <p role="status" className="rounded-xl border border-line bg-paper/70 px-4 py-3 text-sm text-muted" aria-live="polite">{message}</p> : null}
      </header>

      <section aria-label={lang === "ar" ? "تصاميم المنيو" : "Menu designs"} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MENU_THEMES.map((theme, index) => {
          const isSelected = selected === theme.key;
          const isSaved = saved === theme.key;
          return (
            <article key={theme.key} className={cn("group overflow-hidden rounded-[1.4rem] border bg-paper transition duration-300", isSelected ? "border-ink ring-2 ring-ink/10" : "border-line hover:-translate-y-1 hover:border-ink/30")}>
              <button type="button" onClick={() => setSelected(theme.key)} aria-pressed={isSelected} className="block w-full text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset">
                <div className={cn("menu-theme-preview", theme.preview.className)} aria-hidden="true">
                  <div className="preview-orb" />
                  <div className="flex items-center justify-between gap-3">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="rounded-full bg-white/75 px-2 py-1 text-[10px] font-semibold tracking-normal text-ink">{lang === "ar" ? "مجاني" : "Free"}</span>
                  </div>
                  <strong>{lang === "ar" ? theme.name.ar : theme.name.en}</strong>
                </div>
                <div className="grid gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{lang === "ar" ? theme.name.ar : theme.name.en}</h2>
                      <p className="mt-1 text-xs font-medium text-accent">{lang === "ar" ? theme.promise.ar : theme.promise.en}</p>
                    </div>
                    {isSaved ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-good/10 px-2 py-1 text-[11px] text-good"><Check className="size-3" />{lang === "ar" ? "الحالي" : "Current"}</span> : null}
                  </div>
                  <p className="text-sm leading-6 text-muted">{lang === "ar" ? theme.description.ar : theme.description.en}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {theme.tags.map((tag) => <span key={tag.en} className="rounded-full border border-line bg-sand/40 px-2.5 py-1 text-[11px] text-muted">{lang === "ar" ? tag.ar : tag.en}</span>)}
                  </div>
                </div>
              </button>
              <div className="flex items-center gap-2 border-t border-line p-3">
                <Link to="/studio/preview" search={{ theme: theme.key }} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-sm font-medium text-ink-soft hover:bg-sand">
                  <Eye className="size-4" />
                  {lang === "ar" ? "معاينة كاملة" : "Full preview"}
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <aside className="grid gap-3 rounded-2xl border border-line bg-sand/30 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="grid size-11 place-items-center rounded-full bg-ink text-paper"><Sparkles className="size-5" /></div>
        <div>
          <h2 className="font-semibold">{lang === "ar" ? "كل التصاميم متاحة مجاناً" : "Every design is free"}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            {lang === "ar"
              ? "يمكن لكل عميل تجربة أي من التصاميم الخمسة واختيار الأنسب لهوية المطعم، مع بقاء بيانات الأصناف والهوية نفسها."
              : "Every client can try all five designs and choose the best fit for the restaurant identity while keeping the same menu data."}
          </p>
        </div>
      </aside>
    </main>
  );
}
