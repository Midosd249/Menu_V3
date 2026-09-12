# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical database schema `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.

## Current Verified Position — 2026-09-12
- VERIFIED: current `main` SHA is `3c1c08e3b19d19332b11d37d781736f4cdd4a3e2`.
- VERIFIED: PR #75 Onboarding Creation Recovery is merged as `32d46be53f099069c20923afeb83ef1f8a48d1cc`; Quality passed.
- VERIFIED: PR #81 Menu Intelligence V5 Report Center is merged as `b9ff93e1bf599e249fda67dd684a0eabe0f33c26`.
- VERIFIED: PR #89 AI Provider Routing & Multimodal Fallback is merged as `da2885ff970d46bd1f679b6b31d53b8f973ff8a0`.
- VERIFIED: R2.7 WhatsApp Report Sharing is merged into current `main` as `3c1c08e3b19d19332b11d37d781736f4cdd4a3e2`.
- VERIFIED: current `main` GitHub Quality run is `34673634043` and concluded `success`.
- VERIFIED: current `main` Supabase check concluded `success`.
- VERIFIED: current `main` Vercel status is `success` with `Deployment has completed`.
- VERIFIED: the Vercel status is attached directly to current `main` SHA `3c1c08e3b19d19332b11d37d781736f4cdd4a3e2`.
- STATUS: `DEPLOYED` for current main, based on direct GitHub Vercel deployment status evidence.

## Completed Protected Work
- G1–G7.2 — CLOSED / VERIFIED.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- R2.7 WhatsApp Report Sharing — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.

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

Protected R2 principles:
- Database is the source of truth.
- Deterministic findings precede AI explanation.
- AI cannot invent price, availability, allergen, tenant, branch, permission, payment, revenue, or financial truth.
- Reports use canonical verified analytics.
- WhatsApp sharing is owner-reviewed; no autonomous outbound messaging was introduced.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing supports Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: Inception key rotation is server-side; secrets are not committed.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.

## Release / Deployment
- VERIFIED: release-only Vercel workflow remains mandatory.
- VERIFIED: current `main` has GitHub Quality success and Vercel deployment success.
- No additional deployment should be triggered merely for development iteration.

## Current Strategic Direction
Menu V3 is a Premium Arabic-first Restaurant Presence + Menu Intelligence platform:

```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
```

Do not turn the product into a generic AI chatbot, POS, accounting system, or autonomous restaurant operator.

## Exact Next Task
### R3 — Guest Experience Hardening

1. Audit the existing grounded Guest Assistant and current public-menu customer journey on `main`.
2. Verify Arabic RTL, English LTR, mixed-direction content, mobile responsiveness, search/category discovery, availability, product details, and supported customer actions.
3. Verify the assistant remains grounded in actual menu data and cannot mutate production data, create orders, decide prices, or invent allergen facts.
4. Identify only reproducible gaps and implement the smallest safe fixes.
5. Run applicable quality/browser/accessibility/performance gates locally and through GitHub.
6. Release only as one coherent batch; do not use Vercel as the development loop.

Do not rebuild the Guest Assistant. Do not reopen themes, Orders, Notifications, Import, Provider Infrastructure, or completed security work unless a current reproducible regression is proven.

## UNKNOWN / BLOCKED
- UNKNOWN: physical-device observations not directly available through the current connector environment.
- UNKNOWN: account-level Vercel Usage/Billing limits unless separately inspected; current commit nevertheless has successful Vercel deployment status.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records;
6. record exactly one next task;
7. stop.

## Evidence Labels
`VERIFIED` = direct repository/tool/test/platform evidence.
`INFERRED` = derived from verified evidence.
`PROPOSED` = recommendation not yet proven.
`UNKNOWN` = insufficient evidence.
`BLOCKED` = hard constraint prevents verification or implementation.
