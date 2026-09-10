import type { PublicMenu } from "./types";

export const DEFAULT_PUBLIC_ORIGIN = "https://menu-v3-midosd2s-projects.vercel.app";

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeOrigin(value: string | undefined): string {
  const raw = clean(value ?? "");
  if (!raw) return DEFAULT_PUBLIC_ORIGIN;
  return (raw.startsWith("http") ? raw : `https://${raw}`).replace(/\/+$/, "");
}

export function getPublicOrigin(env: Record<string, string | undefined> = {}): string {
  return normalizeOrigin(env.VITE_VERCEL_PROJECT_PRODUCTION_URL ?? env.VERCEL_PROJECT_PRODUCTION_URL);
}

export function publicPath(slug: string, branch?: string, lang: "ar" | "en" = "ar"): string {
  const base = branch ? `/m/${encodeURIComponent(slug)}/${encodeURIComponent(branch)}` : `/m/${encodeURIComponent(slug)}`;
  return lang === "en" ? `${base}?lang=en` : base;
}

export type SitemapEntry = {
  loc: string;
  alternates?: Array<{ hreflang: "ar" | "en"; href: string }>;
};

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

export function buildRobotsTxt(origin = DEFAULT_PUBLIC_ORIGIN): string {
  const normalized = normalizeOrigin(origin);
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /owner",
    "Disallow: /studio",
    "Disallow: /login",
    "Disallow: /onboarding",
    "Disallow: /invite/",
    "Disallow: /api/",
    "Disallow: /?install=1",
    "",
    `Sitemap: ${normalized}/sitemap.xml`,
    "",
  ].join("\n");
}

export function buildPublicMenuSitemapEntries(
  rows: Array<{ slug: string; branchSlug: string; nameEn?: string | null; branchNameEn?: string | null }>,
  origin: string,
): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const normalizedOrigin = normalizeOrigin(origin);
  for (const row of rows) {
    const hasEnglish = Boolean(clean(row.nameEn ?? "") && clean(row.branchNameEn ?? ""));
    const branchPathAr = `${normalizedOrigin}${publicPath(row.slug, row.branchSlug, "ar")}`;
    const branchPathEn = `${normalizedOrigin}${publicPath(row.slug, row.branchSlug, "en")}`;
    const alternates = hasEnglish
      ? [{ hreflang: "ar" as const, href: branchPathAr }, { hreflang: "en" as const, href: branchPathEn }]
      : undefined;
    entries.push({ loc: branchPathAr, alternates });
  }
  return entries;
}
