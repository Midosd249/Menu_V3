# Menu V3 — AI Provider Routing

## Status

`VERIFIED` — implemented on the release branch `feat/ai-provider-routing-and-multimodal-fallback` and corrected on `fix/ai-xkiro-model-routing` before the final quality gate.

## Purpose

Menu V3 keeps a single server-side AI boundary while allowing the underlying provider to change without changing feature callers. The database remains the source of truth and AI output remains a validated draft/recommendation.

## Structured AI routing

Default order:

1. Inception / Mercury 2.5
2. Google Gemini 3.5 Flash-Lite
3. Z.AI GLM-4.7 Flash
4. OpenRouter `google/gemma-4-31b-it:free`
5. xKiro `minimax/minimax-m3:free`

xKiro's free-tier MiniMax M3 is a text/reasoning fallback. xKiro model IDs use the `vendor/model` format and are resolved through its OpenAI-compatible gateway.

The order is configurable with `AI_PROVIDER_ORDER`. A single provider can be forced with `AI_PROVIDER`, although `auto` is the default behavior.

## Multimodal routing

For menu images and PDFs:

1. Google Gemini 3.5 Flash-Lite
2. OpenRouter `google/gemma-4-31b-it:free`
3. Z.AI GLM-4.6V-Flash

xKiro is intentionally **not** a default image/PDF provider because its verified free default is text-only. A future xKiro vision model may be enabled safely by setting `XKIRO_VISION_MODEL`; the router will then include xKiro in the multimodal fallback order without silently sending images to a text-only model.

The order is configurable with `AI_MULTIMODAL_PROVIDER_ORDER`.

## Server environment contract

Secrets are server-only and must never be committed or exposed to browser code.

- `INCEPTION_API_KEY`
- `INCEPTION_API_KEY_2`
- `INCEPTION_API_KEY_3`
- `INCEPTION_API_KEY_4`
- `INCEPTION_API_KEY_5`
- `INCEPTION_API_KEY_6` — optional
- `INCEPTION_MODEL` — optional; defaults to `mercury-2.5`
- `GOOGLE_GEMINI_API_KEY`
- `GEMINI_MODEL` — optional; defaults to `gemini-3.5-flash-lite`
- `ZAI_API_KEY`
- `ZAI_MODEL` — optional; defaults to `glm-4.7-flash`
- `ZAI_VISION_MODEL` — optional; defaults to `glm-4.6v-flash`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` — optional; defaults to `google/gemma-4-31b-it:free`
- `XKIRO_API_KEY`
- `XKIRO_MODEL` — optional; defaults to `minimax/minimax-m3:free`
- `XKIRO_VISION_MODEL` — optional; when set, xKiro becomes eligible for image/PDF fallback
- `AI_PROVIDER` — optional; defaults to `auto`
- `AI_PROVIDER_ORDER` — optional structured-provider override
- `AI_MULTIMODAL_PROVIDER_ORDER` — optional image/PDF-provider override
- `AI_REQUESTS_PER_MINUTE` — optional server-side per-tenant/user limit

## Inception key rotation

The first five configured Inception keys are treated as a key pool. The router rotates the starting key by minute and falls through to the remaining keys if the current key/provider fails. This is resilience, not a bypass of provider quotas.

## Failure behavior

The router advances only when a provider is unavailable, unconfigured, or returns an unusable result. Successful output is still validated with the feature's Zod schema before the feature accepts it.

No AI provider may directly mutate sensitive production state. Prices, allergens, availability, tenant identity, branch identity, permissions, payments, and financial decisions remain database/server controlled.

## Privacy

Only the minimum required menu content should be sent to a provider. Customer PII, credentials, tokens, payment data, and unrelated private restaurant information must not be included in AI prompts.

## Verification requirements

Provider API availability and model capabilities must be rechecked against current official documentation when a model default is changed. CI validates the routing contracts and server-only credential boundaries; live provider execution remains dependent on the configured server environment and provider quotas.


## Provider Expansion / Phase 1 — 2026-09-24

The existing runtime router remains unchanged during Phase 1. Provider families are now modeled separately from runtime eligibility in `src/lib/menu/ai-provider-registry.ts`, while shared capability/task/modality vocabulary lives in `src/lib/menu/ai-capabilities.ts`.

Planned providers are deliberately `runtimeEligible: false` until their credential contract, adapter, exact model capability, tests, and smoke verification are complete.

Jev/TypeSafe is modeled as a `typed_decision` / `decision_orchestrator` capability, not a generic LLM fallback. It will later receive only a server-generated eligible candidate set and its decision will be policy-validated before execution.

Confirmed future key pools:
- TypeSafe/Jev: 3 keys
- NVIDIA: 2 keys
- Groq: 1 key
- Cloudflare Workers AI: API token + Account ID
- Cerebras, Mistral, Deepgram: provider-specific credentials

See `docs/ai-provider-expansion.md` for the complete roadmap and continuity contract.


## Provider Expansion / Phase 3 — NVIDIA — 2026-09-24

NVIDIA hosted NIM/API Catalog is enabled only for the existing structured text boundary. Endpoint: `https://integrate.api.nvidia.com/v1/chat/completions`. Credentials: `NVIDIA_API_KEY`, `NVIDIA_API_KEY_2`. Default model: `openai/gpt-oss-120b`; optional `NVIDIA_MODEL`. The adapter embeds the server-generated JSON schema in the system instruction and requires JSON-only output; downstream Zod/domain validation remains authoritative. Timeout is 60 seconds. NVIDIA is excluded from image/PDF routing because the verified default model is text-only. Explicit test selection uses `AI_PROVIDER=nvidia`.

Official sources: https://docs.api.nvidia.com/nim/reference/openai-gpt-oss-120b ; https://docs.api.nvidia.com/nim/reference/openai-gpt-oss-120b-infer ; https://docs.api.nvidia.com/nim/reference/llm-apis


## Provider Expansion / Phase 4 — Cloudflare Workers AI — 2026-09-24

Cloudflare Workers AI is enabled only for the structured text capability. The adapter uses the account-scoped OpenAI-compatible endpoint:

`https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/chat/completions`

Credentials remain server-only:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Default model:
- `@cf/openai/gpt-oss-120b`
- optional `CLOUDFLARE_MODEL`

The adapter uses JSON schema response formatting, bounds prompts/output/timeouts, normalizes failures, and leaves final acceptance to existing Zod/domain validation. Cloudflare is explicitly excluded from image/PDF routing. Runtime activation is subject to CI and one authenticated provider smoke; no secret values are stored in GitHub.
\n\n## Provider Expansion / Phase 5 — TypeSafe/Jev — 2026-09-24\n\nTypeSafe/Jev is a decision-orchestrator specialist, not a generic text fallback. The dedicated adapter is `src/lib/menu/ai-typesafe.ts`.\n\n- Endpoint: `POST https://api.typesafe.ai/v1/systemone`\n- Authentication: `Authorization: Bearer <TYPESAFE_API_KEY>`\n- Model: `TYPESAFE_MODEL` optional; defaults to `jev-latest`\n- Key pool: `TYPESAFE_API_KEY`, `TYPESAFE_API_KEY_2`, `TYPESAFE_API_KEY_3`\n- Rotation: deterministic minute-based starting-key rotation; failures fall through the remaining configured keys.\n- Typed questions: Noul, Choice, Score.\n- Validation: response model, answer type, probabilities/confidence, question shape, candidate membership, and bounded request size are validated server-side.\n- Candidate boundary: callers must provide a non-empty unique eligible candidate set; the adapter includes only that server-provided set in the decision state and rejects a `selected_candidate` answer outside it.\n- Timeout: 60 seconds.\n- Routing: TypeSafe is intentionally absent from `DEFAULT_STRUCTURED_ORDER` and `DEFAULT_MULTIMODAL_ORDER`; `runtimeEligible` remains false until the live smoke/activation gate is satisfied.\n\n### Server environment contract\n- `TYPESAFE_API_KEY`\n- `TYPESAFE_API_KEY_2`\n- `TYPESAFE_API_KEY_3`\n- `TYPESAFE_MODEL` — optional; defaults to `jev-latest`\n

## Provider Expansion / Phase 6 — Capability-aware routing — 2026-09-24

- IMPLEMENTED: isolated `src/lib/menu/ai-capability-router.ts` filters execution candidates by `runtimeEligible`, execution role, and required capability before any decision layer is considered.
- IMPLEMENTED: candidate IDs are server-derived from provider/model capability state; selection rejects candidates outside the generated set and revalidates the current provider/model contract before execution.
- IMPLEMENTED: policy gate requires verified authorization, entitlement, tenant scope, branch scope, and pricing policy before a selected candidate can be admitted.
- VERIFIED: TypeSafe remains `runtimeEligible:false`; Phase 6 does not add it to generic structured or multimodal routing and does not call the TypeSafe adapter.
- VERIFIED: existing `DEFAULT_STRUCTURED_ORDER` and `DEFAULT_MULTIMODAL_ORDER` remain unchanged.

### Routing boundary
`Feature → AI Core → Capability Registry → Eligible Candidate Set → Jev (gated) → Policy Validation → Selected Provider/Model → Execution Adapter`

The Jev/TypeSafe step is represented by a typed selection question boundary but remains disabled until its independent live smoke and activation gate are satisfied. No tenant, branch, authorization, entitlement, pricing, RLS, or provider execution boundary is delegated to Jev.

# 2026-09-24 — AI Reliability / TypeSafe-Jev + Guest Menu Assistant — CLOSED / VERIFIED

- VERIFIED: feature implementation merged to main as `c62db8bf8a691af791ab0e1bb86f8694b7514619` through PR #288.
- VERIFIED: TypeSafe/Jev is now an optional high-level structured-provider selector when its server credentials are configured and at least two configured execution candidates are available.
- VERIFIED: Jev selection is confidence-gated at 0.55 and fails open to the existing deterministic provider order on unavailable, malformed, low-confidence, or exceptional Jev results.
- VERIFIED: Jev receives only currently configured structured execution candidates; it is not inserted into `DEFAULT_STRUCTURED_ORDER` or `DEFAULT_MULTIMODAL_ORDER`.
- VERIFIED: structured provider execution now continues to the next provider when the provider response fails the feature's application Zod schema, instead of surfacing the invalid result immediately.
- VERIFIED: the public Guest Menu Assistant now has a grounded read-only catalog fallback for provider failure/invalid results, covering item matching, price, availability, allergen disclosure limits, and general menu navigation without inventing data.
- VERIFIED: no database schema, auth/RLS, subscription, tenant/branch, Smart Menu Import, public-menu/performance architecture, or payment behavior changed.
- VERIFIED: GitHub Quality #2411 passed Typecheck, Tests, W7.4–W7.10 contract gates, Lint, Production Build, Browser Template QA, Golden Performance Fixture, Studio browser QA, Platform Admin browser QA, and cleanup.
- VERIFIED: GitHub W9 Orders QA #604 passed.
- VERIFIED: Vercel PR Preview status for the final feature commit was successful.
- UNKNOWN: authenticated TypeSafe/Jev live provider response, real quota, and latency behavior; the connected GitHub session cannot expose runtime secret values.
- UNKNOWN: direct Production deployment identity/status for the merged main commit; no separate production deployment was manually requested.

## PROTECTED / MUST NOT REDO
- Groq, NVIDIA, Cloudflare, Cerebras, Mistral, and Deepgram adapters already completed.
- Phase 1 capability registry and Phase 2 credential/key-pool contracts.
- Existing generic structured/multimodal provider orders except for the new schema-validation fallback and optional Jev preselection boundary documented above.
- Smart Menu Import OCR → Smart Extract → normalization → batching → AI organization → review → save.
- Public-menu/performance phases 0–8.
- Auth/RLS/subscription/tenant/branch isolation and server-side secret boundaries.

## IMPLEMENTATION STATUS
**VERIFIED / MERGED**

## DEPLOYMENT STATUS
**MERGED_TO_MAIN / PRODUCTION_STATUS_UNKNOWN**

## UNKNOWN / BLOCKED
- UNKNOWN: one authenticated TypeSafe/Jev smoke against an authorized runtime.
- BLOCKED only if no authorized runtime exposes the configured TypeSafe credentials for smoke verification.
- Deepgram key/smoke remains separately deferred and is not part of this task.

## EXACT NEXT TASK
**Run exactly one authenticated TypeSafe/Jev smoke on the authorized runtime using the configured TypeSafe key pool; record the real HTTP/decision evidence, then stop.**


# 2026-09-24 — Guest Assistant Last-Mile Reliability — CLOSED / VERIFIED

- VERIFIED: PR #290 merged to `main` as `4a7e35053c5f5a3cde75d1412d6c39c311e5385e`.
- VERIFIED: the public Guest Menu Assistant now shares one grounded catalog fallback between server and client via `src/lib/menu/guest-assistant-fallback.ts`.
- VERIFIED: provider/schema/routing failures no longer surface as a blank/error assistant state when the already-loaded public menu can provide a grounded response; the client uses the same deterministic fallback on server-function failure.
- VERIFIED: Jev/TypeSafe remains the high-level selector for the AI-enhanced structured path; the deterministic fallback is a last-mile safety layer, not a replacement for Jev or the execution providers.
- VERIFIED: fallback answers remain read-only and derive product references only from the current public menu catalog; allergen absence is never inferred.
- VERIFIED: Quality run `36030801370` passed Typecheck, repository Tests, W7.4–W7.10 contract gates, Lint, Production Build, Browser Template QA, Golden Performance Fixture, Studio browser QA, Platform Admin browser QA, and cleanup.
- VERIFIED: W9 Orders QA run `36030801753` passed.
- VERIFIED: Vercel preview deployment for head `24564f05d2794665b463d64440588eefdd09e767` reached READY.
- UNKNOWN: authenticated live TypeSafe/Jev provider response, quota, and latency; no secret value was exposed through the connected tools.
- UNKNOWN: final Production deployment readiness for merged `4a7e35053c5f5a3cde75d1412d6c39c311e5385e` until the Vercel Production deployment reports READY.

## PROTECTED / MUST NOT REDO
- Groq, NVIDIA, Cloudflare, Cerebras, Mistral, and Deepgram adapters.
- Phase 1 provider registry/capability foundation and Phase 2 credential/key-pool contracts.
- Existing generic structured/multimodal routing order and server-side secret boundaries.
- Smart Menu Import OCR → Smart Extract → normalization → batching → AI organization → review → save.
- Public-menu/performance phases 0–8.
- Auth/RLS/subscription/tenant/branch isolation and payment boundaries.

## IMPLEMENTATION STATUS
**VERIFIED / MERGED**

## DEPLOYMENT STATUS
**PRODUCTION_DEPLOYMENT_IN_PROGRESS**

## UNKNOWN / BLOCKED
- UNKNOWN: one authenticated TypeSafe/Jev smoke against an authorized runtime.
- UNKNOWN: direct real-device validation of the new last-mile fallback in this session.
- BLOCKED only for live Jev smoke if no authorized runtime exposes the configured TypeSafe key pool.

## EXACT NEXT TASK
**After the merged Production deployment reaches READY, perform exactly one authenticated TypeSafe/Jev smoke on the authorized runtime and record the real decision evidence; then stop.**


# 2026-09-24 — TypeSafe/Jev Live Smoke Evidence

- VERIFIED: current `main` code has `AI_PROVIDER_REGISTRY.typesafe.runtimeEligible:true`; this was intentionally enabled by PR #288 for the guarded high-level selector.
- VERIFIED: exactly one authenticated-smoke workflow attempt was made through GitHub Actions run `36033142672`.
- VERIFIED: the runtime had no `TYPESAFE_API_KEY`; the smoke exited before issuing the TypeSafe POST request.
- VERIFIED: no TypeSafe API response was therefore observed, and no secret value was exposed.
- VERIFIED: PR #292 was verification-only and was closed without merge.
- UNKNOWN: TypeSafe credential availability in Production/Vercel and real API health/latency.
- BLOCKED: no second smoke until an authorized runtime has the configured credential.
- PROTECTED: Jev remains a decision/orchestration layer; it is not a generic text provider and does not replace the validated execution-provider fallback.

## EXACT NEXT TASK

**Provide the TypeSafe credential to an authorized smoke runtime without exposing it, then run exactly one authenticated TypeSafe/Jev smoke and record HTTP/decision evidence.**
\n\n# 2026-09-24 — Post-Merge Continuity Anchor\n\n- VERIFIED: canonical `main` HEAD is now `4e47f783e3a189b760daf71fff92cd81b2881501`.\n- VERIFIED: this commit contains the continuity record for the single blocked TypeSafe/Jev smoke attempt.\n- VERIFIED: the smoke was not repeated after the credential blocker was observed.\n- BLOCKED: the next TypeSafe/Jev smoke requires an authorized runtime with the configured credential.\n\n## EXACT NEXT TASK\n\n**Securely make the configured TypeSafe credential available to the authorized smoke runtime, then run exactly one authenticated TypeSafe/Jev smoke and record the real HTTP/decision evidence. Do not repeat the smoke before that prerequisite is verified.**\n