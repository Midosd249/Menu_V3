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
- VERIFIED: exact Fontsource `5.3.0` CDN WOFF2 URLs are used for Arabic and Latin delivery.
- VERIFIED: Google Fonts runtime loading and preconnects were removed.
- VERIFIED: regression coverage exists in `scripts/typography-contract.test.mjs`.
- VERIFIED: no new runtime font dependency was added.
- VERIFIED: the old IBM GitHub-commit CDN path was rejected by browser QA with 404s; the corrected Fontsource path is now the implementation of record.
- VERIFIED: GitHub Actions Quality run `34009000701` passed typecheck, tests, lint, production build, all-theme browser QA, performance baseline upload, and preview shutdown.
- Delivery exception: strict local WOFF2 self-hosting remains unclaimed because the repository connector cannot transfer binary assets; exact versioned CDN delivery is the verified production model.
- Implementation status: `docs/typography-implementation-status.md`.

### W7 — Color / Surface / Contrast System — CLOSED / VERIFIED
- VERIFIED: `src/colors.css` defines the shared semantic color/surface contract.
- VERIFIED: semantic roles cover canvas, primary/secondary/elevated/inverse surfaces, overlay, content hierarchy, borders, actions, focus, status, disabled, and interactive states.
- VERIFIED: all five protected themes have adapters that preserve personality while mapping shared meaning.
- VERIFIED: success/warning/danger/info remain theme-independent semantic roles.
- VERIFIED: critical default palette contrast checks meet selected WCAG AA targets, including the Noir accent against its dark canvas.
- VERIFIED: focus-visible, disabled, placeholder, reduced-motion, and higher-contrast behavior are explicit.
- VERIFIED: public-menu shell and form controls consume semantic surface/content/border roles.
- VERIFIED: `scripts/color-contract.test.mjs` protects the contract and is part of the default test suite.
- VERIFIED: GitHub Actions Quality run `34009000701` passed the full required gate, including all-theme browser QA and performance baseline.
- Evidence record: `docs/color-system-implementation-status.md`.

### W8 — Imagery and Art Direction — CLOSED / VERIFIED at contract and implementation-layer level
- VERIFIED: `docs/image-art-direction.md` defines image roles, art direction, responsive delivery, fallbacks, accessibility, licensing, provenance, and theme-specific direction.
- VERIFIED: dish/card imagery uses a 4:3 default framing rule; brand/editorial imagery uses 16:9 or 3:2 according to surface.
- VERIFIED: focal-point and mobile focal-point hooks are implemented in `src/image-art-direction.css`.
- VERIFIED: shared image CSS is loaded from `src/routes/__root.tsx` before theme styles.
- VERIFIED: existing public-menu dish media retains lazy loading, async decoding, and low fetch priority for non-critical media.
- VERIFIED: `scripts/image-art-direction-contract.test.mjs` protects the new contract and is part of `npm test`.
- VERIFIED: no new runtime dependency was introduced and existing package versions were preserved.
- VERIFIED: no Supabase schema, tenant data model, or protected theme was modified.
- UNKNOWN: tenant-specific focal-point metadata is not currently part of the canonical data model and was intentionally not introduced in W8.
- UNKNOWN: final production browser/performance result for the latest W8 commit until the new Quality run completes.
- Evidence record: `docs/image-art-direction.md`.

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
### W9 — Motion and Interaction — READY TO START
- Objective: create a restrained, premium motion system that improves hierarchy, feedback, orientation, and perceived quality without introducing motion sickness, blocking interaction, harming accessibility, or compromising mobile performance.
- Scope: audit existing transitions, drawers, dialogs, buttons, cart interactions, theme previews, loading states, and route changes; define duration/easing/distance/scale/opacity tokens; standardize hover/focus/press/selection/success/error/loading feedback; define drawer/sheet/overlay choreography; preserve immediate customer feedback; support `prefers-reduced-motion`; avoid layout-affecting animation; define mobile/low-power budgets; add regression coverage; run the full Quality Gate.
- Acceptance: evidence-based motion contract documented; tokens centralized and theme-compatible; key interactions consistent; reduced-motion explicit and verified; no avoidable layout shift or interaction blocking; five themes remain distinct; regression coverage exists; full Quality Gate passes.
- Risks: excessive motion, accessibility regressions, low-end mobile jank, theme inconsistency, interaction delays.
- Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, and performance inspection.

## Permanent Quality Gate
Future UI work must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, `docs/design-research-log.md`, `docs/project-memory/problems-learned.md`, `docs/design-strategy-master-plan.md`, `docs/design-system-contract.md`, and `docs/project-infrastructure.md` where applicable.
