# Menu V3 — Public Menu Image Performance Root-Cause Remediation Plan

## Status

- Date: 2026-09-22
- Status: PHASE 4 VERIFIED / PHASE 5 READY
- Current `main` after continuity merge: `5ad84abdae22efb223b5a2cf58f23b37bc36b9a7`
- Canonical product: Menu V3
- Target test tenant: `saudi-shopping-world`
- Test owner account: `mido@hotmail.com` (test reference only; do not expose in product telemetry)
- Baseline branch: `main`
- Investigation branch: `perf/saudi-menu-image-delivery-2026-09-22`
- Baseline production main evidence: current repository continuity must be re-read before every continuation session.
- This document is the durable execution contract. A new chat must resume from Git + this document, not conversation memory.

## 1. Problem Statement

A real customer test imported 30 menu products with images. The owner observed:

1. Studio becomes slow or appears to hang when opening the menu.
2. The public menu opened from the QR code feels slow or appears to hang.
3. Product images take noticeable time to load.
4. The problem is materially worse when many products contain images.

The goal is not to make this one tenant fast by manually editing its data. The goal is to fix the reusable Menu V3 image-delivery architecture so that realistic menus with dozens of image-bearing products remain responsive across Studio and public QR/menu traffic.

## 2. Source-of-Truth Rules

Priority:

1. Current repository code/configuration.
2. Git history, CI, runtime/deployment evidence.
3. Current maintained documentation.
4. Authoritative external documentation.
5. Chat memory.

Never infer production success from source inspection alone.

Use evidence labels:

- VERIFIED — directly observed.
- INFERRED — derived from verified evidence.
- PROPOSED — planned solution.
- UNKNOWN — evidence not available.
- BLOCKED — hard blocker.

## 3. Verified Root-Cause Findings

### 3.1 Product image URLs are not centrally optimized

VERIFIED:

- The test tenant has 30 products.
- All 30 products have product images.
- The product image values are external Unsplash URLs.
- The stored URLs are raw Unsplash URLs rather than consistently normalized responsive URLs.
- The import path stores the supplied image URL; it does not establish a universal responsive image-delivery contract.

Consequence:

A card that visually needs a 96–300px image can request an unnecessarily large remote asset.

### 3.2 Studio product thumbnails are eager by default

VERIFIED:

- `src/components/studio-menu-workspace.tsx` renders product thumbnails using a normal `<img>`.
- The Studio thumbnail does not currently declare `loading="lazy"`.
- Opening a Studio menu with many image-bearing products therefore allows many remote image requests to start immediately.

Consequence:

The Studio first render competes with a burst of image downloads.

### 3.3 Public product media already has a lazy baseline, but the URL size is still uncontrolled

VERIFIED:

- `src/components/public-menu.tsx` uses `loading="lazy"`, `decoding="async"`, and low fetch priority for normal product media.
- This is a useful existing optimization and must be preserved.
- Lazy loading alone cannot reduce the intrinsic bytes of an image once it is requested.

Consequence:

The public menu still needs responsive image URL normalization.

### 3.4 Editorial contains a product-image prefetch path

VERIFIED:

- `DishMedia` contains an Editorial-specific `new Image()` prefetch path.
- The actual `<img>` remains lazy, but the prefetch starts downloads early.
- This can defeat much of the intended scheduling benefit when many products are present.

Consequence:

Editorial must not prefetch every product image. Only genuinely critical above-the-fold media may be eagerly scheduled.

### 3.5 The test tenant has 30/30 products marked Featured

VERIFIED:

- The test tenant has 30 products.
- All 30 are available.
- All 30 are marked Featured.

Consequence:

The Featured presentation can render a large image-bearing group before/alongside the normal product listing. This is a separate workload multiplier.

Important: do not delete or mutate the tenant's Featured flags merely to make the test pass. Presentation should apply a bounded featured presentation contract.

### 3.6 Large Base64 branding media inflates public HTML

VERIFIED during production inspection:

- The test tenant's cover image is stored as a Base64 WebP data URL.
- The cover data URL is approximately 233 KB of encoded text.
- The inspected public HTML was approximately 887 KB before transfer compression.
- The cover data was observed repeatedly in the rendered HTML/payload.
- The main public database query itself is fast (measured in the low-millisecond range for the tested tenant).

Consequence:

The public route can spend substantial bandwidth and browser parsing time on inline image data before product images even become the dominant visual workload.

This is an architectural media-delivery problem, not a PostgreSQL query-speed problem.

### 3.7 Database query is not the primary bottleneck for this case

VERIFIED:

- The public-menu data query for the test tenant completed in approximately 2.37 ms in the measured database execution.
- The product set is only 30 rows.
- The tenant has no variants/modifier groups/options contributing to this slowdown.

Conclusion:

Do not add speculative indexes or rewrite the menu query as the first response to this incident.

### 3.8 Existing G6 performance work is useful but intentionally incomplete

VERIFIED:

- G6 already established lazy public product media, asynchronous decoding, and low fetch priority.
- G6 explicitly avoided speculative URL rewriting because a production image transformation path had not yet been proven.
- The new incident supplies evidence that the remaining image-byte problem is now material and should be addressed.

## 4. Root-Cause Model

Current workload:

```
Import
  -> raw external image URL
  -> database stores URL
  -> Studio renders thumbnail directly
  -> public menu renders product image lazily
  -> browser requests original-sized external image
  -> 30 image-bearing products create substantial network/decode work
  -> Featured presentation can duplicate/accelerate the visual workload
  -> large Base64 cover can inflate initial HTML
```

The problem is therefore:

**Image delivery is not a single controlled system.**

It is a collection of correct local behaviors with an incomplete global media contract.

## 5. Remediation Principles

1. Keep tenant image data intact.
2. Never silently replace a tenant-owned image with unrelated stock imagery.
3. Do not introduce a new image-processing dependency unless the existing asset path is proven insufficient.
4. Preserve the existing five themes.
5. Preserve product ordering, pricing, availability, cart/order, analytics, SEO, auth, tenant isolation, and branch isolation.
6. Centralize image URL behavior in a reusable media utility/primitive.
7. Optimize only sources that are known to support safe transformation.
8. Preserve arbitrary/non-transformable URLs instead of guessing.
9. Use stable dimensions/aspect ratios to prevent layout shift.
10. Use lazy loading below the fold.
11. Use eager loading only for a genuine LCP/critical image.
12. Use responsive `sizes`/width variants when the source supports them.
13. Do not treat HTTP 200 as visual-performance proof.
14. Measure before and after with the existing performance harness and realistic data.

## 6. Execution Plan

### Phase 0 — Evidence Lock

Status: CLOSED / VERIFIED for the current investigation.

Deliverables:

- production/customer reproduction evidence;
- database timing evidence;
- source audit;
- Vercel/runtime inspection;
- current image behavior inventory;
- root-cause report.

Do not repeat this phase unless new evidence contradicts it.

### Phase 1 — Shared Image Delivery Foundation

Status: VERIFIED / COMPLETE

Objective:

Create one safe, reusable image URL normalization contract and apply it first to product thumbnails without changing the database schema.

Tasks:

1. Add a reusable image URL optimizer/normalizer to `src/lib/menu/image.ts`.
2. For known Unsplash URLs:
   - preserve the image identity;
   - add controlled width;
   - use `fit=crop` where the visual surface is crop-based;
   - use `auto=format`;
   - use a controlled quality value;
   - preserve/override width intentionally rather than blindly appending duplicate parameters.
3. Leave Base64/data URLs unchanged.
4. Leave arbitrary third-party URLs unchanged until their transformation contract is proven.
5. Extend `MenuMedia` to use the normalized source and accept responsive `sizes` when appropriate.
6. Update Studio product thumbnails to:
   - use the shared image utility;
   - lazy-load;
   - decode asynchronously;
   - reserve stable 48px thumbnail geometry;
   - avoid loading all 30 images eagerly.
7. Update public product media to use the shared optimizer while preserving the existing lazy/async/low-priority contract.
8. Remove the Editorial all-product prefetch behavior. A future critical-image preload must be narrowly scoped to the actual LCP candidate.
9. Add regression tests for:
   - Unsplash normalization;
   - non-Unsplash passthrough;
   - data URL passthrough;
   - Studio lazy loading;
   - public lazy loading;
   - absence of all-product Editorial prefetch.
10. Run the relevant repository quality checks.

Acceptance criteria:

- No tenant data migration.
- No new image runtime dependency.
- Studio no longer eagerly requests every product thumbnail.
- Public product images retain lazy loading.
- Known Unsplash images receive bounded responsive URLs.
- Unknown image providers remain untouched.
- Existing image fallback behavior remains intact.
- Tests protect the new contract.

### Phase 2 — Public Image Geometry and Responsive Delivery

Status: VERIFIED COMPLETE / MERGED

Objective:

Make every public product-media surface request an asset appropriate to its rendered size.

Tasks:

1. Inventory all public `MenuMedia` call sites across the five protected themes.
2. Assign semantic media roles:
   - product-card;
   - featured-card;
   - hero/cover;
   - product-detail/dialog;
   - logo.
3. Define target width bands for mobile/tablet/desktop based on actual CSS geometry.
4. Add `sizes` values where the browser can select an appropriate source.
5. Ensure each meaningful image reserves geometry before decode.
6. Verify 320px, 375px, 390px, 430px, tablet, and desktop states.
7. Verify Arabic RTL, English LTR, mixed-direction content, long product names, missing descriptions, and missing images.

Acceptance criteria:

- No desktop-sized product asset is unnecessarily requested for a narrow mobile card.
- No CLS regression.
- Five themes retain their intended image composition.

### Phase 3 — Branding/Cover Media Decoupling

Status: VERIFIED COMPLETE / MERGED.

Objective:

Remove large Base64 branding images from the public SSR payload where a safe persistent media URL can be used.

Tasks:

1. Audit tenant `logo_url` and `cover_url` storage behavior.
2. Determine the existing supported production storage/CDN path.
3. Confirm whether Supabase Storage or an existing CDN path can serve optimized image URLs without changing tenant semantics.
4. If a safe existing path exists, use it.
5. If not, design a minimal server-side/media migration path before implementation.
6. Never migrate customer images blindly.
7. Keep a fallback for legacy Base64 data URLs during migration.
8. Measure HTML transfer and parsing before/after.

Acceptance criteria:

- Large binary image content is not unnecessarily embedded in the public HTML.
- Legacy tenant data still renders.
- No broken branding.
- No tenant isolation or privacy regression.

### Phase 4 — Featured Presentation Bound

Status: VERIFIED COMPLETE / MERGED.

Objective:

Prevent large Featured sets from becoming a hidden performance multiplier.

Tasks:

1. Preserve the stored `isFeatured` truth.
2. Define a presentation limit for the dedicated Featured section.
3. Keep all products available in their normal category/list presentation.
4. Avoid duplicate full-size image downloads for the same product where possible.
5. Test the 30-featured-product tenant as the golden case.

Acceptance criteria:

- 30 Featured flags do not cause 30 above-the-fold image downloads.
- Product discovery remains complete.
- No product/order semantics change.

### Phase 5 — Public HTML / SSR Payload Reduction

Status: TODO.

Objective:

Reduce unnecessary initial document size.

Tasks:

1. Measure HTML before/after for the golden tenant.
2. Identify all repeated large media payloads.
3. Keep only necessary textual/public menu data in SSR.
4. Remove duplicate serialized media where architecture allows.
5. Keep hydration deterministic.
6. Preserve SEO metadata and structured data.
7. Verify no duplicate public-menu network fetch is introduced.

Target evidence:

- Document transfer size.
- Uncompressed HTML size.
- FCP/LCP.
- Image transfer bytes.
- Number of initial image requests.
- JS execution/decoding impact.

No arbitrary hard budget is to be invented before measurement.

### Phase 6 — Performance Harness / Golden Fixture

Status: TODO.

Objective:

Turn this incident into a permanent regression test.

Create a deterministic fixture representing:

- 30 products;
- 30 product images;
- 30 Featured flags;
- long Arabic names;
- English names;
- descriptions;
- missing descriptions;
- mixed image providers;
- one large legacy Base64 cover;
- one logo;
- realistic mobile dimensions.

Measure:

- HTML bytes;
- transfer bytes;
- image request count;
- image transfer bytes;
- decoded image bytes where available;
- FCP;
- LCP where exposed;
- CLS;
- interaction responsiveness where available;
- Studio initial render behavior;
- public QR/menu behavior.

The fixture must not contain real customer PII.

### Phase 7 — Cross-Theme Regression

Status: TODO.

Verify all five protected themes:

- Essential
- Editorial
- Noir
- Heritage
- Gallery

For each:

- hero/cover;
- product cards;
- featured section;
- detail modal/sheet;
- fallback;
- RTL/LTR;
- mobile;
- tablet;
- desktop;
- reduced-motion/reduced-data considerations where supported.

### Phase 8 — Production Validation

Status: TODO.

Follow the release-only policy:

LOCAL DEVELOPMENT
→ LOCAL QA
→ LOCAL BROWSER/VISUAL QA
→ TESTS
→ CI QUALITY GATES
→ DIFF REVIEW
→ ONE RELEASE BATCH
→ MAIN
→ ONE PRODUCTION DEPLOYMENT
→ REAL-DEVICE QA

For the golden tenant:

1. Studio open.
2. Studio scroll.
3. Public menu direct open.
4. QR scan.
5. First viewport.
6. Scroll through all categories.
7. Open product details.
8. Cart/order flow.
9. Arabic RTL.
10. English LTR.
11. Repeat on a real Android device.

Do not claim production performance success without direct production evidence.

## 7. Protected Scope

Do not change unless separately authorized:

- authentication;
- authorization;
- RLS;
- tenant isolation;
- branch isolation;
- subscriptions/entitlements;
- pricing/order validation;
- payment;
- SEO architecture unrelated to this image issue;
- Vercel deployment configuration;
- database schema;
- existing five theme identities.

## 8. Golden Test Tenant

The current real-data reproduction is:

- Tenant slug: `saudi-shopping-world`
- Owner test account: `mido@hotmail.com`
- Product count: 30
- Product images: 30
- Featured products: 30
- Availability: 30/30
- Variants: 0
- Modifier groups/options: 0
- Product image provider observed: Unsplash
- Cover: legacy Base64 WebP
- Primary observed symptoms: slow Studio open and slow public/QR image loading.

The email address is diagnostic reference only and must never be written into analytics, public content, test fixtures, or client-side telemetry.

## 9. Known Existing Contracts to Preserve

- `MenuMedia` fallback behavior.
- Public product `loading="lazy"`.
- Public product `decoding="async"`.
- Public product low fetch priority.
- Existing G6 performance harness.
- Existing image art-direction rules.
- Existing five-theme architecture.
- Existing SSR hydration/cache behavior.
- Existing order/cart/customer actions.

## 10. Verification Matrix

### Code

- Typecheck.
- Full tests.
- Platform tests.
- Lint.
- Production build.
- Existing performance audit.
- New image delivery regression tests.

### Browser

- Chromium automated QA.
- Studio.
- Public menu.
- All five themes.
- 320/375/390/430 mobile widths.
- Tablet.
- Desktop.

### Data

- 30-product golden tenant.
- 30 images.
- 30 Featured flags.
- Base64 cover.
- Missing image.
- External non-Unsplash image.
- Long Arabic/English content.

### Production

- HTTP response.
- SSR document size.
- Image request count.
- Image transfer size.
- FCP/LCP/CLS where available.
- Runtime errors.
- Real-device QR.

## 11. Rollback Strategy

Each phase must be independently reversible.

Preferred rollback order:

1. Revert the focused image-delivery code.
2. Preserve tenant image data unchanged.
3. Do not perform destructive media migrations without a verified backup/migration path.
4. If production regression occurs after release, follow the repository rollback procedure and record the exact deployment/commit.

## 12. Stop Conditions

Stop immediately if:

- the task starts requiring schema changes not proven necessary;
- image transformation behavior for a provider is uncertain;
- tenant data would be mutated merely for benchmarking;
- a performance change causes theme or ordering regression;
- security/tenant isolation would need weakening;
- browser evidence contradicts the source-level hypothesis.

## 13. Exact Current Execution Task

**Phase 1 — Shared Image Delivery Foundation.**

First implementation boundary:

1. Add safe shared image URL normalization for known Unsplash URLs.
2. Apply it to shared product media.
3. Make Studio thumbnails lazy and optimized.
4. Remove Editorial all-product prefetch.
5. Add regression tests.
6. Run the applicable quality gates.
7. Review the diff.
8. Update this plan and continuity files with the verified result.
9. Stop.

Do not begin Phase 2 automatically.

## 14. Session Continuity Rule

When a new chat starts:

1. Read `AGENTS.md`.
2. Read `PROJECT_STATE.md`.
3. Read `PLAN.md`.
4. Read `TASKS.md`.
5. Read this document.
6. Read `docs/project-memory/problems-learned.md`.
7. Inspect current `main`, the performance branch, recent commits, PRs, and relevant diffs.
8. Determine the single exact task from the latest section of this document.
9. Do not repeat Phase 0 unless new evidence requires it.
10. Continue from the first unfinished phase.

## 15. Evidence Log

### 2026-09-22 — Initial root-cause investigation

- VERIFIED: customer test tenant has 30 products, all 30 with images.
- VERIFIED: all 30 are Featured.
- VERIFIED: product images are Unsplash URLs.
- VERIFIED: Studio thumbnails currently lack native lazy loading.
- VERIFIED: public product media already has lazy/async/low-priority behavior.
- VERIFIED: Editorial contains all-product image prefetch.
- VERIFIED: test tenant cover is a large Base64 WebP data URL.
- VERIFIED: public HTML inspection produced approximately 887 KB of uncompressed HTML.
- VERIFIED: database execution is low-millisecond and not the primary bottleneck.
- VERIFIED: no relevant Vercel runtime error was found explaining the symptom.
- UNKNOWN: exact real-device network waterfall and LCP on the owner's Android device.
- PROPOSED: implement the phased remediation described above.

## 16. Phase 1 Completion Evidence

- VERIFIED: corrected Phase 1 code commit `8347a3204f501f6a08a085616a3e2cea10e00882`.
- VERIFIED: GitHub Quality run `#2236` completed successfully.
- VERIFIED: GitHub W9 Orders QA run `#468` completed successfully.
- VERIFIED: Quality completed typecheck, tests, lint, production build, Chromium installation, all-theme browser QA, Studio browser QA, and uploaded browser performance diagnostics.
- VERIFIED: W9 completed route/typecheck, isolated PGLite fixture preparation, Playwright installation, W9 browser QA, and diagnostics upload.
- VERIFIED: final PR diff is limited to image delivery, Studio/public media loading behavior, regression tests, and continuity documentation.
- VERIFIED: no database/schema/auth/RLS/order/subscription/tenant-data migration was introduced.
- UNKNOWN: real-device waterfall/LCP for the physical `saudi-shopping-world` reproduction.
- UNKNOWN: production performance after release; PR has not yet been deployed to production.

### Exact Current Execution Task

**Phase 2 — Public Image Geometry and Responsive Delivery.**

Before starting Phase 2, merge PR #239 and verify the resulting `main` SHA. Do not deploy production automatically.

## 17. Do Not Repeat

- Do not re-audit PostgreSQL query speed unless new evidence shows query latency.
- Do not rebuild the public menu.
- Do not redesign themes.
- Do not replace tenant images manually.
- Do not add a speculative image CDN dependency.
- Do not make Vercel deployments merely to inspect CSS.
- Do not treat a passing CI build as proof of real-device performance.


## 18. Phase 2 Implementation Evidence — 2026-09-22

- VERIFIED: Phase 2 implementation branch is `perf/public-image-geometry-2026-09-22`, based directly on merged Phase 1 `main` `a5073612d162d6d7d6776de6df9e422c1d6dc43e`.
- VERIFIED: PR #241 is open against `main`.
- IMPLEMENTED: `src/lib/menu/image.ts` now generates bounded width-descriptor `srcset` candidates for known Unsplash URLs while preserving arbitrary/data/blob URLs.
- IMPLEMENTED: shared `MenuMedia` and public `DishMedia` now expose responsive source widths and only emit `sizes` when a width-descriptor `srcset` exists.
- IMPLEMENTED: public image roles were assigned concrete width bands for product cards, featured cards, detail/dialog media, hero/cover media, and logos.
- IMPLEMENTED: Essential/public shared renderer, Editorial/Signal Table, Noir, Heritage/Taste, and Gallery/public media paths were covered; legacy template media callsites that remain in the repository were also kept consistent.
- IMPLEMENTED: existing lazy/async/low-priority behavior remains preserved for normal public product media; critical hero/detail surfaces remain explicitly eager where the existing template already treated them as critical.
- IMPLEMENTED: regression coverage now verifies responsive source generation, non-Unsplash passthrough, and the updated shared/public media contracts.
- VERIFIED: final branch diff is scoped to responsive image delivery and its regression coverage; no schema, auth, RLS, tenant data, ordering, subscription, or deployment configuration change was introduced.
- VERIFIED: authoritative research confirms that `srcset` width descriptors + `sizes` let the browser choose an appropriate image source for the rendered slot; Unsplash officially supports dynamic `w`, `q`, `fit`, and `auto=format` transformations.
- UNKNOWN: GitHub Quality/browser workflow result for PR #241 is not exposed through the connected GitHub workflow surface yet; the only current combined status is Vercel = PENDING.
- UNKNOWN: physical-device 320/375/390/430px waterfall/LCP and real production performance for the new head.
- BLOCKED: merge/production verification must wait for the repository quality/browser gates; no production deployment has been triggered by this Phase 2 task.

### Exact Current Execution Task

**Complete PR #241 verification: obtain GitHub Quality/W9 and Vercel results, fix only task-scoped failures, review the final diff, merge once if all required gates are green, verify the resulting `main` SHA, then stop. Do not deploy Production automatically.**


## 19. Phase 2 Final Verification — 2026-09-22

Status: VERIFIED COMPLETE / MERGED

- VERIFIED: PR #241 merged once by squash as `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: resulting `main` SHA is `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: Quality #2256 passed; W9 Orders QA #486 passed; Vercel PR preview status is SUCCESS for the final PR head `41f07720621486472cdf04053fdf06f53add7f3e`.
- VERIFIED: three intermediate test-contract failures were task-scoped syntax-contract mismatches caused by the responsive renderer refactor; they were corrected without changing application behavior or widening scope.
- VERIFIED: final diff remained scoped to responsive public image delivery, its regression contracts, and continuity documentation.
- UNKNOWN: physical-device 320/375/390/430px waterfall/LCP and Production performance for the customer test menu.
- Deployment status: NOT_PERFORMED.

### Exact Next Task
**Run the dedicated real-device/public-menu performance evidence pass for the 30-item Saudi shopping world test menu, measuring Studio and QR/public-menu image waterfalls plus LCP at 320/375/390/430px.**


## 20. Phase 3 Completion Evidence — 2026-09-22

- VERIFIED: Phase 3 PR #247 merged once by squash as `fb4c5dba311d5f77c3bcb943f13e35cb92ab8584`.
- VERIFIED: public tenant `logo_url` / `cover_url` Base64 media is no longer embedded directly in the public tenant payload; public mapping uses versioned tenant-media URLs.
- VERIFIED: tenant media endpoint is active/published gated, tenant-scoped, raster-only, cacheable, and protected with `nosniff`.
- VERIFIED: Studio tenant media values remain unchanged.
- VERIFIED: no schema/auth/RLS/order/subscription/deployment configuration changes were introduced.
- VERIFIED: GitHub Quality #2276 and W9 Orders QA #503 passed on the final Phase 3 head.
- UNKNOWN: real-device 320/375/390/430px waterfall/LCP and Production performance for the 30-item test menu.
- Deployment status: NOT_PERFORMED by Phase 3.

## 21. Phase 4 Completion Evidence — 2026-09-22

- VERIFIED: Phase 4 PR #249 merged once by squash as `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78`.
- VERIFIED: Phase 4 continuity documentation is merged in current `main` at `5ad84abdae22efb223b5a2cf58f23b37bc36b9a7`.
- VERIFIED: the dedicated Featured presentation now uses one shared `getFeaturedProducts()` contract with a maximum of 6 presentation items.
- VERIFIED: the bound is applied across the protected public renderer families: PublicMenuView, ContemporaryRestaurantTemplate, FastCasualTemplate, SignalTableTemplate, SpecialtyCafeTemplate, and TasteTemplate.
- VERIFIED: stored `isFeatured` truth is unchanged; all products remain in the normal category/menu discovery path.
- VERIFIED: the 30-featured-product golden case is protected by regression tests.
- VERIFIED: Quality #2282 passed typecheck, tests, W7.4–W7.10 contracts, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, and performance diagnostics.
- VERIFIED: W9 Orders QA #507 passed.
- VERIFIED: Vercel preview status is FAILURE because of the documented build-rate-limit surface; no retry or Production deployment was performed.
- VERIFIED: final Phase 4 diff was limited to featured presentation bounding and regression contracts.
- Deployment status: NOT_PERFORMED.

## 22. Exact Current Execution Task

**Phase 5 — Public HTML / SSR Payload Reduction.**

Scope:
1. Measure current HTML before/after evidence for the 30-item `saudi-shopping-world` golden case using the merged Phase 1–4 architecture.
2. Identify repeated/duplicated serialized media and other unnecessary public SSR payload.
3. Reduce only unnecessary initial document payload while preserving deterministic hydration.
4. Preserve SEO metadata and structured data.
5. Verify no duplicate public-menu network fetch is introduced.
6. Record document transfer size, uncompressed HTML size, FCP/LCP, image transfer bytes, initial image-request count, and relevant JS/decode impact where available.
7. Run the repository quality gates and review the final diff.
8. Do not deploy Production automatically.

Do not re-implement Phase 1, Phase 2, Phase 3, or Phase 4 unless new measured evidence proves a regression or missing contract.
