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
- Uses existing OwnerAnalytics evidence and verified publication state.
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
- VERIFIED: retention and relationship overview are derived from existing guest/order data; no synthetic evidence is introduced.
- VERIFIED: autonomous outbound messaging, automatic rewards, autonomous campaign execution, predictive claims, and pricing mutation are excluded.
- VERIFIED: prior quality run 1453 passed the configured route generation, typecheck, tests, lint, build, Playwright and browser-quality stages.

## R10
STATUS: DEFERRED / NOT STARTED

R10 is intentionally not started. Do not begin R10 until the owner explicitly authorizes it.

## AI Infrastructure
- VERIFIED: server-side provider abstraction.
- VERIFIED: structured routing for Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing for Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: schema validation, rate limiting, prompt-injection safeguards, and human-review boundaries.
- VERIFIED: server-only credentials.

## Production / Commercial Readiness
STATUS: IN PROGRESS — EXTERNAL EVIDENCE REMAINING

- VERIFIED: repository-side R9 implementation and CI quality gates are complete.
- VERIFIED: GitHub `main` contains the protected product work.
- UNKNOWN: direct current Vercel Production environment-variable values.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA.
- BLOCKED: unnecessary Vercel deployment retries must not be attempted while the known free daily deployment quota is exhausted.

## Release-Only Vercel Policy
Normal path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Do not use Vercel as the normal development loop. Do not infer production state from GitHub or HTTP 200. Do not randomly retry quota/rate/build failures.

## Current Release State
- VERIFIED: `main` is `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: the latest main commit was directly fetched from GitHub.
- UNKNOWN: direct current Vercel Production deployment state and environment configuration.
- UNKNOWN: physical real-device Production QA.

## Current Strategic Direction
```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Guest Relationships
→ Production / Commercial Readiness
```

## W7 — Internal Product Experience Architecture
STATUS: W7.1 COMPLETE / W7.2 VERIFIED / W7.3 IN PROGRESS

- VERIFIED: W7.1 audited current Studio/Admin source architecture against main SHA `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: W7.1 deliverables were added on working branch `w7-1-ia-audit`: `docs/W7_SOURCE_SWEEP.md`, `docs/W7_1_IA_AUDIT.md`, `docs/W7_1_ROUTE_MAP.md`, `docs/W7_1_WIREFRAMES.md`.
- VERIFIED: `/admin` is a tab-driven monolith with 12 tabs/pseudo-route states.
- VERIFIED: `/studio/growth` and `/studio/guests` source routes exist.
- VERIFIED: W7.2 route generation executed in GitHub Actions run `34898237425` and produced both routes in `src/routeTree.gen.ts`.
- VERIFIED: generated route artifact was committed by generator-producing CI as `0b4057bbfabadff156fd7f2fd48ecf1e1d8c118d`.
- VERIFIED: route freshness check passed.
- VERIFIED: typecheck, tests, lint, and production build passed in actual CI run `34898237425`.
- VERIFIED: W7.2 was accepted without page migration or navigation changes.

### W7.3 — Studio Shell Transformation
STATUS: IMPLEMENTATION_IN_PROGRESS

- VERIFIED: primary desktop workspaces are Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual navigation maps only to real existing routes.
- VERIFIED: Appearance consolidates Brand + Design; Publishing consolidates QR + Preview.
- VERIFIED: Growth exposes existing Overview, Intelligence, Actions, Analytics, Reports routes.
- VERIFIED: Customers exposes existing Guests/Retention surface without inventing standalone child routes.
- VERIFIED: mobile primary is Home, Menu, Orders, Growth, More using W7.2 `MobileBottomNav`.
- VERIFIED: existing `settings.write` and `team.write` permission gates remain in place.
- VERIFIED: Platform Admin remains outside the Studio shell hierarchy.
- PENDING_BROWSER_QA: real browser/device, RTL/LTR, keyboard, focus, and long-content validation remains.

## Exact Next Task
### W7.3 — Execute quality and browser verification, then review diff

Run route generation, generated-artifact freshness, typecheck, tests, lint, production build, existing navigation/component contract tests, and browser/visual/RTL/accessibility QA. Then review the final diff and forbidden-file list. Do not start W7.4.

R7 remains active independently. R10 remains deferred and untouched.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records when the task reveals a durable lesson;
6. record exactly one next task;
7. stop.