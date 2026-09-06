# Heritage and Gallery Theme Audit

## Status
- Task: Comprehensive Audit & Design Intelligence Pass — Heritage + Gallery
- Date: 2026-09-06
- Status: AUDIT COMPLETE / IMPLEMENTATION NOT STARTED
- Source of truth: `main`
- Browser/device visual execution: UNKNOWN in the current agent environment

## Scope
This audit covers the remaining two public-menu themes before material implementation. It intentionally does not reopen Essential, Editorial, or Noir, and it does not change database, authentication, ordering, routing, or deployment behavior.

## Repository evidence
### Heritage
- `ThemeKey`: `heritage`
- Family: `contemporary-restaurant`
- Direction: contemporary Arabic hospitality; material/pattern inspired without ornament overload.
- Layout metadata: hero header, list product grid, horizontal product card, scroll category navigation, landscape image ratio.
- Capabilities: image-first, featured composition, decorative surfaces, motion.
- Current source has no dedicated `theme-heritage.css` file; Heritage currently relies on registry tokens and the shared `contemporary-restaurant` presentation layer.
- This means Heritage is not yet a distinct finished visual system; its identity is presently mostly token-level.

### Gallery
- `ThemeKey`: `gallery`
- Family: `bakery-dessert`
- Direction: image-led premium catalogue.
- Layout metadata: standard header, gallery grid, vertical product card, scroll category navigation, portrait image ratio.
- Capabilities: image-first, featured composition, decorative surfaces, motion.
- Current source has no dedicated `theme-gallery.css` file; Gallery currently relies on registry tokens and the shared `bakery-dessert` presentation layer.
- This means Gallery is not yet a distinct finished visual system; its identity is presently mostly token-level.

### Shared architecture
- The theme registry is the authoritative mapping from theme key to template family and visual tokens.
- Shared public-menu behavior owns search, category navigation, product details, modifiers, cart/order behavior, language handling, and configured customer actions.
- Theme work must remain presentation-scoped and must not duplicate shared business behavior.
- Existing incident memory explicitly warns against duplicate shells, broad descendant selectors, arbitrary stacking fixes, and animation-dependent visibility.

## Key findings
### H-01 — Heritage lacks a distinct presentation layer
- Severity: HIGH
- Status: VERIFIED
- Evidence: registry defines Heritage as a separate theme, but no dedicated Heritage stylesheet exists; it maps directly to the contemporary restaurant family.
- Risk: the theme can feel like a recolored Editorial/Contemporary experience rather than a genuinely differentiated Arabic/Saudi hospitality option.
- Required direction: add a scoped Heritage presentation layer while preserving the existing template and shared interactions.

### H-02 — Heritage must avoid ornamental overload
- Severity: HIGH
- Status: PROPOSED
- Direction: use restrained material cues—paper, stone, woven/pattern references, warm metal/wood accents, and controlled geometric rhythm—rather than repeated decorative motifs or full-screen ornament.
- Acceptance: menu information remains the dominant scan path; decorative elements never compete with names, prices, categories, or actions.

### H-03 — Arabic typography is a primary design system constraint
- Severity: HIGH
- Status: VERIFIED / PROPOSED
- W3C Arabic layout guidance requires deliberate RTL/bidi handling and supports logical `start`/`end` layout rather than hard-coded left/right assumptions. Arabic also mixes naturally with Latin tokens and numbers.
- Required direction: Heritage must use logical CSS, deliberate Arabic line-height, mixed-direction resilience, and stable price alignment.

### H-04 — Heritage category navigation should remain reachable
- Severity: HIGH
- Status: VERIFIED
- Registry specifies scroll navigation. Shared category behavior already exists.
- Required direction: refine the visual treatment of the scroll rail without replacing the navigation logic or creating a second navigation system.

### G-01 — Gallery lacks a distinct presentation layer
- Severity: HIGH
- Status: VERIFIED
- Evidence: registry defines Gallery as `bakery-dessert` with gallery-grid/vertical-card metadata, but no dedicated Gallery stylesheet exists.
- Risk: the image-first promise is not sufficiently expressed as a finished visual system.
- Required direction: add a scoped Gallery presentation layer around the existing bakery template and shared renderer.

### G-02 — Gallery must make imagery the hero without sacrificing utility
- Severity: HIGH
- Status: PROPOSED
- Image-first layouts must preserve stable image boxes, clear prices, category discovery, and readable product names.
- Required direction: use a disciplined image grid, stable aspect ratios, restrained text overlays, and a clear path into product details.

### G-03 — Gallery needs graceful image failure
- Severity: HIGH
- Status: VERIFIED / PROPOSED
- The permanent checklist requires missing, low-quality, portrait, square, landscape, and varied-ratio media states.
- Required direction: every gallery cell needs a stable fallback and must remain useful without an image.

### G-04 — Gallery density must be controlled on mobile
- Severity: HIGH
- Status: PROPOSED
- A catalogue can become visually dense when every item is image-dominant.
- Required direction: prioritize one-hand scanning, predictable vertical rhythm, readable product names/prices, and category escape routes.

## Shared requirements for both themes
1. Preserve the existing `PublicMenuView` and customer-action semantics.
2. No new checkout/payment/booking behavior.
3. No duplicate public-menu shell.
4. Use scoped selectors under `html[data-menu-theme="heritage"]` or `html[data-menu-theme="gallery"]`.
5. Prefer logical properties (`margin-inline`, `padding-inline`, `inset-inline-*`) for RTL/LTR compatibility.
6. Avoid unnecessary stacking contexts, `isolation`, viewport-filling child layers, and arbitrary z-index escalation.
7. Preserve safe-area clearance for fixed actions.
8. Test Arabic RTL, English LTR, and mixed-direction content.
9. Test long names, long categories, varied SAR prices, missing descriptions, and varied image ratios.
10. Respect reduced motion and avoid decorative animation that blocks visibility or interaction.

## Research evidence
### W3C — Arabic & Persian Layout Requirements
- Source: https://www.w3.org/International/alreq/
- Access date: 2026-09-06
- VERIFIED finding: Arabic is RTL at the page/layout level, while numbers and embedded LTR content require bidi-aware handling; Arabic line breaking and alignment have script-specific requirements.
- Transferable principle: do not treat Arabic as a mirrored English layout; preserve explicit direction and logical layout semantics.
- Relevance: both Heritage and Gallery.
- Limitation: W3C guidance does not prescribe restaurant visual composition.
- Confidence: HIGH
- Must not copy: no proprietary design.

### W3C — Internationalization guidance
- Source: https://www.w3.org/TR/international-specs/
- Access date: 2026-09-06
- VERIFIED finding: individual text runs need determinable language/direction, and bidirectional content needs explicit handling where context changes.
- Transferable principle: mixed Arabic/Latin names, prices, phone numbers, and labels must be treated as structured bidi content rather than accidental text flow.
- Relevance: product cards, prices, category labels, and action controls.
- Limitation: specification guidance does not replace browser/device verification.
- Confidence: HIGH
- Must not copy: no proprietary implementation.

### Toast — digital menu design guidance
- Source: https://pos.toasttab.com/blog/on-the-line/digital-menu
- Access date: 2026-09-06
- VERIFIED finding: clear categories, readable layouts, useful descriptions, and visible prices are core digital-menu fundamentals; ongoing testing and performance review matter.
- Transferable principle: visual differentiation must not reduce menu comprehension or ordering confidence.
- Relevance: Gallery and Heritage information hierarchy.
- Limitation: vendor guidance, not independent usability research.
- Confidence: MEDIUM-HIGH
- Must not copy: no proprietary layout or branding.

### Saudi/MENA market examples
- Sources: https://alqaima.com/ar ; https://nasjmenu.sa/ ; https://tablegreet.com/en-sa
- Access date: 2026-09-06
- VERIFIED finding: Saudi/MENA menu products emphasize QR-first mobile entry, Arabic/English support, imagery, SAR pricing, category discovery, and direct supported actions.
- Transferable principle: Saudi visual identity should sit on top of a fast, readable mobile menu rather than replace its utility.
- Relevance: Heritage positioning and Gallery's image-first catalogue promise.
- Limitation: public vendor positioning is not controlled customer research.
- Confidence: MEDIUM
- Must not copy: no layouts, assets, copy, branding, or code.

## Design decision
The next implementation should be **two scoped presentation layers**, not two new templates:

### Heritage
- Material: warm parchment/stone base, dark ink, restrained terracotta/bronze accent.
- Typography: Arabic-first display hierarchy with generous line-height; English remains coherent.
- Header: controlled hero with identity and branch context; no oversized decorative cover that delays the menu.
- Categories: tactile scroll rail with clear active state.
- Products: horizontal cards with stable landscape media and strong price separation.
- Decoration: subtle geometric/material cues only where they reinforce identity.

### Gallery
- Material: clean gallery canvas with editorial warmth and restrained borders.
- Header: compact identity block; reach the visual catalogue quickly.
- Categories: scrollable discovery rail.
- Products: portrait image-led grid with consistent media boxes and readable text below/alongside.
- Featured: stronger image scale, but never at the cost of category/product discoverability.
- Failure state: image fallback must remain visually intentional.

## Implementation boundary
The next task may modify only the smallest set of theme presentation files required to express these systems. It must not change schema, auth, routing, customer-action logic, or shared ordering semantics unless a concrete regression is discovered and separately scoped.

## Browser evidence limitation
No interactive browser/device surface is available in this session. Therefore actual visual geometry, browser paint behavior, mixed-direction rendering, safe-area behavior, and post-hydration console state remain UNKNOWN and must be verified after implementation using the repository browser harness or an available interactive browser/device surface.
