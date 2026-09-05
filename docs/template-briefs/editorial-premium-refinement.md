# Editorial Premium Refinement Brief

## Scope
- Actual theme ID: `editorial`
- Theme family: `contemporary-restaurant`
- Public route: `/m/$slug` (with optional `branch`, `lang`, and `theme` search parameters)
- Owner preview route: `/studio/preview?theme=editorial`
- General theme preview route: `/themes/preview?theme=editorial`

## Existing capabilities
- **VERIFIED:** image-led contemporary restaurant layout with search, category navigation, featured products, product details/modifiers, cart/order flow, opening hours, branch navigation, language control, WhatsApp, phone, map, and Instagram actions.
- **VERIFIED:** public data is tenant/branch scoped by the existing `getPublicMenu` query and server-side route.
- **VERIFIED:** theme selection is server-authorized for owner/admin roles by `saveTenantTheme`.
- **VERIFIED:** Arabic is the default public locale; English is selected through the `lang=en` search parameter when the menu has the required English identity data.

## Restaurant segment
- **INFERRED:** modern casual restaurants, bistros, chef-led concepts, premium cafes with a substantial food menu, and Saudi restaurants that want a brand-led menu rather than a delivery-app look.

## Saudi-market relevance
- **INFERRED:** Arabic-first hierarchy, RTL correctness, SAR formatting, branch/location actions, WhatsApp availability, and fast QR scanning are important for a Saudi restaurant menu.
- **PROPOSED:** keep direct contact actions compact and secondary to ordering while preserving immediate location/phone access.

## Customer behavior and conversion
- Primary conversion: **VERIFIED:** add items to the existing order/cart flow when ordering is enabled by the current product behavior.
- Secondary conversions: **VERIFIED:** WhatsApp, phone, map/location, Instagram, branch selection, and product detail discovery.
- **PROPOSED:** first-screen sequence should be brand → branch/status → restrained contact actions → search/categories → featured dishes.

## Editorial visual personality
- **PROPOSED:** `typographic`, `culinary`, `quiet`, `confident`, `image-led`.

## Typography
- **PROPOSED:** Georgia-style editorial display typography for English and IBM Plex Sans Arabic for Arabic/RTL text; body copy stays neutral and readable.
- **PROPOSED:** product names outrank decoration; prices remain visually prominent; descriptions are short and clamped only where necessary.
- Mixed Arabic/English and SAR: **VERIFIED:** all visible values use the existing language-aware text fallback and `formatSar`; **PROPOSED:** use `overflow-wrap:anywhere` for mixed-direction product names and keep prices non-wrapping.

## Hero/header
- **PROPOSED:** use the restaurant cover as a dedicated media layer and the logo as a bounded brand mark. Never treat the logo as the hero background.
- **PROPOSED:** keep hero height below the previous near-full-screen treatment on mobile.
- **VERIFIED:** optional tagline, branch, city, and opening status already exist in the data model.

## Category navigation
- **PROPOSED:** sticky search/category rail with compact pill tabs, horizontally scrollable on small screens, and no scroll-progress dependency.

## Featured composition
- **PROPOSED:** editorial selection section with a controlled lead image on larger screens and a single-column fallback on small screens.

## Product-card system
- **PROPOSED:** stable image + text grid, quiet rules instead of rounded dashboard cards, limited asymmetry only at larger widths, no transform-based stagger that can create clipping or horizontal overflow.

## Image behavior
- **VERIFIED:** `MenuMedia` supports missing-image fallback.
- **PROPOSED:** stable aspect ratios, `object-fit: cover`, restrained filtering, and no layout-dependent scroll animation.

## Content/copy tone
- **PROPOSED:** concise, restaurant-specific, confident, and factual. No placeholder labels such as `Menu`, `Item Name`, or `Lorem Ipsum` in published content.

## Contact/action hierarchy
- **VERIFIED:** current fields are tenant WhatsApp/Instagram and branch maps URL/phone.
- **PROPOSED:** action rail after the hero; ordering/cart remains the primary conversion surface; empty values produce no control.
- **PROPOSED:** external links are HTTPS-only and host-allowlisted; phone/WhatsApp values are normalized before use.

## Cart visibility
- **VERIFIED:** existing Editorial implementation exposes a cart trigger when the cart contains items.
- **PROPOSED:** keep the trigger outside preview mode, fixed above safe-area space, and below dialogs in the documented z-index scale.

## Search/opening hours
- **VERIFIED:** search matches names, descriptions, tags, and dietary labels; opening hours are derived from branch hours.
- **PROPOSED:** search remains immediately reachable below the action/branch context; hours remain near the end of the menu so they do not compete with product discovery.

## Mobile safe-area behavior
- **PROPOSED:** reserve bottom space using `env(safe-area-inset-bottom, 0px)` for fixed cart controls and preserve the Studio mobile navigation outside the public menu shell.

## RTL/LTR
- **VERIFIED:** root document derives `lang`/`dir` from the validated `lang` search parameter and `LangProvider` updates document language/direction on client changes.
- **PROPOSED:** Editorial typography switches display treatment for Arabic and preserves logical spacing/alignment rather than left/right hard-coding.

## Accessibility
- **PROPOSED:** important controls target approximately 44×44 CSS pixels where practical, use accessible names, preserve visible focus, keep focused controls clear of fixed UI, and support Escape to close dialogs.
- **VERIFIED:** existing product/cart dialogs use semantic dialog roles.

## SEO and semantics
- **VERIFIED:** public route generates restaurant metadata, canonical/alternate URLs, and Restaurant structured data from verified menu data.
- **PROPOSED:** preserve the existing route-level SEO implementation and avoid decorative text that is mistaken for semantic content.

## Performance
- **PROPOSED:** stable image geometry, lazy loading below the fold, no scroll-driven animation dependency, restrained blur/backdrop use, and no duplicate public shell.

## Layering
- **PROPOSED:** search/navigation `20` < cart trigger `40` < modal/dialog `60` < critical success dialog `70`. No arbitrary large z-index values.
- **VERIFIED:** preview shell does not introduce a second `menu-public-shell` wrapper.

## Real-data scenarios
1. Arabic-only restaurant and branch.
2. Bilingual restaurant with long Arabic/English names.
3. Mixed-direction product names and SAR values.
4. Long category names and many categories.
5. One, three, and many featured products.
6. Missing cover/logo/product image.
7. Missing descriptions.
8. Sold-out product in owner preview.
9. Product variants/modifiers.
10. One and many branches.
11. No contact data.
12. All valid contact data configured.
13. Invalid map/social URLs.
14. Local Saudi phone/WhatsApp formats.
15. Cart populated/empty and dialog open/closed.
16. Small mobile, standard mobile, large mobile, tablet, desktop.

## Acceptance criteria
- No logo-as-background hijack or oversized/circular clipping.
- No fixed/sticky/overlay overlap in supported states.
- Editorial remains visibly distinct from Essential through composition, typography, rhythm, and image treatment.
- Arabic and English switch correctly when English content is available; unavailable English is explicit rather than fabricated.
- Contact actions appear only from valid configured data.
- Tenant/branch/auth/subscription semantics remain server-controlled.
- Temporary theme testing override is explicit, expiring, and server-only.
- Relevant tests, lint, typecheck, build, performance, and browser evidence are recorded before closure.

## Risks
- Existing layered Editorial CSS previously targeted generic `header`, `img`, `button`, and sticky descendants and could unintentionally restyle logos/dialogs.
- Source-level verification cannot prove real browser paint, device-specific safe-area behavior, or cross-browser typography.
- English content availability is currently based on tenant and branch English identity fields; individual missing translations still use the existing graceful fallback policy.

## Rollback strategy
- Revert the Editorial refinement commit(s) on the working branch, restore the previous `theme-editorial.css`, template, language toggle, and testing-access files, and leave Essential/other theme implementations untouched.
- Disable `MENU_THEME_TESTING_OVERRIDE` or let its required expiry pass before any commercial production launch.
