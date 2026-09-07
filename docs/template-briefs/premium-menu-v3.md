# Premium Menu V3 — Design Brief

## Discovery and evidence
- Template / family: Premium Menu V3 / `contemporary-restaurant` presentation family, reused only for the existing interaction/data contract.
- Supported `ThemeKey`: `premium-menu-v3` (PROPOSED until registry implementation is verified).
- Current route(s): `/m/$slug`, `/m/$slug/$branch`, `/themes/preview`, `/studio/preview` through the existing theme controller/preview boundaries.
- Repository evidence reviewed: `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, `docs/agents/design-agent.md`, `docs/design-intelligence.md`, `docs/design-research-log.md`, `docs/template-review-checklist.md`, `docs/template-brief-template.md`, `docs/project-memory/problems-learned.md`, theme registry/types, public menu route, theme controller, public renderer, and contemporary restaurant template.
- Material public/market sources: W3C/WCAG principles already recorded in repository research; current Saudi/MENA QR-menu patterns reviewed from TableGreet, Tappya, T-Gate, Qayema, and TableQR.
- Evidence labels: `VERIFIED` / `INFERRED` / `PROPOSED` / `UNKNOWN` / `BLOCKED`.

## Segment and business intent
- Target restaurant segment: premium casual, contemporary Saudi, fine dining, hotel dining, elevated cafés, and chef-led concepts.
- Saudi-market relevance: Arabic-first QR entry, SAR-first pricing, branch-aware utility, strong food photography, and natural RTL behavior.
- Target customer: guest scanning a QR code on a phone; bilingual local/international diners.
- Business goal: move the guest from discovery to product decision and ordering with minimal cognitive load.
- Primary action: open a product and add it to the order.
- Secondary action: browse categories and view cart; configured WhatsApp/phone/map actions remain secondary and data-driven.
- Conversion goal: `Browse → Product → Options → Quantity → Add to Cart → Cart / Continue browsing`.
- Critical information that must be visible without decoration: restaurant identity, category context, product name, description, availability, price, options, and primary action.

## Visual personality
- Visual promise: a warm, cinematic luxury menu that feels like a digital extension of a premium Saudi dining room.
- Art direction: near-black charcoal canvas, restrained champagne-gold accents, warm ivory type, controlled food photography, soft depth rather than glossy ornament.
- Content/copy tone: confident, concise, hospitality-led; never promotional at the expense of product facts.
- Brand identity treatment: restaurant logo/name remains prominent but never competes with the first useful menu action.
- Rules against generic/copied design: borrow only hierarchy, spacing, image stability, and conversion principles; no proprietary screenshot layout, branding, copy, or assets.

## Content and language
- Default language: Arabic.
- Arabic RTL behavior: native RTL hierarchy; logical spacing/alignment; `bdi`/isolated numeric treatment for prices and mixed Latin tokens.
- English LTR behavior: same information hierarchy with intentional LTR alignment, not a mechanically mirrored layout.
- Mixed-direction text handling: preserve product/category content with logical direction and isolated price/number tokens.
- Sample content style and language: premium restaurant dish names, concise Arabic descriptions, optional English equivalents.
- Long-text behavior: names wrap naturally; descriptions use controlled line lengths without hiding prices or actions; no fixed content heights.
- SAR formatting behavior: reuse existing `formatSar`/`MenuPrice` semantics and keep numeric values isolated from surrounding RTL text.

## Layout and hierarchy
- First-screen composition: compact premium header + short immersive hero + immediate category rail + featured dish treatment; product discovery begins without a large decorative gap.
- Header/identity treatment: restaurant identity, language control, and configured utility actions remain compact and aligned to the current public-menu structure.
- Category navigation pattern: horizontally scrollable, sticky discovery rail; active category uses both contrast and shape/underline cues.
- Section rhythm: generous but measured; no unexplained full-screen gaps.
- Product-card structure: stable rectangular image box, product name, concise description, price, and a clear affordance; cards remain equal in geometry regardless of image source ratio.
- Image prominence and ratio rules: hero may be immersive; product media uses stable `4 / 3` geometry; missing images use a restrained premium fallback surface.
- Price emphasis: champagne-gold/ivory contrast, never hidden below decorative content.
- Featured-item treatment: one lead featured dish plus compact supporting featured items when real `isFeatured` data exists; no fabricated promotions.
- Density target: premium editorial breathing room with enough visible products to support fast QR browsing.
- Decorative-layer constraints: no transform-based card staggering, no oversized ornaments, no pseudo-elements that intercept input, and no full-viewport child layers.

## Interaction hierarchy
- Primary interactive controls: product cards, add-to-cart, quantity controls, required/optional modifiers, cart.
- Secondary interactive controls: category navigation, search, language, branch/contact/location/share actions where configured.
- Icon placement rules: icons clarify actions and stay subordinate to labels; RTL direction follows the semantic action.
- Visible-label requirements: primary product/order actions remain text-labelled on mobile.
- Accessible-name requirements: every icon-only control receives a localized accessible name.
- Touch-target strategy: important controls target approximately 44×44 CSS px where practical; never below the repository/WCAG baseline without an applicable exception.
- Focus and keyboard behavior: preserve the existing dialog semantics and add visible focus styling through the theme layer; do not alter shared ordering logic.
- Feedback/loading/error behavior: theme-specific surfaces for loading, empty, error, unavailable, and success states without changing data semantics.
- Analytics/conversion measurement only when supported: preserve existing `visit`, `qr_scan`, `product_view`, and `whatsapp` event semantics.

## Cart and ordering
- Cart visibility rule: show only when ordering is enabled by the existing renderer/data contract.
- Cart placement: persistent but visually quiet bottom action on mobile; drawer/dialog on activation using existing cart behavior.
- Cart count/badge behavior: preserve current quantity-derived count.
- Add-to-cart feedback: immediate visual confirmation and updated cart count; no invented toast/event contract.
- Quantity/modifier editing: Premium product dialog exposes quantity before confirmation; cart continues to support quantity editing.
- Empty/error/unavailable behavior: explicit empty state, disabled/unavailable states, and existing submit error handling.
- Checkout/payment: only the existing public order submission flow is represented; no payment capability is implied.

## Contact and location actions
- WhatsApp: only when configured; keep it secondary to menu ordering and privacy-safe.
- Phone: only when configured; use existing `tel:` behavior.
- Map / location: only when configured and branch-aware.
- Social: only verified configured links; no decorative empty icons.

## Mobile safe-area behavior
- Bottom fixed/sticky controls: reserve content clearance with `env(safe-area-inset-bottom)` and avoid covering the last product row.
- Safe-area handling: use existing root viewport-fit contract and theme-level bottom padding.
- One-handed reachability: primary cart/action controls remain in the lower reachable zone.
- Sticky category behavior: compact and scrollable; never consumes most of the viewport.
- Modal/bottom-sheet behavior: product details use the existing dialog architecture, styled as a premium full-width mobile sheet and centered desktop dialog.
- Browser UI/keyboard collision avoidance: preserve `dvh`, safe-area padding, and scroll ownership.

## Real-data resilience
- Long restaurant/category/item names: natural wrapping and stable card geometry.
- Missing descriptions: card collapses the missing description space rather than leaving a blank block.
- Missing/low-quality images: premium neutral fallback; no broken-image icon or distorted ratio.
- Mixed image ratios: object-fit inside stable aspect-ratio containers.
- Long prices/SAR formatting: isolated numeric rendering with no clipping.
- Sold-out items: remain visible with explicit unavailable treatment when preview/data contract exposes them.
- Modifiers/variants: support existing variants, required groups, optional groups, price deltas, and validation.
- Few/many categories: same rail remains usable from one category through dense menus.
- Few/many products: no accidental masonry or stretched cards.
- One/multiple branches: preserve existing branch switching and identity.
- Loading/empty/error/offline states: use existing state ownership and style them consistently.

## Visual audit acceptance criteria
- No clipping, overlap, obscured text, broken hierarchy, or accidental horizontal traps.
- Restaurant identity and first-screen purpose are immediately understandable.
- Arabic and English layouts remain intentional and readable.
- Decorative effects never dominate or obscure content.
- Sticky/fixed/modal layers never cover important content or controls.
- Theme personality is coherent with premium Saudi hospitality.
- Real-data stress cases remain visually stable.
- Browser/device visual evidence is required before claiming final visual closure.

## Functional audit acceptance criteria
- Product open/close, modifier selection, quantity, add-to-cart, cart count, and order submission preserve existing contracts.
- Required options block confirmation until valid selections exist.
- No unsupported payment, booking, or contact behavior is introduced.
- RTL/LTR and mixed-direction states remain correct.
- Existing public analytics semantics remain unchanged.

## SEO and performance acceptance criteria
- Public metadata and canonical identity remain unchanged unless required by the existing theme key/route resolution.
- Critical hero media is not unnecessarily lazy-loaded; below-fold product media remains lazy-loaded through existing components.
- Product media keeps stable aspect ratios to reduce layout shift.
- No new dependency is added for visual effects.

## Verification plan
- Source-level tests: registry/theme-key contract, preview rendering contract, Premium stylesheet selector/geometry contract, and product-detail quantity contract.
- Functional tests: product dialog, required modifier validation, quantity changes, add-to-cart, cart count, and existing order submission path.
- Browser/device checks: small/standard/large mobile, tablet, desktop; Arabic RTL, English LTR, mixed-direction data.
- Required screenshots: homepage, category/product grid, product details with modifiers/quantity, cart, missing-image state, long-name state.
- Viewports: 360px, 390px, 430px, tablet, desktop where repository tooling supports them.
- Real-data fixtures: existing preview/seed data plus long Arabic/English names, mixed text, varied SAR prices, image/no-image, modifiers, sold-out, sparse/dense categories.
- Performance evidence: existing performance audit plus image geometry inspection.
- SEO evidence: existing public route/preview metadata contracts.
- Console-error checks: browser/Playwright console review where tooling is available.
- Known UNKNOWN/BLOCKED items: physical-device rendering and production deployment state are not verifiable through the GitHub-only connector; no Vercel deployment will be intentionally triggered for this task.

## Rollback / migration notes
- Reversible files: Premium theme registry/type changes, Premium presentation stylesheet, Premium template enhancement, tests, and documentation.
- Rollback trigger: any regression to an existing theme, public order flow, or shared preview contract.
- Data/schema impact: none.

## Change boundary
- No database/schema/migration changes.
- No auth/authz, subscription, entitlement, tenant/branch isolation, CI/CD, Vercel, environment, or dependency changes.
- Preserve the existing public-menu data/business contract and customer-action semantics.
