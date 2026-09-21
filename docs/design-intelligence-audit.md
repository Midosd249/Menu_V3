# Menu V3 — Design Intelligence Audit

## Status
- Status: IN_PROGRESS.
- Scope: supplemental design intelligence and competitive research performed while authenticated browser/device QA is blocked.
- Repository source of truth: `main`.
- Existing five-theme system remains protected.
- Deep Research task is running externally; final synthesis is pending its report.

## Research standard
Findings are labeled `VERIFIED`, `INFERRED`, `PROPOSED`, or `UNKNOWN`. External products are used for transferable principles only; proprietary layouts, copy, assets, screenshots, and source code must not be copied.

## 1. Repository and current design direction

### VERIFIED
- Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant restaurant/cafe digital-menu SaaS.
- The repository defines five protected visual systems: Essential, Editorial, Noir, Heritage, and Gallery.
- The existing design system explicitly prioritizes Arabic RTL, mobile-first behavior, legibility, restaurant identity, restrained motion, accessibility, and performance.
- The existing Canva brand-direction document independently reinforces a premium hospitality direction based on restrained editorial layout, generous whitespace, warm neutral paper surfaces, deep ink, muted terracotta, strong Arabic hierarchy, and operational clarity.
- Shared public-menu behavior owns search, categories, product details, modifiers, cart/order, language handling, and configured customer actions. Theme work should therefore remain presentation-scoped unless evidence proves a shared behavior defect.

### INFERRED
The strongest current strategic position is not "another QR menu". It is a premium Arabic-first restaurant presence system: live menu + branded web presence + operational control + local discoverability, with the menu remaining the highest-frequency customer surface.

## 2. Saudi/MENA competitive signals

### VERIFIED
- Nasj Menu positions around QR menus, dine-in ordering, waiter calls, reservations, analytics, bilingual RTL presentation, and hospitality operations. Source: https://nasjmenu.sa/
- Jaicome positions around a restaurant management platform with a branded website, digital menu, theme selection, multiple channels, analytics, and Saudi regulatory compliance. Source: https://www.jaicome.sa/en/menu/
- TableQR positions around managed Saudi digital menus, Arabic/English, SFDA-related labeling, QR access, and service-assisted setup. Source: https://tableqr.co/digital-menu/saudi-arabia/
- Menulisa positions around Arabic-first multilingual menus, VAT-aware pricing, branches, QR ordering, and connected restaurant operations. Source: https://menulisa.com/sa
- Qayema positions around Arabic-first bilingual menu creation from photos/PDFs, AI-assisted setup, and live analytics. Source: https://www.qayema.com/
- TSHKIL positions around a Saudi restaurant-owned website + QR menu + direct ordering proposition, emphasizing zero commission and data ownership. Source: https://tshkil.sa/en
- TheOctopus AI emphasizes native Arabic UI, RTL, Saudi tax fields, QR ordering, and Arabic analytics. Source: https://www.theoctopus-ai.com/en

### INFERRED
The local market is moving beyond "scan a QR to see a menu" toward a bundled promise: branded presence, direct ordering, operational data, compliance/local fit, and ownership of customer/business data. Menu V3 should therefore avoid positioning itself as only a prettier QR menu.

## 3. Global competitive signals

### VERIFIED
- Toast supports customizable restaurant online-ordering pages, custom fonts/colors/images, menu templates, multi-location selection, SEO-optimized menus, direct menu-item links, and customer-facing QR access. Source: https://pos.toasttab.com/products/online-ordering and https://support.toasttab.com/en/article/Getting-Started-with-Toast-Online-Ordering-Pro
- Square treats the menu as a central catalog spanning POS, online ordering, kiosks, delivery channels, locations, availability, and reporting; it supports importing a menu from a file/photo and AI-assisted starter menu creation. Source: https://squareup.com/help/us/en/article/6424-create-menus-with-square-for-restaurants
- Popmenu positions restaurant websites around menu discoverability, SEO/AEO/GEO, individual dish pages, structured data, mobile speed, and conversion to ordering/reservations. Source: https://get.popmenu.com/solutions/website-design

### INFERRED
A competitive Menu V3 website should demonstrate outcomes, not only features. Strong proof should show the restaurant's branded result, the guest journey, and the owner workflow. SEO/local discovery and direct customer actions are increasingly part of the product story rather than secondary marketing claims.

## 4. Arabic/RTL and typography evidence

### VERIFIED
- W3C recommends explicit directional markup and logical bidirectional handling for Arabic/RTL content. Mixed Arabic, Latin text, and numbers are bidirectional and should not be handled as simple mirrored layouts. Source: https://www.w3.org/International/tutorials/bidi-xhtml/
- W3C explicitly notes that direction is a property of scripts, not language, and recommends directional markup rather than relying on language inference. Source: https://www.w3.org/TR/i18n-html-tech-bidi/
- web.dev recommends relative typography sizing, restrained type variation, clear hierarchy, readable grouping, and avoiding ornate/handwritten faces for accessible content. Source: https://web.dev/learn/accessibility/typography
- web.dev notes that web-font loading can affect FCP/LCP and font swapping can cause CLS; font delivery should therefore be performance-aware. Source: https://web.dev/articles/font-best-practices
- IBM Plex officially supports Arabic through IBM Plex Sans Arabic, is open source under OFL, and provides performance-oriented web font files/subsets. Source: https://www.ibm.com/design/language/typography/typeface/ and https://github.com/IBM/plex
- IBM's current design guidance uses an adjusted type scale for Arabic rather than blindly applying the Latin scale. Source: https://www.ibm.com/design/language/typography/type-scale/

### PROPOSED
Shortlist IBM Plex Sans Arabic as a serious candidate for a unified Arabic/Latin product system because it has explicit Arabic support, UI intent, open licensing, and a coherent Latin counterpart. This is a research candidate, not a final font decision. Any change must be tested against existing restaurant themes and real Arabic/English/mixed-direction content.

## 5. Current visual strategy assessment

### VERIFIED
The user's existing Canva brand direction emphasizes:
- restrained editorial composition;
- generous whitespace;
- warm neutral paper surfaces;
- deep ink text;
- muted terracotta accent;
- strong Arabic hierarchy;
- mobile-first owner dashboard;
- tactile hospitality feel;
- clear product information over decorative effects.

### INFERRED
This direction is coherent with the repository's five-theme architecture. The next improvement should be a stronger shared brand/design-system layer, not a sixth visual theme. The five themes can remain differentiated while sharing typography discipline, spacing rhythm, action hierarchy, accessibility behavior, and a recognizable Menu V3 signature.

## 6. High-value design opportunities identified so far

### P0 — Positioning and product storytelling
1. Reframe the marketing narrative from QR menu to a complete branded restaurant presence: live menu + website + direct customer action + operational insight + local discovery.
2. Show the outcome immediately with a real restaurant menu preview rather than a generic SaaS hero.
3. Make Arabic-first differentiation explicit and visible, not buried in feature copy.

### P1 — Public menu conversion layer
1. Make restaurant identity, current availability/open status, category discovery, search, and primary customer action form one predictable first-screen hierarchy.
2. Treat SAR prices and mixed Arabic/Latin content as a first-class bidi test case.
3. Make fixed/sticky actions subordinate to content and reserve safe-area space.
4. Preserve strong image treatment while keeping dish name and price as primary anchors.

### P1 — Owner Studio
1. Make onboarding outcome-oriented: "go live" rather than "configure settings".
2. Make preview/publish state and the public result visible throughout menu editing.
3. Reduce dashboard density by grouping high-frequency actions and using mobile-first task cards.
4. Surface Menu Health, QR, branch state, and local-visibility opportunities as actionable work rather than passive metrics.

### P1 — Brand system
1. Establish shared type tokens and a small semantic color system independent of theme personality.
2. Standardize buttons, focus states, status badges, surfaces, cards, category navigation, fixed actions, dialogs, and empty/loading/error states.
3. Create a recognizable signature motif derived from hospitality/editorial cues rather than generic SaaS gradients, glassmorphism, or excessive decoration.

### P2 — Discoverability
1. Build toward indexable menu/item/branch pages where the data model supports them.
2. Treat local business information and verified restaurant facts as first-class content.
3. Use structured data only where it accurately represents page content.

## 7. Do-not-change list
- Do not rebuild the five-theme architecture.
- Do not replace shared public-menu business logic merely for visual polish.
- Do not introduce a sixth theme before proving a market gap.
- Do not replace restaurant identity with generic SaaS branding.
- Do not use gradients, glassmorphism, oversized decoration, or motion as the primary differentiator.
- Do not weaken RTL/bidi behavior to simplify LTR implementation.
- Do not add customer actions that are not supported by verified restaurant data/capabilities.
- Do not use Vercel deployments for ordinary design iteration.

## 8. Evidence gaps
- `UNKNOWN / BLOCKED`: authenticated real-browser/device visual closure for the five themes.
- `UNKNOWN`: final typography choice until it is compared against the actual current font stack, theme-specific type treatments, real Arabic/English content, and performance measurements.
- `UNKNOWN`: final marketing-site information architecture until the full deep-research report is available.
- `UNKNOWN`: exact conversion priorities without product analytics or controlled user testing.
- `UNKNOWN`: competitor claims that are not independently verified; vendor claims are treated as positioning signals, not user-behavior evidence.

## 9. External research task
A parallel Manus Deep Research task is running with scope covering Saudi/MENA and global competitors, homepage IA, public-menu UX, owner/admin UX, typography, color, design-system direction, accessibility/RTL/performance/SEO, opportunity backlog, and an implementation roadmap. Task reference: `3N3w5oqCXYxbveZRnNZXkT`.

## 10. Next synthesis gate
Do not implement design changes from this interim document alone. First combine the repository evidence, this audit, the deep-research report, and direct browser/device evidence when available. Then create one ranked implementation backlog and execute only the first atomic task.
