import type { ThemeKey } from "@/lib/theme";

import themeCss from "../../theme-premium.css?url";
import essentialThemeCss from "../../theme-essential.css?url";
import noirThemeCss from "../../theme-noir.css?url";
import themeRefinementsCss from "../../theme-refinements.css?url";
import themeRefinementsV2Css from "../../theme-refinements-v2.css?url";
import noirHardeningCss from "../../theme-noir-hardening.css?url";
import heritageThemeCss from "../../theme-heritage.css?url";
import galleryThemeCss from "../../theme-gallery.css?url";
import galleryHardeningCss from "../../theme-gallery-hardening.css?url";
import publicThemeQualityRecoveryCss from "../../theme-public-quality-recovery.css?url";
import menuPreviewLayerCss from "../../menu-preview-layer.css?url";
import quickAddCompactRefinementCss from "../../quick-add-compact-refinement.css?url";
import priceConsistencyCss from "../../theme-price-consistency.css?url";
import galleryCanvaParityCss from "../../theme-gallery-canva-parity.css?url";
import w16MobileQrHardeningCss from "../../theme-w16-mobile-qr-hardening.css?url";
import finalThemeVisualHardeningCss from "../../theme-final-visual-hardening.css?url";
import qrFinalFixesCss from "../../theme-qr-final-fixes.css?url";
import signalTableCss from "../../theme-signal-table.css?url";

const SHARED_PUBLIC_STYLESHEETS = [themeCss, menuPreviewLayerCss] as const;

const THEME_STYLESHEETS: Record<ThemeKey, readonly string[]> = {
  essential: [essentialThemeCss, w16MobileQrHardeningCss, quickAddCompactRefinementCss],
  editorial: [priceConsistencyCss, signalTableCss, quickAddCompactRefinementCss],
  noir: [
    noirThemeCss,
    themeRefinementsCss,
    themeRefinementsV2Css,
    noirHardeningCss,
    publicThemeQualityRecoveryCss,
    priceConsistencyCss,
    w16MobileQrHardeningCss,
    finalThemeVisualHardeningCss,
    quickAddCompactRefinementCss,
  ],
  heritage: [
    heritageThemeCss,
    publicThemeQualityRecoveryCss,
    quickAddCompactRefinementCss,
    priceConsistencyCss,
    qrFinalFixesCss,
  ],
  gallery: [
    galleryThemeCss,
    galleryHardeningCss,
    publicThemeQualityRecoveryCss,
    priceConsistencyCss,
    galleryCanvaParityCss,
    w16MobileQrHardeningCss,
    finalThemeVisualHardeningCss,
    quickAddCompactRefinementCss,
  ],
};

export function getThemeStylesheets(theme: ThemeKey): readonly string[] {
  return [...new Set([...SHARED_PUBLIC_STYLESHEETS, ...THEME_STYLESHEETS[theme]])];
}

function hasStylesheet(href: string): boolean {
  return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).some(
    (link) => link.href === new URL(href, window.location.href).href,
  );
}

export function syncThemeStylesheets(theme: ThemeKey): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();

  const desired = new Set(getThemeStylesheets(theme));
  const managedLinks = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[data-menu-runtime-theme-style]'),
  );

  for (const link of managedLinks) {
    if (!desired.has(link.dataset.menuRuntimeThemeStyle ?? "")) {
      link.remove();
    }
  }

  const pending: Promise<void>[] = [];

  for (const href of desired) {
    if (hasStylesheet(href)) continue;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.menuRuntimeThemeStyle = href;

    pending.push(
      new Promise<void>((resolve, reject) => {
        link.addEventListener("load", () => resolve(), { once: true });
        link.addEventListener("error", () => reject(new Error(`theme stylesheet failed: ${href}`)), { once: true });
      }),
    );

    document.head.appendChild(link);
  }

  return Promise.all(pending).then(() => undefined);
}
