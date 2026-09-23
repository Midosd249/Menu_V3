# Smart Menu Import and AI Organization — 2026-09-23

## Status
- IMPLEMENTATION_IN_PROGRESS
- Branch: `fix/smart-menu-import-and-ai-organization-2026-09-23`
- PR: #265
- Base: `main`
- Base SHA at task start: `16e3cfe284a76abb78bcdb51d8c261f8efa7ef61`

## Verified repository evidence
- The image/PDF import flow previously extracted text into the UI but required a separate manual AI analysis step before a structured import draft existed.
- The import draft already had a save action, but the review table was read-only and the import validator used a 500-character image URL limit while product editing accepted up to 450,000 characters.
- Existing AI menu tooling already supports per-product category suggestions and whole-menu quality review.
- The new organization workflow is draft-only and uses existing tenant categories; it does not write directly to saved menu data.

## Implemented in this branch
1. Image/PDF extraction now continues automatically into structured AI draft analysis.
2. Source type is preserved as text/image/PDF for the AI ingest operation.
3. AI draft organization groups items against existing tenant categories and produces deterministic ordering.
4. Evidence-backed draft corrections can be applied to the import draft before the existing owner review/save action.
5. Imported image URL validation is aligned with the existing product image limit.
6. Regression contracts were added.

## Protected
- No schema or migration changes.
- No authentication, authorization, RLS, tenant isolation, branch isolation, order, subscription, or deployment changes.
- Saved menu data is still written only through the existing owner import action.

## Research
- Repository-first inspection of import, AI ingest, owner persistence, menu intelligence, tests, continuity docs, Git history, and current PR state.
- W3C WCAG 2.2 reviewed for touch-target and accessible interaction baseline: https://www.w3.org/TR/WCAG22/
- No proprietary UI/code/assets were copied.

## Verification
- VERIFIED: branch is based directly on current `main`.
- VERIFIED: diff is scoped to import UI, AI ingest, import persistence validation, tests, and this continuity note.
- BLOCKED/UNKNOWN: local test/typecheck/lint/build/browser execution is not available through the current connected GitHub surface.
- BLOCKED/UNKNOWN: GitHub Actions quality result has not appeared for the latest branch head yet.
- UNKNOWN: real customer image import/save flow has not been re-run in a live browser session after this change.

## Acceptance criteria
- Image/PDF upload produces a structured draft without requiring the customer to discover a second mandatory analysis step.
- Draft rows are organized using existing categories where evidence is sufficient.
- Obvious AI/OCR corrections are applied only to the draft and remain visible before save.
- Incomplete rows remain explicitly blocked rather than silently fabricated.
- Existing save action persists only valid rows under server-side tenant authorization.
- Existing menu behavior outside this flow remains unchanged.

## Exact next action
Run GitHub Quality/W9/browser verification for PR #265. If green, review the final diff and then merge once. If red, fix only the reported task-scoped failure. Do not deploy automatically.
