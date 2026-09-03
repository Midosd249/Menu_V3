export type PublicSitemapEntry = {
  path: string;
  lastModified?: string | null;
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

export function buildRobotsTxt(origin: string): string {
  const sitemapUrl = `${normalizeOrigin(origin)}/sitemap.xml`;
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /studio",
    "Disallow: /owner",
    "Disallow: /onboarding",
    "Disallow: /login",
    "Disallow: /invite",
    "Disallow: /api/",
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");
}

export function buildSitemapXml(origin: string, entries: PublicSitemapEntry[]): string {
  const base = normalizeOrigin(origin);
  const seenPaths = new Set<string>();
  const uniqueEntries = entries.filter((entry) => {
    if (seenPaths.has(entry.path)) return false;
    seenPaths.add(entry.path);
    return true;
  });

  const urls = uniqueEntries.map(({ path, lastModified }) => {
    const loc = `${base}${path.startsWith("/") ? path : `/${path}`}`;
    const lastmod = lastModified ? `<lastmod>${escapeXml(lastModified)}</lastmod>` : "";
    return `  <url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function publicMenuSitemapEntries(
  rows: Array<{ slug: string; branchSlug?: string | null; updatedAt?: string | null }>,
): PublicSitemapEntry[] {
  return rows.flatMap(({ slug, branchSlug, updatedAt }) => [
    { path: `/m/${encodeURIComponent(slug)}`, lastModified: updatedAt },
    ...(branchSlug
      ? [{ path: `/m/${encodeURIComponent(slug)}/${encodeURIComponent(branchSlug)}`, lastModified: updatedAt }]
      : []),
  ]);
}
