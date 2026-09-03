import { createFileRoute } from "@tanstack/react-router";
import { MenuLoader } from "./m.$slug";
import { getPublicMenu } from "@/lib/menu/public";
import { getPublicMenuSeo } from "@/lib/menu/seo";

export const Route = createFileRoute("/m/$slug/$branch")({
  loader: ({ params }) => getPublicMenu({ data: { slug: params.slug, branch: params.branch } }),
  head: ({ loaderData, params }) => {
    const pathname = `/m/${encodeURIComponent(params.slug)}/${encodeURIComponent(params.branch)}`;
    if (loaderData && "data" in loaderData) {
      const seo = getPublicMenuSeo(loaderData.data, pathname);
      return {
        meta: [
          { title: seo.title },
          { name: "description", content: seo.description },
          { name: "robots", content: "index, follow" },
          { property: "og:type", content: "website" },
          { property: "og:title", content: seo.title },
          { property: "og:description", content: seo.description },
          { property: "og:locale", content: "ar_SA" },
          ...(seo.image ? [{ property: "og:image", content: seo.image }] : []),
        ],
        links: [{ rel: "canonical", href: pathname }],
        scripts: [{ type: "application/ld+json", children: JSON.stringify(seo.schema) }],
      };
    }
    return {
      meta: [{ title: "المنيو غير موجود" }, { name: "robots", content: "noindex, nofollow" }],
      links: [{ rel: "canonical", href: pathname }],
    };
  },
  component: BranchMenuPage,
});

function BranchMenuPage() {
  const { slug, branch } = Route.useParams();
  const loaderData = Route.useLoaderData();
  return <MenuLoader slug={slug} branch={branch} initialMenu={loaderData && "data" in loaderData ? loaderData.data : undefined} />;
}
