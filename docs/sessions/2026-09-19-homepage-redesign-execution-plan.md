# Menu V3 — Marketing Homepage Redesign Execution Plan

## Status
- Status: DOCUMENTED / IMPLEMENTATION NOT STARTED
- Date: 2026-09-19
- Repository: `Midosd249/Menu_V3`
- Canonical branch: `main`
- Planning HEAD: `6c0ac3ffef3501698ecc2b93551d7d5f928896cb`
- This file is the continuity anchor for the homepage redesign.
- Runtime implementation is not authorized until the owner explicitly approves it.

## 1. Objective
Redesign the Menu V3 marketing homepage so it communicates the depth of the existing product without rebuilding the product, changing the public-menu theme architecture, or creating duplicate business logic.

Target story:

```
Restaurant
→ Branded public presence
→ Guest menu experience
→ Customer action / ordering
→ Owner control
→ Intelligence / analytics
→ Growth
→ Guest relationships
→ Branch-aware operation
```

**PROPOSED positioning:** premium Arabic-first restaurant presence and operating-growth platform, with the live menu remaining the central guest surface.

Do not turn the homepage into a generic AI SaaS page, POS/accounting product, generic website builder, autonomous restaurant operator, feature dump, or sixth theme.

## 2. Verified starting point
- VERIFIED: `main` is the repository source of truth.
- VERIFIED: planning HEAD is `6c0ac3ffef3501698ecc2b93551d7d5f928896cb`.
- VERIFIED: latest code merge before this continuity HEAD was PR #203 at `d55c6c7b8cc18807b7a20982d803761d8180fc61`.
- VERIFIED: PR #203 covered QR printing, multi-copy QR sheets, Editorial Arabic typography, and decorative-label cleanup.
- VERIFIED: Quality run `35407461902` and W9 Orders QA `35407461827` were recorded as passed.
- VERIFIED: the historical homepage `React.Children.only` crash was fixed in PR #172 and regression-protected.
- VERIFIED: protected public themes are Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- VERIFIED: primary homepage files are `src/routes/index.tsx` and `src/routes/index.css`.
- UNKNOWN: physical-device visual evidence for the homepage.
- UNKNOWN: exact live homepage conversion baseline.
- UNKNOWN: final typography and image requirements.

## 3. Protected boundaries — never change for homepage polish
Unless a later task proves a direct defect and explicitly authorizes it, do not change:
- database/migrations/schema;
- Supabase/RLS;
- Better Auth/authentication;
- authorization;
- tenant/branch isolation;
- subscriptions/entitlements;
- public-menu business logic;
- cart/order/pricing/idempotency/rate limits;
- analytics/R2–R9 systems;
- Guest Assistant backend;
- five-theme renderer or the five protected themes;
- Studio/Admin architecture;
- Vercel/deployment configuration;
- release-only Vercel workflow;
- existing SEO architecture unless a homepage-specific defect is proven.

This is a presentation, information architecture, content, conversion, and product-proof task.

## 4. Specialist routing
Relevant workflows:
1. Principal Engineer / Orchestrator.
2. Research & Connected Tools.
3. Product Analyst.
4. UI/UX & Design.
5. Content & Localization.
6. Marketing & Growth.
7. Frontend.
8. SEO.
9. Accessibility / RTL.
10. Performance.
11. QA & Verification.
12. Code Audit / Hygiene.
13. Documentation / Continuity.
14. Release / Deployment at the final release boundary only.

## 5. Research evidence
### VERIFIED
- W3C guidance requires deliberate bidi/direction handling for Arabic/RTL and mixed-direction content.
- Restaurant platforms increasingly communicate branded presence, QR/ordering, analytics and multi-location capabilities together.
- Real product proof communicates complex products more clearly than generic feature illustrations.
- Typography and font delivery affect layout and performance.

### INFERRED
Menu V3 should not position itself as only a QR menu; the homepage should communicate restaurant presence + guest experience + owner control.

### PROPOSED
Use real Menu V3 guest and owner UI as proof and visibly demonstrate Arabic-first quality.

## 6. Target homepage information architecture
1. **Navigation** — Product, Themes, Pricing, Sign in, primary Start CTA.
2. **Hero / Restaurant Presence** — Arabic-first H1, concise outcome, primary CTA, secondary preview action, real product proof.
3. **Guest Journey Proof** — QR → Menu → Category → Item → supported action/order.
4. **Branded Restaurant Presence** — all five protected themes as identity proof.
5. **Owner Control** — realistic Studio proof using verified Menu/Branches/Orders/Analytics/Growth/Guests capabilities.
6. **Intelligence & Growth** — actionable post-publish value, not vanity metrics.
7. **Arabic-first Advantage** — Arabic, English, RTL, mixed direction, SAR and mobile proof.
8. **How It Works** — Create → Build → Publish → Share.
9. **Pricing** — existing canonical plans only.
10. **FAQ / Objections** — verified answers only.
11. **Final CTA** — one clear conversion action.

## 7. Section-by-section requirements

### Navigation
Keep simple and preserve all existing signup/login/theme/pricing route contracts.

### Hero
Current gap: too close to “digital menu” positioning and too illustrative.

Target hierarchy:
```
Eyebrow
→ H1
→ concise outcome
→ primary CTA
→ secondary preview action
→ real product preview
```

The hero must explain the product without requiring the visitor to read the entire page.

### Guest Journey
Show:
```
QR
→ Menu
→ Category
→ Item
→ supported action/order
```
Only show capabilities verified in the repository.

### Theme Gallery
- Keep Essential, Editorial, Noir, Heritage/Taste, Gallery.
- Do not create a sixth theme.
- Present themes as restaurant identity proof.
- Do not modify theme renderer logic.

### Owner Control
Show a realistic Studio story:
```
Menu | Branches | Orders | Analytics | Growth | Guests
```
Exact modules must match current routes/capabilities.

### Intelligence / Growth
Explain what the owner can learn/do after publishing. Do not invent quantified outcomes.

### Arabic-first
Use real Arabic restaurant names, categories, item names, descriptions, SAR prices, English/mixed strings and RTL/LTR behavior. Arabic quality must be visible, not merely claimed.

### How It Works
Use only a real flow:
```
Create → Build → Publish → Share
```

### Pricing
Reuse canonical plan data/contracts. No invented limits, fake discounts, duplicated entitlement logic or dark patterns.

### FAQ
Use only verified capability. Candidate questions: Arabic/English support, themes, branches, QR updates, publishing, plan differences.

### Final CTA
One strong action, with login where appropriate. Avoid competing CTA clusters.

## 8. Visual direction
**Editorial Hospitality + Real Product**

Principles:
- warm paper / neutral surfaces;
- deep ink;
- restrained emerald/olive and muted amber/terracotta accents where compatible;
- confident Arabic typography with coherent Latin;
- generous whitespace;
- editorial rhythm;
- restaurant identity over generic SaaS identity;
- real UI proof;
- restrained motion.

Avoid:
- gradient-heavy SaaS;
- glassmorphism;
- generic 3D dashboards;
- excessive floating cards;
- stock photography as primary product explanation;
- giant abstract blobs;
- fake logos/testimonials/statistics;
- AI as the sole identity;
- unsupported capability cues.

## 9. Typography gate
Final font is UNKNOWN.

IBM Plex Sans Arabic is a research candidate only.

Benchmark candidates with:
- Arabic/English H1 and body;
- mixed Arabic/English;
- SAR prices;
- long restaurant/category/item names;
- buttons/navigation/FAQ;
- mobile wrapping;
- line height/density;
- Arabic/Latin harmony;
- font-loading impact.

Do not change the product-wide font system merely for homepage styling.

## 10. Image-generation protocol
Images are optional. Priority:
1. real repository UI;
2. CSS composition;
3. existing approved assets;
4. user-generated reference-based assets;
5. licensed third-party imagery only when justified.

Do not create `public/assets/homepage/` until an actual asset is required.

Possible future names:
```
homepage-hero-menu.webp
homepage-studio-preview.webp
homepage-theme-collage.webp
homepage-hospitality-detail.webp
```

When an image is needed, give the user the exact generation brief first:
- purpose;
- placement;
- aspect ratio;
- pixel dimensions;
- background;
- composition;
- negative prompts;
- text/no-text rule;
- format;
- compression target;
- alt text;
- mobile crop.

Do not generate assets now.

## 11. Implementation surface
Primary:
- `src/routes/index.tsx`
- `src/routes/index.css`

Possible focused files only if evidence requires:
- `tests/public-pages-themes-contract.test.mjs`
- `src/routes/__root.tsx` for proven homepage metadata/head behavior;
- homepage asset directory when actually needed.

Do not touch backend/data/auth/RLS/order/theme/deployment systems for presentation work.

## 12. CTA contract
Before implementation, map every existing homepage CTA and preserve:
- signup/new-customer flow;
- login;
- theme preview;
- pricing;
- real menu preview;
- secondary CTA.

Do not create a parallel lead/signup backend path.

## 13. Content/localization contract
Arabic is the primary quality bar. It must be natural, concise and outcome-oriented, not literal translation.

English must preserve meaning, hierarchy and commercial intent.

Mixed-direction stress cases:
- Arabic + Latin names;
- Arabic + English brand names;
- Arabic + numeric price;
- phones;
- URLs;
- abbreviations.

## 14. Accessibility acceptance
Before DONE:
- semantic heading hierarchy and one H1;
- keyboard navigation;
- visible focus;
- accessible icon names;
- 24×24 CSS px minimum baseline, preferably ~44×44 for important mobile controls;
- reduced motion;
- sufficient contrast;
- no fixed/sticky obstruction;
- logical DOM order;
- correct RTL/LTR;
- no horizontal overflow;
- meaningful alt text.

## 15. Responsive acceptance
Test:
- 360×800
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×800
- 1440×900

Stress long Arabic names, long descriptions, SAR prices, mixed bidi, missing/slow images, narrow and wide layouts.

## 16. Browser visual QA
Verify Arabic RTL, English LTR and mixed bidi; homepage open; pricing; signup; login; theme previews; real menu preview; mobile navigation; keyboard/focus; reduced motion; clipping/overlap/overflow; fonts/images; CTA collisions; hydration/runtime errors.

Source inspection and unit tests alone are not visual proof.

## 17. Automated verification
After implementation run applicable:
```
npm run typecheck
npm test
npm run lint
npm run build
npm run qa:template
npm run performance:audit
```
Also run the relevant homepage/public-page regression and available Playwright/browser/accessibility checks. Never claim a check passed unless it actually ran.

## 18. SEO
Preserve and verify title, description, canonical, robots, social metadata, structured data accuracy, internal links, no accidental noindex, no duplicate canonical, and locale behavior.

## 19. Performance
Prefer real UI over heavy hero media. Avoid large hero video, unnecessary animation libraries, oversized images and font-loading regressions. Reserve image dimensions and test mobile network behavior.

## 20. Analytics
Homepage conversion baseline is UNKNOWN.

If events are needed, inspect the existing canonical analytics system first. Never create a parallel stream.

Potential funnel only if supported:
```
homepage_view
→ primary_cta_click
→ signup_start
→ signup_complete
→ publish
→ public_menu_view
```

## 21. Implementation phases

### Phase 0 — Reconfirm state
Re-read governance and this plan, verify current main, inspect homepage source/contracts, confirm no newer homepage work.

### Phase 1 — Contract + content map
Finalize section order, copy hierarchy, CTA/route mapping and protected contracts.

### Phase 2 — Hero proof
Implement Hero hierarchy and real product proof; verify Arabic/English/responsive behavior.

### Phase 3 — Guest journey proof
Implement QR → menu → product → supported action story.

### Phase 4 — Theme identity proof
Present all five existing themes without renderer changes.

### Phase 5 — Owner control proof
Show Studio-side value using verified capabilities.

### Phase 6 — Intelligence/growth
Show post-publish value without fabricated metrics.

### Phase 7 — Arabic-first proof
Use realistic Arabic/English/mixed bidi/SAR content.

### Phase 8 — How It Works + Pricing + FAQ + CTA
Use canonical commercial contracts and verified copy.

### Phase 9 — Responsive/accessibility/performance
Run viewport, bidi, accessibility and performance checks.

### Phase 10 — Verification/audit
Run quality gates, browser QA, SEO/performance review, protected-boundary audit and final diff review.

### Phase 11 — Continuity
After verified implementation, update PROJECT_STATE.md, PLAN.md, TASKS.md, record commit/evidence/unknowns and exactly one next task, then STOP.

## 22. Rollback
Keep the change focused and reversible. No schema migration or unrelated refactor. If a regression appears, revert the smallest offending change and rerun affected checks. Never hide rendering defects with giant z-index values, arbitrary timeouts, duplicate controls or fake UI.

## 23. Risk register
- R1 generic SaaS look → restaurant-first visuals and real menu proof.
- R2 unsupported claims → map every claim to repository capability.
- R3 Arabic regression → real bidi benchmark.
- R4 mobile overflow → stress 360/390/430 and long content.
- R5 CTA regression → preserve route contracts and focused tests.
- R6 theme regression → no renderer rewrite; preserve five themes.
- R7 performance regression → real UI, compressed assets, font discipline.
- R8 SEO regression → metadata/canonical review.
- R9 deployment churn → no Vercel iteration loop.
- R10 scope creep → one atomic homepage task.

## 24. Definition of DONE
Done only when:
1. approved IA is implemented;
2. positioning is accurate;
3. real product proof is visible;
4. signup/login/theme/pricing contracts remain intact;
5. Arabic RTL, English LTR and mixed bidi are verified;
6. mobile/tablet/desktop are verified;
7. accessibility is verified;
8. performance is verified;
9. SEO remains correct;
10. five themes remain protected;
11. no unnecessary backend/auth/RLS/order/analytics changes occurred;
12. automated gates pass or evidence-backed exceptions are documented;
13. browser visual evidence is recorded;
14. final diff is reviewed;
15. continuity docs are updated;
16. exactly one next task is recorded;
17. deployment status is separately recorded.

## 25. Explicit non-goals
No public theme rebuild, Studio rebuild, onboarding rebuild, auth rebuild, subscription change, schema/RLS change, new ordering/payment infrastructure, sixth theme, analytics replacement, AI-provider replacement, native app, product/category deep links, Web Share API, fabricated proof, or repeated Vercel deployment.

## 26. New-chat recovery protocol
When resuming from a new chat:
1. read AGENTS.md;
2. read PROJECT_STATE.md;
3. read PLAN.md;
4. read TASKS.md;
5. read SESSION_PROTOCOL.md;
6. read this file;
7. verify current main HEAD;
8. inspect newer homepage commits/PRs;
9. continue from the first incomplete phase only;
10. never repeat completed work;
11. inspect whether required assets already exist;
12. do not deploy during ordinary design iteration;
13. stop if implementation approval is absent.

## 27. Current session state
- Classification: deep design/product planning and continuity documentation.
- Research: deep/focused evidence synthesis.
- Runtime implementation: NOT STARTED.
- Deployment: NOT PERFORMED.
- Code changes in this task: NONE.
- Documentation change: this execution plan and continuity pointers.
- Exact next action: explicit owner approval, then Phase 0 → Phase 1 only.

## 28. Approval gate
**APPROVAL REQUIRED:** Proceed with this homepage redesign plan while preserving all protected product, theme, backend, auth, analytics, SEO and deployment boundaries.

Until approval is given, do not edit runtime code.
