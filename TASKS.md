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
- VERIFIED: GitHub Actions Quality run `34007481599` for the P0 closure commit passed all required steps.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP cache behavior remains unexercised in an interactive authenticated browser session.

### Project Infrastructure Identity — CLOSED / VERIFIED
- VERIFIED: Menu V3 uses Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical schema is `menu_v3`; legacy `public` tables are not the default Menu V3 surface.
- VERIFIED: infrastructure identity is recorded in `docs/project-infrastructure.md`.

### W6 — Typography Evidence & Decision — CLOSED / VERIFIED
- VERIFIED: eight typography candidates were evaluated with authoritative/open-source evidence.
- VERIFIED: IBM Plex Sans Arabic + IBM Plex Sans selected as the default shared typography system.
- VERIFIED: Noto Sans Arabic + Noto Sans selected as Alternate 1; Tajawal selected as Alternate 2.
- VERIFIED: decision and implementation boundary are recorded in `docs/design-intelligence.md`.

### W6-01 — Typography Implementation — CLOSED / VERIFIED
- VERIFIED: shared semantic typography contract is implemented in `src/typography.css`.
- VERIFIED: root document loads typography before theme styles.
- VERIFIED: IBM Plex Sans Arabic and IBM Plex Sans weights 400/500/600/700 are declared with `@font-face`.
- VERIFIED: WOFF2 URLs are pinned to immutable IBM Plex upstream commit SHAs and delivered through a CORS-compatible CDN.
- VERIFIED: Google Fonts runtime loading and preconnects were removed.
- VERIFIED: regression coverage exists in `scripts/typography-contract.test.mjs`.
- VERIFIED: no new runtime font dependency was added.
- VERIFIED: the previous browser-template failure was isolated to the font delivery path and the corrected pinned CDN path is the implementation of record.
- UNKNOWN until the new CI run completes: final browser-template QA and performance result for the corrected delivery path.
- Implementation status: `docs/typography-implementation-status.md`.

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
### W7 — Color / Surface / Contrast System — READY TO START
- Objective: establish and implement a shared, accessible semantic color/surface contract that improves polish and trust without flattening the five protected theme personalities.
- Scope: audit shared colors/surfaces; define semantic background/surface/elevated/text/muted/border/primary/accent/status/focus/overlay/interactive roles; validate contrast; define applicable light/dark behavior; preserve tenant branding; add regression coverage; validate responsive states; run full Quality Gate.
- Acceptance: evidence-based semantic contract documented; no theme personality flattened; critical text/controls meet selected accessibility target; focus/hover/active/disabled/error/success states explicit; shared hard-coded colors replaced where semantic tokens are required; regression coverage passes; full Quality Gate passes.
- Risks: contrast regressions, tenant-brand collisions, theme coupling, dark-mode inconsistencies, hierarchy changes.
- Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, and performance inspection.

## Permanent Quality Gate
Future UI work must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, `docs/design-research-log.md`, `docs/project-memory/problems-learned.md`, `docs/design-strategy-master-plan.md`, `docs/design-system-contract.md`, and `docs/project-infrastructure.md` where applicable.
