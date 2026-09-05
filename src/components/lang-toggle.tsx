import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

export function LangToggle({ className, englishAvailable = true }: { className?: string; englishAvailable?: boolean }) {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isPublicMenu = pathname === "/m" || pathname.startsWith("/m/");

  const changeLang = (next: "ar" | "en") => {
    if (next === "en" && !englishAvailable) return;
    if (isPublicMenu) {
      void navigate({
        search: (previous) => ({ ...previous, lang: next === "en" ? "en" : undefined }),
      });
      return;
    }
    setLang(next);
  };

  return (
    <div
      className={cn("inline-flex h-9 items-center rounded-full border border-line bg-paper p-0.5 text-xs", className)}
      role="group"
      aria-label={lang === "ar" ? "اختيار اللغة" : "Language selection"}
    >
      <button
        type="button"
        aria-pressed={lang === "ar"}
        className={cn(
          "h-8 min-w-10 rounded-full px-3 font-medium",
          lang === "ar" ? "bg-ink text-paper" : "text-muted",
        )}
        onClick={() => changeLang("ar")}
      >
        عربي
      </button>
      <button
        type="button"
        aria-pressed={lang === "en"}
        aria-disabled={!englishAvailable}
        disabled={!englishAvailable}
        title={!englishAvailable ? (lang === "ar" ? "النسخة الإنجليزية غير متاحة لهذا المطعم" : "English content is not available for this menu") : undefined}
        className={cn(
          "h-8 min-w-10 rounded-full px-3 font-medium",
          lang === "en" ? "bg-ink text-paper" : "text-muted",
          !englishAvailable && "cursor-not-allowed opacity-45",
        )}
        onClick={() => changeLang("en")}
      >
        EN
      </button>
    </div>
  );
}
