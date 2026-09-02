import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
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
        onClick={() => setLang("ar")}
      >
        عربي
      </button>
      <button
        type="button"
        className={cn(
          "h-8 min-w-10 rounded-full px-3 font-medium",
          lang === "en" ? "bg-ink text-paper" : "text-muted",
        )}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
