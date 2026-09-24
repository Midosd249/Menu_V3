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
