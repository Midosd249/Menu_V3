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
R2.1 Menu Health / Completeness
↓
R2.2 Problem Detection
↓
R2.3 Priority + Actionable Fixes
↓
R2.4 Owner Menu Intelligence UX
↓
R2.5 Verified Analytics Intelligence
↓
R2.6 Professional Analytics Reports
↓
R2.7 WhatsApp Report Sharing
```

All seven are complete and protected. Do not reopen without a current reproducible regression.

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

## Current Verified Release
- VERIFIED: `main` SHA `3c1c08e3b19d19332b11d37d781736f4cdd4a3e2`.
- VERIFIED: GitHub Quality run `34673634043` passed.
- VERIFIED: Supabase check passed.
- VERIFIED: Vercel status for this exact SHA is `success` with `Deployment has completed`.
- STATUS: `DEPLOYED`.

## Current Atomic Task — R3 Guest Experience Hardening
### Objective
Harden the existing grounded Guest Assistant and public-menu customer journey without rebuilding completed systems.

### Scope
1. Inspect current public-menu rendering and the Guest Assistant integration on `main`.
2. Verify actual menu grounding, product-ID validation, and read-only boundaries.
3. Audit Arabic RTL, English LTR, mixed-direction content, mobile layout, search, category navigation, product details, availability, and supported customer actions.
4. Test realistic long/short names, SAR price lengths, missing/varied images, one/many products, available/unavailable items, and empty/loading/error states supported by the current architecture.
5. Fix only reproducible defects with minimal reversible changes.
6. Run relevant typecheck, tests, lint, build, Playwright/browser, accessibility, performance, and security/data checks available in the repository.
7. Prepare one coherent release batch only after verification.

### Security boundaries
- Guest Assistant remains read-only.
- It cannot mutate production DB, create orders, decide prices, decide allergens, or bypass tenant/branch isolation.
- Existing authentication, authorization, RLS, ordering, pricing, and customer-action contracts remain protected.

### Acceptance criteria
- Existing Guest Assistant remains functional and grounded.
- No regression to public menu themes or customer actions.
- Arabic/English/RTL/LTR behavior is deterministic.
- No fabricated product or allergen claims.
- All relevant quality gates pass.
- Final diff contains only R3 work and required continuity evidence.

## Research
Research level: Focused when external evidence materially improves a customer-journey decision; repository-first always. For market-specific or browser/platform questions, use official/primary sources and record material findings.

## Exact Next Action
Start R3 discovery/audit from current `main`; do not change code until the existing public journey and Guest Assistant implementation are inspected and acceptance gaps are identified.
