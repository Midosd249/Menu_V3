import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "menu-theme";

function applyTheme(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-platform-theme", dark ? "dark" : "light");
}

function readStoredPreference(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function readSystemTheme() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(preference: string | null) {
  return preference === "dark" || (preference !== "light" && readSystemTheme());
}

export function ThemeToggle({ className }: { className?: string }) {
  const { lang } = useLang();
  // Keep server/client first-render markup identical, then synchronize before paint.
  // The root bootstrap script already applies the persisted/system theme to <html>.
  const [dark, setDark] = useState(false);
  const storedPreference = useRef<string | null>(null);

  useLayoutEffect(() => {
    const preference = readStoredPreference();
    storedPreference.current = preference;
    const initialDark = resolveTheme(preference);
    setDark(initialDark);
    applyTheme(initialDark);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (storedPreference.current === "dark" || storedPreference.current === "light") return;
      const nextDark = readSystemTheme();
      setDark(nextDark);
      applyTheme(nextDark);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      storedPreference.current = event.key === null ? null : event.newValue;
      const nextDark = resolveTheme(storedPreference.current);
      setDark(nextDark);
      applyTheme(nextDark);
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggleTheme = () => {
    // The state and root bootstrap now resolve from the same stored/system preference.
    const nextDark = !dark;
    storedPreference.current = nextDark ? "dark" : "light";
    setDark(nextDark);
    applyTheme(nextDark);
    try { window.localStorage.setItem(STORAGE_KEY, storedPreference.current); } catch { /* Current tab still changes. */ }
  };
  const label = dark
    ? (lang === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode")
    : (lang === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode");

  return <button type="button" className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} onClick={toggleTheme} aria-label={label} title={label} aria-pressed={dark}>
    {dark ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
  </button>;
}
