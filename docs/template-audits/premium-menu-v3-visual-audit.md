# Premium Menu V3 — Visual / Functional Audit

## Reference analysis
- `VERIFIED`: Reference 1 is a premium mobile menu homepage with dark warm surfaces, centered brand identity, food-led hero, compact category discovery, featured dishes, strong prices, and a persistent lower action/navigation area.
- `VERIFIED`: Reference 2 is a product-details state with large food media, product facts, selectable options, quantity/order intent, and a strong add action.
- `INFERRED`: the references prioritize visual appetite and conversion, but their decorative density and fixed-screen composition should not be copied literally.
- `PROPOSED`: Premium Menu V3 keeps the same hospitality intent while simplifying decoration, stabilizing geometry, and strengthening information hierarchy.

## Visual checklist
| Area | Target | Status |
|---|---|---|
| Canvas | Near-black warm charcoal | `VERIFIED` in theme CSS |
| Accent | Restrained champagne gold | `VERIFIED` in theme registry/CSS |
| Text | Warm ivory, muted secondary | `VERIFIED` in theme registry/CSS |
| Hero | Immersive but capped | `VERIFIED` in theme CSS |
| Categories | Compact/sticky and tactile | `VERIFIED` in theme CSS |
| Featured | Clear lead item, controlled support items | `VERIFIED` in theme CSS |
| Product media | Stable `4 / 3` | `VERIFIED` in theme CSS |
| Long names | Natural wrapping | `VERIFIED` in theme CSS |
| Missing images | Premium neutral surface | `VERIFIED` in theme CSS |
| Price hierarchy | Gold/ivory emphasis | `VERIFIED` in theme CSS |
| Product details | Unified dark/gold surface | `VERIFIED` in theme CSS |
| Fixed actions | Safe-area aware | `VERIFIED` in theme CSS |
| Focus | Visible premium accent outline | `VERIFIED` in theme CSS |
| Reduced motion | Motion reduction path | `VERIFIED` in theme CSS |

## Functional checklist
- `VERIFIED`: existing product variants, modifier groups, required selections, price deltas, add-to-cart, cart quantity editing, order submission, and configured public actions remain owned by the existing renderer.
- `INFERRED`: exact pre-add quantity control inside product details is not currently exposed by the reused renderer; this is the only material interaction gap against the strongest interpretation of Reference 2.
- `UNKNOWN`: browser confirmation of every interaction on Premium Menu V3.

## Real-data checklist
- `VERIFIED`: CSS rules explicitly account for long Arabic/English names and descriptions, mixed image ratios, missing media, sticky/fixed controls, and safe-area padding.
- `UNKNOWN`: final rendered behavior for 360/390/430px, tablet, desktop, and physical iOS/Android devices until browser QA runs.

## Compatibility checklist
- `VERIFIED`: no shared theme stylesheet was edited.
- `VERIFIED`: no data/schema/auth/authz/entitlement/subscription/tenant/branch logic was edited.
- `VERIFIED`: no dependency was added.
- `VERIFIED`: existing five theme keys remain present; only the theme catalog test expectations were extended for the new explicit sixth theme requested by this task.

## Release gate
- `BLOCKED`: no final visual sign-off is claimed until browser/device QA is executed.
- `BLOCKED`: no production deployment is claimed; the feature branch has no successful workflow evidence in the available connector environment, and the visible Vercel status on the head commit is a rate-limit failure rather than a deployment result.
