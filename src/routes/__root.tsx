import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { LangProvider } from "@/lib/lang";
import appCss from "../styles.css?url";
import colorsCss from "../colors.css?url";
import w8InternalVisualScopeFixCss from "../w8-internal-visual-scope-fix.css?url";
import typographyCss from "../typography.css?url";
import imageArtDirectionCss from "../image-art-direction.css?url";
import motionCss from "../motion.css?url";
import accessibilityCss from "../accessibility.css?url";
import platformThemeCss from "../platform-theme.css?url";
import homepageDarkModeFixCss from "../homepage-dark-mode-fix.css?url";

const APP_NAME = "Menuun";
const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const searchConsoleVerification = env?.VITE_GOOGLE_SITE_VERIFICATION?.trim();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#344331" },
      { name: "description", content: "منصة المنيو الرقمية للمطاعم السعودية" },
      ...(searchConsoleVerification ? [{ name: "google-site-verification", content: searchConsoleVerification }] : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: colorsCss },
      { rel: "stylesheet", href: w8InternalVisualScopeFixCss },
      { rel: "stylesheet", href: platformThemeCss },
      { rel: "stylesheet", href: homepageDarkModeFixCss },
      { rel: "stylesheet", href: typographyCss },
      { rel: "stylesheet", href: imageArtDirectionCss },
      { rel: "stylesheet", href: motionCss },
      { rel: "stylesheet", href: accessibilityCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
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
        <script dangerouslySetInnerHTML={{ __html: `try { var storedTheme = localStorage.getItem("menu-theme"); var darkTheme = storedTheme === "dark" || (storedTheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches); document.documentElement.setAttribute("data-platform-theme", darkTheme ? "dark" : "light"); } catch { document.documentElement.setAttribute("data-platform-theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }` }} />
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <LangProvider initialLang={locale}><Outlet /></LangProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
