# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Backend Identity (VERIFIED — 2026-09-06)
- Supabase project ref: `ublxptcqefujkbeepylc`.
- Supabase URL: `https://ublxptcqefujkbeepylc.supabase.co`.
- Supabase region: `ap-northeast-2` (Seoul).
- Supabase status: `ACTIVE_HEALTHY` at last verification.
- Menu V3 canonical database schema: `menu_v3`.
- Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables are not the canonical Menu V3 surface.
- Canonical infrastructure reference: `docs/project-infrastructure.md`.

## Current Position
- G1–G7.2 completed work remains protected.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected; browser/device closure remains separately tracked where noted.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- External Theme Preview QR Mode — DONE / VERIFIED.
- Shared Public Menu Rendering Stabilization — VERIFIED.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED; implementation is incremental.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 Typography Evidence & Decision — CLOSED / VERIFIED.
- W6-01 Typography Implementation — CLOSED / VERIFIED; corrected Fontsource CDN delivery passed full Quality Gate.
- W7 Color / Surface / Contrast System — CLOSED / VERIFIED.
- **W8 Imagery and Art Direction — READY TO START.**

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## Runtime Evidence — P0 Public Content Propagation
- VERIFIED: live Supabase database contains `menu_v3.tenants.public_content_version`.
- VERIFIED: live `menu_v3` has revision triggers for tenants, branches, branch hours, categories, products, product variants, modifier groups, modifier options, and product-modifier links.
- VERIFIED: trigger functions explicitly target `menu_v3` and use `search_path = menu_v3, pg_temp`.
- VERIFIED: representative live Owner-side writes incremented the published tenant revision.
- VERIFIED: separate tenant revisions remained isolated during live mutation checks.
- VERIFIED: `src/lib/db.ts` sets `search_path` to `menu_v3,public` and `src/lib/menu/public.ts` versions its process-local cache key by tenant, branch, and revision.
- VERIFIED: browser menu-content caching is absent; browser storage is limited to anonymous analytics session identity.
- VERIFIED: canonical migration was corrected to explicitly target `menu_v3`; repair migration was applied to the live database.
- VERIFIED: GitHub Actions Quality run `34007481599` completed successfully for the P0 closure commit.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP response cache behavior has not been exercised in an interactive authenticated browser session in this environment.

## Typography Decision — W6
- VERIFIED: IBM Plex Sans Arabic + IBM Plex Sans is the selected default shared typography system.
- VERIFIED: Noto Sans Arabic + Noto Sans is Alternate 1.
- VERIFIED: Tajawal is Alternate 2.
- VERIFIED: IBM Plex is OFL-1.1, supports Arabic, is designed for UI environments, and exposes web WOFF/WOFF2 assets.
- VERIFIED: decision record: `docs/design-intelligence.md` under `Typography Decision — 2026-09-06`.

## W6-01 Typography Implementation — CLOSED Evidence
- VERIFIED: `src/typography.css` defines the shared semantic typography contract.
- VERIFIED: `src/routes/__root.tsx` loads the typography contract before theme styles.
- VERIFIED: Arabic and Latin IBM Plex weights 400/500/600/700 use exact Fontsource `5.3.0` CDN WOFF2 URLs.
- VERIFIED: assets use `font-display: swap`; Google Fonts runtime loading is removed.
- VERIFIED: `scripts/typography-contract.test.mjs` protects the delivery contract and prevents Google Fonts/font-package regression.
- VERIFIED: no new runtime font dependency was added.
- VERIFIED: the previous Browser Template QA failure was traced to 404s on the old IBM GitHub-commit CDN path.
- VERIFIED: corrected Fontsource delivery passed full Quality run `34009000701`, including all-theme browser QA and performance baseline upload.
- Delivery boundary: strict local WOFF2 self-hosting remains unclaimed because the repository connector cannot transfer binary assets; exact versioned CDN delivery is the verified production model.
- Status record: `docs/typography-implementation-status.md`.

## W7 Color / Surface / Contrast — CLOSED Evidence
- VERIFIED: `src/colors.css` owns the semantic color/surface contract.
- VERIFIED: semantic roles cover canvas, primary/secondary/elevated/inverse surfaces, overlay, content hierarchy, borders, actions, focus, status, disabled, and interactive states.
- VERIFIED: all five protected themes have semantic adapters and retain their individual personality.
- VERIFIED: status semantics are theme-independent.
- VERIFIED: selected critical palette contrast checks meet WCAG AA targets; Noir accent contrast is checked against its dark canvas.
- VERIFIED: focus-visible, disabled, placeholder, reduced-motion, and higher-contrast behavior are explicit.
- VERIFIED: public-menu shell and form controls consume semantic surface/content/border roles.
- VERIFIED: regression coverage exists in `scripts/color-contract.test.mjs`.
- VERIFIED: Quality run `34009000701` passed typecheck, tests, lint, production build, all-theme browser QA, performance baseline upload, and preview shutdown.
- Evidence record: `docs/color-system-implementation-status.md`.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W8 — Imagery and Art Direction
Objective: make hospitality quality immediately visible through a disciplined, premium image/art-direction system without weakening performance, accessibility, or the five protected theme personalities.

Scope:
- audit current image usage, placeholders, screenshots, avatars, food/product imagery, branch imagery, and marketing surfaces;
- research high-quality hospitality/editorial image patterns and current web-platform guidance;
- define art direction for hero, menu items, restaurants, branches, Owner Studio previews, and product screenshots;
- define aspect-ratio, crop, focal-point, object-position, and responsive sizing rules;
- define missing/poor-image fallbacks that preserve layout and brand hierarchy;
- define responsive image delivery, compression, loading priority, and stable geometry rules;
- define Arabic-first alt-text/content rules and decorative-image handling;
- preserve tenant ownership and never introduce unlicensed competitor imagery or copied creative assets;
- add regression coverage for image dimensions/fallback/accessibility contracts where the current architecture supports it;
- run full Quality Gate plus applicable browser/performance checks.

Acceptance criteria:
- evidence-based imagery/art-direction contract documented;
- no protected theme is flattened or replaced;
- critical public-menu and marketing images have explicit sizing/crop/fallback behavior;
- responsive image loading does not introduce avoidable layout shift;
- meaningful images have accessible alternative text and decorative images are not announced;
- no unlicensed or competitor-owned creative is introduced;
- regression coverage exists for the chosen contracts;
- full Quality Gate passes.

Risks: image licensing, visual inconsistency, CLS/performance regressions, poor Arabic content context, over-art-directed themes, oversized mobile payloads.

Verification commands: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, and performance inspection.
