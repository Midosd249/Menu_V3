import { useEffect, useRef, useState } from "react";
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
  const storedPreference = useRef<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    try { storedPreference.current = window.localStorage.getItem(STORAGE_KEY); } catch { /* Continue with the OS preference. */ }
    const resolveTheme = () => storedPreference.current === "dark" || (storedPreference.current !== "light" && readSystemTheme());
    const syncInitialTheme = () => {
      // A click can happen before passive effects run. Never let late initialization undo it.
      if (initialized.current) return;
      initialized.current = true;
      const nextDark = resolveTheme();
      setDark(nextDark);
      applyTheme(nextDark);
    };
    syncInitialTheme();
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
      const nextDark = resolveTheme();
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
    // The DOM attribute is the source of truth during hydration and route transitions:
    // React state may still reflect the previous render while the root script has already
    // applied the stored/system preference. Derive the next value from the effective theme.
    const effectiveTheme = document.documentElement.getAttribute("data-platform-theme");
    const nextDark = effectiveTheme
      ? effectiveTheme !== "dark"
      : !(storedPreference.current === "dark" || (storedPreference.current !== "light" && readSystemTheme()));
    storedPreference.current = nextDark ? "dark" : "light";
    initialized.current = true;
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
