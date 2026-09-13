# TASKS

## Completed Strategic Tasks

- P0 Public Order Hardening — CLOSED / VERIFIED.
- P1 Production/Continuity Hardening — CLOSED / VERIFIED.
- P2 Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir Theme Hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.

## R2 — Menu Intelligence Product Layer — CLOSED / VERIFIED

```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX       DONE
R2.5 Verified Analytics Intelligence  DONE
R2.6 Professional Analytics Reports   DONE
R2.7 WhatsApp Report Sharing          DONE
```

## R4 — Owner Intelligence — CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

## R5 — Growth Extensions — CLOSED / VERIFIED

- Deterministic distribution action for published zero-activity menus.
- Uses only existing OwnerAnalytics evidence and verified publication state.
- Reuses `/studio/brand`; no duplicate dashboard or route.
- No fabricated metrics or autonomous messaging.

## R6 — Experiments — CLOSED / VERIFIED

- Experiment: `whatsapp-cta-v1`.
- Stable `control` / `prominent` assignment from existing anonymous session id.
- Server derives the recorded variant.
- Participation is limited to published menus with configured WhatsApp.
- Existing `menu_events` remains canonical through nullable experiment fields.
- Preview/owner-preview does not activate or record the experiment.
- Primary metric: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection target: 50 exposed sessions per variant.
- Directional results only; no statistical significance claim.
- Production outcome remains UNKNOWN until real exposure accumulates.

## R7 — Initial Evidence Review — IN PROGRESS / NON-BLOCKING

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: current observed exposure remains 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: no treatment decision is justified; continue eligible real exposure.
- R7 remains independent and must not be closed using synthetic or insufficient traffic.

## R8 — Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED

- VERIFIED: `/studio/growth` provides the unified owner-facing Observe → Act → Measure surface.
- VERIFIED: recommendations are deterministic and grounded in existing analytics evidence.
- VERIFIED: thin traffic is explicitly treated as insufficient evidence.
- VERIFIED: recommendations route to existing supported Studio destinations; no automatic menu mutation.
- VERIFIED: R8.1 Action Loop, R8.2 Evidence-based Recommendations, R8.3 Experiment Expansion, R8.4 Evidence-based Upsell, and R8.5 Restaurant Discovery are complete and protected.

## R9 — Guest Relationships — CLOSED / VERIFIED / MERGED

- VERIFIED: PR #136 merged into `main` as `afece1cb591566e885520b703117d0994643597a`.
- VERIFIED: owner-facing Studio guest relationship surface covers Guest CRM, Loyalty, Campaigns, Feedback, and Retention.
- VERIFIED: relationship data is server-authorized and tenant/branch scoped; owner/admin are the elevated roles in the existing permission contract.
- VERIFIED: loyalty accounts and ledger, owner-controlled campaign drafts, and feedback records use RLS with public access revoked.
- VERIFIED: retention and relationship overview are derived from real guest/order data; no synthetic evidence is introduced.
- VERIFIED: autonomous outbound messaging, automatic rewards, autonomous campaign execution, predictive claims, and pricing mutation are excluded.
- VERIFIED: final GitHub Actions quality run 1453 passed route generation, typecheck, 265 tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance artifact upload, and cleanup.
- VERIFIED: a PGlite portability failure from unconditional `anon`/`authenticated` role revocation was fixed without weakening Supabase security semantics.

## R10 — DEFERRED / NOT STARTED

R10 is intentionally not started. Do not begin R10 until the owner explicitly authorizes it.

## Production / Commercial Readiness — IN PROGRESS

- VERIFIED: repository-side R9 implementation and quality gates are complete.
- VERIFIED: canonical `main` contains the R9 merge.
- UNKNOWN: direct current Vercel Production environment-variable values.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA.
- BLOCKED: do not retry Vercel deployment while the known free daily deployment quota is exhausted.

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## Saudi Food Disclosure Extension — 2026-09-13

- IMPLEMENTED LOCALLY: nullable sodium and caffeine fields with explicit caffeine basis, owner entry/review, public display, and derived high-salt warning.
- VERIFIED: canonical `menu_v3.products` migration applied successfully.
- PRESERVED: calories, existing allergen text, AI review boundaries, tenant scoping, and protected menu/theme behavior.
- UNKNOWN: final technical-regulation presentation details, controlled allergen categories, and physical-activity calculation formula.
- BLOCKED: full TypeScript gate has pre-existing route/type-generation errors unrelated to the changed Product fields.
- NOT DEPLOYED: release-only workflow has not been started.

## Golden Demo Restaurant — 2026-09-13

- VERIFIED: authorized existing tenant was rebuilt as fictional `مائدة سُرى / Sura Table`; no user, membership, order, or unrelated tenant data was overwritten.
- VERIFIED: 10 categories and 28 products, including 5 Kids Menu items, bilingual copy, calories, sodium, 4 caffeine cases, 2 high-salt cases, varied allergen coverage, one unavailable item, empty image fields, options, and variants.
- VERIFIED: Supabase direct checks confirmed tenant/owner scope, zero orders, no duplicate Arabic names, no orphan products, no invalid nutrition values, and zero non-empty image fields.
- VERIFIED LOCALLY: `npm test` 263/263, static theme/public-menu contracts 19/19, focused data/theme/SEO tests 24/24, `npm run build`, `npm run lint`, and `npm run typecheck` passed.
- BLOCKED: Playwright browser QA could not run because the browser executable is unavailable; local PGlite also lacks the pre-existing `public_content_version` schema. Static evidence passed; no theme code was changed without visual evidence.
- NOT DEPLOYED: no push, preview, or Vercel deployment was performed.

## Current Release Evidence
- VERIFIED: canonical `main` is `afece1cb591566e885520b703117d0994643597a`.
- VERIFIED: PR #136 is merged.
- VERIFIED: quality run 1453 passed all configured stages.
- UNKNOWN: direct current Vercel Production environment configuration and deployment state.
- UNKNOWN: direct physical-device production QA.

## Exact Next Task
### Production / Commercial Readiness — External Verification Gate

1. Verify Vercel Production environment/configuration against canonical Supabase project `ublxptcqefujkbeepylc` and schema `menu_v3`.
2. Perform available authenticated/browser/QR/theme/order/RTL Production QA without overstating unavailable device evidence.
3. Perform real-device QA when a real device/browser session is available.
4. Record direct evidence and close the readiness milestone when all applicable checks pass.

R7 remains active independently and does not block this task. R10 must remain untouched.

## Working Rules
- `main` is source of truth.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Preserve completed work.
- One atomic task at a time unless the user explicitly names a complete milestone.
- Never claim deployment without direct deployment evidence.
- Reconcile continuity files against Git history at every session boundary.
