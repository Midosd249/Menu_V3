import { defineEventHandler, getRequestURL, setResponseHeader, setResponseStatus } from "h3";
import { getSql } from "@/lib/db";
import { buildPublicMenuSitemapEntries, buildRobotsTxt, buildSitemapXml, getPublicOrigin } from "@/lib/menu/seo-discovery";

const XML_CONTENT_TYPE = "application/xml; charset=utf-8";
const TEXT_CONTENT_TYPE = "text/plain; charset=utf-8";

type PublicSitemapRow = {
  slug: string;
  branch_slug: string;
  name_en: string | null;
  branch_name_en: string | null;
};

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname;
  const origin = getPublicOrigin({
    VITE_VERCEL_PROJECT_PRODUCTION_URL: process.env.VITE_VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  });

  if (pathname === "/robots.txt") {
    setResponseHeader(event, "content-type", TEXT_CONTENT_TYPE);
    setResponseHeader(event, "cache-control", "public, max-age=3600, s-maxage=86400");
    return buildRobotsTxt(origin);
  }

  if (pathname !== "/sitemap.xml") return;

  try {
    const sql = await getSql();
    const rows = await sql<PublicSitemapRow>`
      select
        t.slug,
        b.slug as branch_slug,
        t.name_en,
        b.name_en as branch_name_en
      from tenants t
      join branches b on b.tenant_id = t.id and b.is_active = true
      where t.is_active = true and t.is_published = true
      order by t.slug, b.created_at
    `;
    const entries = buildPublicMenuSitemapEntries(rows.map((row) => ({
      slug: String(row.slug),
      branchSlug: String(row.branch_slug),
      nameEn: row.name_en,
      branchNameEn: row.branch_name_en,
    })), origin);
    setResponseHeader(event, "content-type", XML_CONTENT_TYPE);
    setResponseHeader(event, "cache-control", "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400");
    return buildSitemapXml(entries);
  } catch (error) {
    console.error("public sitemap generation failed", error);
    setResponseStatus(event, 503);
    setResponseHeader(event, "content-type", TEXT_CONTENT_TYPE);
    return "Sitemap temporarily unavailable";
  }
});
