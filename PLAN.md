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

## R3 — Guest Experience Hardening
STATUS: CLOSED / VERIFIED / MERGED

### Completed
- Audited the existing grounded Guest Assistant and public-menu integration.
- Preserved read-only grounding, actual catalog/product-ID validation, tenant/branch boundaries, and existing customer ordering behavior.
- Hardened the existing Guest Assistant dialog with Escape handling, keyboard focus containment, focus restoration, body scroll locking, and assistive-technology dialog semantics.
- Added focused regression coverage.
- Updated the shared UI Button contract with forwarded refs required for correct focus management.
- PR #103 merged to `main` as `45e20a8b760ec4ec4571a8839b5194b33cbd4b61`.
- GitHub Quality for the R3 PR head passed: run `34675215594`.
- No theme, order, auth, RLS, tenant-isolation, provider, database, or deployment configuration changes were introduced.

### Release constraint
- Vercel is currently blocked by the account build-rate quota. This blocks deployment attempts, not engineering progress.
- Do not retry or redeploy merely to clear the status. Continue repository/CI work and use one production deployment when the quota permits.

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

## Current Verified Repository Position
- VERIFIED: `main` SHA `45e20a8b760ec4ec4571a8839b5194b33cbd4b61`.
- VERIFIED: commit is the signed merge commit for R3 Guest Experience Hardening.
- VERIFIED: R3 PR Quality run `34675215594` passed before merge.
- BLOCKED: Vercel deployment for the new main SHA is not established because the current Vercel account/build quota rejects deployment attempts.
- The last separately verified production deployment remains the prior successful release SHA until a new Vercel deployment is directly evidenced.

## R4 — Owner Intelligence
STATUS: NEXT / DISCOVERY

### Objective
Extend the existing owner intelligence surfaces into a decision-support layer using only verified menu and analytics data. R4 must not become a generic chatbot or an autonomous operator.

### Guardrails
- Existing Analytics and Menu Intelligence remain the canonical owner surfaces; do not create a parallel dashboard without verified architectural need.
- Database-backed and server-verified data is the source of truth.
- AI may explain, summarize, prioritize, and draft recommendations; it may not invent metrics or silently mutate production data.
- No autonomous price, allergen, availability, tenant, branch, payment, or financial decisions.
- Recommendations must distinguish observed facts from interpretation and proposed action.
- Zero-data states must remain explicit rather than producing fabricated percentages or trends.

### Discovery sequence
1. Inspect current Analytics, Menu Intelligence, Growth Advisor, reports, and relevant server contracts on `main`.
2. Map existing verified facts, insights, recommendations, and available owner actions.
3. Identify duplicated or fragmented owner UX before adding anything.
4. Select one atomic R4 capability with a measurable acceptance contract.
5. Implement only the smallest safe extension.
6. Run repository, CI, browser/accessibility, and security/data checks relevant to that capability.
7. Keep deployment deferred until the single release batch is ready and Vercel quota permits it.

## Exact Next Action
Start R4 discovery from `main` at `45e20a8b760ec4ec4571a8839b5194b33cbd4b61`; inspect the existing owner-intelligence surfaces and server contracts before editing code. Do not reopen R2 or rebuild R3.