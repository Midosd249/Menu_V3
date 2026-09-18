# A.5 — Public Shareability / Deep-Link Audit

## Status
- Status: CLOSED / AUDIT COMPLETE / NOT DEPLOYED.
- Task: A.5 Public Shareability / Deep-Link Audit.
- Repository: `Midosd249/Menu_V3`.
- Canonical source of truth reviewed: `main`.
- Audit baseline: `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- Audit branch: `audit/a5-public-shareability-deep-links-2026-09-18`.
- Runtime/schema/auth/RLS/theme changes: NONE.
- Production deployment: NONE.

## Objective

Verify that a public Menu V3 URL is reliably addressable and shareable when opened directly, refreshed, scanned from QR, opened from WhatsApp/social channels, or indexed by search systems.

Target transition:

`Menu works when navigated normally → Menu is reliably addressable, shareable, refresh-safe, crawl-safe, and tenant/branch-safe`

The audit covers:
- `/m/:slug`
- `/m/:slug/:branch`
- direct load and refresh behavior
- QR deep links
- Arabic/English URL state
- canonical/alternate/OG metadata
- sitemap/robots discovery
- tenant/branch resolution
- invalid/nonexistent menu behavior
- theme-preview query behavior
- category/product deep-link capability
- public action/share surfaces
- all-theme route architecture
- tenant/data leakage boundaries

## Evidence hierarchy

1. Current repository code/configuration.
2. GitHub history, tests, and continuity evidence.
3. Existing SEO/shareability documentation.
4. External standards only where required for interpretation.

## Repository evidence inspected

- `src/routes/m.$slug.tsx`
- `src/routes/m.$slug.$branch.tsx`
- `src/lib/menu/public.ts`
- `src/lib/menu/seo.ts`
- `src/lib/menu/seo-discovery.ts`
- `server/middleware/seo-discovery.ts`
- `server/middleware/grok-pwa.ts`
- `src/lib/seo/crawl.ts`
- `src/components/lang-toggle.tsx`
- `src/routes/studio/qr.tsx`
- `src/components/public-menu.tsx`
- `scripts/grok-pwa-shared.mjs`
- `scripts/quality-workflow.test.mjs`
- `src/lib/menu/seo.test.ts`
- `src/lib/menu/seo-discovery.test.ts`
- `tests/preview-shell.test.mjs`
- `README.md`
- `SESSION_PROTOCOL.md`
- current continuity files and prior SEO/shareability records.

## Audit matrix

| Boundary | Status | Finding |
|---|---|---|
| Tenant public route `/m/:slug` | VERIFIED | File-based public route exists and resolves a published active tenant. |
| Branch public route `/m/:slug/:branch` | VERIFIED | Dedicated branch route exists and resolves the requested active branch within the tenant. |
| Direct SSR route data | VERIFIED | Both public routes call the server-side `getPublicMenu` loader before rendering. |
| Refresh/deep-link architecture | VERIFIED | Routes are addressable through TanStack file routing; no client-only route registration is required. |
| Tenant isolation | VERIFIED | `getPublicMenu` scopes tenant by slug and branch selection by tenant ID. |
| Published gate | VERIFIED | Public SQL requires tenant `is_active = true` and `is_published = true`; branches require `is_active = true`. |
| Branch isolation | VERIFIED | Requested branch slug is resolved inside the selected tenant. |
| QR URL | VERIFIED | Studio QR generation uses `/m/:slug/:branch?src=qr`. |
| QR analytics | VERIFIED | Public event recording recognizes `src=qr` and records `qr_scan`; canonical SEO does not preserve `src=qr`. |
| Arabic/English route state | VERIFIED | `lang=ar|en` is preserved by the public routes and language toggle. |
| English fallback | VERIFIED | Missing English tenant/branch names fall back to Arabic instead of fabricating an English variant. |
| Canonical URL | VERIFIED | Public SEO emits an absolute canonical and removes non-locale query state from canonical URLs. |
| hreflang | VERIFIED | Arabic/English alternates are reciprocal when real English content exists. |
| OG/Twitter metadata | VERIFIED | Route-level title, description, URL, locale, and image metadata exist; platform middleware also has share-head handling. |
| Theme preview | VERIFIED | `theme` preview is marked `noindex, nofollow` and does not create a separate public canonical. |
| Sitemap | **CONFLICTED** | Two active discovery implementations exist with different contracts. |
| Robots | **CONFLICTED** | Two active discovery implementations exist with different cache/ownership paths. |
| Invalid menu HTTP semantics | **GAP** | Loader returns `not_found` as data instead of throwing a route-level not-found response, so direct HTTP status is not proven to be 404. |
| Root tenant URL with multiple branches | **AMBIGUOUS** | `/m/:slug` selects the first active branch; branch-specific shareability is stronger through `/m/:slug/:branch`. |
| Sitemap/root-route parity | **CONFLICTED** | Current `src/lib/menu/seo-discovery.ts` sitemap emits branch URLs, while legacy `src/lib/seo/crawl.ts` emits both tenant and branch URLs. |
| Product deep links | **MISSING** | Product details are client state; no canonical product URL or route parameter was found. |
| Category deep links | **MISSING** | Category selection is client state; no canonical category URL or route parameter was found. |
| Native browser share surface | UNKNOWN / LIMITED | No `navigator.share` implementation was found; sharing relies on URL/QR/external actions rather than a dedicated public share control. |
| Public theme coverage | VERIFIED | All five protected themes reuse the same public route architecture; no theme-specific public route was found. |
| Data leakage | VERIFIED BY SOURCE REVIEW | Public tenant mapping excludes owner identity; public menu SQL is scoped to active/published tenant and active branches. |
| Production behavior | UNKNOWN | This audit used repository/GitHub evidence; current production HTTP behavior for the latest main was not directly exercised. |

## A5-F1 — Direct public routing is structurally healthy

**VERIFIED**

The repository has two canonical public route shapes:

- `/m/:slug` — tenant-level public menu.
- `/m/:slug/:branch` — branch-specific public menu.

Both routes execute `getPublicMenu` in the loader and pass server-resolved menu data into the shared public rendering architecture.

**Conclusion:** Direct addressability and refresh safety are structurally supported by the route architecture.

## A5-F2 — Branch-specific URLs are the reliable share contract

**VERIFIED**

Studio QR generation creates:

`/m/{tenantSlug}/{branchSlug}?src=qr`

The branch route then resolves the requested branch inside the tenant boundary.

By contrast, `/m/:slug` intentionally selects the first active branch when no branch slug is supplied.

**Risk:** A tenant with multiple branches can have a generic URL whose branch is determined by database ordering rather than by the shareer's intended branch.

**Assessment:** This is not a tenant-isolation defect, but it is a shareability/canonicalization ambiguity.

**Required future direction:** Treat `/m/:slug/:branch` as the authoritative branch-specific share URL and explicitly define whether `/m/:slug` is a tenant landing/default-branch URL or a redirect to a canonical branch.

## A5-F3 — QR query parameters are correctly separated from canonical identity

**VERIFIED**

The QR URL uses `src=qr` for measurement. Public SEO canonical generation uses only the route path plus supported `lang=en` state.

**Conclusion:** QR tracking does not create duplicate indexed URLs by itself.

## A5-F4 — Arabic/English shareability is correctly URL-addressable

**VERIFIED**

`?lang=en` is preserved by the language toggle and included in the English canonical. The SEO layer emits reciprocal Arabic/English alternates only when both tenant and branch English names exist.

When English content is incomplete, the system resolves back to Arabic rather than creating a fabricated English page.

**Conclusion:** The bilingual URL contract is coherent and safe.

## A5-F5 — Theme preview is correctly separated from public indexation

**VERIFIED**

The public routes accept `theme` for preview behavior. Preview requests use `noindex, nofollow`, while the canonical remains the underlying public menu URL.

**Conclusion:** Theme previews are not intended to become separate searchable public pages.

## A5-F6 — Public discovery has duplicate/competing implementations

**VERIFIED — MATERIAL GAP**

There are two separate public discovery systems:

1. `src/lib/menu/seo-discovery.ts` + `server/middleware/seo-discovery.ts`
2. `src/lib/seo/crawl.ts` + `server/middleware/grok-pwa.ts`

They do not implement the same contract.

Examples:

- `src/lib/menu/seo-discovery.ts` generates locale-aware branch sitemap entries with reciprocal hreflang links.
- `src/lib/seo/crawl.ts` generates a simpler sitemap with tenant and branch paths and optional last-modified values.
- The two middleware layers both claim `/robots.txt` and `/sitemap.xml`.
- `scripts/quality-workflow.test.mjs` still imports the legacy `src/lib/seo/crawl.ts` contract and inspects `server/middleware/grok-pwa.ts`.

**Risk:** The repository has more than one source of truth for crawler discovery. Actual runtime ownership can depend on middleware registration order rather than one explicit contract.

**Required future direction:** choose one canonical robots/sitemap implementation, retire or adapt the other, and make the quality tests target the canonical implementation.

**Do not:** add a third implementation or patch both independently.

## A5-F7 — Invalid-menu HTTP status is not proven and likely incorrect

**VERIFIED FROM SOURCE**

`getPublicMenu` returns:

`{ ok: false, code: "not_found", ... }`

The public route loader returns that result as loader data rather than throwing a route-level not-found response.

The route head has a fallback branch that emits `noindex, nofollow` metadata when loader data is not successful, but the public page component can still proceed into `MenuLoader`, which performs another client-side load and displays an error state.

**Risk:** A nonexistent public menu may be served with a successful document status while carrying an application-level error state. That is weaker than a real HTTP 404 for crawlers, link validation, monitoring, and share-preview systems.

**Status:** **GAP — requires runtime verification and likely a focused routing fix.**

**Required future direction:** establish an explicit route-level 404 contract for `not_found`, then verify the actual HTTP status and metadata for missing tenant and missing branch URLs.

## A5-F8 — Tenant-level and branch-level canonical contracts need one explicit rule

**VERIFIED**

Both route shapes are public. The sitemap implementations disagree about whether tenant-level paths belong in discovery.

**Assessment:** The product should explicitly define one of these contracts:

- tenant URL is canonical and resolves a default branch; or
- branch URL is canonical for published menu content and tenant URL redirects/lands on a tenant-level branch selector.

Until this is decided, the current architecture is usable but not fully deterministic for multi-branch share distribution.

## A5-F9 — Product/category deep links are not currently first-class

**VERIFIED**

Product selection and category selection are maintained as client state inside the public menu. No route or canonical query contract for a product or category was found.

**Impact:** A restaurant cannot produce a stable URL that opens one specific dish or category directly.

**Assessment:** This is a shareability opportunity, not a data/security defect.

**Future option:** add a stable public deep-link contract only after defining analytics, canonical, back/forward, modal accessibility, and tenant/branch boundaries.

Do not implement this as an ad-hoc query parameter without a complete contract.

## A5-F10 — No dedicated Web Share API surface was found

**VERIFIED FROM SEARCH**

No `navigator.share` implementation was found in the repository search.

The existing public sharing model is therefore primarily:
- direct URL;
- QR;
- WhatsApp/contact actions;
- search/crawl discovery;
- owner-side report sharing.

**Assessment:** A native share button could improve mobile distribution later, but it is not required to establish a valid public URL contract.

## A5-F11 — Public data boundary is preserved

**VERIFIED**

`mapPublicTenant` removes `ownerUserId` and public menu loading is scoped to the published tenant and active branches.

The audit found no route pattern that accepts a client-supplied tenant ID or branch ID as an authority boundary. Slugs are resolved server-side.

**Conclusion:** The shareability gaps identified here do not require weakening tenant isolation.

## A5-F12 — All protected themes inherit the same routing contract

**VERIFIED**

Public routes select the active theme/template after resolving the same public menu object. The five protected themes do not have separate public URL architectures.

**Conclusion:** A shareability fix should be made at the route/discovery contract layer, not duplicated inside Essential, Editorial, Noir, Heritage/Taste, or Gallery.

## Priority classification

### P0 — Release correctness
1. Establish a real HTTP 404 contract for nonexistent public menus/branches.
2. Eliminate competing `robots.txt` / `sitemap.xml` ownership and define one canonical discovery implementation.

### P1 — Shareability correctness
3. Define the canonical relationship between `/m/:slug` and `/m/:slug/:branch`.
4. Align sitemap entries with that canonical URL policy.

### P2 — Growth opportunity
5. Consider product/category deep links.
6. Consider native Web Share API support.

## Explicit non-goals

A.5 does not:
- redesign public themes;
- change menu rendering;
- change tenant/branch authorization;
- change order flow;
- change analytics schema;
- add product/category deep links;
- add a Web Share button;
- deploy;
- modify production configuration.

## Acceptance criteria

- [x] Canonical public route shapes inspected.
- [x] Direct SSR/loader path inspected.
- [x] Tenant and branch resolution inspected.
- [x] QR URL and tracking query inspected.
- [x] Arabic/English canonical and hreflang behavior inspected.
- [x] Theme preview indexation behavior inspected.
- [x] Robots and sitemap implementations searched repository-wide.
- [x] Invalid-menu handling inspected.
- [x] Product/category deep-link support searched.
- [x] Public share surface searched.
- [x] All protected theme route architecture checked.
- [x] No runtime/schema/auth/theme/deployment changes introduced.
- [x] Exactly one next atomic task recorded.

## Verification limitations

- GitHub repository/code/history evidence was available.
- Local runtime/browser/device execution was not available through this GitHub-only execution surface.
- Current production HTTP status for valid/invalid public URLs is therefore **UNKNOWN**.
- Vercel deployment status is not used as evidence of current production behavior.
- The likely 404 gap must be confirmed by a runtime/HTTP test before implementation is finalized.

## Exact next task

**A.5 Remediation — unify public discovery ownership and establish a verified HTTP 404 contract for public menu routes.**

This is one atomic remediation task. Product/category deep links and native Web Share remain deferred.
