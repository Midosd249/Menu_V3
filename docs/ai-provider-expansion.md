# Menu V3 — AI Provider Expansion and Intelligent Model Orchestration

## Status

IN_PROGRESS — Phase 1: Provider abstraction audit + capability registry foundation.

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

### Phase 4 — Jev adapter and 3-key orchestration
Use POST /v1/systemone with typed questions. Batch related questions, pin the model when threshold behavior matters, preserve probabilities/confidence, rotate three keys, reject malformed decisions, and restrict selection to server-provided candidates.

### Phase 5 — Capability-aware routing
Filter candidates by task class, input modality, required capability, structured-output requirement, confidence requirement, provider health, configured model, and bounded latency/cost policy. Then let Jev choose among eligible candidates.

### Phase 6 — Smart Menu Import
Preserve OCR -> Smart Extract -> normalization -> bounded batches -> AI organization -> review -> save. Jev may assist with typed classification/validity/duplicate/evidence decisions, but never writes directly to source-of-truth data.

### Phase 7 — Intelligence/Growth
Evaluate Jev for Menu Intelligence, Owner Intelligence, Growth, and Guest/Relationship intelligence only when each output has a stable typed contract and measurable acceptance criteria.

### Phase 8 — Verification and release
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

Current exact next task after Phase 1: implement fail-closed credential validation/key pools for TypeSafe (3), NVIDIA (2), Groq (1), Cloudflare (token + Account ID), Cerebras, Mistral, and Deepgram. Do not activate providers yet; adapters follow the credential contract.
