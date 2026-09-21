import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

export function LangToggle({ className, englishAvailable = true, disabled = false, compact = false }: { className?: string; englishAvailable?: boolean; disabled?: boolean; compact?: boolean }) {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const search = useRouterState({ select: (state) => state.location.search });
  const englishDisabled = disabled || !englishAvailable;

  const changeLang = (next: "ar" | "en") => {
    if (next === "en" && englishDisabled) return;
    setLang(next);
    const currentSearch = search as Record<string, unknown>;
    void navigate({ search: { ...currentSearch, lang: next === "en" ? "en" : undefined } as never, replace: true });
  };

  if (compact) {
    const nextLang = lang === "ar" ? "en" : "ar";
    const nextLabel = nextLang === "ar" ? "عربي" : "EN";
    const nextFlag = nextLang === "ar" ? "🇸🇦" : "🇬🇧";
    const nextDisabled = nextLang === "en" && englishDisabled;
    return (
      <button
        type="button"
        data-language-switcher="true"
        aria-label={nextLang === "ar" ? "التبديل إلى العربية" : "Switch to English"}
        aria-disabled={nextDisabled}
        disabled={nextDisabled}
        title={nextDisabled ? (lang === "ar" ? "النسخة الإنجليزية غير متاحة لهذا المطعم" : "English content is not available for this menu") : undefined}
        className={cn("menu-lang-toggle menu-lang-toggle--compact inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-line bg-paper px-2.5 text-xs font-semibold", className, nextDisabled && "cursor-not-allowed opacity-45")}
        onClick={() => changeLang(nextLang)}
      >
        <span aria-hidden="true">{nextFlag}</span>
        <span dir="ltr">{nextLabel}</span>
      </button>
    );
  }

  return (
    <div className={cn("menu-lang-toggle inline-flex h-9 items-center rounded-full border border-line bg-paper p-0.5 text-xs", className)} role="group" aria-label={lang === "ar" ? "اختيار اللغة" : "Language selection"}>
      <button type="button" aria-pressed={lang === "ar"} className={cn("h-8 min-w-10 rounded-full px-3 font-medium", lang === "ar" ? "bg-ink text-paper" : "text-muted")} onClick={() => changeLang("ar")}>عربي</button>
      <button type="button" aria-pressed={lang === "en"} aria-disabled={englishDisabled} disabled={englishDisabled} title={englishDisabled ? (lang === "ar" ? "النسخة الإنجليزية غير متاحة لهذا المطعم" : "English content is not available for this menu") : undefined} className={cn("h-8 min-w-10 rounded-full px-3 font-medium", lang === "en" ? "bg-ink text-paper" : "text-muted", englishDisabled && "cursor-not-allowed opacity-45")} onClick={() => changeLang("en")}>EN</button>
    </div>
  );
}
