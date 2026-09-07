# Heritage — Full Visual / Layout / Image / Theme Refinement Audit

## Status
- Theme: `heritage`
- Template family: `contemporary-restaurant`
- Public route: `/m/$slug` and `/m/$slug/$branch`
- Preview route: `/themes/preview?theme=heritage`
- Branch: `feat/heritage-full-refinement`
- Status: IMPLEMENTATION IN PROGRESS / VERIFICATION PENDING
- Scope: Heritage presentation only.

## Evidence legend
- **VERIFIED** — directly confirmed by repository source or supplied screenshot.
- **INFERRED** — derived from verified source/screenshot evidence.
- **PROPOSED** — design recommendation not yet browser-proven.
- **UNKNOWN** — insufficient evidence.
- **BLOCKED** — cannot verify in the current environment.

## Screenshot findings
Supplied evidence is a 695×1536 mobile screenshot. Exact physical device/browser identity is **UNKNOWN**.

### VERIFIED
- The cover image occupies a large, visually dominant upper region before the menu content.
- The restaurant logo renders as a large white rectangular media block instead of a compact brand mark.
- The identity hierarchy is visually diluted by the oversized logo/cover treatment.
- The kicker line containing Arabic menu text, `VOL. 03`, and city information is visually compressed and reads as a single dense line.
- The first-screen composition contains substantial image area before useful menu discovery.
- The visible WhatsApp action sits close to the lower viewport edge and requires safe-area-aware spacing.

### INFERRED
- The large logo is consistent with a shared/generic header-image rule not explicitly neutralized by the Heritage layer.
- The visual imbalance is amplified when the supplied logo asset itself contains a light/white square background.
- Heritage's current identity direction is materially better served by a compact identity block plus restrained material imagery than by a poster-like hero.

## Intended restaurant segment
**VERIFIED / INFERRED:** Arabic-first Saudi/MENA restaurants, cafés, and hospitality businesses seeking a warm, premium, culturally grounded presentation without decorative overload.

## Visual personality
- Warm parchment / stone
- Dark ink
- Restrained terracotta / bronze
- Tactile but quiet category controls
- Material-inspired details rather than repeated ornament

## Content / copy mismatch
**VERIFIED:** the screenshot's `المنيو 03 / VOL. 03 / الرياض` treatment is visually dense. The repository confirms that the same header kicker contains `المنيو`, `VOL. 03`, and `tenant.city`.

**PROPOSED:** preserve the information but separate it into compact semantic pills/runs so Arabic, Latin volume text, and city remain scannable.

## Header / hero findings
### VERIFIED
- The public renderer uses `.editorial-hero`, `.editorial-hero-media`, `.editorial-hero-shade`, `.editorial-hero-inner`, `.editorial-brand-row`, and `.editorial-brand-logo`.
- Existing Heritage CSS did not explicitly bound `.editorial-brand-logo` or isolate it from generic header-image behavior.
- Existing Heritage CSS allowed a large hero treatment and decorative header overlays.

### Refinement decision
- Keep the cover image as a supporting material layer.
- Bound the logo to a compact, predictable square.
- Use `object-fit: contain` for the brand asset.
- Reduce hero height on mobile.
- Strengthen the identity block over the image instead of making the image the dominant content.

## Layout structure
### VERIFIED
- Shared `contemporary-restaurant` owns search, category navigation, featured items, product lists, opening hours, product dialog, cart, and customer actions.
- Heritage is presentation-only and must not duplicate this behavior.

### Refinement decision
- Preserve the shared renderer.
- Stabilize the horizontal product-card scan unit.
- Remove accidental alternating card geometry inherited from the shared premium layer.
- Preserve featured composition but standardize its media geometry.

## Image distribution and balance
### Problems
- **HIGH / VERIFIED:** logo image is visually oversized in supplied evidence.
- **HIGH / VERIFIED:** cover imagery dominates the first screen relative to menu utility.
- **MEDIUM / INFERRED:** mixed source image ratios can make the list feel inconsistent unless the media box remains fixed.

### Refinement
- Hero media: fixed responsive region.
- Brand logo: bounded `contain` box.
- Product media: stable `4 / 3` boxes.
- Featured media: stable `4 / 3` boxes.
- Missing images: retain the existing `MenuMedia` fallback and theme surface rather than introducing content logic.

## Typography / alignment
- **VERIFIED:** Arabic is the default public locale and the root sets `dir="rtl"` for Arabic.
- **PROPOSED:** use logical layout and explicit bidi isolation for Latin volume text and SAR values.
- **PROPOSED:** maintain generous Arabic line-height while reducing headline scale enough to keep the first screen useful.

## Pricing / SAR
**VERIFIED:** pricing is rendered through `MenuPrice` in the shared template and should remain untouched by this presentation refinement.

**Refinement:** Heritage styles keep prices LTR/bidi-isolated so SAR values do not reorder inside RTL text.

## Icons and actions
**VERIFIED:** `PublicActionLinks` is the shared owner of WhatsApp, location, phone, and Instagram actions when configured.

**Refinement:** no action semantics are changed. Visual spacing remains subordinate to the identity/menu scan path and safe-area clearance is preserved.

## Cart / order
**VERIFIED:** the shared contemporary template supports product details, variants/modifiers, cart, and public ordering.

**Boundary:** no ordering or checkout logic is modified.

## Arabic RTL / English LTR
- Arabic: explicit RTL document direction; logical inline properties used in the hardening layer.
- English: the same structure remains usable in LTR.
- Mixed content: `VOL. 03` and price presentation are explicitly bidi-isolated.

## Browser background / initial flash
**UNKNOWN:** supplied screenshot does not prove an initial theme flash or browser background mismatch. No timing-based workaround is introduced.

## Root causes verified
1. **VERIFIED:** Heritage CSS did not explicitly isolate/bound the brand logo class even though the renderer gives it a dedicated class.
2. **VERIFIED:** shared Heritage premium rules introduced alternating card radii; the Heritage hardening layer must neutralize that geometry for stable scanning.
3. **INFERRED:** the screenshot's oversized logo results from generic image presentation interacting with an unconstrained brand asset.

## Real-data audit matrix
| Scenario | Status | Acceptance |
|---|---|---|
| Arabic-only | PROPOSED | No clipping/overlap; stable hierarchy |
| English-only | PROPOSED | LTR remains coherent |
| Bilingual | PROPOSED | Explicit bidi-safe runs |
| Long names | PROPOSED | Wrap without overflow |
| Mixed direction | PROPOSED | Isolated numeric/Latin runs |
| Varied SAR prices | PROPOSED | Stable price alignment |
| Missing image | PROPOSED | Premium fallback, stable geometry |
| Portrait/square/landscape images | PROPOSED | Fixed media box |
| Missing description | PROPOSED | Card remains balanced |
| Sold-out items | PROPOSED | Existing availability semantics preserved |
| One/many categories | PROPOSED | Stable category rail and list |
| Minimal/large menu | PROPOSED | No broken grid or spacing collapse |
| Loading/empty/error/offline | UNKNOWN | Must remain owned by existing shared renderer |

## Acceptance criteria
- Logo remains bounded and never behaves as hero media.
- Mobile hero is compact enough to expose menu utility early.
- Product cards share one predictable geometry.
- Featured cards share one predictable media geometry.
- No intentional change to ordering, actions, data, auth, routing, or deployment.
- RTL/LTR and mixed-direction numeric text remain stable.
- Reduced motion remains supported.
- Relevant tests, lint, typecheck, build, and browser QA pass.
- No regression in Essential, Editorial, Noir, or Gallery.

## Test plan
1. `npm test`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`
5. `npm run qa:template <preview-url> --all-themes` where environment permits.
6. Browser QA at small/standard/large mobile, tablet, and desktop.
7. Inspect RTL/LTR, long names, mixed images, prices, actions, product dialog, and cart.
8. Review final diff and verify only Heritage presentation/test/documentation changes remain.

## Rollback plan
Revert the Heritage hardening layer, its stylesheet import, its regression test registration, and the Heritage audit/state documentation commits. Do not revert unrelated project history.

## Verification state
- Repository inspection: **VERIFIED**.
- Screenshot evidence review: **VERIFIED**.
- Browser pixel verification after implementation: **UNKNOWN** until a browser run against this branch completes.
- Production deployment: **NOT DEPLOYED intentionally**.
