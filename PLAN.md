# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: canonical `main` is `0295650fe3d59e5e25f75cecd51b9a5c8a9b131d`.
- VERIFIED: this is the post-merge continuity synchronization commit whose parent was `8bce889eda8605c73173e390139e54393024b03b`.
- VERIFIED: the preceding application baseline is the theme-hardening main commit `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: latest theme-hardening commit preceding the continuity merge contains Guest Assistant public-route/launcher hardening plus Gallery assistant modal layering and Noir item-modal stacking/surface contrast hardening.
- VERIFIED: focused Gallery/Noir regression coverage is present.

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
- Server derives the stored variant.
- Published menus with configured WhatsApp only.
- Existing `menu_events` remains canonical through nullable experiment fields.
- Preview/owner-preview does not activate or record the experiment.
- Primary: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection target: 50 exposed sessions per variant.
- Directional interpretation only; no statistical significance claim.

## R7 — Initial Evidence Review
STATUS: IN_PROGRESS — NON-BLOCKING / INSUFFICIENT EXPOSURE

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: current observed exposure is 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: current `control` has 0 WhatsApp-click sessions and 0 product-view sessions.
- VERIFIED: current `prominent` has 0 WhatsApp-click sessions and 1 product-view session.
- INFERRED: Control is at 2% of the 50-session target and Prominent is at 4% of the 50-session target.
- DECISION: no treatment decision is justified; continue real exposure and re-review after meaningful accumulation.

## AI Infrastructure
- VERIFIED: server-side provider abstraction.
- VERIFIED: structured routing for Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing for Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: schema validation, rate limiting, prompt-injection safeguards, and human-review boundaries.
- VERIFIED: server-only credentials.

## Production / Commercial Readiness
STATUS: IN_PROGRESS — REPOSITORY-READY; EXTERNAL EVIDENCE REMAINING

- VERIFIED: the temporary premium-theme testing override is server-side, expiry-bound, client-inaccessible, and hard-disabled in production; no removal is justified solely by the current all-free theme catalog.
- VERIFIED: the repository quality workflow covers route generation, typecheck, tests, lint, production build, Playwright/Chromium browser QA, all-theme template QA, and performance audit.
- VERIFIED: current `main` is `0295650fe3d59e5e25f75cecd51b9a5c8a9b131d`.
- UNKNOWN: direct Vercel Production environment-variable values are not readable through the current GitHub connector and must not be inferred from repository state.
- UNKNOWN: physical real-device Production QA is not available through the current connector environment.

## Release-Only Vercel Policy
Normal path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Do not use Vercel as the normal development loop. Do not infer production state from GitHub or HTTP 200. Do not randomly retry quota/rate/build failures.

## Current Release State
- VERIFIED: continuity synchronization is represented by current `main` commit `0295650fe3d59e5e25f75cecd51b9a5c8a9b131d`.
- VERIFIED: the current GitHub quality workflow is configured for push/PR quality gates.
- UNKNOWN: direct current Vercel Production environment configuration cannot be verified from the GitHub connector.
- UNKNOWN: direct physical-device Production QA is unavailable through the current connector environment.

## Current Strategic Direction
```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Production / Commercial Readiness
```

## Exact Next Task
### Production / Commercial Readiness — External Verification Gate

Complete only the remaining evidence-dependent work:
1. verify Vercel Production environment/configuration against the canonical Supabase target;
2. perform available authenticated/browser/QR/theme/order/RTL Production QA;
3. perform real-device QA when a real device/browser session is available;
4. record direct evidence and close the readiness milestone when all applicable checks pass.

R7 remains active independently and does not block this task.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records when the task reveals a durable lesson;
6. record exactly one next task;
7. stop.
