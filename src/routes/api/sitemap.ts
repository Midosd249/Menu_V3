import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { buildSitemapXml, publicMenuSitemapEntries } from "@/lib/seo/crawl";

type SitemapRow = {
  slug: string;
  branch_slug: string | null;
};

export const Route = createFileRoute("/api/sitemap")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sql = await getSql();
        const rows = await sql.query<SitemapRow>(`
          select t.slug, b.slug as branch_slug
          from tenants t
          join branches b on b.tenant_id = t.id and b.is_active = true
          where t.is_active = true and t.is_published = true
          order by t.slug, b.created_at
        `);
        const entries = publicMenuSitemapEntries(
          rows.map((row) => ({ slug: row.slug, branchSlug: row.branch_slug })),
        );
        return new Response(buildSitemapXml(new URL(request.url).origin, entries), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
          },
        });
      },
    },
  },
});
