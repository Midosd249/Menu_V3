import type { TemplateFamily, ThemeDefinition, ThemeKey } from "./types";

const baseTokens = {
  colors: {
    background: "#f8f5ef",
    foreground: "#171411",
    surface: "#ffffff",
    surfaceMuted: "#f1ece3",
    border: "#ded6ca",
    primary: "#171411",
    primaryForeground: "#ffffff",
    accent: "#8f4e32",
    accentForeground: "#ffffff",
    muted: "#756e66",
    mutedForeground: "#756e66",
  },
  typography: {
    displayFont: "var(--font-display)",
    bodyFont: "var(--font-sans)",
    headingWeight: 600,
    bodyWeight: 400,
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  shape: { radiusSm: "0.375rem", radiusMd: "0.625rem", radiusLg: "1rem", radiusXl: "1.5rem" },
  spacing: { page: "1rem", section: "2rem", card: "0.75rem", gap: "0.75rem" },
  effects: { shadow: "0 1px 2px rgb(0 0 0 / 0.06)", shadowHover: "0 12px 30px rgb(0 0 0 / 0.10)", overlay: "rgb(0 0 0 / 0.35)" },
} as const;

const definitions: readonly ThemeDefinition[] = [
  {
    key: "editorial", family: "contemporary-restaurant", name: { ar: "تحريري", en: "Editorial" },
    description: { ar: "فخم وهادئ للمطاعم التي تريد هوية تحريرية راقية.", en: "Refined editorial presentation for premium hospitality." },
    tokens: baseTokens, layout: { header: "standard", productGrid: "list", productCard: "editorial", categoryNav: "sticky", imageRatio: "portrait" },
    capabilities: { dark: false, imageFirst: false, compact: false, immersive: false }, preview: { className: "preview-editorial" },
  },
  {
    key: "dark-dining", family: "fine-dining-hospitality", name: { ar: "عشاء داكن", en: "Dark Dining" },
    description: { ar: "تجربة داكنة سينمائية للمطاعم الراقية والعشاء.", en: "Cinematic dark presentation for fine dining." },
    tokens: { ...baseTokens, colors: { ...baseTokens.colors, background: "#11100f", foreground: "#f6f0e8", surface: "#1a1816", surfaceMuted: "#24211e", border: "#3b3530", primary: "#f6f0e8", primaryForeground: "#11100f", accent: "#c68b52", accentForeground: "#11100f", muted: "#aaa097", mutedForeground: "#aaa097" } },
    layout: { header: "standard", productGrid: "list", productCard: "editorial", categoryNav: "sticky", imageRatio: "portrait" },
    capabilities: { dark: true, imageFirst: true, compact: false, immersive: false }, preview: { className: "preview-dark-dining" },
  },
  {
    key: "coffee", family: "specialty-cafe", name: { ar: "قهوة مختصة", en: "Specialty Coffee" },
    description: { ar: "مصمم للمقاهي: سريع، بصري، ومناسب للاختيار السريع.", en: "Fast, visual and compact for specialty coffee." },
    tokens: { ...baseTokens, colors: { ...baseTokens.colors, background: "#f3ede3", surface: "#fffaf2", accent: "#7b4b2a" }, shape: { ...baseTokens.shape, radiusMd: "0.75rem", radiusLg: "1.25rem" } },
    layout: { header: "standard", productGrid: "compact-grid", productCard: "vertical", categoryNav: "pills", imageRatio: "square" },
    capabilities: { dark: false, imageFirst: true, compact: true, immersive: false }, preview: { className: "preview-coffee" },
  },
  {
    key: "heritage", family: "contemporary-restaurant", name: { ar: "تراث سعودي", en: "Saudi Heritage" },
    description: { ar: "دفء عربي بلمسة تراثية بدون زخرفة زائدة.", en: "Warm Arabic heritage without visual clutter." },
    tokens: { ...baseTokens, colors: { ...baseTokens.colors, background: "#efe6d6", surface: "#fbf5e9", accent: "#8a5a2b" } },
    layout: { header: "hero", productGrid: "list", productCard: "horizontal", categoryNav: "scroll", imageRatio: "landscape" },
    capabilities: { dark: false, imageFirst: true, compact: false, immersive: false }, preview: { className: "preview-heritage" },
  },
  {
    key: "fast-casual", family: "fast-casual", name: { ar: "سريع وعصري", en: "Fast Casual" },
    description: { ar: "واضح وسريع للبرجر والبيتزا والمطاعم السريعة.", en: "Clear, energetic and fast for casual concepts." },
    tokens: { ...baseTokens, colors: { ...baseTokens.colors, background: "#faf7f2", accent: "#c44724" }, shape: { ...baseTokens.shape, radiusMd: "0.875rem", radiusLg: "1.25rem", radiusXl: "1.75rem" } },
    layout: { header: "standard", productGrid: "compact-grid", productCard: "vertical", categoryNav: "pills", imageRatio: "square" },
    capabilities: { dark: false, imageFirst: true, compact: true, immersive: false }, preview: { className: "preview-fast-casual" },
  },
  {
    key: "gallery", family: "bakery-dessert", name: { ar: "معرض", en: "Gallery" },
    description: { ar: "الأطباق هي الأبطال؛ صور كبيرة وشبكة بصرية.", en: "Food-first gallery layout with large visual cards." },
    tokens: { ...baseTokens, spacing: { ...baseTokens.spacing, page: "1.25rem", section: "2.5rem", card: "1rem", gap: "1rem" } },
    layout: { header: "standard", productGrid: "gallery-grid", productCard: "vertical", categoryNav: "scroll", imageRatio: "portrait" },
    capabilities: { dark: false, imageFirst: true, compact: false, immersive: false }, preview: { className: "preview-gallery" },
  },
  {
    key: "immersive", family: "fine-dining-hospitality", name: { ar: "غامر", en: "Immersive" },
    description: { ar: "منيو غامر يبدأ بصورة كبيرة وقصة بصرية.", en: "Immersive, image-led experience with a cinematic entry." },
    tokens: { ...baseTokens, colors: { ...baseTokens.colors, background: "#141210", foreground: "#f5eee5", surface: "#1d1916", surfaceMuted: "#29231f", border: "#40372f", primary: "#f5eee5", primaryForeground: "#141210", accent: "#d19a63", accentForeground: "#141210" } },
    layout: { header: "immersive", productGrid: "gallery-grid", productCard: "vertical", categoryNav: "scroll", imageRatio: "landscape" },
    capabilities: { dark: true, imageFirst: true, compact: false, immersive: true }, preview: { className: "preview-immersive" },
  },
  {
    key: "minimal", family: "small-menu", name: { ar: "مينيمال", en: "Minimal" },
    description: { ar: "نظيف جداً للعلامات التي تريد التركيز على المحتوى.", en: "Quiet, minimal and content-first." },
    tokens: { ...baseTokens, colors: { ...baseTokens.colors, background: "#ffffff", surface: "#ffffff", surfaceMuted: "#f7f7f7", border: "#e7e7e7", accent: "#333333" }, shape: { ...baseTokens.shape, radiusSm: "0.25rem", radiusMd: "0.375rem", radiusLg: "0.625rem", radiusXl: "0.75rem" }, effects: { ...baseTokens.effects, shadow: "none", shadowHover: "0 4px 16px rgb(0 0 0 / 0.06)" } },
    layout: { header: "standard", productGrid: "list", productCard: "horizontal", categoryNav: "sticky", imageRatio: "square" },
    capabilities: { dark: false, imageFirst: false, compact: false, immersive: false }, preview: { className: "preview-minimal" },
  },
] as const satisfies readonly ThemeDefinition[];

export const MENU_THEMES = definitions;
export const DEFAULT_THEME_KEY: ThemeKey = "editorial";

const THEME_MAP = new Map<ThemeKey, ThemeDefinition>(definitions.map((theme) => [theme.key, theme]));

export function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === "string" && THEME_MAP.has(value as ThemeKey);
}

export function getTheme(key: ThemeKey): ThemeDefinition {
  return THEME_MAP.get(key) ?? THEME_MAP.get(DEFAULT_THEME_KEY)!;
}

export function getThemeFamily(key: ThemeKey): TemplateFamily {
  return getTheme(key).family;
}
