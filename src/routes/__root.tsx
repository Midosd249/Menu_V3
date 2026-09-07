import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { MenuThemeController } from "@/components/menu-theme-controller";
import { LangProvider } from "@/lib/lang";
import appCss from "../styles.css?url";
import colorsCss from "../colors.css?url";
import typographyCss from "../typography.css?url";
import imageArtDirectionCss from "../image-art-direction.css?url";
import motionCss from "../motion.css?url";
import accessibilityCss from "../accessibility.css?url";
import themeCss from "../theme-premium.css?url";
import essentialThemeCss from "../theme-essential.css?url";
import noirThemeCss from "../theme-noir.css?url";
import themeRefinementsCss from "../theme-refinements.css?url";
import themeRefinementsV2Css from "../theme-refinements-v2.css?url";
import noirHardeningCss from "../theme-noir-hardening.css?url";
import editorialThemeCss from "../theme-editorial.css?url";
import editorialHardeningCss from "../theme-editorial-hardening.css?url";
import heritageThemeCss from "../theme-heritage.css?url";
import heritageHardeningCss from "../theme-heritage-hardening.css?url";
import galleryThemeCss from "../theme-gallery.css?url";
import menuPreviewLayerCss from "../menu-preview-layer.css?url";

const APP_NAME = "منيو";
const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const searchConsoleVerification = env?.VITE_GOOGLE_SITE_VERIFICATION?.trim();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#171411" },
      { name: "description", content: "منصة المنيو الرقمية للمطاعم السعودية" },
      ...(searchConsoleVerification
        ? [{ name: "google-site-verification", content: searchConsoleVerification }]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: colorsCss },
      { rel: "stylesheet", href: typographyCss },
      { rel: "stylesheet", href: imageArtDirectionCss },
      { rel: "stylesheet", href: motionCss },
      { rel: "stylesheet", href: accessibilityCss },
      { rel: "stylesheet", href: themeCss },
      { rel: "stylesheet", href: essentialThemeCss },
      { rel: "stylesheet", href: noirThemeCss },
      { rel: "stylesheet", href: themeRefinementsCss },
      { rel: "stylesheet", href: themeRefinementsV2Css },
      { rel: "stylesheet", href: noirHardeningCss },
      { rel: "stylesheet", href: editorialThemeCss },
      { rel: "stylesheet", href: editorialHardeningCss },
      { rel: "stylesheet", href: heritageThemeCss },
      { rel: "stylesheet", href: heritageHardeningCss },
      { rel: "stylesheet", href: galleryThemeCss },
      { rel: "stylesheet", href: menuPreviewLayerCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const search = useRouterState({ select: (state) => state.location.searchStr });
  const locale = new URLSearchParams(search).get("lang") === "en" ? "en" : "ar";
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <MenuThemeController />
        <PreviewHostBridge />
        <AuthProvider>
          <LangProvider initialLang={locale}>
            <Outlet />
          </LangProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
