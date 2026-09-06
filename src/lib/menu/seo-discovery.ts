import type { PublicMenu } from "./types";
import { getPublicMenuLocaleAlternates } from "./seo";

export const DEFAULT_PUBLIC_ORIGIN = "https://menu-v3.vercel.app";

type PublicSitemapSource = {
  slug: string;
  branchSlug: string;
  nameEn: string | null;
  branchNameEn: string | null;
};

export type SitemapEntry = {
  loc: string;
  alternates?: Array<{ hreflang: "ar" | "en"; href: string }>;
};

export function getPublicOrigin(env: { VITE_VERCEL_PROJECT_PRODUCTION_URL?: string; VERCEL_PROJECT_PRODUCTION_URL?: string }): string {
  const candidate = env.VITE_VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_PROJECT_PRODUCTION_URL;
  if (candidate) return /^https?:\/\//i.test(candidate) ? candidate.replace(/\/$/, "") : `https://${candidate}`;
  return DEFAULT_PUBLIC_ORIGIN;
}

export function buildRobotsTxt(origin: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /studio",
    "Disallow: /login",
    "Disallow: /invite/",
    "Disallow: /themes/preview",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");
}

function publicPath(slug: string, branchSlug: string): string {
  return `/m/${encodeURIComponent(slug)}/${encodeURIComponent(branchSlug)}`;
}

export function buildPublicMenuSitemapEntries(rows: PublicSitemapSource[], origin: string): SitemapEntry[] {
  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];
  for (const row of rows) {
    const path = publicPath(row.slug, row.branchSlug);
    const loc = `${origin}${path}`;
    if (seen.has(loc)) continue;
    seen.add(loc);
    const alternates = row.nameEn && row.branchNameEn
      ? [
          { hreflang: "ar" as const, href: loc },
          { hreflang: "en" as const, href: `${origin}${path}?lang=en` },
        ]
      : undefined;
    entries.push({ loc, alternates });
  }
  return entries;
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const escapeXml = (value: string) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  const urls = entries.map((entry) => {
    const links = (entry.alternates ?? [])
      .map((alternate) => `<xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}"/>`)
      .join("");
    return `<url><loc>${escapeXml(entry.loc)}</loc>${links}</url>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
}

export function getPublicMenuDiscoverySeo(menu: PublicMenu, pathname: string, origin: string) {
  const alternates = getPublicMenuLocaleAlternates(menu, pathname, origin);
  return {
    canonical: `${origin}${pathname}`,
    alternates,
    robots: "index, follow",
  };
}
