import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

export function LangToggle({ className, englishAvailable = true, disabled = false }: { className?: string; englishAvailable?: boolean; disabled?: boolean }) {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const search = useRouterState({ select: (state) => state.location.search });
  const isPublicMenu = pathname === "/m" || pathname.startsWith("/m/");
  const englishDisabled = disabled || !englishAvailable;

  const changeLang = (next: "ar" | "en") => {
    if (next === "en" && englishDisabled) return;
    if (isPublicMenu) {
      const currentSearch = search as Record<string, unknown>;
      void navigate({ search: { ...currentSearch, lang: next === "en" ? "en" : undefined } as never });
      return;
    }
    setLang(next);
  };

  return (
    <div className={cn("menu-lang-toggle inline-flex h-9 items-center rounded-full border border-line bg-paper p-0.5 text-xs", className)} role="group" aria-label={lang === "ar" ? "اختيار اللغة" : "Language selection"}>
      <button type="button" aria-pressed={lang === "ar"} className={cn("h-8 min-w-10 rounded-full px-3 font-medium", lang === "ar" ? "bg-ink text-paper" : "text-muted")} onClick={() => changeLang("ar")}>عربي</button>
      <button type="button" aria-pressed={lang === "en"} aria-disabled={englishDisabled} disabled={englishDisabled} title={englishDisabled ? (lang === "ar" ? "النسخة الإنجليزية غير متاحة لهذا المطعم" : "English content is not available for this menu") : undefined} className={cn("h-8 min-w-10 rounded-full px-3 font-medium", lang === "en" ? "bg-ink text-paper" : "text-muted", englishDisabled && "cursor-not-allowed opacity-45")} onClick={() => changeLang("en")}>EN</button>
    </div>
  );
}
