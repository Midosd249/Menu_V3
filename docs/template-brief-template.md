# Template Brief Template

Use this document before implementing or materially redesigning a template or public-menu presentation. Keep the brief presentation-focused and compatible with the existing menu data/business contract.

## Identity
- Template / family:
- Supported `ThemeKey`:
- Target restaurant concept:
- Primary visual promise:
- Evidence/research references:

## Customer and conversion intent
- Primary action:
- Secondary action:
- Conversion goal:
- Critical information that must be visible without decoration:

## Content and language
- Default language:
- Arabic RTL behavior:
- English LTR behavior:
- Mixed-direction text handling:
- Sample content style and language:
- Long-text behavior:

## Layout and hierarchy
- First-screen composition:
- Header/identity treatment:
- Category navigation pattern:
- Section rhythm:
- Product-card pattern:
- Image prominence and ratio rules:
- Price emphasis:
- Featured-item treatment:
- Density target:

## Interaction hierarchy
- Primary interactive controls:
- Secondary interactive controls:
- Icon usage rules:
- Visible-label requirements:
- Accessible-name requirements:
- Focus and keyboard behavior:
- Feedback/loading/error behavior:

## Cart and ordering
- Cart visibility rule: show only when ordering is enabled and the repository exposes the required behavior.
- Cart placement:
- Cart count/badge behavior:
- Add-to-cart feedback:
- Quantity/modifier editing:
- Empty/error/unavailable behavior:
- Checkout/payment: only describe if verified as implemented.

## Contact and location actions
### WhatsApp
- Visibility rule: only with a verified business WhatsApp action.
- Placement:
- Label/accessibility:
- Mobile/desktop behavior:
- Privacy constraints:

### Phone
- Visibility rule: only with a verified phone number.
- Placement:
- Label/accessibility:
- Mobile behavior:

### Map / location
- Visibility rule: only with a verified destination.
- Branch labeling:
- External-link behavior:

## Mobile safe-area behavior
- Bottom fixed/sticky controls:
- Safe-area handling:
- One-handed reachability:
- Sticky category behavior:
- Modal/bottom-sheet behavior:
- Browser UI/keyboard collision avoidance:

## Real-data resilience
- Long restaurant/category/item names:
- Missing descriptions:
- Missing/low-quality images:
- Mixed image ratios:
- Long prices/SAR formatting:
- Sold-out items:
- Modifiers/variants:
- Few/many categories:
- Few/many products:
- One/multiple branches:
- Loading/empty/error/offline states:

## Visual audit acceptance criteria
- No clipping, overlap, obscured text, broken hierarchy, or accidental horizontal traps.
- Restaurant identity and first-screen purpose are immediately understandable.
- Arabic and English layouts remain intentional and readable.
- Decorative effects never dominate or obscure content.
- Sticky/fixed/modal layers never cover important content or controls.
- Theme personality is coherent with the target concept and sample content.
- Real-data stress cases remain visually stable.

## Functional audit acceptance criteria
- Every interactive control has an obvious purpose and meaningful accessible name.
- Important mobile controls meet the touch-target baseline.
- Core actions work in normal, empty, loading, error, disabled, and unavailable states where relevant.
- Cart/order behavior is preserved and not implied beyond verified repository capability.
- WhatsApp/phone/map actions appear only when their verified data exists.
- Search/category navigation remains reachable and predictable.
- RTL/LTR behavior is correct.
- Analytics reuse existing privacy-safe event semantics only.

## SEO and performance acceptance criteria
- Public metadata and canonical identity remain accurate.
- Structured data contains only verified page/business facts.
- Critical media is prioritized appropriately; below-fold media remains lazy-loaded where appropriate.
- Image dimensions/aspect ratios minimize layout shift.
- Effects do not introduce unnecessary runtime cost or dependencies.

## Verification plan
- Source-level tests:
- Functional tests:
- Browser/device checks:
- Required screenshots:
- Viewports:
- RTL/LTR evidence:
- Real-data fixtures:
- Performance evidence:
- SEO evidence:
- Known UNKNOWN/BLOCKED items:

## Change boundary
- Do not change menu data semantics, authorization, tenant/branch isolation, ordering validation, pricing truth, availability truth, or security boundaries to achieve a visual result.
- Do not add a customer-facing action unless repository capabilities and the approved product task explicitly support it.
