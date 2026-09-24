# Menu V3 — AI Provider Expansion and Intelligent Model Orchestration

## Status

IN_PROGRESS — Phase 4: Cloudflare Workers AI structured adapter implemented; live smoke pending.

This document is the continuity anchor for the AI provider expansion. A new chat must read this document, docs/ai-provider-routing.md, PROJECT_STATE.md, PLAN.md, TASKS.md, and the current src/lib/menu/ai-*.ts implementation before making further changes.

## 1. Objective

Expand the existing single server-side AI boundary without creating a second AI architecture.

Confirmed provider families:
- TypeSafe / Jev — 3 API keys
- NVIDIA — 2 API keys
- Groq — 1 API key
- Cloudflare Workers AI — API token + Account ID
- Cerebras
- Mistral
- Deepgram

Existing protected providers:
- Mercury / Inception
- Gemini
- Z.AI
- OpenRouter
- xKiro

No secret values belong in GitHub, source, tests, documentation, screenshots, or chat.

## 2. Target architecture

Feature -> AI Core -> Capability Registry -> Eligible Candidate Set -> Jev Orchestrator -> Policy Validation -> Selected Provider/Model -> Execution Adapter -> Zod/domain validation -> Review/Save.

Jev is NOT a generic text fallback. It is the high-level typed-decision layer for provider/model selection, task classification, extraction interpretation, duplicate/validity decisions, evidence sufficiency, escalation/review, and future typed intelligence/growth decisions.

Jev can only choose from a server-generated candidate set. It cannot bypass authorization, tenant/branch isolation, entitlements, pricing, RLS, source-of-truth rules, or validation. If Jev is unavailable or confidence is below a task-specific threshold, use deterministic policy or review.

## 3. Capability families

| Capability | Purpose | Initial role |
|---|---|---|
| structured | Structured text/JSON execution | Existing LLM providers; new providers after adapter verification |
| typed_decision | Calibrated typed decisions | Jev |
| image | Image input | Existing multimodal providers; new models only after exact verification |
| pdf | PDF input | Existing multimodal providers; Mistral/NVIDIA candidates later |
| ocr_document | OCR + document structure | Mistral specialist |
| audio_stt | Speech-to-text | Deepgram specialist |
| embedding | Vector/semantic embedding | Future separate capability |

## 4. Provider roles

| Provider | Lifecycle | Role | Transport | Key pool | Phase-1 runtime |
|---|---|---|---|---:|---|
| Mercury | active | execution | OpenAI-compatible | 6 | enabled |
| Gemini | active | execution | native | 1 | enabled |
| Z.AI | active | execution | OpenAI-compatible | 1 | enabled |
| OpenRouter | active | execution | OpenAI-compatible | 1 | enabled |
| xKiro | active | execution | OpenAI-compatible | 1 | enabled |
| TypeSafe/Jev | planned | decision orchestrator | System One | 3 | disabled |
| NVIDIA | planned | execution | OpenAI-compatible | 2 | disabled |
| Groq | planned | execution | OpenAI-compatible | 1 | disabled |
| Cloudflare Workers AI | planned | execution | OpenAI-compatible | 1 | disabled |
| Cerebras | planned | execution | OpenAI-compatible | 1 | disabled |
| Mistral | planned | document specialist | Document AI | 1 | disabled |
| Deepgram | planned | audio specialist | STT | 1 | disabled |

## 5. Execution roadmap

### Phase 1 — Provider abstraction audit + capability registry
CURRENT.
- Keep one AI boundary.
- Define capability/task/modality vocabulary.
- Register active and planned provider families.
- Mark planned providers runtimeEligible=false.
- Record transport, role, model-selection strategy and key-pool size.
- Do not change runtime provider ordering.
- Add regression tests proving planned providers cannot enter the current runtime router.

### Phase 2 — Credentials and key pools
- TypeSafe: TYPESAFE_API_KEY, TYPESAFE_API_KEY_2, TYPESAFE_API_KEY_3
- NVIDIA: NVIDIA_API_KEY, NVIDIA_API_KEY_2
- Groq: GROQ_API_KEY
- Cloudflare: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
- Cerebras: CEREBRAS_API_KEY
- Mistral: MISTRAL_API_KEY
- Deepgram: DEEPGRAM_API_KEY
- Missing/partial configuration fails closed.
- Key rotation is resilience/load distribution, never quota bypass.
- Do not activate routing during credential-only work.

### Phase 3 — Execution adapters
1. Groq OpenAI-compatible text/structured adapter.
2. NVIDIA hosted NIM/API Catalog adapter with two-key pool.
3. Cloudflare Workers AI adapter with token + Account ID.
4. Cerebras OpenAI-compatible text/structured adapter.
5. Mistral Document AI/OCR + structured annotation path.
6. Deepgram isolated STT/audio adapter.

Every adapter requires server-only credentials, bounded timeout, normalized errors, no secret logging, validation, capability gate, model contract, and targeted tests.

### Phase 4 — Cloudflare Workers AI structured adapter\n- Endpoint: `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/chat/completions`.\n- Credentials: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`.\n- Default model: `@cf/openai/gpt-oss-120b`; optional `CLOUDFLARE_MODEL`.\n- Structured JSON uses the documented `response_format` boundary and remains subject to Menu V3 Zod/domain validation.\n- 60-second bounded timeout and normalized provider failures.\n- Structured-only: no image/PDF routing.\n- Runtime activation requires CI, exact provider contract verification, and one authenticated smoke before release.\n\n### Phase 5 — Jev adapter and 3-key orchestration
Use POST /v1/systemone with typed questions. Batch related questions, pin the model when threshold behavior matters, preserve probabilities/confidence, rotate three keys, reject malformed decisions, and restrict selection to server-provided candidates.

### Phase 6 — Capability-aware routing
Filter candidates by task class, input modality, required capability, structured-output requirement, confidence requirement, provider health, configured model, and bounded latency/cost policy. Then let Jev choose among eligible candidates.

### Phase 7 — Smart Menu Import
Preserve OCR -> Smart Extract -> normalization -> bounded batches -> AI organization -> review -> save. Jev may assist with typed classification/validity/duplicate/evidence decisions, but never writes directly to source-of-truth data.

### Phase 8 — Intelligence/Growth
Evaluate Jev for Menu Intelligence, Owner Intelligence, Growth, and Guest/Relationship intelligence only when each output has a stable typed contract and measurable acceptance criteria.

### Phase 9 — Verification and release
Run applicable typecheck, tests, platform tests, lint, build, auth checks, targeted AI/security tests, and provider smoke tests only when credentials are configured. Review the final diff and release through the normal one-batch Vercel process only after explicit release authorization.

## 6. Research evidence

Official sources reviewed in the Phase-1 deep preflight:
- TypeSafe API: https://api.typesafe.ai/docs
- TypeSafe Jev: https://typesafe.ai/blog/introducing-system-one-models-and-jev
- NVIDIA NIM: https://docs.api.nvidia.com/nim/docs/api-quickstart
- Groq OpenAI compatibility: https://console.groq.com/docs/openai
- Cloudflare Workers AI: https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/
- Mistral Document Annotations: https://docs.mistral.ai/studio/document-processing/annotations
- Cerebras OpenAI compatibility: https://inference-docs.cerebras.ai/resources/openai
- Deepgram STT: https://developers.deepgram.com/docs/stt/getting-started

Key findings:
- Jev is optimized for typed/probabilistic decisions, not generic string generation.
- NVIDIA hosted NIM capabilities are model/catalog dependent.
- Groq is mostly OpenAI-compatible; unsupported features must be handled explicitly.
- Workers AI provides OpenAI-compatible chat/embedding endpoints and requires account context.
- Mistral Document AI supports OCR and structured annotations.
- Cerebras provides an OpenAI-compatible inference endpoint.
- Deepgram provides pre-recorded and streaming STT.

## 7. Security invariants

- Never store secret values in repository files.
- Never expose provider credentials to browser code.
- Never trust client-supplied provider/model/tenant/branch/role/entitlement/price.
- Jev decisions are advisory and policy-validated.
- AI output is never the source of truth for authorization, pricing, subscriptions, payment, tenant, or branch ownership.
- Provider failure must not mutate source-of-truth data.
- Key rotation must not bypass quotas.
- Never route a modality to a provider/model until the exact capability is verified.

## 8. Rollback

Phase-1 rollback is limited to reverting registry/documentation/test changes. No database migration, credential write, runtime activation, or deployment is required.

## 9. Continuity contract

At every phase close, record:
- current branch and commit
- exact phase
- files changed
- verification commands/results
- unknowns/blockers
- protected work not to repeat
- exactly one next task

Current exact next task: finish Cloudflare CI verification, perform one authenticated smoke on `main`, then continue with the next explicitly scoped provider adapter. NVIDIA is merged but its live provider response remains an external runtime evidence item.


## Phase 1 Closure — 2026-09-24

**Status: CLOSED / VERIFIED on branch `feat/ai-provider-expansion-foundation`.**

Verified evidence:
- Branch base is current `main` at `17fbefd1c8a80c69e7fba28338c2121a97e7aea3`.
- Phase-1 changes are contained in PR #270.
- GitHub Quality run #2337: PASS.
- GitHub W9 Orders QA run #545: PASS.
- Quality completed typecheck, full tests, lint, production build, browser template QA, golden performance fixture, Studio browser QA, Platform Admin browser QA, and artifact/cleanup stages.
- W9 Orders QA completed successfully.
- Combined status for the Phase-1 head is successful.
- No provider secrets were added.
- No runtime provider order was changed.
- No new provider was enabled in production routing.
- No database migration was introduced.
- No Vercel production deployment was performed.

Phase-1 regression note:
- The first CI attempt exposed only a test assertion-format mismatch in the new registry contract. It was corrected in a focused test-only commit.
- The final CI run passed all configured Quality and W9 gates.

**Implementation status: READY_TO_PUSH.**

**Deployment status: NOT_PERFORMED.**

**Exact next task:** Phase 2 — implement fail-closed credential validation and key pools for TypeSafe/Jev (3), NVIDIA (2), Groq (1), Cloudflare Workers AI (token + Account ID), Cerebras, Mistral, and Deepgram. Do not activate provider routing during the credential-only phase.


## Phase 2 — Credential Contracts / Key Pools — IN PROGRESS

Scope is deliberately credential-only. No new provider is activated and no runtime routing order changes.

### Server-only environment contract

| Provider | Secret environment variables | Required context | Activation |
|---|---|---|---|
| TypeSafe/Jev | `TYPESAFE_API_KEY`, `TYPESAFE_API_KEY_2`, `TYPESAFE_API_KEY_3` | none | disabled |
| NVIDIA | `NVIDIA_API_KEY`, `NVIDIA_API_KEY_2` | none | disabled |
| Groq | `GROQ_API_KEY` | none | disabled |
| Cloudflare Workers AI | `CLOUDFLARE_API_TOKEN` | `CLOUDFLARE_ACCOUNT_ID` | disabled |
| Cerebras | `CEREBRAS_API_KEY` | none | disabled |
| Mistral | `MISTRAL_API_KEY` | none | disabled |
| Deepgram | `DEEPGRAM_API_KEY` | none | disabled |

The credential module is `src/lib/menu/ai-provider-credentials.server.ts`. The `.server.ts` boundary is intentional.

### Fail-closed rules

- Missing required secret => provider credential state is `missing`.
- Missing required context => provider credential state is `missing`.
- A configured pool may contain fewer optional rotation keys than the owner's maximum pool size.
- The application never serializes or returns secret values as credential status; status exposes counts and state only.
- Client/browser code must not import the credential module.
- Credentials are never committed to GitHub and are not read from `VITE_*` variables.
- Credential configuration does not activate a provider. Runtime eligibility remains controlled by the provider registry.
- Cloudflare requires both the API token and Account ID because the official Workers AI OpenAI-compatible endpoint is account-scoped.
- Key pools are for resilience/load distribution only; they must not be used to bypass provider quotas or policy.

### Official authentication evidence used for Phase 2

- TypeSafe: `TYPESAFE_API_KEY`, Bearer authentication, System One endpoint.
- NVIDIA API Catalog: Developer API Key for hosted model requests.
- Groq: `GROQ_API_KEY`, OpenAI-compatible endpoint.
- Cloudflare Workers AI: API token + Account ID.
- Cerebras: `CEREBRAS_API_KEY`, Bearer authentication.
- Mistral: standard API key for inference/document APIs.
- Deepgram: `DEEPGRAM_API_KEY`, Token authentication.

### Exact Phase 2 verification

1. Static tests prove every credential contract and pool cardinality.
2. Typecheck/test/lint/build must pass.
3. CI must pass the applicable Quality and W9 gates.
4. Diff review must prove no secret values, no runtime activation, and no database/deployment changes.
5. Only after closure may Phase 3 adapters begin.


## Phase 2 Closure — VERIFIED — 2026-09-24

**Status: CLOSED / VERIFIED.**

Implementation:
- Added `src/lib/menu/ai-provider-credentials.server.ts`.
- Locked the requested credential names and pool inventory.
- TypeSafe/Jev: 3 key slots.
- NVIDIA: 2 key slots.
- Groq/Cerebras/Mistral/Deepgram: 1 key slot each.
- Cloudflare: API token + Account ID.
- Missing/partial configuration fails closed.
- Credential status contains counts/state only; it does not expose secret values.
- The module is server-only by filename boundary.
- No provider runtime activation was introduced.
- No database migration or deployment was introduced.

Research:
- Official authentication requirements were checked for all seven provider families using the connected Exa research workflow.

Verification:
- GitHub Quality #2345: PASS.
- GitHub W9 Orders QA #553: PASS.
- Quality included typecheck/tests, lint, production build, browser template QA, golden performance fixture, Studio browser QA, and Platform Admin browser QA.
- W9 Orders browser QA passed.
- Final diff review shows only the planned AI registry/credential/documentation/test files.

Security:
- No secret values were committed.
- No `VITE_*` credential path was introduced.
- No new provider entered runtime routing.
- Live credential validity remains UNKNOWN until the owner supplies credentials through the secret store; this is intentionally not a blocker for the credential-contract phase.

**Implementation status: READY_TO_PUSH.**

**Deployment status: NOT_PERFORMED.**

**Exact next task:** Phase 3 — execution adapters, beginning with Groq, then NVIDIA, Cloudflare Workers AI, Cerebras, Mistral, and Deepgram. TypeSafe/Jev remains the later decision-orchestrator adapter. Do not activate any provider until its adapter, exact capability contract, targeted tests, and smoke verification pass.


## Phase 3 — Groq Execution Adapter — IN PROGRESS — 2026-09-24

**Current branch:** `feat/ai-provider-expansion-foundation`
**Current head:** `ea8ad25082c90ce3dce1eb2b0cd4108c3d466cda`
**PR:** #270 (OPEN / MERGEABLE / NOT MERGED)

Implementation completed:
- Added `src/lib/menu/ai-groq.ts` as a dedicated server-side Groq execution adapter.
- Uses the official Groq OpenAI-compatible Chat Completions endpoint.
- Uses `GROQ_API_KEY` and optional `GROQ_MODEL`; default model is `openai/gpt-oss-20b`.
- Uses structured JSON Schema response format with best-effort mode so the existing Menu V3 schema contracts remain compatible; downstream Zod validation remains authoritative.
- Applies a bounded 60-second timeout, normalized failure codes, prompt-injection boundary text, and no secret logging.
- Groq is enabled only for the `structured` capability. Groq vision remains outside runtime multimodal routing until a separate exact vision contract is approved.

Verification:
- GitHub Quality #2353: PASS.
- GitHub W9 Orders QA #561: PASS.
- Quality passed typecheck, full tests, lint, production build, browser template QA, golden performance fixture, Studio browser QA, and Platform Admin browser QA.
- Vercel Preview deployment for the current branch head is READY.
- The first adapter CI attempt exposed three TypeScript boundary errors; they were corrected in focused follow-up commits and the final Quality/W9 run passed.

Smoke status:
- UNKNOWN: live Groq API invocation has not been executed from this connected GitHub session because the secret value is not accessible to the session.
- UNKNOWN: provider-specific live latency/error behavior and actual Groq quota response in the configured Vercel Preview environment.
- No Production deployment or merge was performed.

Security / protected work:
- No secret values were committed.
- Existing Mercury/Gemini/Z.AI/OpenRouter/xKiro routing and Smart Menu Import flow remain protected.
- No database migration, auth/RLS, subscription, tenant/branch, or Production deployment changes were introduced.

**Implementation status: VERIFIED_LOCALLY (CI evidence) / LIVE_SMOKE_PENDING**
**Deployment status: Preview READY; Production NOT_PERFORMED**

**Exact next task:** Execute one authenticated Groq smoke request against the current Vercel Preview using the configured `GROQ_API_KEY`, verify a valid structured response and normalized failure behavior, then review the final diff. Do not merge or start NVIDIA until the Groq smoke evidence is recorded.

## Phase 3 — NVIDIA Execution Adapter — IMPLEMENTED / LIVE SMOKE PENDING — 2026-09-24

- VERIFIED: owner confirmed Groq live smoke succeeds on `main`.
- IMPLEMENTED: `src/lib/menu/ai-nvidia.ts` dedicated server-side structured adapter.
- IMPLEMENTED: two-key pool, configurable `NVIDIA_MODEL`, default `openai/gpt-oss-120b`.
- IMPLEMENTED: bounded timeout, normalized errors, prompt-injection boundary, schema-aware JSON-only instruction, fail-closed credentials.
- VERIFIED: NVIDIA is structured-only; image/PDF routing is unchanged.
- VERIFIED: no database/auth/RLS/subscription/tenant/branch/public-menu/performance changes.
- UNKNOWN: live NVIDIA response/quota/latency/error behavior.

### Exact verification boundary
1. Static adapter/routing tests.
2. Full Quality/W9 gates.
3. One authenticated NVIDIA smoke on `main` with `AI_PROVIDER=nvidia`.
4. Only after smoke evidence: proceed to Cloudflare.


## Phase — Cerebras Structured Execution — 2026-09-24

**Status:** IMPLEMENTED / CI verification pending.

### Official contract verified via Cerebras documentation
- OpenAI-compatible base URL: `https://api.cerebras.ai/v1`.
- Chat endpoint: `POST /v1/chat/completions`.
- Authentication: `Authorization: Bearer $CEREBRAS_API_KEY`.
- Structured Outputs: `response_format.type = json_schema`.
- Current documented production model used as the repository default: `gpt-oss-120b`.
- API Version 2 is now the default; the adapter explicitly sends `X-Cerebras-Version-Patch: 2` to make the intended contract explicit.
- Structured outputs have model/schema constraints; the adapter uses `strict: false` because the existing Menu V3 response schemas are not globally proven to satisfy Cerebras strict-mode requirements. Final acceptance remains the existing application-level schema validation.
- Cerebras is structured-only in Menu V3 and is excluded from image/PDF routing.

### Security and resilience
- `CEREBRAS_API_KEY` is read server-side only.
- Optional model override: `CEREBRAS_MODEL`.
- Prompt input is bounded to 12,000 characters.
- Output is bounded to 2,000 tokens.
- Temperature is clamped to 0–1.
- Request timeout is 60 seconds.
- Missing credentials fail closed with `ai_not_configured`.
- Provider HTTP/runtime failures normalize to the existing provider failure contract.
- No secrets are committed.

### Research sources
- Cerebras OpenAI Compatibility: https://inference-docs.cerebras.ai/resources/openai
- Cerebras Structured Outputs: https://inference-docs.cerebras.ai/capabilities/structured-outputs
- Cerebras Chat Completions API reference: https://inference-docs.cerebras.ai/api-reference/chat-completions
- Cerebras Versions: https://inference-docs.cerebras.ai/api-reference/versions
- Cerebras Public Models: https://inference-docs.cerebras.ai/api-reference/models/public-models

### Remaining gate
CI must pass. One authenticated live Cerebras smoke on `main` remains a separate runtime evidence item because GitHub cannot read the configured secret value or substitute it into an authenticated external API request.
