# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: canonical `main` is `9995848b747bdb238e45b7ed6fe6b551c6779fcc` as directly fetched from GitHub on 2026-09-14.
- VERIFIED: latest main commit mounts the shared nutrition disclosure on the published QR menu route and adds a protecting test.
- VERIFIED: R9 guest relationship work remains protected in history; current main is newer than the prior continuity SHA.
- VERIFIED: R8 and all preceding protected work remain in main.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for activation/measurement implementation; outcome pending real exposure.
- R8.1 Action Loop — CLOSED / VERIFIED / MERGED.
- R8.2 Evidence-based Recommendations — CLOSED / VERIFIED / MERGED.
- R8.3 Experiment Expansion — CLOSED / VERIFIED / MERGED.
- R8.4 Evidence-based Upsell — CLOSED / VERIFIED / MERGED.
- R8.5 Restaurant Discovery — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.

## R2 — Menu Intelligence Product Layer
STATUS: CLOSED / VERIFIED

```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX       DONE
R2.5 Verified Analytics Intelligence  DONE
R2.6 Professional Analytics Reports   DONE
R2.7 WhatsApp Report Sharing          DONE
```

## R4 — Owner Intelligence
STATUS: CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

## R5 — Growth Extensions
STATUS: CLOSED / VERIFIED

- Deterministic distribution action for published zero-activity menus.
- Uses only existing OwnerAnalytics evidence and verified publication state.
- Reuses `/studio/brand`; no duplicate dashboard or route.
- No fabricated metrics or autonomous messaging.

## R6 — Experiments
STATUS: CLOSED / VERIFIED — ACTIVATION COMPLETE; OUTCOME PENDING REAL EXPOSURE

- Experiment: `whatsapp-cta-v1`.
- Stable `control` / `prominent` assignment from existing anonymous session id.
- Server derives the recorded variant.
- Participation is limited to published menus with configured WhatsApp.
- Existing `menu_events` remains canonical through nullable experiment fields.
- Preview/owner-preview does not activate or record the experiment.
- Primary: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection target: 50 exposed sessions per variant.
- Directional interpretation only; no statistical significance claim.

## R7 — Initial Evidence Review
STATUS: IN PROGRESS — NON-BLOCKING / INSUFFICIENT EXPOSURE

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: current observed exposure remains 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: no treatment decision is justified; continue eligible real exposure.
- VERIFIED: no synthetic traffic is used and no statistical significance claim is made.

## R8 — Closed-Loop Menu Growth Engine
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: `/studio/growth` provides the unified owner-facing Observe → Act → Measure surface.
- VERIFIED: recommendations are deterministic and evidence-bound.
- VERIFIED: thin traffic is treated as insufficient evidence.
- VERIFIED: recommendations route to existing supported Studio destinations; no automatic menu mutation.
- VERIFIED: R8.1–R8.5 are complete and protected.

## R9 — Guest Relationships
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: PR #136 merged the R9 guest relationship batch.
- VERIFIED: owner-facing Studio guest relationship surface covers Guest CRM, Loyalty, Campaigns, Feedback, and Retention.
- VERIFIED: relationship data is server-authorized and tenant/branch scoped; owner/admin are the elevated roles used by the existing permission contract.
- VERIFIED: loyalty accounts and ledger, owner-controlled campaign drafts, and feedback records have RLS enabled and public access revoked.
- VERIFIED: retention and relationship overview is derived from existing guest/order data; no synthetic evidence is introduced.
- VERIFIED: autonomous outbound messaging, automatic rewards, autonomous campaign execution, predictive claims, and pricing mutation are excluded.
- VERIFIED: prior quality run 1453 passed the configured route generation, typecheck, tests, lint, build, Playwright and browser-quality stages.

## R10
STATUS: DEFERRED / NOT STARTED

R10 is intentionally not started. Do not begin R10 until the owner explicitly authorizes it.

## W7.10 — Full-Product Mobile and Responsive Pass — DONE / VERIFIED / RELEASE-STAGE DEVICE QA PENDING

- VERIFIED: final responsive CI run `34932493596` / run 1655 passed the complete configured route, test, lint, build, public, Studio, Platform Admin, performance, diagnostics, and cleanup stages for implementation HEAD `16d11eae278641062503c0a6d23d60677e6c7cb3`.
- VERIFIED: the previous Studio browser readiness assertion used `<main>` even though the real Studio Shell exposes `role="banner"`; the correction was test-only and retained route, viewport, overflow, and accessibility assertions.
- VERIFIED: the prior 320px Studio overflow measured `scrollWidth=344` versus `clientWidth=320`; diagnostics identified the Studio Shell header action group as the source.
- VERIFIED: `src/components/studio-shell.tsx` makes the mobile header action group width-contained and wrapping-safe, restoring compact horizontal sizing from `sm`.
- VERIFIED: `src/components/studio-menu-workspace.tsx` adds narrow-width containment while preserving the Menu Import action and behavior.
- VERIFIED: shared WorkspaceHeader and FilterBar wrapping protections were retained.
- VERIFIED: public all-theme QA passed all five themes across 320×800, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×800, and 1440×900 with no horizontal overflow, accessible-name failures, or runtime console errors.
- VERIFIED: Studio browser QA passed 9 tests and Platform Admin browser QA passed 20 tests in the final workflow.
- VERIFIED: no business logic, data contracts, routes, permissions, backend, dependencies, Supabase, database, RLS, auth, subscriptions, AI, orders, Vercel, merge, or deployment changed.
- UNKNOWN: physical Android/iOS device QA remains `PENDING_RELEASE_STAGE`.

## W7.11 — Final Visual Quality, Product Consistency, Release-Readiness Audit, and Draft PR Review — DONE / VERIFIED

- VERIFIED: final visual/consistency audit is recorded in `docs/W7_11_FINAL_QUALITY_AUDIT.md`.
- VERIFIED: Draft PR review is recorded in `docs/W7_11_PR_REVIEW.md`.
- VERIFIED: W7.11 found no release blocker and no unresolved high/medium visual, accessibility, navigation, or state defect in the audited W7 scope.
- VERIFIED: final W7.10 CI remains the current implementation evidence: `34933400630` / run 1661 PASS against `7a1aa201c6556d8d6f8dfcabe85489a264150663`.
- VERIFIED: PR #146 remains Open / Draft / Unmerged and is `READY_FOR_HUMAN_REVIEW`.
- VERIFIED: no product/runtime code change was required during W7.11.
- VERIFIED: no database, Supabase, RLS, auth, permissions, subscriptions, AI, orders, business logic, route architecture, dependency, Vercel, merge, or deployment change occurred during W7.11.
- UNKNOWN: physical Android/iOS QA remains `PENDING_RELEASE_STAGE`.

## Production / Commercial Readiness — IN PROGRESS

- VERIFIED: repository-side R9 implementation and quality gates are complete.
- VERIFIED: GitHub `main` contains the protected product work.
- UNKNOWN: direct current Vercel Production environment-variable values.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA.
- BLOCKED: unnecessary Vercel deployment retries must not be attempted while the known free daily deployment quota is exhausted.

## Exact Next Task
Human review of Draft PR #146, followed by the existing release-stage physical-device QA gate when the owner explicitly authorizes release work. Do not begin another product milestone automatically.
