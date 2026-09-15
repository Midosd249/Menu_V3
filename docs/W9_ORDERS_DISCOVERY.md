# W9 Orders Discovery

Status: `VERIFIED` — 2026-09-15

## Routes and components
- `VERIFIED`: Orders route is `/studio/orders` in `src/routes/studio/orders.tsx`.
- `VERIFIED`: Order data reader and status writer are `getOrdersDashboard` and `updateOrderStatus` in `src/lib/menu/orders.ts`.
- `VERIFIED`: Studio Shell exposes Orders in desktop primary navigation and mobile primary navigation.
- `VERIFIED`: Order Detail is inline on the same route; no separate detail route exists.

## Actual data and status behavior
- `VERIFIED`: `AdminOrder` already exposes order id/number, tenant, restaurant, branch, status, source, customer name/phone/email, notes, currency, subtotal, total, item count, timestamps, item snapshots, quantities, prices, line totals, and selected option snapshots.
- `VERIFIED`: `order_status_events` records transitions, but the current Orders response does not expose that history; W9 does not expand the contract.
- `VERIFIED`: the server path authorizes owner/admin access and accepts the existing six statuses. W9 does not change the status set, persistence path, or authorization.
- `INFERRED`: the existing `ORDER_STATUSES` sequence is the only operational ordering exposed by the current implementation, so W9 uses its next sequential status as the primary action while preserving other currently accepted non-destructive statuses under Change status.

## English-language root cause
- `VERIFIED`: shared `LangToggle` updates the `lang` search parameter and `LangProvider` updates document `lang`/`dir`.
- `VERIFIED`: Orders previously ignored `useLang` and rendered Arabic-only labels/status names, Arabic-only item/option fields, and Arabic-only date/number formatting.
- `FIXED`: Orders now consumes the shared locale state, translates UI/status/action copy, uses English item/option snapshots when available, and applies locale-aware date/number formatting with explicit LTR/bidi handling for IDs, phones, URLs, and SAR values.

## Action audit
- `VERIFIED`: Orders navigation, order selection, refresh, search, status filter, status update, and mobile navigation have real handlers/routes.
- `FIXED`: Arabic ↔ English now updates the current Orders list/detail without losing order context; the selected order id is retained in route search state.
- `FIXED`: mobile detail now has a contact area, one next action, secondary status control, separated cancellation confirmation, readable line items, notes, and total.
- `FIXED`: refresh and Browser Back/Forward preserve or clear selected order context according to the URL state.
- `VERIFIED`: WhatsApp is click-to-chat only and phone is a `tel:` link; neither action claims or performs an outbound action automatically.
- `UNAVAILABLE`: contact actions are absent when a phone cannot be safely normalized.
- `BLOCKED`: production-data permission-denied runtime cannot be exercised safely in this CI task; authorized CI fixture coverage remains the browser boundary.

## Intentionally omitted
- `NOT_IMPLEMENTED`: delivery tracking, driver, ETA, payment state/method, tip, discount, tax, fake call/message history, synthetic customer metrics, or a fabricated order timeline.
- `NOT_IMPLEMENTED`: new backend fields, schema changes, or a new order-detail route.
