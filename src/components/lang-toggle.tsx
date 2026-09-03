import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const search = useRouterState({ select: (state) => state.location.search });
  const isPublicMenu = pathname === "/m" || pathname.startsWith("/m/");

  const changeLang = (next: "ar" | "en") => {
    if (isPublicMenu) {
      const currentSearch = search as Record<string, unknown>;
      void navigate({
        search: { ...currentSearch, lang: next === "en" ? "en" : undefined } as never,
      });
      return;
    }
    setLang(next);
  };

  return (
    <div
      className={cn("inline-flex h-9 items-center rounded-full border border-line bg-paper p-0.5 text-xs", className)}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
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
        className={cn(
          "h-8 min-w-10 rounded-full px-3 font-medium",
          lang === "en" ? "bg-ink text-paper" : "text-muted",
        )}
        onClick={() => changeLang("en")}
      >
        EN
      </button>
    </div>
  );
}
