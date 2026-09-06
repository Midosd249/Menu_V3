# Menu V3 — Canonical Content & Publishing Audit

Date: 2026-09-06
Status: CLOSED / VERIFIED for audit scope

## Purpose

Validate the Manus design-strategy recommendation against the actual Menu V3 repository before introducing schema or UI changes.

The target model is:

`Owner content → canonical tenant/menu data → preview/review → publish → public menu → website/SEO surfaces → analytics`

This audit is evidence-only. It does not introduce application, schema, dependency, CI/CD, or deployment changes.

## Evidence reviewed

- `src/lib/menu/types.ts`
- `src/lib/menu/public.ts`
- `src/lib/menu/owner.ts`
- `src/lib/menu/studio.tsx`
- `src/components/studio-shell.tsx`
- `src/routes/m.$slug.tsx`
- `src/routes/m.$slug.$branch.tsx`
- `migrations/0002_menu_v3.sql`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- `AGENTS.md`
- `SESSION_PROTOCOL.md`
- `README.md`

## Findings matrix

| Area | Status | Evidence / conclusion |
|---|---|---|
| Tenant identity | EXISTS | `Tenant` carries bilingual name/tagline, logo/cover, social/contact, colors, currency, city/country, theme, active/published state. |
| Branch identity | EXISTS | `Branch` carries bilingual name/address, maps URL, phone, active state; `BranchHour` carries weekly hours. |
| Categories | EXISTS | Tenant-scoped bilingual categories with ordering and active state. |
| Products | EXISTS | Tenant-scoped bilingual product name/description, price/currency, media, calories, availability, featured state, allergens and ordering. |
| Product variants/modifiers | EXISTS | Product variants, modifier groups and options are tenant-scoped and loaded for the public menu. |
| Bilingual data | EXISTS | Core tenant/category/product/branch fields have Arabic and English representations; locale resolution exists in public routes. |
| Public branch routing | EXISTS | `/m/$slug` and `/m/$slug/$branch` both resolve public menu data. |
| Public published gate | EXISTS | Public SQL requires `is_active = true` and `is_published = true`. |
| Owner authorization | EXISTS | Owner server functions use `authMiddleware`, tenant membership, and role checks before writes. |
| Tenant write isolation | EXISTS | Owner mutations scope updates/inserts to the authenticated member's tenant. |
| Category/product source of truth | EXISTS | Owner Studio and public menu both consume the same tenant/category/product domain data. |
| Public cache invalidation | PARTIAL | Server-side public cache exists with 15s TTL and `invalidatePublicMenuCache()`; this audit did not find direct evidence that every owner mutation invokes invalidation. Browser session cache adds another 5-minute layer. This requires targeted verification before promising immediate propagation. |
| Publish state | EXISTS / LIMITED | `tenants.is_published` is the current publish switch and public reads honor it. |
| Publish workflow | PARTIAL | There is not yet evidence of a first-class draft/review/publish state machine, publish audit trail, scheduling, or rollback history. `is_published` is currently a boolean. |
| Preview | EXISTS | Studio exposes `/studio/preview`; public routes support a theme preview query and `noindex` for preview mode. |
| Bilingual review before publish | PARTIAL | Bilingual fields and preview exist, but no repository evidence of a dedicated parity/review gate before publish. |
| Website content model | MISSING / UNKNOWN | Current canonical model clearly supports the menu/public presence, but no dedicated restaurant website/page content model was verified in the audited source set. Whether the current marketing/homepage architecture is intended to become tenant-generated website content is UNKNOWN. |
| SEO for public menu | EXISTS | Public menu route generates title, description, canonical, hreflang alternates, OG metadata and JSON-LD through `getPublicMenuSeo`. |
| Local discovery data | PARTIAL | City, branch address, phone and maps URL exist; broader local landing/content/reputation model is not verified. |
| Analytics | EXISTS / LIMITED | Visit, product_view, qr_scan and whatsapp events exist; owner analytics exposes visits, unique sessions, product views, QR scans, WhatsApp clicks, language split and series/top lists. |
| Cross-surface analytics identity | PARTIAL | Menu events are modeled, but a unified event taxonomy across future website/local-discovery surfaces is not yet verified. |
| Single canonical content principle | VERIFIED for current menu | Tenant/category/product/branch data is shared between owner management and public menu. It is not yet a complete multi-surface content platform. |

## Critical observations

### 1. The current menu model is already a strong canonical core

The repository does not need a new menu schema merely to satisfy the strategy. The existing `Tenant`, `Branch`, `Category`, `Product`, variants/modifiers, hours, and menu-event structures already provide a coherent core for the public menu and Owner Studio.

### 2. Publish is currently a boolean, not a full publishing system

`tenants.is_published` is enough for a basic live/draft gate, but it does not by itself provide:

- draft vs published revision history;
- explicit review/approval;
- scheduled publishing;
- rollback to a prior published version;
- publish audit records;
- surface-level validation before release.

These are **future requirements**, not a reason to add schema now. They must become a separate implementation task only after product requirements and migration safety are proven.

### 3. Immediate propagation needs explicit cache verification

`getPublicMenu` has a server cache and the public route adds a browser session cache. The repository exposes `invalidatePublicMenuCache`, but this audit has not proven that every relevant owner mutation invalidates both layers. The resulting risk is stale public content after an edit.

This is the most concrete technical follow-up discovered by P0-01.

### 4. Branch scope is asymmetric by design

Branch identity/hours are branch-specific, while categories and products are tenant-scoped. This may be intentional shared-menu behavior. It is **not** a defect by itself. Branch-specific menu availability/content should only be added if a real product requirement demands it.

### 5. Website is not yet proven to be a tenant-generated surface

The strategy calls for Menu + Website + Local Discovery, but the audited model does not yet prove a dedicated tenant website-content layer. This is an architecture/product question for a later task, not a reason to duplicate product data now.

## Security review

- Public menu reads are gated by active/published tenant state.
- Owner mutations use server-side authentication middleware and membership checks.
- Category/product mutations enforce tenant ownership through server-side membership lookup.
- Product category references are validated against the authenticated tenant before writes.
- Public event input is schema-validated and product/tenant ownership is checked for product-view events.
- No secret, credential, or client-controlled tenant identity was introduced by this audit.

## Decision

**VERIFIED:** Menu V3 already has the canonical menu-data foundation recommended by Manus.

**PROPOSED:** Do not introduce a new canonical menu schema at this stage.

**P0 follow-up:** verify and, if necessary, repair cache invalidation/propagation from Owner mutation to Public Menu.

**Future P1/P2:** evaluate a formal publish/revision model and a tenant website-content model only after the current publishing behavior and product requirements are measured.

## Explicit non-actions

- No migration added.
- No new dependency added.
- No theme reopened.
- No public-menu business logic rewritten.
- No authorization model changed.
- No Vercel deployment triggered.

## Acceptance result

**P0-01 Audit: CLOSED / VERIFIED.**

The repository has a viable canonical menu-data core. The principal gap is not a missing foundational menu schema; it is the maturity of publishing/propagation and the future multi-surface content model.

## Exact follow-up task

`P0 — Verify public-content propagation after Owner mutations, including server cache invalidation and browser session-cache behavior.`
