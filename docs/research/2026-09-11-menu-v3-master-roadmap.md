# Menu V3 — Master Roadmap

**Date:** 2026-09-11

## Decision
Unify the prior V4/V5/V6 work with the latest market and AI research. Do not restart or broaden the product into a POS platform.

## Current state — VERIFIED
- `main` is the source of truth; current tip: `01bb45cd2289d656a65dfd621eb4d84b0746ebb5`.
- Current history includes intelligence, owner order alerts, WhatsApp reports, V5 report coverage alignment, and safe AI product-price extraction/application.
- Existing menu, ordering, cart, Item Notes, Quick Add, themes, authentication, authorization, tenant/branch isolation, and analytics are protected.
- V4 Saudi Menu Readiness is retired as an active milestone. Keep its research as reference; do not resurrect it as a separate product.
- Reports remain inside Analytics. WhatsApp/email are delivery channels, not a new reporting product.

## Product thesis
**Menu V3 = premium Arabic-first restaurant presence + direct customer action + owner intelligence.**

The differentiator is not a QR code or a generic chatbot. It is a menu that is easy to launch, easy to maintain, trustworthy, bilingual, mobile-first, and connected to useful owner actions.

## Consolidated roadmap

### R0 — Release reconciliation
Verify the current main release and its already-merged intelligence, order-alert, reporting, and AI price flows. Keep Vercel outside the development loop while rate/build limits are active.

### R1 — Safe Menu Intelligence Foundation — NEXT
Create one server-side AI boundary:
- replaceable provider adapter;
- versioned prompts and structured schemas;
- trusted server tenant/branch context;
- bounded usage and rate controls;
- timeout/error fallback;
- PII minimization;
- deterministic validation around AI output;
- draft/approval workflow for owner content;
- Arabic/English evaluation set.

### R2 — Menu Intelligence UX
Build on the foundation, inside existing Studio flows:
- Copy Studio: description, English, category, tags;
- Translation QA;
- Structured Menu Ingest from text;
- stronger Menu QA;
- preserve the existing explicit price extraction/application flow.

### R3 — Grounded Guest Assistant
Later, only with read-only tools and branch-scoped available menu data. Never invent price, availability, allergens, or unsupported facts. No payment, booking, or autonomous transaction execution.

### R4 — Owner Intelligence
Health/readiness from real metrics, concise briefing inside Analytics, action-oriented recommendations, professional report generation, and supported WhatsApp/email handoff. Never invent revenue, conversion, ranking, or causal uplift.

### R5 — Growth extensions
Only after real usage data: rule-based pairing/upsell with AI wording, aggregated analytics copilot, campaign drafts, and review intelligence after a real feedback source exists.

### R6 — Experiments
Voice FAQ, deeper personalization, autonomous merchandising. Experimental only until privacy, reliability, cost, and evidence justify them.

## Explicitly deferred
AI Search, generic chatbot/AI waiter, POS/KDS/accounting/full inventory replacement, reservation platform, autonomous pricing, autonomous publishing of sensitive facts, and a sixth theme.

## Saudi position
Prioritize Arabic RTL, English LTR, SAR pricing, local dish names, bilingual culinary wording, structured allergen/nutrition data, QR/direct customer action, WhatsApp workflows, and owner simplicity. Any regulatory claim must be rechecked against current official SFDA material before implementation or marketing.

## AI rules
1. Database/business rules are the source of truth.
2. AI drafts; humans approve sensitive owner content.
3. Read-only tools before write tools.
4. No PII by default.
5. Never trust model output for price, availability, allergens, tenant, branch, role, or entitlement.
6. Never expose API keys to the browser.
7. Avoid provider lock-in.
8. Free API credits are for evaluation and bounded pilots, not permanent pricing assumptions.
9. Every AI feature needs measurable value and regression coverage.
10. Local verification first; one coherent release batch later.

## Research interpretation
The supplied Grok reports are treated as strategic research inputs, not repository facts. Their competitor prices, adoption figures, and regulatory interpretations must be independently rechecked before public claims. Their strongest actionable conclusion is that Menu V3 should avoid QR-only competition and instead combine trusted menu data, maintenance intelligence, direct customer action, and owner usefulness.

## Acceptance gate for R1
No client-side secret exposure; trusted tenant/branch context; schema validation; deterministic business validation; bounded usage; privacy controls; Arabic/English coverage; focused tests; typecheck/test/lint/build gates; task-scoped diff; no unsupported deployment claim.

## Exact next task
**R0 release reconciliation, then R1 Safe Menu Intelligence Foundation as one atomic milestone.**
