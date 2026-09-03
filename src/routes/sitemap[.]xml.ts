import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { buildSitemapXml, publicMenuSitemapEntries } from "@/lib/seo/crawl";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sql = await getSql();
        const rows = await sql<Array<{ slug: string; branch_slug: string | null; updated_at: string | null }>>`
          select
            t.slug,
            b.slug as branch_slug,
            greatest(t.updated_at, b.updated_at) as updated_at
          from tenants t
          join branches b on b.tenant_id = t.id and b.is_active = true
          where t.is_active = true
            and t.is_published = true
          order by t.slug, b.created_at
        `;

        const entries = publicMenuSitemapEntries(
          rows.map((row) => ({
            slug: row.slug,
            branchSlug: row.branch_slug,
            updatedAt: row.updated_at,
          })),
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
