# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main branch protection — CLOSED / VERIFIED.
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

All seven are complete and protected. Do not reopen without a current reproducible regression.

## R4 — Owner Intelligence
STATUS: CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

R4 protected principle:
**verified evidence → evidence quality → insight → priority → owner action → re-check**

The Owner Intelligence layer remains deterministic at the data boundary. AI may explain or prepare recommendations, but it cannot become the source of truth or autonomously mutate production data.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing: Inception/Mercury → Gemini → Z.AI → OpenRouter → xKiro, configurable by server environment.
- VERIFIED: multimodal routing: Gemini → OpenRouter → Z.AI → xKiro.
- VERIFIED: Inception key rotation is server-side and secrets are not stored in Git.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.

## Release-Only Vercel Policy
Normal path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Do not use Vercel for ordinary development or visual iteration. CI success and HTTP 200 are not deployment identity evidence. Do not randomly retry deployments or Redeploy.

## Current Verified Main
- VERIFIED: current `main` SHA is `08565c47550df828450c76c8ce27fb6c373b04fd`.
- VERIFIED: R4.5 is merged at that SHA.
- VERIFIED: GitHub Vercel status for that SHA reports `Deployment has completed`.
- UNKNOWN: direct physical-device production QA is unavailable through the current connector environment.

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

## R5 — Growth Extensions
STATUS: DISCOVERY / NOT IMPLEMENTED

Objective: identify the highest-value growth improvement already supported by real product data and current architecture, then implement one atomic improvement without duplicating existing capabilities.

Required discovery before editing:
1. Inspect current growth, analytics, experimentation, local-visibility, conversion, onboarding, and public-menu capabilities.
2. Map existing data sources and identify what is actually measurable today.
3. Identify customer/owner friction that can be addressed without inventing metrics.
4. Select one evidence-backed atomic improvement with clear acceptance criteria.
5. Preserve R2/R3/R4, themes, orders, import, provider infrastructure, security, tenant isolation, and release controls.

## Research
Research level for the next task: Focused by default; escalate to Deep only if external market/customer evidence materially changes the decision. Repository-first remains mandatory.

## Exact Next Action
Perform R5 discovery on current `main @ 08565c47550df828450c76c8ce27fb6c373b04fd`, then choose exactly one atomic growth improvement based on verified evidence. Do not implement before the discovery identifies a non-duplicative target.
