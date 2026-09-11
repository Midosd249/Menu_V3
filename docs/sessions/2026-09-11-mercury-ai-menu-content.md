# Session — 2026-09-11 — Mercury AI Menu Content

## Request
Start Phase 1 of the Mercury AI integration in Menu V3: add AI Assist to the Add Product flow for Arabic description generation, English generation, category suggestion, and tag suggestion.

## Scope
- Secure server-side Mercury 2.5 API integration.
- No API key exposed to the browser.
- Suggestions are reviewed by the owner before saving.
- Category suggestions are constrained to existing Menu V3 category IDs.
- No automatic database mutation by the model.

## Implemented
- Added `src/lib/menu/ai.ts` with authenticated server-side Mercury API calls.
- Added structured-output schemas for description, English content, category, and tags.
- Added `tests/mercury-ai-menu-content.test.mjs` for the integration contract.
- The API key is read only from `INCEPTION_API_KEY` on the server; optional model override uses `INCEPTION_MODEL` and defaults to `mercury-2.5`.

## Integration Status
- `IMPLEMENTATION_IN_PROGRESS`.
- A feature branch `feat/mercury-ai-menu-content` was created from the current `main`.
- The existing `src/routes/studio/menu.tsx` still requires the UI integration commit. The GitHub connector available in this session requires the current blob SHA for replacement of an existing file, but that SHA is not exposed by the available fetch response for this large file. The existing file was therefore intentionally not replaced with an inferred copy.

## Security
- API credentials remain server-side.
- The endpoint authenticates through the existing `authMiddleware`.
- The tenant is derived from authenticated server context.
- No client-supplied tenant, role, price, or product identity is trusted by the AI endpoint.

## Verification
- Focused static contract test added but not executed in this environment.
- Full repository lint/typecheck/build/E2E/visual QA has not been run for this partial implementation.

## Exact Next Action
Integrate the `generateMenuAi` server function into the existing Add Product Sheet without replacing or regressing the current Studio menu UI, then run the focused test and the repository quality gates before considering merge or deployment.
