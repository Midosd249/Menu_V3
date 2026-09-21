# W11 — SEO, Local Discovery, and Shareability

## Status

- Status: IMPLEMENTED / QUALITY GATE PENDING.
- Date: 2026-09-06.
- Scope: public menu discovery only.

## Decisions

1. Public menu canonicals are absolute production URLs, not relative paths.
2. Arabic is the canonical default locale; English is emitted only when both tenant and branch English names exist.
3. English and Arabic variants use reciprocal `hreflang` links.
4. Preview/theme query variants remain `noindex, nofollow`.
5. A missing public menu remains `noindex, nofollow`.
6. Restaurant structured data is derived only from the public menu payload and includes location data only when the Saudi location contract is complete.
7. Sitemap entries are generated from active, published tenants and active branches only.
8. Private/control surfaces are excluded from robots discovery.
9. No tenant or branch is added to the sitemap unless its public publication flags allow it.
10. No new runtime dependency or database schema migration is introduced.

## Implemented Surface

- `src/lib/menu/seo.ts`: absolute canonical URLs, stable schema URLs, locale alternates, OG/Twitter metadata support through public route heads.
- `src/lib/menu/seo-discovery.ts`: production-origin resolution, public path generation, robots contract, sitemap entry/XML generation.
- `server/middleware/seo-discovery.ts`: `/robots.txt` and `/sitemap.xml` server endpoints backed by published Menu V3 data.
- `src/routes/m.$slug.tsx`: public share metadata and canonical handling.
- `src/routes/m.$slug.$branch.tsx`: branch share metadata and canonical handling.
- `src/lib/menu/seo.test.ts`: canonical/schema/locale regression coverage.
- `src/lib/menu/seo-discovery.test.ts`: robots/sitemap/origin regression coverage.

## Security / Privacy

- Sitemap SQL reads only publication-safe tenant/branch identity fields.
- Unpublished or inactive tenants and branches are excluded.
- No owner/admin/studio route is exposed through the sitemap.
- Preview theme URLs remain explicitly noindex.
- No user/session data is placed into SEO metadata.

## Verification

Required release gate:

- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
- Playwright/template QA
- `/robots.txt` response inspection
- `/sitemap.xml` response inspection
- canonical/hreflang/schema validation
- performance inspection

## Research Basis

- Google Search documentation: canonicalization, localized versions, and structured data principles.
- Schema.org `Restaurant` vocabulary for restaurant and menu structured data.
- Sitemaps protocol for XML discovery and `xhtml:link` locale annotations.

The implementation deliberately uses only truthful first-party data already exposed by the public menu model; it does not fabricate ratings, reviews, coordinates, or business attributes.
