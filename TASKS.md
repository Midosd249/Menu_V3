# TASKS

## Completed Tasks
### W13 — Trust, Security, and Data Ownership — CLOSED / VERIFIED
- VERIFIED: public tenant responses use a distinct `PublicTenant` type that omits `ownerUserId`.
- VERIFIED: `mapPublicTenant()` strips `owner_user_id` before public serialization; operational revision metadata is not exposed through the public type.
- VERIFIED: authenticated Studio workflows retain the full `Tenant` type.
- VERIFIED: inactive `tenant_members` records fail closed and inactive members are excluded from Studio member snapshots.
- VERIFIED: Owner/Admin server functions retain the shared `authMiddleware` chokepoint and tenant/branch predicates.
- VERIFIED: platform administration remains fail-closed through the existing `requirePlatformAdmin` and database-backed platform-admin check.
- VERIFIED: `scripts/security-boundary.test.mjs` covers public/private data separation, authenticated middleware coverage, platform-admin fail-closed behavior, and client-reachable secret-name leakage.
- VERIFIED: existing dependency versions were preserved; no new dependency was added.
- INFERRED: the existing platform-admin mechanism is the correct foundation for high-privilege operations; a client-side permanent superuser flag is intentionally rejected.
- Decision: future emergency/holiday client support should use a time-bound, tenant-scoped, audited support session rather than a blanket bypass. This is a follow-up design, not an insecure shortcut.
- Evidence: `docs/security-w13-trust-data-ownership.md`.
- VERIFIED: final Quality Gate `34050857106` passed all required steps.

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
- VERIFIED: shared accessibility primitives, focus behavior, bidi handling, forced-colors focus, and reduced-motion compatibility are implemented.
- VERIFIED: public dialogs expose modal semantics, labels, focus entry, keyboard containment, Escape handling, and focus restoration.
- VERIFIED: public order controls have programmatic labels, autocomplete hints, appropriate phone/email direction, and live validation feedback.
- VERIFIED: mixed Arabic/Latin/numeric values use semantic bidi isolation and `dir="auto"` where needed.
- VERIFIED: owner-critical Studio forms were audited at the shared `Field`/`Input` primitive level.
- VERIFIED: regression coverage exists in `scripts/accessibility-contract.test.mjs`.
- VERIFIED: final Quality run `34010619265` passed required checks.
- UNKNOWN: direct screen-reader output and authenticated Owner UI keyboard traversal were not manually observed in this connector environment.
- Evidence record: `docs/accessibility-rtl-quality.md`.

### W11 — SEO, Local Discovery, and Shareability — CLOSED / VERIFIED
- VERIFIED: public-menu canonical URLs are absolute production URLs.
- VERIFIED: Arabic is the canonical default locale; English alternates are emitted only when real English tenant + branch names exist.
- VERIFIED: reciprocal Arabic/English alternates, preview noindex behavior, scoped Restaurant structured data, share metadata, robots, and sitemap generation are protected.
- VERIFIED: discovery regression tests exist in `src/lib/menu/seo-discovery.test.ts` and `src/lib/menu/seo.test.ts`.
- VERIFIED: W11 final Quality run `34013074378` passed all required steps.
- Evidence record: `docs/seo-local-discovery-shareability.md`.

### W12-01 — Public Menu Hydration Performance — CLOSED / VERIFIED
- VERIFIED: SSR `initialMenu` prevents the avoidable mount-time duplicate public-menu request.
- VERIFIED: client-only loading remains available when SSR data is absent.
- VERIFIED: branch, locale, theme, timeout, retry, and cache-key behavior are preserved.
- VERIFIED: Quality Gate `34013861903` passed all required steps.
- UNKNOWN: production RUM is not available, so the exact real-user request reduction is not quantified.

### W12-02 — Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED
- VERIFIED: critical font origin and root resource loading were audited.
- VERIFIED: anonymous-CORS `preconnect` and `dns-prefetch` were added for the established critical font origin.
- VERIFIED: `scripts/quality-workflow.test.mjs` protects the connection-hint contract.
- VERIFIED: Quality Gate `34014895325` passed all required steps.
- Evidence record: `docs/performance-public-menu-resources.md`.

### W12-03 — Reliability and Failure-Path Audit — CLOSED / VERIFIED
- VERIFIED: bounded two-attempt retry policy with 10-second per-attempt timeout and 350 ms retry delay.
- VERIFIED: `not_found` and invalid results terminate immediately without retry.
- VERIFIED: terminal failure messages are actionable in Arabic and English.
- VERIFIED: existing optional cache remains tenant/branch safe.
- VERIFIED: `scripts/quality-workflow.test.mjs` protects retry and terminal-response behavior.
- VERIFIED: Quality Gate `34015320658` passed all required steps.
- UNKNOWN: production RUM is unavailable for real-user timeout/retry frequency.
- Evidence record: `docs/reliability-failure-path-audit.md`.

### W14 — Pricing, Packaging, and Commercial UX — CLOSED / VERIFIED
- VERIFIED: market scan covers current Saudi/MENA and global digital-menu pricing patterns; evidence is recorded in `docs/commercial-w14-pricing.md`.
- VERIFIED: commercial plan catalog mirrors the active subscription catalog: Free 0 SAR / 1 branch / 50 products / 3 team members; Starter 99 SAR / 3 / 300 / 10; Pro 199 SAR / 10 / 1,000 / 25.
- VERIFIED: all five protected themes remain available across plans; no artificial theme gate was introduced.
- VERIFIED: bilingual `/pricing` presents prices and operational limits without exposing private tenant data.
- VERIFIED: online checkout is explicitly not claimed; no fake payment path was introduced.
- VERIFIED: authenticated Studio overview resolves subscription state through active tenant membership and displays active-branch, item, and active-team usage against limits.
- VERIFIED: `src/lib/menu/commercial.test.ts` protects the commercial catalog and is included in `npm test`.
- VERIFIED: no runtime dependency or database schema change was introduced by W14.
- VERIFIED: Quality Gate `34052577671` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- VERIFIED: Vercel deployment status for W14 head commit `d1bfd7ea1d7cbd225bde923850827cd25f80b064` is `success`.
- INFERRED: operational scale is the strongest current packaging boundary because those limits already exist and are enforced server-side.
- UNKNOWN: payment collection, automated billing, invoices, refunds, and webhook-driven subscription transitions remain unimplemented and are outside W14.
- Evidence record: `docs/commercial-w14-pricing.md`.

### W15 — Growth, Analytics, and Experimentation — CLOSED / VERIFIED
- VERIFIED: current product-analytics and experimentation research is recorded in `docs/growth-w15-analytics-experimentation.md`.
- VERIFIED: existing event taxonomy remains exactly `visit`, `qr_scan`, `product_view`, `whatsapp`.
- VERIFIED: added denominator-safe directional growth ratios in `src/lib/menu/growth.ts`.
- VERIFIED: added product views per 100 visits, WhatsApp clicks per 100 sessions, visits per 100 QR scans, average views/session, and opportunity classification; UI explicitly avoids unique-user conversion claims.
- VERIFIED: Studio Analytics now presents the growth loop in Arabic/English.
- VERIFIED: added `src/lib/menu/growth.test.ts` to the default test suite.
- VERIFIED: tenant-scoped analytics integrity remains protected by `src/lib/menu/analytics-integrity.test.ts`.
- VERIFIED: no third-party analytics SDK, fingerprinting, IP storage, schema migration, or parallel tracking system was introduced.
- VERIFIED: production A/B experimentation is explicitly not activated because the current event schema lacks experiment exposure/variant data.
- INFERRED: acquisition → engagement → intent is the strongest immediate growth loop supported by current evidence.
- UNKNOWN: retention, revenue attribution, statistical significance, and true order conversion remain unavailable until corresponding production events exist.
- VERIFIED: Quality Gate `34053348446` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- Evidence: `docs/growth-w15-analytics-experimentation.md`.

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
### W16 — QA, Browser/Device, and Release
- Objective: perform the final release-readiness pass across the complete Menu V3 surface without reopening completed foundations.
- Acceptance: full repository state, diff, history, configuration, documentation, and deployment path audited; typecheck/tests/lint/build/Playwright/all-theme QA/performance/release checks pass; W14/W15 regressions remain green; Arabic/English/RTL remain intact; no unresolved P0/P1 security, isolation, accessibility, or reliability issue; final release evidence is recorded before merge.
- Verification: repository Quality Gate plus final diff review and deployment status.
