# AI Provider Expansion — Phase 6 Closure — 2026-09-24

## Status

**CLOSED / VERIFIED / MERGED**

Phase 6 capability-aware routing was implemented and merged into `main`.

- Merge commit: `99dfd0c5b83baff890eecb89971ea2d0056e351e`
- PR: #285
- Source branch: `feat/ai-capability-aware-routing`
- Phase start `main`: `9573de8fbe1eca6ed0f1761b7eecf150d547f6b0`

## Implementation

Added `src/lib/menu/ai-capability-router.ts`.

The routing boundary:

`Feature → AI Core → Capability Registry → Eligible Candidate Set → Jev (gated) → Policy Validation → Selected Provider/Model → Execution Adapter`

The implementation:

- filters candidates by current registry `runtimeEligible`;
- requires execution role and requested capability;
- restricts the execution candidate family to the explicitly approved execution providers;
- derives candidate IDs from the server-side provider/model capability state;
- rejects selections outside the server-generated candidate set;
- revalidates provider runtime eligibility, role, capability, and current model before admission;
- fails closed unless authorization, entitlement, tenant scope, branch scope, and pricing policy are all verified;
- exposes a typed TypeSafe Choice boundary without activating TypeSafe.

## Verification

GitHub Quality run `35966976169` — **PASS**.

Verified stages included route generation, typecheck, full tests, W7.4–W7.10 contract tests, lint, production build, all-theme browser QA, golden 30-product performance fixture, Studio browser QA, Platform Admin browser QA, browser diagnostics, and cleanup.

GitHub W9 Orders QA run `35966976170` — **PASS**.

PR #285 final diff was reviewed before merge. No review threads or pending review submissions were present.

## Protected boundaries

No changes were made to existing provider adapters, generic structured/multimodal routing order, Smart Menu Import, database/auth/RLS/subscription/tenant/branch boundaries, or public-menu/performance phases 0–8.

TypeSafe/Jev remains `runtimeEligible:false` and is not a generic fallback.

## Deployment

**NOT_REQUESTED / NOT_PERFORMED**

The connected GitHub status still reports the known Vercel `build-rate-limit` failure context. This is deployment infrastructure/quota evidence, not a Quality/W9 application-code failure. No redeploy or retry was initiated.

## Remaining UNKNOWN / BLOCKED

- **UNKNOWN:** authenticated live TypeSafe/Jev API behavior, quota, and latency.
- **BLOCKED:** TypeSafe activation until its independent authenticated smoke and activation review are completed.
- **UNKNOWN:** Production deployment identity for merge commit `99dfd0c5b83baff890eecb89971ea2d0056e351e`.

## MUST NOT REDO

Do not rebuild or rework Groq, NVIDIA, Cloudflare Workers AI, Cerebras, Mistral, Deepgram, Phase 1 capability registry, Phase 2 credential contracts/key pools, Smart Menu Import, public-menu/performance phases 0–8, or auth/RLS/subscription/tenant/branch boundaries.

Deepgram live smoke remains deferred unless explicitly requested.

## Exact next task

**Run exactly one authenticated TypeSafe/Jev smoke on an authorized runtime using the configured TypeSafe credential, record the real response/failure evidence, and keep `runtimeEligible:false` until the activation review is complete.**

Do not start another provider implementation, deployment, redesign, or unrelated cleanup before that task is explicitly authorized.
