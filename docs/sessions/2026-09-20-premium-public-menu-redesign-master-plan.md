# Premium Public Menu Redesign — Master Execution Plan

## Status
- Status: IMPLEMENTATION_IN_PROGRESS — owner authorized execution on 2026-09-20.
- Repository: Midosd249/Menu_V3.
- Canonical branch: main.
- Verified baseline HEAD: 6544be33126b13501b15b483ec56e997eaa44117.
- Current visual baseline: Editorial Canvas.
- Decision: do not patch Canvas again. The next visual implementation is a clean presentation-system replacement.
- This document is the continuity source for the redesign. A new chat must read it before implementation.

## Concept: SIGNAL TABLE
SIGNAL TABLE treats the public menu as a premium hospitality interface rather than a decorated card grid. It combines refined hospitality, modern product-interface clarity, Arabic-first typography, restrained wayfinding, strong food imagery, calm surfaces, deliberate whitespace, compact controls, and strong hierarchy.

It must be unmistakably different from Editorial, Atelier, Canvas, Noir, Heritage/Taste, and Gallery. It is not another CSS restyle of the same card geometry.

## Hard Constraint: No Numbered Menu Products
Menu products must never display numbers.

Do not render:
- 01 / 02 / 03 product prefixes
- numbered badges
- product sequence counters
- CSS counters for products
- decorative issue numbers
- numeric category prefixes
- pseudo-elements that introduce product numbering

Categories use their real names only. No artificial numeric index is part of the new design.

## Product and Architecture Contract
The redesign is presentation-first and must preserve:
- tenant isolation and branch isolation
- server-side authorization
- public-menu routes and locale routing
- canonical URLs and SEO/discovery
- menu loading and category filtering
- search and availability
- product details and modifiers/options
- Quick Add rules and Item Notes
- cart and ordering
- analytics/event semantics
- configured restaurant actions
- QR/share/print behavior
- Studio/Owner contracts
- Better Auth
- Supabase/PostgreSQL/RLS
- subscriptions/entitlements

Never move trust decisions to the client to simplify presentation.

## Experience Structure

### Restaurant Header
Compact identity layer with configured logo/mark, restaurant name, supported availability state, configured map/location action, language control where supported, search, and cart/order entry. Avoid icon-heavy toolbars.

### Signature Stage
A compact first-screen food/identity feature, not a giant marketing hero. Use real configured data only:
- featured product when valid
- image when available
- product name
- short description
- price
- availability
- clear action

If no valid featured item exists, fall back to restaurant identity and menu orientation. Never invent dishes, prices, promotions, ratings, claims, or images.

### Cuisine Rail
Category navigation based only on real category names. Mobile uses a controlled horizontal rail with an obvious active state. Desktop may use compact horizontal or leading-side navigation based on actual renderer constraints. No numeric labels and no multi-layer stacking maze.

### Menu Stream
The core menu is a Menu Stream, not a generic repeated card grid.

Each product unit has:
- stable media region
- name
- description
- price
- availability
- action

Required implementation:
- min-width: 0 where needed
- stable media aspect ratio
- intentional object-fit
- logical CSS properties for direction-aware spacing
- explicit mixed-direction handling
- price isolated from title wrapping
- natural word wrapping
- no character-level breaking
- no accidental vertical writing
- no fixed height around unpredictable Arabic
- no overflow hiding to conceal defects

### Featured Product Treatments
Use Signature / Featured / Standard as presentation levels only, not new data states. Missing images must not break geometry.

### Product Detail
Mobile: one focused bottom-sheet/detail surface, safe-area aware, clear dismissal, image/name/description/price/availability, modifiers/options, quantity, notes, add/update action.
Desktop: side panel or focused detail region with the same hierarchy and shared business logic.
Do not stack normal configuration modals.

### Order Bar
When cart has items, use one persistent Order Bar instead of a floating bubble. Example: 3 items · 128 SAR · View order. Keep copy and currency data-driven.

The bar must reserve document space, respect safe areas, remain reachable, never cover content, use one controlled stacking layer, and reflect real cart state.

### Cart
Preserve existing semantics. Make items, quantities, options/notes, totals, primary order action, empty state, and error state obvious. No decorative complexity.

### Search
Quiet utility when idle, focused surface when active. Preserve current search behavior, category/product semantics, analytics, loading/empty/error states, and user context.

## Typography
Initial candidates:
- Arabic/UI: Readex Pro
- Arabic display candidate: Alexandria
- English display accent: Playfair Display

These are PROPOSED only. Before adoption, inspect existing font loading, glyph coverage, Arabic shaping, weights, licensing, and performance. Prefer an existing repository-safe font when it can deliver the required result.

Rules:
- comfortable Arabic body text
- display typography only for controlled short headings
- natural wrapping for long names
- no aggressive Arabic letter-spacing
- no fake Arabic italics
- no forced uppercase on Arabic
- mixed Arabic/English remains readable
- price remains independent from title width

MDN documents text-wrap: balance and text-wrap: pretty; use selectively after browser/performance verification.

## Color Tokens
Initial proposal:
- Porcelain #F7F5F0
- Deep Navy #101827
- Cobalt #315BFF
- Warm Signal #F0A43C
- Soft Gray #E5E7EA
- Muted Ink #667085

Validate contrast for normal/large text, controls, focus, selected category, availability, image overlays, order bar, and disabled states. WCAG 2.2 requires 4.5:1 for normal text and 3:1 for large text under SC 1.4.3.

## Shape and Material Language
Avoid generic SaaS rounded cards and excessive luxury ornament. Prefer controlled radii, thin borders, restrained shadows, strong alignment, occasional edge-to-edge media, and one or two signature shape motifs. Every visual detail must earn its place.

## RTL / LTR / Mixed Direction
Arabic is primary. Test Arabic-only, English-only, mixed name/description pairs, Arabic with Latin brand names, prices, modifiers, and long category labels.

Prefer:
- padding-inline
- margin-inline
- inset-inline
- border-inline
- inline-size
- block-size

Do not duplicate whole layouts to solve RTL.

## Responsive Composition
Primary mobile widths: 360, 375, 390, 412, 430.
Tablet: 768, 834.
Desktop: 1024, 1280, 1440.

Mobile is the primary design target. Desktop must be a deliberate composition, not a stretched mobile column.

## Imagery
Use repository-owned, configured tenant, or explicitly approved generated assets. Every image needs stable dimensions, appropriate loading, graceful missing-image behavior, and appropriate alt behavior. No hardcoded customer/menu data. No heavy video, WebGL, parallax, or carousel dependency.

## Motion
Use subtle 120–180ms transitions where useful, opacity/transform changes, detail-sheet transitions, category feedback, and reduced-motion support. Never make visibility depend on scroll progress, animation completion, or timeouts.

## Accessibility
Acceptance includes keyboard access, visible focus, logical focus order, accessible names, adequate targets/spacing, contrast, reduced motion, focus not hidden by fixed UI, readable zoom/reflow, and semantic headings/landmarks.

WCAG 2.2 SC 2.5.8 defines a 24×24 CSS pixel minimum target size with exceptions. Apple HIG emphasizes safe areas, hierarchy, spacing, and comfortable control placement.

## Architecture Decision Process
Before editing:
- inspect ThemeRenderer
- inspect active theme registry
- inspect Editorial Canvas owner
- inspect ContemporaryRestaurantTemplate and shared public-menu contracts
- inspect tests/imports/CSS
- inspect docs/project-memory/problems-learned.md

Choose the smallest safe owner:
- scoped replacement inside the existing renderer, or
- a new scoped presentation owner registered through existing theme architecture

Do not create parallel public-menu architecture, duplicate data loading, duplicate cart/order logic, duplicate analytics, or a new auth/data architecture.

## Legacy Retirement
After the new presentation is proven:
- remove obsolete Canvas presentation ownership
- remove genuinely dead Editorial/Atelier presentation remnants
- remove dead selectors/imports
- update/remove tests only when they assert retired presentation behavior
- retain shared functionality tests
- leave one clear presentation owner

Do not add another CSS compatibility stack.

## Connected Tools Registry
Routing registry: docs/connected-tools-registry.md
Verified at documentation time on branch: docs/connected-tools-registry-2026-09-20

If the registry is not on main in a future session, inspect that exact branch/file. Do not invent tool availability.

Relevant routing:
- GitHub: repository source of truth, history, branches, PRs, diffs, CI
- Exa / Parallel Search: external research when repository evidence is insufficient
- UIAudit: UX, hierarchy, mobile, RTL/LTR, typography, accessibility, states
- DesignSystem: tokens and consistency
- WebMockup: visual exploration before implementation
- Color Designer / AI Color Picker: controlled palette exploration
- Font Pairing: Arabic/English typography; verify license/runtime cost
- Polish: final refinement after correctness
- Review: final code/UX/security/regression review
- QRCM: QR-specific work only
- Agent Ready / Grow My Website: SEO/crawler checks only when relevant
- AppDeploy / Replit / Base44 / WebsitePublisher: isolated prototypes only, never production architecture

Use the smallest relevant set. Unknown cost/capability is UNKNOWN, not free. Record every tool actually used with purpose, evidence, cost status, result, and implementation impact.

## Research Basis
Repository evidence:
- main is 6544be33126b13501b15b483ec56e997eaa44117
- PR #223 is the current Canvas baseline
- recent visual work repeatedly addressed Arabic wrapping, overflow, card geometry, stacking, and fixed controls
- project memory records these recurring presentation-layer risks
- automated browser/CI evidence does not replace physical-device evidence

External sources:
- MDN logical properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values
- MDN text-wrap: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Apple HIG Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- Apple HIG Modality: https://developer.apple.com/design/human-interface-guidelines/modality
- Apple HIG Designing for iOS: https://developer.apple.com/design/human-interface-guidelines/designing-for-ios/
- Baymard 2026 Food Delivery & Takeout UX Benchmark: https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026
- Baymard Food Delivery & Takeout research: https://baymard.com/research/online-food-delivery

Research is directional. Do not copy competitor branding, code, copy, assets, or exact layouts.

## Execution Phases

### Phase A — Repository Baseline and Design Freeze
Verify main SHA, recent history, relevant PRs, AGENTS.md, PROJECT_STATE.md, PLAN.md, TASKS.md, SESSION_PROTOCOL.md, README.md, master-execution-plan, automatic-specialist-routing, agent-registry, research-connected-tools-agent, project memory, connected-tools registry, ThemeRenderer, theme registry, Canvas owner, public-menu contracts, tests, and CSS.
Deliverable: exact file map, architecture entry point, deletion map, regression surface.

### Phase B — Design Contract
Create/update the template/design brief and lock palette, typography, spacing, radius, borders, shadows, imagery, Signature Stage, Cuisine Rail, Menu Stream, detail, Order Bar, cart, search, states, RTL/LTR, responsive behavior, motion, accessibility, and the no-numbering rule.
Deliverable: one coherent visual contract.

### Phase C — Presentation Architecture
Choose the smallest safe presentation owner from code evidence. Document protected behavior and deletion candidates before editing.

### Phase D — Remove Old Visual System
After Phase C is proven, remove/replace Canvas presentation, remove dead presentation remnants/selectors/imports, update contracts, and preserve shared behavior.
Deliverable: one presentation owner, no dead visual architecture.

### Phase E — Build SIGNAL TABLE
Implement header, Signature Stage, Cuisine Rail, Menu Stream, featured treatment, product detail, search, Order Bar, cart, empty/error/unavailable/missing-image states, desktop composition, mobile composition, and RTL/LTR adaptation.
No unrelated features.

### Phase F — Arabic Stress Pass
Stress very long/short Arabic names, English names, mixed-direction content, long descriptions, price lengths, missing/slow images, unavailable products, modifiers, notes, sparse/dense categories, and long restaurant/category names.
Required: no vertical character collapse, title/price collision, clipping, hidden action, unexpected horizontal scroll, or fixed-control overlap.

### Phase G — Visual QA
Run 360/375/390/412/430 mobile, 768/834 tablet, and 1024/1280/1440 desktop with Arabic RTL, English LTR, mixed direction, sparse/dense data, image-rich/missing images, availability, cart states, detail states, search states, category selection, and safe-area/fixed-order behavior.

### Phase H — Functional Regression
Verify QR entry, public menu loading, categories, search, product details, modifiers/options, Quick Add, Item Notes, cart, order submission, configured restaurant actions, language switching, analytics, tenant/branch boundaries, canonical URLs, and SEO/discovery where touched.

### Phase I — Accessibility and Performance
Run applicable typecheck, tests, platform tests, lint, build, Playwright/browser QA, accessibility, performance, image-loading, responsive/reflow, and reduced-motion checks. Review contrast, focus, targets, safe areas, CLS, font loading, CSS size, dead assets, duplicate selectors, and unnecessary dependencies.

### Phase J — Final Review and Release Gate
Review the complete diff and verify every changed line belongs to the task. Inspect dead CSS, duplicated architecture, hardcoded tenant data, protected-boundary changes, giant z-index, overflow masking, animation-dependent visibility, and accidental numbering.
Run GitHub Quality and W9 Orders browser gates, resolve review threads, and form one coherent release batch. Do not use Vercel as a design iteration loop. Production deployment is separate and requires direct evidence.

## Acceptance Criteria
All must be true:
- visually distinct from Canvas, Editorial, Atelier, Noir, Heritage/Taste, Gallery
- no numbered products, counters, numeric category prefixes, or CSS-generated product numbers
- Arabic-first and RTL-safe
- English LTR-safe
- mixed-direction safe
- no one-character-per-line Arabic failure
- no title/price collision
- no clipping
- no hidden content under fixed controls
- no duplicate visual architecture
- no giant z-index hacks
- no scroll-driven visibility
- no invented customer/menu data
- no backend/database/auth/RLS/tenant-isolation regression
- search/categories/details/options/Quick Add/Item Notes/cart/order/analytics/QR/share/print/configured actions remain correct
- responsive/accessibility/performance evidence is recorded
- final diff reviewed
- continuity updated
- exactly one next task recorded

## Protected Boundaries
Do not casually change Better Auth, Supabase/PostgreSQL, RLS, tenant/branch isolation, subscriptions/entitlements, pricing, orders, analytics semantics, SEO/discovery, public routes, or Vercel release policy.
If a protected boundary must change, stop that sub-scope and record BLOCKED instead of silently widening the task.

## Failure Patterns to Avoid
- patching another CSS layer over Canvas
- multiple presentation owners
- overflow:hidden as a visual fix
- huge z-index values
- fixed heights for unpredictable Arabic
- price trapped inside title geometry
- physical left/right CSS in RTL-sensitive layout
- decorative numbering
- hardcoded demo tenant/product content
- client-side trust assumptions
- scroll-dependent visibility
- multiple overlapping fixed controls
- prototype output treated as production architecture
- Vercel used as visual iteration loop
- mockups/screenshots treated as device proof
- automated browser QA treated as physical-device proof

## New-Chat Continuity Contract
A new chat must:
- read this document first
- verify main before implementation
- read AGENTS.md, PROJECT_STATE.md, PLAN.md, TASKS.md, SESSION_PROTOCOL.md, README.md and relevant docs
- inspect project memory
- inspect the current renderer/theme registry
- inspect the connected-tools registry branch/file
- treat Canvas as historical baseline, not a patch target
- not ask the owner to restate the plan
- not create a second design concept
- proceed through authorized phases without unnecessary pauses
- stop only for a genuine hard blocker or an owner decision that cannot safely be inferred
- update continuity before stopping
- record exactly one next task

## Authorization State
Current state: AUTHORIZED / IMPLEMENTATION_IN_PROGRESS

The owner explicitly authorized implementation on 2026-09-20. The master plan plus the owner's execution prompt define the task boundary; no further direction confirmation is required.

## Execution Evidence
- Main baseline verified: `6544be33126b13501b15b483ec56e997eaa44117`.
- A scoped SIGNAL TABLE presentation owner is being introduced through the existing `ThemeRenderer` / `contemporary-restaurant` family boundary.
- Canvas is being retired rather than patched.
- Product/category numbering is explicitly removed from the new presentation contract.
- Font pairing and palette tools were used only for validation of the proposed typography/palette; no paid/unknown-cost service was used.

## Exact Next Action
Review GitHub Quality run #2160 and W9 Orders QA run #403 to completion, resolve any failures, then perform the final diff/release gate for PR #226.


## 2026-09-21 — Mobile Card Remediation Closeout

- VERIFIED: SIGNAL TABLE implementation is merged into canonical `main` at `dd8db716d0170543590b875f15e3dec99d8cba4c`.
- VERIFIED: PR #227 resolved the recurring mobile product-card failure structurally rather than by adding another overlay/patch layer.
- VERIFIED: shared legacy `theme-price-consistency.css` generic card rules were excluded from the SIGNAL TABLE `editorial` compatibility key; SIGNAL TABLE's scoped stylesheet is authoritative for its card geometry.
- VERIFIED: product-card contract is fixed 92px media + protected text column + title → description → price + in-flow actions.
- VERIFIED: PR Quality, W9 Orders QA, and main Quality #2187 passed; browser QA covered all themes and the full responsive matrix.
- VERIFIED: no SIGNAL TABLE numbering/counter implementation remains.
- UNKNOWN: physical Android/iOS and QR/device evidence; standalone local `check:auth`.
- Deployment: NOT_REQUESTED / NOT_PERFORMED.

### Current State

Implementation: **DONE / MERGED / VERIFIED**
Canonical main: **`dd8db716d0170543590b875f15e3dec99d8cba4c`**
Next task: **Physical Android/iOS public-menu QA only; do not begin another redesign automatically.**
