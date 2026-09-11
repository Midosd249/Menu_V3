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
