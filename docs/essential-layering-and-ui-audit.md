# Essential Layering and UI Audit

## Scope
- Theme: `essential`
- Template family: `small-menu`
- Renderer: `src/components/public-menu.tsx`
- Audit date: 2026-09-05

## Evidence state
- `VERIFIED`: the previous incident was traced to duplicate presentation ownership and client-only theme-token timing; the stabilization commit moved theme identity into the document head and removed route-level duplicate shell ownership.
- `VERIFIED`: the shared action dock is `z-40`; product dialog is `z-[50]`; cart drawer is `z-[60]`; success dialog is `z-[70]`.
- `VERIFIED`: Essential CSS now reserves bottom document space and accounts for `env(safe-area-inset-bottom)` for the fixed dock.
- `UNKNOWN`: real-device paint timing, Opera rendering, and console output until CI/browser evidence is inspected.

## Documented z-index ownership
| Layer | Owner | Priority | Rule |
| --- | --- | ---: | --- |
| Base document | theme/root | 0 | Never creates an overlay stacking context for customer content. |
| Header/hero | `PublicMenuView` | flow | Decorative image is behind content; it never receives input. |
| Branch navigation | `PublicMenuView` | flow | Normal document layer. |
| Sticky search/category bar | `PublicMenuView` | 20 | Stays above scrolling menu content, below dialogs/action dock. |
| Customer action dock | `PublicMenuView` | 40 | Fixed, safe-area aware, never used in owner preview. |
| Product details dialog | `ProductSheet` | 50 | Above customer dock and page content. |
| Cart drawer | `CartDrawer` | 60 | Above product/page layers. |
| Success dialog | `PublicMenuView` | 70 | Top customer interaction layer. |

## Stacking-context audit
- Essential hero intentionally uses `isolation: isolate` so the cover image cannot escape its component; this is a local visual boundary, not a global overlay trap.
- Essential does not introduce fixed pseudo-element masks over the page.
- The fixed customer action dock is a direct child of the public shell and owns its documented layer.
- No arbitrary `z-index: 9999` is used for Essential.
- Existing dialogs remain responsible for their own priority rather than being moved into theme CSS.

## Fixed/sticky collision rules
1. Sticky search/category controls remain at `z-20`.
2. The action dock remains at `z-40`.
3. Main content reserves at least `8.25rem + safe-area-inset-bottom` of bottom space; desktop Essential reserves slightly more.
4. The action dock uses `bottom: max(0.75rem, env(safe-area-inset-bottom, 0px))`.
5. Product/cart/success dialogs remain above the dock.
6. Essential section anchors use `scroll-margin-top` so sticky navigation does not hide headings.

## Browser safe-area strategy
The dock and document clearance use CSS environment variables rather than browser sniffing. `safe-area-inset-bottom` is a user-agent-provided safe-area measurement intended to prevent content from being obscured by device UI or display cutouts. This is consistent with MDN guidance. See `docs/design-research-log.md` for the source record.

## Focus visibility
- Important controls use `:focus-visible` outlines with the Essential accent.
- The fixed dock must not fully obscure a focused product/category control.
- This directly addresses WCAG 2.2 focus-not-obscured and target-size concerns.

## Overlay checklist
- [x] Hero decorative layer is non-interactive.
- [x] Sticky search/category has documented priority.
- [x] Action dock has documented priority and safe-area clearance.
- [x] Product dialog is above action dock.
- [x] Cart drawer is above product dialog.
- [x] Success dialog is above cart drawer.
- [x] Owner preview does not render the customer action dock.
- [x] No arbitrary high z-index values introduced.
- [x] No new global stacking context added to the public page.
- [ ] Real-device browser overlap verification — `UNKNOWN` / `BLOCKED` in current environment.

## Regression scenarios
1. Scroll from top to bottom with categories and action dock visible.
2. Focus a final product control near the bottom of the page.
3. Open product details from a bottom-of-page item.
4. Open an empty cart.
5. Open a populated cart.
6. Submit an order and display success dialog.
7. Open the virtual keyboard while search is focused.
8. Rotate/narrow viewport around 320–360 CSS px.
9. Use RTL and LTR.
10. Load the route with and without configured WhatsApp/map/phone data.
11. Load the page with a missing hero image and missing product images.
12. Load the route in an owner preview where customer action dock must be absent.

## Closure rule
Do not call the layering audit `CLOSED` until browser evidence confirms that the documented priority and clearance rules match rendered behavior on the supported target devices/browsers.
