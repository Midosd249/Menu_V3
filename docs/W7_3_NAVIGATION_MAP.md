# W7.3 — Studio Navigation Map

Status: DONE / VERIFIED

## Primary desktop

| Workspace | Route | Access | Contextual destinations |
|---|---|---|---|
| Home | `/studio` | Existing Studio access | — |
| Menu | `/studio/menu` | Existing Studio access | Items & categories, Options, Import |
| Orders | `/studio/orders` | Existing Studio access | — |
| Growth | `/studio/growth` | Existing Studio access | Overview, Intelligence, Actions, Analytics |
| Customers | `/studio/guests` | Existing Studio access | Guests & retention |
| Settings | `/studio/settings` | `settings.write` | Branches, Team & Permissions, Appearance, Publishing |

## Existing-route mapping

- Brand → Appearance context (`/studio/brand`)
- Design → Appearance context (`/studio/design`)
- QR → Publishing context (`/studio/qr`)
- Preview → Publishing context (`/studio/preview`)
- Menu Intelligence → Growth context (`/studio/intelligence`)
- Intelligence Actions → Growth context (`/studio/intelligence-actions`)
- Analytics → Growth context (`/studio/analytics`)
- Guests → Customers context (`/studio/guests`)
- Reports remains an existing analytics/reporting route but is intentionally not exposed as Studio navigation because current repository contract tests explicitly require it to stay out of navigation.

## Intentionally omitted as navigation destinations

These concepts were part of the approved IA but do not have standalone routes in the current repository, so W7.3 does not create dead links:
- Restaurant
- Categories as a standalone route
- Loyalty
- Campaigns
- Feedback
- Retention as a standalone route
- Subscription
- Advanced
- Experiments as a standalone route

## Mobile

| Position | Destination |
|---|---|
| 1 | Home `/studio` |
| 2 | Menu `/studio/menu` |
| 3 | Orders `/studio/orders` |
| 4 | Growth `/studio/growth` |
| 5 | More (real permission-filtered destinations) |

## Browser Evidence

`VERIFIED`: GitHub Actions run `34905256209` reached `/studio` directly with the deterministic PGlite fixture and passed the Studio Shell browser test across the required desktop/mobile/tablet matrix, RTL/LTR, active-state, keyboard focus, More/Escape, no-dead-link, Reports exclusion, and overflow checks.

## Platform Admin

`/admin` remains outside the Studio workspace hierarchy and is not included in Studio navigation groups.
