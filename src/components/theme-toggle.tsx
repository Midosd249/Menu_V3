import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "menu-theme";

function applyTheme(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-platform-theme", dark ? "dark" : "light");
}

function readSystemTheme() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { lang } = useLang();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch { /* Continue with the OS preference. */ }
    const sync = () => {
      const nextDark = stored === "dark" || (stored !== "light" && readSystemTheme());
      setDark(nextDark);
      applyTheme(nextDark);
    };
    sync();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => { if (stored !== "dark" && stored !== "light") sync(); };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      stored = event.key === null ? null : event.newValue;
      sync();
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    applyTheme(nextDark);
    try { window.localStorage.setItem(STORAGE_KEY, nextDark ? "dark" : "light"); } catch { /* Current tab still changes. */ }
  };
  const label = dark
    ? (lang === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode")
    : (lang === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode");

  return <button type="button" className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} onClick={toggleTheme} aria-label={label} title={label} aria-pressed={dark}>
    {dark ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
  </button>;
}
