import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/menu/types";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: "rtl" | "ltr";
};

const LangContext = createContext<LangContextValue>({
  lang: "ar",
  setLang: () => {},
  dir: "rtl",
});

function readStored(): Lang {
  if (typeof window === "undefined") return "ar";
  try {
    const stored = window.localStorage.getItem("menu-lang");
    if (stored === "en" || stored === "ar") return stored;
  } catch {
    /* ignore */
  }
  return "ar";
}

export function LangProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? readStored);
  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem("menu-lang", next);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next === "ar" ? "ar" : "en";
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    }
  };
  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, dir: lang === "ar" ? "rtl" : "ltr" }),
    [lang],
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
