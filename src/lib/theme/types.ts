export const THEME_KEYS = [
  "editorial",
  "dark-dining",
  "coffee",
  "heritage",
  "fast-casual",
  "gallery",
  "immersive",
  "minimal",
] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];

export type ThemeLocaleText = {
  ar: string;
  en: string;
};

export type ThemeTokens = {
  colors: {
    background: string;
    foreground: string;
    surface: string;
    surfaceMuted: string;
    border: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
  };
  typography: {
    displayFont: string;
    bodyFont: string;
    headingWeight: number;
    bodyWeight: number;
    lineHeight: string;
    letterSpacing: string;
  };
  shape: {
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    radiusXl: string;
  };
  spacing: {
    page: string;
    section: string;
    card: string;
    gap: string;
  };
  effects: {
    shadow: string;
    shadowHover: string;
    overlay: string;
  };
};

export type ThemeLayout = {
  header: "standard" | "immersive" | "hero";
  productGrid: "list" | "compact-grid" | "gallery-grid";
  productCard: "horizontal" | "vertical" | "editorial";
  categoryNav: "scroll" | "sticky" | "pills";
  imageRatio: "square" | "portrait" | "landscape" | "auto";
};

export type ThemeCapabilities = {
  dark: boolean;
  imageFirst: boolean;
  compact: boolean;
  immersive: boolean;
};

export type ThemeDefinition = {
  key: ThemeKey;
  name: ThemeLocaleText;
  description: ThemeLocaleText;
  tokens: ThemeTokens;
  layout: ThemeLayout;
  capabilities: ThemeCapabilities;
  preview: {
    className: string;
    image?: string;
  };
};
