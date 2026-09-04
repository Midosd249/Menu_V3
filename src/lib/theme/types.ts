export const THEME_KEYS = ["essential", "editorial", "noir", "heritage", "gallery"] as const;
export type ThemeKey = (typeof THEME_KEYS)[number];

export const TEMPLATE_FAMILIES = [
  "specialty-cafe",
  "bakery-dessert",
  "fast-casual",
  "contemporary-restaurant",
  "fine-dining-hospitality",
  "small-menu",
] as const;
export type TemplateFamily = (typeof TEMPLATE_FAMILIES)[number];

export type ThemeLocaleText = { readonly ar: string; readonly en: string };
export type ThemeTier = "free" | "premium";
export type ThemeMotion = "quiet" | "editorial" | "cinematic" | "heritage" | "gallery";
export type ThemeTokens = {
  readonly colors: {
    readonly background: string;
    readonly foreground: string;
    readonly surface: string;
    readonly surfaceMuted: string;
    readonly border: string;
    readonly primary: string;
    readonly primaryForeground: string;
    readonly accent: string;
    readonly accentForeground: string;
    readonly muted: string;
    readonly mutedForeground: string;
  };
  readonly typography: {
    readonly displayFont: string;
    readonly bodyFont: string;
    readonly headingWeight: number;
    readonly bodyWeight: number;
    readonly lineHeight: string;
    readonly letterSpacing: string;
  };
  readonly shape: { readonly radiusSm: string; readonly radiusMd: string; readonly radiusLg: string; readonly radiusXl: string };
  readonly spacing: { readonly page: string; readonly section: string; readonly card: string; readonly gap: string };
  readonly effects: { readonly shadow: string; readonly shadowHover: string; readonly overlay: string };
};
export type ThemeLayout = {
  readonly header: "standard" | "immersive" | "hero";
  readonly productGrid: "list" | "compact-grid" | "gallery-grid";
  readonly productCard: "horizontal" | "vertical" | "editorial";
  readonly categoryNav: "scroll" | "sticky" | "pills";
  readonly imageRatio: "square" | "portrait" | "landscape" | "auto";
};
export type ThemeCapabilities = {
  readonly dark: boolean;
  readonly imageFirst: boolean;
  readonly compact: boolean;
  readonly immersive: boolean;
  readonly featuredComposition: boolean;
  readonly decorativeSurfaces: boolean;
  readonly motion: boolean;
};
export type ThemeDefinition = {
  readonly key: ThemeKey;
  readonly family: TemplateFamily;
  readonly tier: ThemeTier;
  readonly name: ThemeLocaleText;
  readonly description: ThemeLocaleText;
  readonly promise: ThemeLocaleText;
  readonly tags: readonly ThemeLocaleText[];
  readonly tokens: ThemeTokens;
  readonly layout: ThemeLayout;
  readonly capabilities: ThemeCapabilities;
  readonly motion: ThemeMotion;
  readonly preview: { readonly className: string; readonly image?: string };
};
