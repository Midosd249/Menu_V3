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
    headingWeight: 650,
    bodyWeight: 400,
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  shape: { radiusSm: "0.375rem", radiusMd: "0.75rem", radiusLg: "1.25rem", radiusXl: "1.75rem" },
  spacing: { page: "1rem", section: "2.5rem", card: "0.875rem", gap: "0.875rem" },
  effects: { shadow: "0 1px 2px rgb(0 0 0 / 0.06)", shadowHover: "0 18px 42px rgb(0 0 0 / 0.12)", overlay: "rgb(0 0 0 / 0.42)" },
} as const;

const definitions: readonly ThemeDefinition[] = [
  {
    key: "essential",
    family: "small-menu",
    tier: "free",
    name: { ar: "أساسي", en: "Essential" },
    description: { ar: "ضيافة يومية هادئة، واضحة وسريعة على الهاتف.", en: "Quiet everyday hospitality, clear and fast on every phone." },
    promise: { ar: "منيو احترافي يضع ما يهم الضيف أولاً.", en: "A professional menu that puts what guests need first." },
    tags: [{ ar: "مجاني", en: "Free" }, { ar: "واضح", en: "Clear" }, { ar: "سريع", en: "Fast" }],
    tokens: baseTokens,
    layout: { header: "standard", productGrid: "list", productCard: "horizontal", categoryNav: "sticky", imageRatio: "square" },
    capabilities: { dark: false, imageFirst: false, compact: false, immersive: false, featuredComposition: false, decorativeSurfaces: false, motion: false },
    motion: "quiet",
    preview: { className: "preview-essential" },
  },
  {
    key: "editorial",
    family: "contemporary-restaurant",
    tier: "premium",
    name: { ar: "إديتوريال", en: "Editorial" },
    description: { ar: "تجربة تشبه مجلة ضيافة فاخرة: جريئة في العناوين ودقيقة في التفاصيل.", en: "A hospitality editorial experience with bold hierarchy and refined detail." },
    promise: { ar: "حوّل المنيو إلى قصة بصرية متكاملة.", en: "Turn the menu into a complete visual story." },
    tags: [{ ar: "فاخر", en: "Premium" }, { ar: "تحريري", en: "Editorial" }, { ar: "هوية", en: "Brand-led" }],
    tokens: {
      ...baseTokens,
      colors: { ...baseTokens.colors, background: "#f4efe7", surface: "#fffdf9", surfaceMuted: "#e9dfd2", border: "#d7c8b7", accent: "#9b5134" },
      typography: { ...baseTokens.typography, headingWeight: 700, lineHeight: "1.52", letterSpacing: "-0.012em" },
      shape: { ...baseTokens.shape, radiusLg: "0.5rem", radiusXl: "0.875rem" },
      spacing: { page: "1.25rem", section: "3.5rem", card: "1rem", gap: "1rem" },
      effects: { ...baseTokens.effects, shadow: "0 1px 0 rgb(23 20 17 / .08)", shadowHover: "0 22px 50px rgb(23 20 17 / .14)" },
    },
    layout: { header: "hero", productGrid: "list", productCard: "editorial", categoryNav: "sticky", imageRatio: "portrait" },
    capabilities: { dark: false, imageFirst: true, compact: false, immersive: false, featuredComposition: true, decorativeSurfaces: true, motion: true },
    motion: "editorial",
    preview: { className: "preview-editorial" },
  },
  {
    key: "noir",
    family: "fine-dining-hospitality",
    tier: "premium",
    name: { ar: "نوار", en: "Noir" },
    description: { ar: "مزاج ليلي سينمائي مستوحى من قوائم المطاعم الراقية والضوء الدافئ.", en: "A cinematic night-time experience inspired by fine dining and candlelight." },
    promise: { ar: "اجعل فتح المنيو لحظة دخول إلى المطعم.", en: "Make opening the menu feel like entering the restaurant." },
    tags: [{ ar: "فاخر", en: "Premium" }, { ar: "سينمائي", en: "Cinematic" }, { ar: "ليلي", en: "Night" }],
    tokens: {
      ...baseTokens,
      colors: { background: "#0d0b0a", foreground: "#f6efe6", surface: "#171311", surfaceMuted: "#211a16", border: "#3a2e27", primary: "#f6efe6", primaryForeground: "#0d0b0a", accent: "#d29a5f", accentForeground: "#17110d", muted: "#aa9b90", mutedForeground: "#aa9b90" },
      typography: { ...baseTokens.typography, headingWeight: 600, lineHeight: "1.58", letterSpacing: "-0.008em" },
      shape: { radiusSm: "0.25rem", radiusMd: "0.5rem", radiusLg: "0.75rem", radiusXl: "1rem" },
      spacing: { page: "1rem", section: "3.25rem", card: "1rem", gap: "1rem" },
      effects: { shadow: "0 12px 36px rgb(0 0 0 / .28)", shadowHover: "0 28px 70px rgb(0 0 0 / .42)", overlay: "rgb(0 0 0 / .62)" },
    },
    layout: { header: "immersive", productGrid: "list", productCard: "editorial", categoryNav: "sticky", imageRatio: "portrait" },
    capabilities: { dark: true, imageFirst: true, compact: false, immersive: true, featuredComposition: true, decorativeSurfaces: true, motion: true },
    motion: "cinematic",
    preview: { className: "preview-noir" },
  },
  {
    key: "heritage",
    family: "contemporary-restaurant",
    tier: "premium",
    name: { ar: "أصالة", en: "Heritage" },
    description: { ar: "ضيافة عربية معاصرة تستلهم الخامات والنقوش بدون ازدحام بصري.", en: "Contemporary Arabic hospitality inspired by material, pattern and craft." },
    promise: { ar: "هوية عربية فاخرة تبدو أصلية لا مزخرفة.", en: "A distinctly Arabic luxury identity without ornament overload." },
    tags: [{ ar: "فاخر", en: "Premium" }, { ar: "عربي", en: "Arabic" }, { ar: "سعودي", en: "Saudi" }],
    tokens: {
      ...baseTokens,
      colors: { background: "#eee3d1", foreground: "#2b2118", surface: "#fbf6ec", surfaceMuted: "#e5d4bb", border: "#cbb391", primary: "#2b2118", primaryForeground: "#fffaf1", accent: "#986532", accentForeground: "#fffaf1", muted: "#75624f", mutedForeground: "#75624f" },
      typography: { ...baseTokens.typography, headingWeight: 700, lineHeight: "1.65", letterSpacing: "0" },
      shape: { radiusSm: "0.25rem", radiusMd: "0.625rem", radiusLg: "0.875rem", radiusXl: "1.25rem" },
      spacing: { page: "1.125rem", section: "3rem", card: "1rem", gap: "1rem" },
      effects: { shadow: "0 1px 0 rgb(67 45 25 / .10)", shadowHover: "0 18px 40px rgb(67 45 25 / .16)", overlay: "rgb(48 31 18 / .45)" },
    },
    layout: { header: "hero", productGrid: "list", productCard: "horizontal", categoryNav: "scroll", imageRatio: "landscape" },
    capabilities: { dark: false, imageFirst: true, compact: false, immersive: false, featuredComposition: true, decorativeSurfaces: true, motion: true },
    motion: "heritage",
    preview: { className: "preview-heritage" },
  },
  {
    key: "gallery",
    family: "bakery-dessert",
    tier: "premium",
    name: { ar: "غاليري", en: "Gallery" },
    description: { ar: "منيو بصري تكون فيه الصور والمنتجات هي أبطال الصفحة.", en: "An image-led menu where dishes become the visual heroes." },
    promise: { ar: "اعرض أطباقك ككتالوج بصري فاخر.", en: "Present your dishes like a premium visual catalogue." },
    tags: [{ ar: "فاخر", en: "Premium" }, { ar: "صور أولاً", en: "Image-first" }, { ar: "كتالوج", en: "Catalogue" }],
    tokens: {
      ...baseTokens,
      colors: { ...baseTokens.colors, background: "#eee9e1", surface: "#fffdf9", surfaceMuted: "#e4ddd3", border: "#d1c7ba", accent: "#7b4d36" },
      typography: { ...baseTokens.typography, headingWeight: 650, lineHeight: "1.58", letterSpacing: "-0.01em" },
      shape: { radiusSm: "0.5rem", radiusMd: "0.875rem", radiusLg: "1.25rem", radiusXl: "1.75rem" },
      spacing: { page: "1rem", section: "3rem", card: "0", gap: "1rem" },
      effects: { shadow: "0 2px 5px rgb(33 28 23 / .08)", shadowHover: "0 22px 55px rgb(33 28 23 / .17)", overlay: "rgb(20 15 12 / .36)" },
    },
    layout: { header: "standard", productGrid: "gallery-grid", productCard: "vertical", categoryNav: "scroll", imageRatio: "portrait" },
    capabilities: { dark: false, imageFirst: true, compact: false, immersive: false, featuredComposition: true, decorativeSurfaces: true, motion: true },
    motion: "gallery",
    preview: { className: "preview-gallery" },
  },
] as const satisfies readonly ThemeDefinition[];

export const MENU_THEMES = definitions;
export const DEFAULT_THEME_KEY: ThemeKey = "essential";
const THEME_MAP = new Map<ThemeKey, ThemeDefinition>(definitions.map((theme) => [theme.key, theme]));

const LEGACY_THEME_ALIASES: Record<string, ThemeKey> = {
  minimal: "essential",
  coffee: "gallery",
  "fast-casual": "essential",
  "dark-dining": "noir",
  immersive: "noir",
};

export function normalizeThemeKey(value: unknown): ThemeKey | null {
  if (typeof value !== "string") return null;
  if (THEME_MAP.has(value as ThemeKey)) return value as ThemeKey;
  return LEGACY_THEME_ALIASES[value] ?? null;
}

export function isThemeKey(value: unknown): value is ThemeKey {
  return normalizeThemeKey(value) !== null;
}

export function getTheme(key: ThemeKey): ThemeDefinition {
  return THEME_MAP.get(key) ?? THEME_MAP.get(DEFAULT_THEME_KEY)!;
}

export function getThemeFamily(key: ThemeKey): TemplateFamily {
  return getTheme(key).family;
}

export function isPremiumTheme(key: ThemeKey): boolean {
  return getTheme(key).tier === "premium";
}

export function canUseTheme(key: ThemeKey, planCode: string | null | undefined): boolean {
  return !isPremiumTheme(key) || (planCode !== null && planCode !== undefined && planCode !== "free");
}
