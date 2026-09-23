# Smart Menu Import and AI Organization — 2026-09-23

## Status
- DONE
- Branch: `fix/smart-menu-import-and-ai-organization-2026-09-23`
- PR: #265 — MERGED
- Merged SHA: `09c9bfb8ae9aca8dcd66b4364166a2c7e7d26a54`
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
- VERIFIED: GitHub Quality run 2325 completed successfully: route tree, typecheck, tests, lint, production build, browser template QA, golden performance fixture, Studio/browser QA, Platform Admin/browser QA, and performance evidence upload all passed.
- VERIFIED: GitHub W9 Orders QA run 537 completed successfully, including browser QA.
- VERIFIED: Vercel preview deployment for the branch is Ready at the PR status target.
- UNKNOWN: this connected surface does not provide a real authenticated customer session with the uploaded menu image, so the exact user-provided image has not been replayed against the preview.
- VERIFIED: the code path is covered by CI contract tests and browser QA, but the exact external image remains an application-level live-session check.

## Acceptance criteria
- Image/PDF upload produces a structured draft without requiring the customer to discover a second mandatory analysis step.
- Draft rows are organized using existing categories where evidence is sufficient.
- Obvious AI/OCR corrections are applied only to the draft and remain visible before save.
- Incomplete rows remain explicitly blocked rather than silently fabricated.
- Existing save action persists only valid rows under server-side tenant authorization.
- Existing menu behavior outside this flow remains unchanged.

## Exact next action
No implementation task remains. Verify the single post-merge main deployment and, separately, replay the exact customer image in an authenticated live session when that environment is available.


## Follow-up hardening — 2026-09-23 — DONE

### Problem reproduced from owner evidence
- VERIFIED: the uploaded menu image successfully produced readable OCR text in the customer UI.
- VERIFIED: after OCR, the UI showed `نتيجة مساعد الذكاء الاصطناعي غير صالحة` and did not produce the structured import draft.
- VERIFIED: `src/lib/menu/ai-core.ts` validates structured JSON strictly.
- VERIFIED: `src/lib/menu/ai-providers.ts` clamps structured output to 2,000 tokens.
- VERIFIED: the previous onboarding schema requested a large full row object for every product, and organization additionally requested a reason for every change. A full restaurant menu can exceed that output ceiling.

### Implemented
1. OCR/document extraction is now a separate step. Image/PDF upload leaves the extracted text visible and exposes an explicit **Smart extract menu / استخراج القائمة بذكاء** action.
2. Structured onboarding extraction now requests only product fields that actually need AI generation/extraction.
3. Large menus are split into bounded product-oriented batches before structured AI extraction.
4. Server-side normalization supplies safe defaults for image URL, availability, featured state, tags, dietary labels, and review issues.
5. Duplicate rows across extraction batches are de-duplicated without changing the owner save contract.
6. AI organization output is compacted to ordering, confident existing-category assignments, and evidence-backed corrections; verbose per-change reasons are removed from the provider contract.
7. Existing owner review/save remains the only persistence path.

### Verification
- VERIFIED: PR #267 merged into `main`.
- VERIFIED: merge SHA `f60e24071a17077895cb61b5ca85b7a59cdccaea`.
- VERIFIED: Quality run #2331 passed: route tree, typecheck, tests, W7.4–W7.10 contracts, lint, production build, browser template QA, golden performance fixture, Studio browser QA, Platform Admin browser QA, and evidence uploads.
- VERIFIED: W9 Orders QA run #541 passed.
- VERIFIED: Vercel Production deployment `dpl_ELuxrzuTeSR3oUwyCLc7sNtmnwwt` is READY and targets production for main commit `f60e24071a17077895cb61b5ca85b7a59cdccaea`.
- VERIFIED: production root `https://menu-v3-kohl.vercel.app/` returned HTTP 200 with Arabic RTL HTML.
- UNKNOWN: the exact uploaded customer image has not yet been replayed through an authenticated live Studio session, so exact end-to-end behavior for that specific account/image remains unverified outside CI.

### Exact next action
Replay the exact uploaded menu image in the authenticated live Studio session and confirm: OCR → **استخراج القائمة بذكاء** → structured rows → AI organization/corrections → owner review → save. Do not change runtime code unless that exact live replay produces a new, reproducible defect.
