# Menu V3 — Canonical Content & Publishing Audit

Date: 2026-09-06
Status: CLOSED / VERIFIED for audit scope

## Purpose

Validate the Manus design-strategy recommendation against the actual Menu V3 repository before introducing schema or UI changes.

The target model is:

`Owner content → canonical tenant/menu data → preview/review → publish → public menu → website/SEO surfaces → analytics`

This audit is evidence-first. The audit phase itself introduced no schema/dependency changes; the follow-up propagation task is recorded separately below.

## Evidence reviewed

- `src/lib/menu/types.ts`
- `src/lib/menu/public.ts`
- `src/lib/menu/owner.ts`
- `src/lib/menu/studio.tsx`
- `src/components/studio-shell.tsx`
- `src/components/public-menu.tsx`
- `src/lib/menu/session.ts`
- `src/routes/m.$slug.tsx`
- `src/routes/m.$slug.$branch.tsx`
- `migrations/0002_menu_v3.sql`
- `migrations/0008_menu_product_options.sql`
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
| Server public cache | EXISTS / VERIFIED | `getPublicMenu` keeps a 15s process-local cache. It is now keyed by the database-backed `tenants.public_content_version`. |
| Public cache invalidation | VERIFIED | Owner-facing mutations are covered by database triggers that increment the tenant public-content revision. Direct SQL/import paths are therefore covered too. |
| Browser content cache | NOT PRESENT | `src/components/public-menu.tsx` does not cache menu content in browser storage. `src/lib/menu/session.ts` uses `localStorage` only for the anonymous analytics session identifier; it is not a menu-content cache. |
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

These are future requirements, not a reason to add a full publishing system now. They must become a separate implementation task only after product requirements and migration safety are proven.

### 3. Propagation was the concrete gap and is now repaired

The original audit identified a 15s server cache and did not find proof that every owner mutation explicitly called `invalidatePublicMenuCache()`.

The follow-up implementation now makes cache correctness independent of individual owner code paths:

- `tenants.public_content_version` is the database source-of-truth revision.
- Tenant changes and all public-menu child-table mutations increment that revision through PostgreSQL triggers.
- `getPublicMenu` includes the revision in its process-local cache key.
- Any committed public-content change therefore produces a new cache key on the next request, including requests handled by another server instance.
- The existing `invalidatePublicMenuCache()` helper remains available for explicit same-process invalidation where useful.

This is stronger than maintaining a growing list of owner-side invalidation calls.

### 4. There is no browser menu-content cache to invalidate

The initial audit wording referred to a browser session cache. Source inspection corrected that assumption:

- `src/components/public-menu.tsx` does not persist menu data in browser storage.
- `src/lib/menu/session.ts` stores only the anonymous analytics session identifier in `localStorage`.

Therefore the propagation contract is now:

`Owner mutation → DB transaction → public_content_version → server cache key → fresh Public Menu payload`

There is no separate browser menu-content cache layer in the current implementation.

### 5. Branch scope is asymmetric by design

Branch identity/hours are branch-specific, while categories and products are tenant-scoped. This may be intentional shared-menu behavior. It is not a defect by itself. Branch-specific menu availability/content should only be added if a real product requirement demands it.

### 6. Website is not yet proven to be a tenant-generated surface

The strategy calls for Menu + Website + Local Discovery, but the audited model does not yet prove a dedicated tenant website-content layer. This is an architecture/product question for a later task, not a reason to duplicate product data now.

## Security review

- Public menu reads are gated by active/published tenant state.
- Owner mutations use server-side authentication middleware and membership checks.
- Category/product mutations enforce tenant ownership through server-side membership lookup.
- Product category references are validated against the authenticated tenant before writes.
- Public event input is schema-validated and product/tenant ownership is checked for product-view events.
- The revision triggers derive tenant scope from trusted foreign-key relationships; no client-supplied tenant identifier is accepted by the revision mechanism.
- No secret, credential, or client-controlled tenant identity was introduced.

## Decision

**VERIFIED:** Menu V3 already has the canonical menu-data foundation recommended by Manus.

**VERIFIED:** The concrete public propagation gap identified by P0-01 has been repaired using a database-backed content revision rather than a fragile mutation-by-mutation invalidation list.

**PROPOSED:** Keep the current 15s process-local payload cache, but treat the database revision as the correctness boundary. Optimize further only if measured performance requires it.

**Future P1/P2:** evaluate a formal publish/revision model and a tenant website-content model only after current publishing requirements are measured.

## Implementation record

### Changed files

- `migrations/20260906001000_public_menu_content_revision.sql`
- `src/lib/menu/public.ts`
- `scripts/public-menu-cache.test.mjs`

### Migration behavior

`public_content_version` is a `bigint` revision counter on `tenants`. PostgreSQL triggers increment it for:

- tenants;
- branches;
- branch_hours;
- categories;
- products;
- product_variants;
- modifier_groups;
- modifier_options;
- product_modifier_groups.

The trigger is intentionally database-driven so future imports or trusted SQL mutations cannot silently bypass cache versioning. The tenant trigger explicitly ignores a change that only updates the revision itself, preventing recursive version increments.

## Verification

**VERIFIED by source inspection:**

- All current Owner mutations that change public content were mapped in `src/lib/menu/owner.ts`.
- Every mapped mutation changes one of the trigger-covered tables.
- Public cache keys now contain the database revision.
- Tenant and branch identity remain part of the cache key.
- No browser menu-content storage exists.
- `localStorage` is used only for anonymous analytics session identity.
- No dependency or theme change was introduced.

**ENVIRONMENT LIMITATION:** the agent environment cannot clone the GitHub repository because outbound DNS/network access is unavailable, so local `npm` execution could not be performed in this session. This is not presented as a passing test result.

**REQUIRED external verification before release:**

- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
- focused `node --test scripts/public-menu-cache.test.mjs`
- apply the migration against the intended database and verify trigger behavior with a real Owner → Public mutation.

## Acceptance result

**P0 — Public-content propagation: IMPLEMENTED / SOURCE-VERIFIED; runtime database verification remains REQUIRED before marking fully runtime-verified.**

The code now has a database-backed propagation contract. The remaining evidence gap is execution against the actual database/runtime, not an unresolved design or implementation gap.

## Exact next task

`P0 — Runtime verification of public-content propagation after Owner mutations, including migration application and cross-branch/tenant isolation.`
