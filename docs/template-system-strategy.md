# Menu V3 Template System Strategy

## 1. Product Goals

- **VERIFIED:** Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS for restaurants and cafes.
- **PROPOSED:** Make templates a genuine product differentiator: each family should change information hierarchy, composition, density, imagery, navigation, and conversion behavior—not only colors or border radii.
- **PROPOSED:** Preserve one canonical menu data model while allowing multiple presentation systems to consume it safely.
- **PROPOSED:** Make mobile/RTL behavior a first-class design constraint rather than a later adaptation.
- **PROPOSED:** Allow controlled restaurant branding without allowing arbitrary customization to destroy accessibility, hierarchy, or performance.

## 2. Current-System Audit

- **VERIFIED:** `src/lib/theme/types.ts` defines eight theme keys: `editorial`, `dark-dining`, `coffee`, `heritage`, `fast-casual`, `gallery`, `immersive`, and `minimal`.
- **VERIFIED:** `src/lib/theme/registry.ts` defines shared tokens plus per-theme token/layout/capability metadata.
- **VERIFIED:** The current layout vocabulary is limited to `standard`, `immersive`, and `hero` headers; `list`, `compact-grid`, and `gallery-grid` product grids; `horizontal`, `vertical`, and `editorial` cards; `scroll`, `sticky`, and `pills` category navigation; and four image-ratio values.
- **VERIFIED:** `src/components/menu-theme-controller.tsx` applies the selected theme through `data-menu-theme` and does not itself select a different React rendering tree.
- **VERIFIED:** `src/components/public-menu.tsx` is the shared public menu renderer for the main menu flow, including product details, modifiers, ordering/cart UI, search, branch information, WhatsApp, and language switching.
- **VERIFIED:** `src/routes/themes.tsx` presents the themes as a gallery and links to a preview route.
- **VERIFIED:** `src/routes/themes/preview.tsx` renders the same `PublicMenuView` with a selected theme in preview mode.
- **VERIFIED:** `src/routes/m.$slug.tsx` loads a public menu, resolves its saved theme through `MenuThemeController`, and renders `PublicMenuView`.
- **VERIFIED:** Theme differences are currently implemented primarily through CSS selectors in `src/styles.css`, while the underlying public-menu markup remains shared.
- **VERIFIED:** The current public menu data model already exposes tenant branding, branches, hours, categories, products, product variants, modifier groups/options, dietary labels, allergens, calories, availability, featured status, and bilingual content through `src/lib/menu/types.ts`.
- **VERIFIED:** Existing public rendering already has loading/error states, session caching, product-detail dialogs, modifier selection, cart/order flows, language switching, and responsive CSS.
- **INFERRED:** The largest template-system weakness is architectural: eight named themes do not yet constitute eight genuinely distinct template families because most structural variation is encoded as CSS over one shared renderer.
- **UNKNOWN:** No repository evidence currently proves a complete visual-regression harness for the public menu; this must be established before retiring any existing template.

## 3. Competitive and Open-Source Research

### Toast
- **VERIFIED (external):** Toast supports branded online-ordering pages, menu visibility, popular items/upsells, mobile bottom-sheet section navigation, and menu search at large catalog sizes.
- **Application:** Menu V3 should treat navigation and search as conversion-critical infrastructure, not decoration.
- **Tradeoff:** Menu V3 is a digital-menu product first; it should not copy Toast's broader POS complexity.
- Source: https://support.toasttab.com/en/article/Getting-Started-Online-Ordering
- Source: https://support.toasttab.com/en/article/Online-Ordering-FAQ

### Square
- **VERIFIED (external):** Square models menus as buyer-facing structures separate from internal categories and supports location/channel visibility, menu hours, item-level visibility, branded ordering profiles, QR ordering, and real-time mobile preview.
- **Application:** Template rendering must respect menu/branch availability and should remain presentation-only; operational data should remain canonical.
- **Tradeoff:** Avoid importing POS-specific concepts into the template contract unless the repository already requires them.
- Source: https://squareup.com/help/us/en/article/6424-create-menus-with-square-for-restaurants
- Source: https://squareup.com/help/us/en/article/8566-set-up-an-online-ordering-profile
- Source: https://squareup.com/us/en/online-ordering/qr-code-ordering

### GloriaFood
- **VERIFIED (external):** GloriaFood emphasizes photo-rich menus, modifiers, nutritional/allergen data, responsive ordering, and a restaurant website generated around the menu.
- **Application:** Menu V3 should make rich item metadata and imagery first-class content inputs while keeping the template responsible for hierarchy rather than data ownership.
- **Tradeoff:** Avoid making every template image-heavy; some restaurant concepts need high information density.
- Source: https://www.gloriafood.com/online-ordering-system-for-restaurants

### Accessibility / design-system references
- **VERIFIED (external):** Radix Primitives follows WAI-ARIA patterns and provides accessible primitives for focus management, keyboard navigation, labels, and RTL-aware interactions.
- **Application:** New template interactions should reuse existing accessible primitives where applicable and avoid custom interactive semantics when native HTML or established primitives are sufficient.
- Source: https://www.radix-ui.com/primitives/docs/overview/accessibility
- Source: https://www.radix-ui.com/primitives/docs/overview/introduction
- **VERIFIED (external):** W3C WAI-ARIA Authoring Practices defines expected keyboard, labeling, and state behavior for menus and menu buttons.
- **Application:** Category navigation and template controls must preserve native link/button semantics and explicit accessible names.
- Source: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
- Source: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

### Performance
- **VERIFIED (external):** web.dev recommends lazy-loading below-the-fold images and prioritizing truly critical above-the-fold imagery; responsive image sizing reduces unnecessary transfer and decoding cost.
- **Application:** Template contracts should distinguish hero/critical media from below-fold product media and preserve explicit image dimensions/aspect ratios where possible.
- Source: https://web.dev/learn/performance/image-performance
- Source: https://web.dev/learn/design/responsive-images

### Open-source reference
- **VERIFIED (external):** `danishfareed/restaurant-digital-menu` demonstrates a React-based digital-menu approach with categories, images, titles, descriptions, and prices.
- **Application:** Useful as a basic reference for domain separation, but it is not sufficient as a quality benchmark for Menu V3's multi-tenant, RTL, ordering, accessibility, and template requirements.
- Source: https://github.com/danishfareed/restaurant-digital-menu

## 4. Target Restaurant Segments

The system should use **six template families**. These are deliberately behavioral families, not cosmetic themes.

### Family A — Specialty Coffee / Cafe
- **Target:** specialty coffee, cafes, tea shops.
- **Visual personality:** tactile, editorial, warm, compact.
- **Hierarchy:** brand → quick categories → featured/seasonal → dense item list.
- **Density:** high.
- **Navigation:** sticky category rail or compact horizontal navigation.
- **Product pattern:** compact card with strong name/price hierarchy and optional thumbnail.
- **Image strategy:** selective; prioritize hero/featured products and avoid requiring every item to have an image.
- **CTA:** quick add/order where ordering is enabled.
- **Typography/color:** brand-led but restrained; strong numeric price treatment.
- **Accessibility/mobile:** large touch targets, no horizontal-scroll traps, RTL-safe category navigation.
- **Customization:** logo, colors, typography pair, media, emphasis level.
- **Why distinct:** speed and density matter more than cinematic imagery.

### Family B — Bakery / Dessert
- **Target:** bakeries, patisserie, dessert shops.
- **Visual personality:** visual, playful, product-forward.
- **Hierarchy:** hero/brand story → signature items → category discovery → product gallery.
- **Density:** medium.
- **Navigation:** scrollable category chips with persistent access.
- **Product pattern:** image-led card with name, description, and price.
- **Image strategy:** strong image coverage; portrait/square crops with graceful fallback.
- **CTA:** featured item emphasis and add-to-order.
- **Typography/color:** expressive display type paired with highly readable body text.
- **Accessibility/mobile:** preserve text readability over images; reduced-motion fallback.
- **Customization:** accent palette, image treatment, badge style, type scale.
- **Why distinct:** visual appetite appeal is central, but it still needs fast scanning.

### Family C — Fast Casual / QSR
- **Target:** burger, pizza, chicken, shawarma, casual quick-service concepts.
- **Visual personality:** bold, direct, energetic.
- **Hierarchy:** brand → high-value categories → best sellers → dense product cards → persistent ordering action.
- **Density:** high.
- **Navigation:** sticky compact navigation and fast category switching.
- **Product pattern:** information-dense horizontal or compact card.
- **Image strategy:** optional but high-value for best sellers.
- **CTA:** prominent order/add action with clear price.
- **Typography/color:** high contrast and strong weight hierarchy.
- **Accessibility/mobile:** immediate price/action visibility, no tiny secondary text.
- **Customization:** brand colors, CTA treatment, card density within bounded ranges.
- **Why distinct:** conversion speed and scanability dominate.

### Family D — Contemporary Restaurant
- **Target:** casual dining, modern restaurants, multi-category concepts.
- **Visual personality:** polished editorial hospitality.
- **Hierarchy:** brand/identity → categories → signature dishes → detailed item content.
- **Density:** medium.
- **Navigation:** sticky or scroll category navigation depending on menu length.
- **Product pattern:** editorial horizontal card with optional media.
- **Image strategy:** balanced; images support signature items without dominating the entire menu.
- **CTA:** contextual item action; ordering remains visible but secondary to discovery when appropriate.
- **Typography/color:** refined hierarchy with controlled brand expression.
- **Accessibility/mobile:** predictable reading order and robust long-text handling.
- **Customization:** type, color, corner language, media ratio within family limits.
- **Why distinct:** balances storytelling and practical scanning.

### Family E — Fine Dining / Hotel / Hospitality
- **Target:** fine dining, hotel restaurants, lounges, premium hospitality.
- **Visual personality:** restrained, immersive, luxurious.
- **Hierarchy:** identity/story → signature categories → detailed dishes → dietary/allergen/nutrition context.
- **Density:** low to medium.
- **Navigation:** calm persistent category navigation; avoid overly app-like chrome.
- **Product pattern:** editorial detail card with generous spacing.
- **Image strategy:** selective cinematic imagery; never force images for every item.
- **CTA:** reservations/contact/ordering only where configured; avoid distracting conversion UI.
- **Typography/color:** sophisticated contrast and measured scale.
- **Accessibility/mobile:** contrast must remain valid despite dark/premium treatments; focus states must stay visible.
- **Customization:** palette, type scale, media, logo placement, header treatment within safe limits.
- **Why distinct:** hospitality storytelling and restraint outweigh catalog density.

### Family F — Small Menu / Food Truck / Single-Concept
- **Target:** food trucks, pop-ups, small cafes, focused concepts, seasonal counters.
- **Visual personality:** immediate, branded, utilitarian with personality.
- **Hierarchy:** identity → short category set → signature products → order/contact.
- **Density:** low.
- **Navigation:** minimal; categories may become simple anchors.
- **Product pattern:** large clear cards or list rows depending on item count.
- **Image strategy:** hero/signature-first.
- **CTA:** immediate order/contact/location action.
- **Typography/color:** strong brand signal with minimal UI chrome.
- **Accessibility/mobile:** minimal interaction depth; critical actions reachable without scrolling excessively.
- **Customization:** brand mark, colors, hero media, CTA priority.
- **Why distinct:** a small catalog should not look like a scaled-down enterprise menu.

## 5. Shared Design-System Foundations

- **PROPOSED:** Keep a shared semantic token layer for color, typography, spacing, radii, elevation, motion, focus, and surface states.
- **PROPOSED:** Add semantic menu primitives: `MenuHeader`, `MenuCategoryNav`, `MenuSection`, `MenuItemCard`, `MenuItemMedia`, `MenuPrice`, `MenuBadge`, `MenuItemDetails`, `MenuActionBar`.
- **PROPOSED:** Separate content/data concerns from presentation components.
- **PROPOSED:** Define bounded variants rather than exposing arbitrary CSS knobs.
- **PROPOSED:** Keep theme selection backwards compatible with the current `ThemeKey` values while introducing a family-level abstraction underneath.
- **PROPOSED:** Keep current `PublicMenu` as the canonical content contract unless an evidence-backed missing field is discovered.

## 6. Template-Specific Variations

Templates may vary in:
- header composition
- category navigation
- section rhythm
- product card geometry
- image prominence
- price emphasis
- featured-item treatment
- CTA placement
- background/surface treatment
- density
- typography scale

Templates should not vary in:
- tenant ownership or data access
- authorization
- menu data semantics
- ordering validation
- price calculation rules
- availability truth
- accessibility fundamentals
- locale/RTL correctness
- security boundaries

## 7. Data Requirements

- **VERIFIED:** Current `PublicMenu` already supplies tenant/branch, hours, categories, products, variants, modifier groups/options, dietary labels, allergens, calories, availability, featured state, bilingual content, and branding fields.
- **PROPOSED:** Treat these as optional content signals so templates degrade gracefully when data is sparse.
- **PROPOSED:** Do not add schema fields solely to make a visual effect possible; first determine whether existing content can express the requirement.
- **UNKNOWN:** Whether future families require a genuinely missing content field. Prove this with the first vertical template before proposing migrations.

## 8. Customization Boundaries

- **PROPOSED:** Allow controlled brand customization: logo, primary/accent colors, type pairing from an approved set, image treatment, and selected layout options exposed by family.
- **PROPOSED:** Do not expose arbitrary spacing, font-size, card geometry, contrast, or animation values.
- **PROPOSED:** Every customization must remain inside an accessibility and layout-safe envelope.

## 9. Mobile, Responsive, and RTL Behavior

- **VERIFIED:** The current product is mobile-first and uses Arabic-first content with RTL support.
- **PROPOSED:** Every family gets a mobile-first layout specification before desktop enhancement.
- **PROPOSED:** Category navigation must remain reachable without trapping horizontal scroll.
- **PROPOSED:** Cards must survive long Arabic and English names, long descriptions, missing images, and multi-line prices.
- **PROPOSED:** Logical CSS properties should be preferred over physical left/right positioning for RTL-safe layout.
- **PROPOSED:** Reduced-motion behavior must remain respected.

## 10. Accessibility Requirements

- **PROPOSED:** Use semantic HTML first; use ARIA only where required.
- **PROPOSED:** Every interactive control must have an accessible name and visible focus state.
- **PROPOSED:** Dialogs, category navigation, option selectors, and ordering controls must preserve keyboard/focus behavior.
- **PROPOSED:** Do not encode essential meaning using color alone.
- **PROPOSED:** Validate contrast and touch-target usability for every family.
- **VERIFIED (external):** Radix and WAI-ARIA guidance reinforce focus management, labels, keyboard navigation, and semantic interaction patterns.

## 11. Performance Requirements

- **PROPOSED:** Avoid large decorative DOM structures that do not improve menu comprehension.
- **PROPOSED:** Below-fold product images should remain lazy-loaded; critical hero imagery should not be lazy-loaded by default.
- **PROPOSED:** Preserve explicit image ratios to reduce layout shift.
- **PROPOSED:** Prefer CSS and existing dependencies over animation libraries or new runtime dependencies.
- **VERIFIED (external):** web.dev recommends lazy loading below-fold images and prioritizing genuinely critical imagery.

## 12. SEO and Social Sharing

- **VERIFIED:** The repository contains an `src/lib/og/` area and public menu routes.
- **PROPOSED:** Templates should expose stable document metadata, canonical menu URLs, useful social previews, and meaningful headings without changing the underlying menu identity.
- **UNKNOWN:** Current production metadata quality for every public menu route; validate during implementation.

## 13. Analytics and Conversion

- **VERIFIED:** The product already records public menu events including visits, product views, QR scans, and WhatsApp interactions.
- **PROPOSED:** Template analytics should reuse these existing event semantics rather than inventing per-template metrics.
- **PROPOSED:** Evaluate conversion through existing actions: category discovery, product views, ordering/cart activity, WhatsApp clicks, and branch interactions.

## 14. Testing and Visual Regression Strategy

- **PROPOSED:** Add deterministic template fixtures using realistic restaurant content in Arabic and English.
- **PROPOSED:** Test sparse, dense, long-text, no-image, mixed-image-ratio, unavailable-item, modifier-heavy, and multi-branch cases.
- **PROPOSED:** Add screenshot regression coverage with Playwright if the existing repository tooling supports a stable browser harness.
- **PROPOSED:** Test at representative mobile and desktop widths and RTL/LTR modes.
- **PROPOSED:** Keep the existing themes as regression baselines until a replacement passes acceptance criteria.
- **UNKNOWN:** Exact existing screenshot-regression infrastructure; verify before adding new tooling.

## 15. Migration Strategy

- **PROPOSED:** Introduce the new template architecture beside the current renderer.
- **PROPOSED:** Keep existing `ThemeKey` values valid during migration.
- **PROPOSED:** Route one flagship family through the new renderer first.
- **PROPOSED:** Preserve the current renderer as a compatibility fallback until the replacement is verified.
- **PROPOSED:** Migrate existing theme keys to family implementations deliberately; do not delete legacy keys in the first rollout.

## 16. Rollback Strategy

- **PROPOSED:** Keep the current renderer and existing theme keys available behind the same public contract.
- **PROPOSED:** If a new family fails visual, accessibility, performance, or data-compatibility checks, revert its renderer mapping without touching menu data.
- **PROPOSED:** Avoid irreversible database migrations for presentation work.

## 17. Out of Scope

- **PROPOSED:** No payment-provider redesign.
- **PROPOSED:** No new ordering backend.
- **PROPOSED:** No replacement of authentication or authorization.
- **PROPOSED:** No new CMS or menu data model unless the first vertical template proves a missing requirement.
- **PROPOSED:** No broad dependency replacement.
- **PROPOSED:** No redesign of unrelated Studio/Admin surfaces during the template initiative.

## 18. Open Decisions

- **OPEN DECISION:** Exact implementation boundary between `ThemeDefinition` and a future template renderer registry.
- **OPEN DECISION:** Whether the first flagship family should be `Contemporary Restaurant` or `Specialty Coffee`; select from implementation evidence and the fastest safe vertical slice.
- **OPEN DECISION:** Whether screenshot regression can reuse existing Playwright setup or requires a small dedicated harness.
- **UNKNOWN:** Production menu traffic distribution by restaurant type; this should inform later family prioritization if analytics data becomes available.

## 19. Acceptance Criteria

The template ecosystem will be considered production-ready only when:

1. A single canonical menu data contract renders through genuinely distinct family structures.
2. Existing published menus remain renderable throughout migration.
3. At least one flagship family passes realistic Arabic/English mobile and desktop checks.
4. Long text, sparse data, missing images, modifiers, availability, and dietary metadata do not break layout.
5. RTL/LTR, keyboard access, focus, labels, and reduced motion are verified.
6. Critical images and below-fold images follow the performance strategy.
7. Visual regression coverage exists for the flagship family before expanding to additional families.
8. Theme selection and preview remain deterministic.
9. No template can bypass tenant isolation, authorization, availability, or pricing semantics.
10. Existing legacy themes have an explicit compatibility/rollback path until replacements are proven.

## 20. Current Recommendation

- **PROPOSED:** Do not start by adding more CSS themes.
- **PROPOSED:** First build the reusable template-rendering contract and one flagship family on top of the existing `PublicMenu` data model.
- **PROPOSED:** The first implementation should prove that a genuinely different structure can coexist with the current renderer without changing data or public routing.
- **CONFIDENCE:** High for the architectural direction; medium for the exact first family until visual/manual validation is performed.
