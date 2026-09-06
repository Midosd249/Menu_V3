# TASKS

## Completed Tasks
### P0 — Runtime Public Content Propagation — CLOSED / VERIFIED
- VERIFIED: live Supabase migration was applied to the intended `menu_v3` schema.
- VERIFIED: revision triggers cover tenant, branch, branch hours, categories, products, variants, modifier groups, modifier options, and product-modifier links.
- VERIFIED: representative live Owner-side mutations advanced the tenant public-content revision.
- VERIFIED: cross-tenant revision isolation was demonstrated.
- VERIFIED: `src/lib/menu/public.ts` versions its process-local cache key by tenant, branch, and revision.
- VERIFIED: no browser menu-content cache exists; browser storage is limited to anonymous analytics session identity.
- VERIFIED: focused regression test passes in CI.
- VERIFIED: GitHub Actions Quality run `34007481599` for commit `a43052b0f1c2ce8c64a00c852dd30f863783aa95` passed all steps: route generation, typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA, performance baseline upload, and cleanup.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP cache behavior remains unexercised in an interactive authenticated browser session.

### Project Infrastructure Identity — CLOSED / VERIFIED
- VERIFIED: Menu V3 uses Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical schema is `menu_v3`; legacy `public` tables are not the default Menu V3 surface.
- VERIFIED: infrastructure identity is recorded in `docs/project-infrastructure.md`.

### W6 — Typography Evidence & Decision — CLOSED / VERIFIED
- VERIFIED: repository typography inventory found no explicit named font dependency that must be preserved.
- VERIFIED: eight candidates were evaluated: IBM Plex Sans Arabic + IBM Plex Sans, Noto Sans Arabic + Noto Sans, Tajawal, Mada, Amiri, Noto Kufi Arabic, Lemonada, and Changa.
- VERIFIED: authoritative/open-source evidence was checked for licensing and family characteristics.
- VERIFIED: IBM Plex Sans Arabic + IBM Plex Sans selected as the default shared typography system.
- VERIFIED: Noto Sans Arabic + Noto Sans selected as Alternate 1.
- VERIFIED: Tajawal selected as Alternate 2.
- VERIFIED: decision and implementation boundary are recorded in `docs/design-intelligence.md`.
- PROPOSED: self-host/subset the smallest IBM Plex Arabic/Latin weight set; avoid the IBM npm font package because its package documentation includes telemetry.
- UNKNOWN until implementation: final payload, font-swap/CLS behavior, and runtime visual fit across all themes.
- No application code, theme architecture, database schema, dependencies, or deployment configuration changed during the decision.

## Protected Scope
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.

## Master Design Strategy
The cross-functional roadmap is recorded in `docs/design-strategy-master-plan.md`.

Workstreams:
- W0 Evidence, measurement, product positioning.
- W1 Brand positioning and content system.
- W2 Marketing website/homepage.
- W3 Public customer menu.
- W4 Owner Studio/admin UX.
- W5 Shared design system.
- W6 Typography.
- W7 Color/brand tokens.
- W8 Imagery/art direction.
- W9 Motion/interaction.
- W10 Accessibility/RTL quality.
- W11 SEO/local discovery/shareability.
- W12 Performance/reliability.
- W13 Trust/security/data ownership.
- W14 Pricing/packaging/commercial UX.
- W15 Growth/analytics/experimentation.
- W16 QA/browser/device/release.

## Current Task
### W6-01 — Typography Implementation
- Objective: introduce IBM Plex Sans Arabic + IBM Plex Sans as the shared typography foundation, self-hosted and subsetted, without changing theme architecture.
- Scope: existing font/style entry points, semantic typography tokens, official font assets/licensing documentation, representative Arabic/English/mixed-direction tests, and performance inspection.
- Acceptance: official assets/licensing; no new dependency; smallest required weight set; semantic roles preserved; Arabic/English/SAR/phone/URL/bidi samples correct; responsive states checked; font loading/layout shift measured; five themes structurally unchanged; quality gates pass.
- Constraint: no theme rewrite, no database/schema work, no unrelated refactor, no new font dependency.
- Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, and typography/performance inspection.

## Permanent Quality Gate
Future UI work must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, `docs/design-research-log.md`, `docs/project-memory/problems-learned.md`, `docs/design-strategy-master-plan.md`, `docs/design-system-contract.md`, and `docs/project-infrastructure.md` where applicable.
