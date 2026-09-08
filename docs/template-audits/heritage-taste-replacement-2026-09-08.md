# Heritage → Taste Replacement — 2026-09-08

## Request classification
- Public-menu visual/theme replacement.
- The user explicitly authorized retiring the former Heritage visual direction and using the provided Canva-inspired restaurant-menu reference as its replacement.

## Evidence
- **VERIFIED:** canonical repository is `Midosd249/Menu_V3` on `main`; implementation branch is `feat/replace-heritage-with-canva-menu`.
- **VERIFIED:** the theme system has exactly five canonical keys: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** the shared public renderer is `src/components/public-menu.tsx` and already owns product details/options, cart, ordering, language, customer actions, and public-menu behavior.
- **VERIFIED:** `PublicMenu` already contains tenant, branch/branches, hours, categories, products, product options, imagery, availability, allergens, tags, dietary labels, and calories.
- **VERIFIED:** the reference supplied by the user describes a restaurant-menu journey with brand header, hero image, language/search/cart utilities, sticky categories, search/filtering, featured content, menu cards, information/action areas, allergy information, and cart drawer.
- **UNKNOWN:** direct browser inspection of the supplied Canva URL was unavailable in this connector session; the implementation therefore uses the user-provided HTML/Tailwind structure as reference, not a claimed live visual inspection.

## Design decision
- **VERIFIED:** keep the canonical `heritage` theme key to preserve the five-theme architecture and existing persisted theme references.
- **VERIFIED:** retire the former Heritage visual identity and rename its user-facing label to `مذاق` / `Taste`.
- **PROPOSED:** treat `Taste` as the modern Arabic-first restaurant presentation: large photographic hero, restrained neutral canvas, warm accent, rounded utility controls, sticky discovery/search rail, image-led product cards, strong product/price hierarchy, and centered premium customer actions.
- No database, authentication, authorization, entitlement, tenant isolation, branch isolation, ordering, or analytics logic was changed.

## Implementation
- Replaced the active `src/theme-heritage.css` presentation layer with the Taste visual system.
- Removed the retired Heritage cascade-layer imports from `src/routes/__root.tsx` so historical Heritage hardening/cascade CSS cannot participate in rendering.
- Updated the `heritage` registry definition to the `Taste` identity and matching tokens/layout capabilities.
- Updated `tests/heritage-browser-hardening.test.mjs` to protect the replacement contract instead of the retired visual rules.

## Visual contract
- Arabic RTL and English LTR remain owned by the shared document/renderer.
- Product name, description, price, availability, and action remain separate and readable.
- Prices remain isolated with LTR/bidi-safe presentation.
- Images use stable aspect-ratio containers and `object-fit: cover`.
- Sticky discovery/search controls remain reachable without introducing arbitrary z-index escalation.
- Responsive layouts cover small mobile, standard mobile, tablet, and desktop through scoped media rules.
- Reduced-motion behavior remains explicitly respected.

## Verification
- **VERIFIED:** branch writes completed for registry, root stylesheet imports, replacement stylesheet, and replacement tests.
- **UNKNOWN:** local typecheck/lint/test/build and browser/device visual QA have not been executed by this connector session.
- **UNKNOWN:** QR-camera scanning on a physical device remains unobserved.
- No Vercel deployment was intentionally triggered.

## Remaining risk
- The repository still contains historical Heritage-specific CSS files that are no longer imported by `src/routes/__root.tsx`; physical deletion requires the repository file-delete operation with the exact current blob SHA, which was not exposed by the available read response in this session.
- The replacement should not be considered browser-verified until the normal local/browser/device quality gate is run.
