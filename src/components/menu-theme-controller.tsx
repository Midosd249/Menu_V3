import { useEffect } from "react";

const THEMES = new Set([
  "editorial",
  "dark-dining",
  "coffee",
  "heritage",
  "fast-casual",
  "gallery",
  "immersive",
  "minimal",
]);

function getThemeFromUrl() {
  if (typeof window === "undefined") return "editorial";
  const value = new URLSearchParams(window.location.search).get("theme")?.toLowerCase();
  return value && THEMES.has(value) ? value : "editorial";
}

export function MenuThemeController() {
  useEffect(() => {
    const apply = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/m\/([^/]+)/);
      const slug = match?.[1] ?? "default";
      const key = `menu-v3:theme:${slug}`;
      const fromUrl = new URLSearchParams(window.location.search).get("theme")?.toLowerCase();
      const theme = fromUrl && THEMES.has(fromUrl)
        ? fromUrl
        : window.localStorage.getItem(key) && THEMES.has(window.localStorage.getItem(key)!)
          ? window.localStorage.getItem(key)!
          : "editorial";
      if (fromUrl && THEMES.has(fromUrl)) window.localStorage.setItem(key, fromUrl);
      document.documentElement.dataset.menuTheme = theme;
    };

    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, []);

  return null;
}

export const MENU_THEMES = [
  { key: "editorial", ar: "تحريري", en: "Editorial" },
  { key: "dark-dining", ar: "عشاء داكن", en: "Dark Dining" },
  { key: "coffee", ar: "قهوة مختصة", en: "Specialty Coffee" },
  { key: "heritage", ar: "تراث سعودي", en: "Saudi Heritage" },
  { key: "fast-casual", ar: "سريع وعصري", en: "Fast Casual" },
  { key: "gallery", ar: "معرض", en: "Gallery" },
  { key: "immersive", ar: "غامر", en: "Immersive" },
  { key: "minimal", ar: "مينيمال", en: "Minimal" },
] as const;
