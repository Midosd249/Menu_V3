import { createFileRoute } from "@tanstack/react-router";
import { MenuLoader } from "./m.$slug";
import { getPublicMenu } from "@/lib/menu/public";
import { getPublicMenuSeo, resolvePublicMenuLocale } from "@/lib/menu/seo";
import { normalizeThemeKey } from "@/lib/theme";
import type { Lang, PublicMenu } from "@/lib/menu/types";
import type { ThemeKey } from "@/lib/theme";
import { z } from "zod";

type BranchMenuRouteData = { menu: PublicMenu; locale: Lang; localeAvailable: boolean; previewTheme?: ThemeKey };
const branchMenuSearchSchema = z.object({ lang: z.enum(["ar", "en"]).optional(), theme: z.string().max(40).optional() });

export const Route = createFileRoute("/m/$slug/$branch")({
  validateSearch: branchMenuSearchSchema,
  loaderDeps: ({ search }) => ({ lang: search.lang, theme: search.theme }),
  loader: async ({ params, deps }) => {
    const result = await getPublicMenu({ data: { slug: params.slug, branch: params.branch } });
    if (!result.ok) return result;
    const requestedLocale = deps.lang ?? "ar";
    const locale = resolvePublicMenuLocale(result.data, requestedLocale);
    const previewTheme = deps.theme ? normalizeThemeKey(deps.theme) ?? undefined : undefined;
    return { ok: true as const, data: { menu: result.data, locale, localeAvailable: locale === requestedLocale, previewTheme } };
  },
  head: ({ loaderData, params }) => {
    const pathname = `/m/${encodeURIComponent(params.slug)}/${encodeURIComponent(params.branch)}`;
    if (loaderData?.ok) {
      const { menu, locale, localeAvailable, previewTheme } = loaderData.data as BranchMenuRouteData;
      const seo = getPublicMenuSeo(menu, pathname, locale);
      return { meta: [{ title: seo.title }, { name: "description", content: seo.description }, { name: "robots", content: previewTheme ? "noindex, nofollow" : localeAvailable ? "index, follow" : "noindex, follow" }, { property: "og:type", content: "website" }, { property: "og:title", content: seo.title }, { property: "og:description", content: seo.description }, { property: "og:locale", content: locale === "ar" ? "ar_SA" : "en_US" }, ...(seo.image ? [{ property: "og:image", content: seo.image }] : [])], links: [{ rel: "canonical", href: seo.canonical }, ...seo.alternates.map((alternate) => ({ rel: "alternate", hreflang: alternate.hreflang, href: alternate.href }))], scripts: [{ type: "application/ld+json", children: JSON.stringify(seo.schema) }] };
    }
    return { meta: [{ title: "المنيو غير موجود" }, { name: "robots", content: "noindex, nofollow" }], links: [{ rel: "canonical", href: pathname }] };
  },
  component: BranchMenuPage,
});

function BranchMenuPage() {
  const { slug, branch } = Route.useParams();
  const { lang, theme } = Route.useSearch();
  const loaderData = Route.useLoaderData();
  const menuData = loaderData?.ok ? loaderData.data as BranchMenuRouteData : undefined;
  return <MenuLoader slug={slug} branch={branch} locale={menuData?.locale ?? lang ?? "ar"} initialMenu={menuData?.menu} previewTheme={menuData?.previewTheme ?? (theme ? normalizeThemeKey(theme) ?? undefined : undefined)} />;
}
