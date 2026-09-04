import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { MenuThemeController } from "@/components/menu-theme-controller";
import { LangProvider } from "@/lib/lang";
import appCss from "../styles.css?url";

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
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap",
      },
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
