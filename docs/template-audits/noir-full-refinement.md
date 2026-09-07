# Noir Full Refinement Audit

## 1. Scope and identity
- Actual theme ID: `noir`.
- Template family: `fine-dining-hospitality`.
- Public routes: `/m/$slug` and `/m/$slug/$branch`.
- Preview route: `/themes/preview?theme=noir`.
- Scope: Noir public-menu visual, layout, image, typography, and theme-coherence refinement only.
- Protected: Essential, Editorial, Heritage, Gallery, backend/data/auth/authz, tenant/branch isolation, subscriptions, dependencies, CI/CD, Vercel configuration, environment variables, and deployment behavior.

## 2. Evidence status
- **VERIFIED:** repository maps `noir` to `fine-dining-hospitality` and the public route selects that family through the theme registry.
- **VERIFIED:** `FineDiningHospitalityTemplate` previously rendered its own hero/featured presentation and then mounted the shared `PublicMenuView`, creating a second public-menu shell below the custom Noir presentation.
- **VERIFIED:** the shared `PublicMenuView` owns search, category navigation, product details, cart/order, pricing, WhatsApp, phone, map, Instagram, and fixed customer actions.
- **VERIFIED:** multiple Noir CSS layers existed: `theme-noir.css`, `theme-refinements.css`, and `theme-refinements-v2.css`, with overlapping product-card geometry, staggered transforms, alternating radii, image transforms, and view-timeline decoration.
- **VERIFIED:** the existing Noir refinement layers contained several competing card geometries, including desktop stagger transforms and different image heights.
- **VERIFIED:** the supplied screenshots are 695×1536 mobile screenshots and show a dark Noir presentation with a strong restaurant identity, a large hero/description block, a featured image section, and a second screenshot with a visibly muted/covered lower presentation state.
- **UNKNOWN:** exact physical-device browser/OS identity, live browser paint timing, console output, and the causal source of the muted/covered lower presentation in screenshot 2 are not directly reproducible in this connector environment.
- **UNKNOWN:** final rendered pixels after this refinement until the repository browser QA workflow executes.

## 3. Tested evidence conditions
- Supplied screenshot evidence: 695×1536 mobile viewport, Android browser chrome visible.
- Repository source inspection: `main` HEAD `b346a494afd19992236baea4b3f8b26ca6a30d3e` before this refinement branch.
- Static route/theme architecture inspection: completed.
- Browser/device execution in this connector environment: **UNKNOWN**.
- Vercel deployment intentionally triggered: **NO**.

## 4. Intended segment and visual personality
- Segment: luxury restaurants, fine dining, chef-led hospitality, premium evening concepts.
- Saudi-market relevance: Arabic-first QR entry, high mobile usage, SAR pricing, branch identity, direct customer contact, and fast category/product discovery must remain clear.
- Visual personality: cinematic, dark, warm-metal, tactile, restrained, editorial, hospitality-led.
- Design rule: atmosphere supports the menu; product name, description, price, availability, and action remain stronger than decoration.

## 5. Screenshot findings
### P0 / Critical
- **VERIFIED — duplicate presentation shell:** the existing Noir template rendered a custom hero/featured composition and then mounted the shared `PublicMenuView`, which renders another header and featured area. This can produce duplicated visual hierarchy and excessive page length.
- **VERIFIED — competing card geometry:** three Noir CSS layers applied overlapping product-card rules. The older layers included odd/even/third-item transforms, alternating corner radii, different image heights, and scroll-timeline decoration. This is the repository-level root cause of the inconsistent card grammar.

### High
- **VERIFIED — image distribution imbalance:** the Noir CSS allowed featured and product media to use different fixed heights and item-position-based variations. Real mixed-ratio media could therefore produce inconsistent visual weight.
- **VERIFIED — visual noise:** decorative pseudo-elements, light-pool overlays, scanline texture, hover borders, image zoom, staggered transforms, and view-timeline blur/reveal were layered over an already dark cinematic system.
- **VERIFIED — first-screen density:** the custom Noir hero used a large presentation surface while the shared menu below introduced another hero/search/featured sequence.
- **INFERRED — scanability risk:** the combination of cinematic decoration and multiple presentation layers makes fast QR-menu scanning less predictable than the shared interaction model requires.

### Medium
- **VERIFIED — duplicated visit ownership:** `FineDiningHospitalityTemplate` recorded a public `visit` event while the mounted `PublicMenuView` also records the visit. The refinement removes the template-level duplicate and leaves the shared public renderer as the event owner.
- **UNKNOWN — screenshot 2 covering/muted layer:** the lower rounded gray composition appears to be a covering or preview-state presentation, but the screenshot alone does not prove the responsible DOM/CSS layer. No speculative z-index or timeout fix is introduced.

## 6. Header / hero decisions
- Keep the Noir custom hero because it is the theme's intended identity and is visible in the supplied evidence.
- Reduce vertical waste on mobile through a compact, content-driven hero rather than a fixed `72dvh`/`92dvh` presentation.
- Keep logo, restaurant name, branch/city, language control, and configured tagline data-driven.
- Preserve a restrained `N / 03` identifier as a decorative accent only.
- Do not invent permanent marketing copy when the configured tagline is absent.

## 7. Featured imagery decisions
- Keep one Noir featured section in the outer presentation.
- Use a stable `4 / 3` media ratio for featured cards.
- Use two columns on mobile and three on larger screens.
- Keep descriptions clamped and prices distinct.
- Preserve `MenuMedia` fallback behavior rather than introducing a new image pipeline.

## 8. Product-card decisions
- The shared public renderer remains the interaction owner.
- Hide only the duplicate inner Noir header, branch navigation, and duplicate featured section from the embedded shared renderer.
- Preserve the shared search, category navigation, product details, modifiers, pricing, cart, order submission, and customer-action surface.
- Product cards use a stable horizontal scan unit on mobile and two-column category grids on larger screens.
- Product media uses a stable `4 / 3` aspect-ratio box with `object-fit: cover`.
- Remove item-position staggering, alternating radii, scroll-timeline reveal, blur, decorative card pseudo-elements, and image transforms for this template.
- Long names use wrapping rather than fixed-width clipping.
- Prices remain `MenuPrice`/`formatSar` driven and bidi-isolated by the existing shared renderer.

## 9. Actions and functionality
- **VERIFIED:** cart/order is supported by `PublicMenuView`; the refinement does not change order validation or totals.
- **VERIFIED:** WhatsApp, phone, map, and Instagram are rendered only when their configured data exists.
- **VERIFIED:** fixed menu actions remain owned by `PublicMenuView` and retain safe-area spacing.
- **VERIFIED:** the template-level duplicate `visit` event was removed.
- **PROTECTED:** no new customer-facing action was introduced.

## 10. RTL / LTR and content resilience
Required and covered by the CSS contract:
- Arabic-only content.
- English-only content.
- Bilingual and mixed-direction strings.
- Long Arabic/English restaurant, category, and product names.
- SAR prices of different lengths.
- Missing descriptions.
- Missing, portrait, square, landscape, and poor-quality images.
- Available and sold-out products through the existing renderer.
- Few/many categories and products.
- One/multiple branches through the existing renderer.
- Loading/error/empty/unavailable states through the existing renderer.

## 11. Browser/viewport findings
- **VERIFIED from source:** safe-area bottom space remains reserved for fixed actions.
- **VERIFIED from source:** mobile and larger-screen card geometry are explicitly separated.
- **UNKNOWN:** physical small/standard/large mobile, tablet, desktop, Edge, and Opera pixel rendering until browser QA executes.
- **UNKNOWN:** exact first-paint behavior for the screenshot 2 muted/covered state.

## 12. Acceptance criteria
- One visible Noir hero/presentation shell on the public route.
- One visible featured presentation section.
- No duplicate shared header/featured chrome below the Noir hero.
- Stable `4 / 3` media geometry for featured/product imagery.
- No odd/even/third-item card staggering or ornamental transforms.
- Product names, descriptions, prices, and actions remain readable with long/mixed-direction data.
- Arabic RTL and English LTR remain coherent.
- Cart/order/search/category/customer actions remain owned by the existing shared renderer.
- No unsupported customer action is introduced.
- Fixed actions remain clear of content and safe-area edges.
- Reduced-motion behavior remains safe.
- SEO/canonical/data/auth/tenant behavior remains unchanged.
- Browser QA must pass before claiming final visual closure.

## 13. Test plan
Automated:
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
- `npm run qa:template`
- `npm run performance:audit`

Browser/visual:
- `/m/<slug>` Noir Arabic at small/standard/large mobile.
- `/m/<slug>?lang=en` Noir English where English identity data exists.
- mixed-direction names/descriptions and SAR prices.
- missing/mixed image ratios and image fallback.
- sparse/dense categories.
- fixed action bar and product dialog/cart states.
- `/themes/preview?theme=noir` preview state.
- all-theme browser regression to prove other themes remain unaffected.

## 14. Rollback
- Revert only the Noir refinement commits/files: `src/components/templates/fine-dining-hospitality.tsx`, `src/theme-noir-hardening.css`, `src/routes/__root.tsx`, `tests/noir-browser-hardening.test.mjs`, and the test-script registration in `package.json`.
- No schema/data migration rollback is required.
- Do not revert unrelated W17, Editorial, or infrastructure work.

## 15. Status
- Implementation: **IN_PROGRESS / awaiting automated browser verification**.
- Deployment: **NOT DEPLOYED by this task; no Vercel deployment intentionally triggered**.
- Remaining blocker: browser/device evidence and complete repository quality gate must run before visual closure.
