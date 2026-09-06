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

### W8 — Imagery and Art Direction — CLOSED / VERIFIED
- VERIFIED: `docs/image-art-direction.md` defines image roles, art direction, responsive delivery, fallbacks, accessibility, licensing, provenance, and theme-specific direction.
- VERIFIED: dish/card imagery uses a 4:3 default framing rule; brand/editorial imagery uses 16:9 or 3:2 according to surface.
- VERIFIED: focal-point and mobile focal-point hooks are implemented in `src/image-art-direction.css`.
- VERIFIED: shared image CSS is loaded from `src/routes/__root.tsx` before theme styles.
- VERIFIED: existing public-menu dish media retains lazy loading, async decoding, and low fetch priority for non-critical media.
- VERIFIED: `scripts/image-art-direction-contract.test.mjs` protects the new contract and is part of `npm test`.
- VERIFIED: no new runtime dependency was introduced and existing package versions were preserved.
- VERIFIED: no Supabase schema, tenant data model, or protected theme was modified.
- UNKNOWN: tenant-specific focal-point metadata is not currently part of the canonical data model and was intentionally not introduced in W8.
- VERIFIED: final production browser/performance result passed in Quality run `34010117079`.
- Evidence record: `docs/image-art-direction.md`.

### W9 — Motion and Interaction — CLOSED / VERIFIED
- VERIFIED: `src/motion.css` centralizes duration, easing, distance, scale, and compatibility aliases.
- VERIFIED: root document loads motion before protected themes.
- VERIFIED: product-detail sheet, cart drawer, and overlay entrance choreography are deterministic and RTL-aware.
- VERIFIED: reduced-motion behavior removes movement/press scaling while preserving state feedback.
- VERIFIED: coarse-pointer hover movement is disabled.
- VERIFIED: `scripts/motion-contract.test.mjs` protects tokens, loading order, reduced-motion behavior, and public-menu dialog hooks.
- VERIFIED: the motion contract is part of the default `npm test` suite.
- VERIFIED: no new runtime dependency or Supabase/schema change was introduced.
- VERIFIED: pre-existing invalid `@radix-ui/react-popover` range `^1.2.12` was aligned to the lockfile's installable `^1.1.12` range after CI proved it blocked installation; no package upgrade was introduced.
- VERIFIED: Quality run `34010117079` passed install, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- Evidence record: `docs/motion-implementation.md`.

### W10 — Accessibility and RTL Quality — CLOSED / VERIFIED
- VERIFIED: `src/accessibility.css` provides shared focus scroll margins, document scroll padding, bidi primitives, coarse-pointer behavior, forced-colors focus, and reduced-motion compatibility.
- VERIFIED: root document loads the accessibility layer before protected theme CSS.
- VERIFIED: public product and cart dialogs expose modal semantics, accessible labels, focus entry, Tab/Shift+Tab containment, Escape handling, and focus restoration.
- VERIFIED: public order form controls have programmatic labels, autocomplete hints, appropriate phone/email input direction, and live validation feedback.
- VERIFIED: mixed Arabic/Latin/numeric values use semantic `<bdi>` isolation and `dir="auto"` where content direction is data-dependent.
- VERIFIED: fixed/sticky public UI has focus scroll clearance and important mobile controls meet the repository target-size baseline.
- VERIFIED: owner-critical Studio forms were audited at the shared `Field`/`Input` primitive level without introducing a second form system.
- VERIFIED: regression coverage exists in `scripts/accessibility-contract.test.mjs` and is part of the default `npm test` suite.
- VERIFIED: W9 motion contract was updated only to preserve its dialog-target contract after dialog IDs became unique.
- VERIFIED: final Quality run `34010619265` passed typecheck, 120 tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- UNKNOWN: direct screen-reader output and authenticated Owner UI keyboard traversal were not manually observed in this connector environment.
- Evidence record: `docs/accessibility-rtl-quality.md`.

### W11 — SEO, Local Discovery, and Shareability — CLOSED / VERIFIED
- VERIFIED: public-menu canonical URLs are absolute production URLs.
- VERIFIED: Arabic is the canonical default locale; English alternates are emitted only when real English tenant + branch names exist.
- VERIFIED: Arabic/English alternates are reciprocal and use absolute URLs.
- VERIFIED: preview theme variants remain `noindex, nofollow`.
- VERIFIED: missing public menus remain `noindex, nofollow`.
- VERIFIED: public Restaurant structured data is tenant/branch scoped and does not fabricate location data when required Saudi fields are incomplete.
- VERIFIED: public share metadata includes `og:url`, `og:site_name`, `og:title`, `og:description`, locale, and Twitter card/image metadata where an image exists.
- VERIFIED: `/robots.txt` excludes private/control surfaces and advertises `/sitemap.xml`.
- VERIFIED: `/sitemap.xml` is generated server-side from active, published tenants and active branches only.
- VERIFIED: sitemap emits English variants only when real English names exist.
- VERIFIED: no new runtime dependency or database schema migration was introduced.
- VERIFIED: discovery regression tests exist in `src/lib/menu/seo-discovery.test.ts`; public SEO tests were extended in `src/lib/menu/seo.test.ts`.
- VERIFIED: W11 final Quality run `34013074378` passed install, route generation, typecheck, 123 tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance audit/upload, and preview shutdown.
- Evidence record: `docs/seo-local-discovery-shareability.md`.

### W12-01 — Public Menu Hydration Performance — CLOSED / VERIFIED
- Objective: eliminate the avoidable duplicate public-menu request during SSR hydration.
- VERIFIED: `src/routes/m.$slug.tsx` renders from `initialMenu` and writes it to the existing session cache without issuing the mount-time `getPublicMenu` request.
- VERIFIED: the existing client-only loading path remains available when `initialMenu` is absent.
- VERIFIED: branch, locale, theme, timeout, retry, and existing cache-key behavior are preserved.
- VERIFIED: regression coverage exists in `scripts/quality-workflow.test.mjs`.
- VERIFIED: implementation record exists at `docs/performance-public-menu.md`.
- VERIFIED: final Quality Gate `34013861903` passed all required steps.
- UNKNOWN: production RUM is not available, so the exact real-user request reduction is not quantified.

### W12-02 — Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED
- Objective: reduce avoidable public-menu resource startup cost using evidence and the smallest safe change.
- VERIFIED: audited root resource loading, typography delivery, public-menu route, theme CSS loading, and `scripts/performance-audit.mjs`.
- VERIFIED: critical font origin is `https://cdn.jsdelivr.net` under the established Fontsource typography contract.
- VERIFIED: `src/routes/__root.tsx` now emits `preconnect` with anonymous CORS mode and `dns-prefetch` for that critical origin.
- VERIFIED: `scripts/quality-workflow.test.mjs` protects the connection-hint ordering and CORS contract.
- VERIFIED: no runtime dependency, Supabase/schema, tenant/cache, hydration, or theme behavior changed.
- VERIFIED: existing global theme stylesheet availability was intentionally retained because the current theme/preview architecture depends on immediate availability; speculative runtime stylesheet injection was not introduced.
- VERIFIED: Quality Gate `34014895325` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- Evidence record: `docs/performance-public-menu-resources.md`.

### W12-03 — Reliability and Failure-Path Audit — CLOSED / VERIFIED
- Objective: harden public-menu timeout, transient upstream failure, cache miss, retry, and terminal error handling without changing the successful path.
- VERIFIED: `src/routes/m.$slug.tsx` uses a bounded two-attempt retry policy with a 10-second per-attempt timeout.
- VERIFIED: retry delay is deterministic and bounded at 350 ms after the first failed attempt.
- VERIFIED: `not_found` and invalid results terminate immediately without retry.
- VERIFIED: terminal timeout, unavailable, and unknown failures provide actionable Arabic/English messages.
- VERIFIED: existing session cache remains optional and slug/branch keyed; no cross-tenant cache mechanism was introduced.
- VERIFIED: no Supabase/schema, auth, authorization, theme, routing, or successful-path data contract changed.
- VERIFIED: `scripts/quality-workflow.test.mjs` protects retry bounds, delay, terminal response handling, and localized failure copy.
- VERIFIED: Quality Gate `34015320658` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- UNKNOWN: production RUM is unavailable, so real-user timeout/retry frequency and recovery rate cannot be quantified.
- Evidence record: `docs/reliability-failure-path-audit.md`.

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
### W13 — Trust, Security, and Data Ownership — TODO
- Objective: audit public/owner boundaries, tenant and branch authorization, public data exposure, secrets/configuration, error/logging exposure, and data-ownership UX; harden only evidenced risks without changing protected product behavior.
- Acceptance: no public response exposes private tenant/owner data; authorization boundaries remain tenant/branch scoped; secrets are not embedded in client bundles or logs; error responses do not expose internal SQL, stack traces, or infrastructure details; public analytics/event paths remain tenant-scoped; security regression coverage exists for every changed boundary; full Quality Gate passes; no unrelated changes.
- Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, targeted security tests, and final diff review.
