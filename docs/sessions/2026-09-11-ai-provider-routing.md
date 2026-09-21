# AI Provider Routing Session — 2026-09-11

## Classification
- Request: add resilient multi-provider AI routing and multimodal fallback using the provider keys already configured in Vercel.
- Workflows: AI architecture, security boundary, repository-first research, release-only Vercel workflow.
- Research level: Focused.

## Verified starting position
- `main` was the source of truth at `9c35c1a39b0b45009e044ea9af70cfbf1759190c` when this milestone branch started.
- Existing structured AI already used the server-side Inception/Mercury boundary.
- Existing image/PDF menu extraction was hard-coded to an OpenAI dependency.
- The user configured five Inception keys plus Google, Z.AI, OpenRouter, and xKiro keys in Vercel without requesting a deployment.

## Completed implementation
- Added `src/lib/menu/ai-providers.ts` as the replaceable provider boundary.
- Structured AI now supports automatic fallback across Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- Inception supports a rotating key pool through `INCEPTION_API_KEY` to `_6`.
- Image/PDF extraction now uses a multimodal provider router rather than a hard-coded OpenAI key.
- Default multimodal order is Gemini → OpenRouter → Z.AI → xKiro.
- AI output remains schema-validated before feature acceptance.
- Existing server-side tenant/user rate limiting remains in the structured AI path.
- Prompt-injection boundaries are explicit and provider credentials remain server-only.
- Added provider routing documentation and regression coverage.

## Provider defaults
- Inception: `mercury-2.5`
- Google: `gemini-3.5-flash-lite`
- Z.AI structured: `glm-4.7-flash`
- Z.AI vision: `glm-4.6v-flash`
- OpenRouter: `google/gemma-4-31b-it:free`
- xKiro: `stealth/ox-alpha`

Defaults are configurable by server environment variables and are not client-visible.

## Verification
- GitHub Quality run `34632139918` passed route generation, typecheck, 254 tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance handling, and cleanup.
- An earlier quality run failed only on stale test assertions; those assertions were corrected and the final quality run passed.
- No Vercel deployment was intentionally triggered for this milestone.

## Deployment
- Status: `READY_TO_PUSH` at the milestone branch level after final continuity reconciliation.
- Production deployment status: `UNKNOWN` for this new code until a controlled release is performed.
- Vercel rate-limit history remains respected; no redeploy retry was requested.

## Safety boundary
- No secrets were committed.
- No client-side API key access was introduced.
- AI does not directly mutate sensitive production data.
- Provider failure falls through without changing database source-of-truth semantics.

## Exact next task
Merge this verified atomic AI provider-routing milestone into `main` as one coherent release batch, then perform one controlled production deployment only when the existing Vercel release condition permits it. Do not start another AI product milestone automatically.
