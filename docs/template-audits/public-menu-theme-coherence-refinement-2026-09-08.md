# Public Menu Theme Coherence Refinement — 2026-09-08

## Scope
Focused public-menu presentation refinement across the five protected themes: Essential, Editorial, Noir, Heritage, and Gallery.

No cart architecture, order API, pricing logic, availability logic, modifiers, authentication, authorization, tenant isolation, schema, migrations, or customer-action semantics were changed.

## VERIFIED findings
- The shared public renderer exposes `.public-menu-options-action` as a separate catalogue CTA in addition to the product card/detail entry point.
- Product variants and modifiers are already rendered inside the existing `ProductSheet`; therefore a second catalogue-level options CTA is unnecessary presentation noise.
- Heritage uses the shared `.public-menu-bottom-bar` cart surface but can inherit conflicting theme presentation/positioning layers.
- Noir's footer is a shared semantic surface containing configured restaurant information and opening-hours content; its visual surface must remain consistent with the Noir dark system.
- Gallery has prior evidence of clipping caused by card/wrapper overflow and therefore remains explicitly protected from fixed-height text shells.

## IMPLEMENTED
- Hide `.public-menu-options-action` across all menu themes. Product cards remain the single catalogue entry point and the existing details sheet continues to expose variants/modifiers.
- Normalize product-card text wrappers so variable-length descriptions can grow in normal document flow without a clipping shell.
- Force Heritage's existing cart bottom bar into the same stable bottom/safe-area presentation used by the shared public-menu pattern. No new cart control is created.
- Restore Noir footer/schedule surfaces to the dark Noir visual system without changing opening-hours data.

## Theme matrix
| Theme | Options CTA | Cart | Product text | Notes |
| --- | --- | --- | --- | --- |
| Essential | Hidden | Existing shared behavior | Open flow | No behavioral change |
| Editorial | Hidden | Existing Editorial treatment | Open flow | Editorial identity preserved |
| Noir | Hidden | Existing shared behavior | Open flow | Footer/hours darkened to match Noir |
| Heritage | Hidden | Existing bottom bar, stabilized | Open flow | Bottom safe-area position enforced |
| Gallery | Hidden | Existing shared behavior | Open flow | Builds on border/clipping correction |

## Accessibility / interaction
- Existing product-card/detail interaction remains unchanged.
- Existing `ProductSheet` retains keyboard focus management, Escape handling, focus restoration, and accessible labels.
- No nested interactive element was introduced.
- The existing cart control is preserved; no duplicate cart was added.

## Verification plan
Run the repository quality gates and all-theme Browser Template QA. Physical-device pixels and manual screen-reader output remain UNKNOWN unless directly observed on a real device.
