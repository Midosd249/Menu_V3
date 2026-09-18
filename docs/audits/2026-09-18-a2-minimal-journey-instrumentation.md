# A.2 — Minimal Journey Instrumentation

## Status
- Status: DONE / IMPLEMENTATION COMPLETE / VERIFIED BY CI
- Date: 2026-09-18
- Baseline main: `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27`
- Final branch head: `fb3b27218fcd8f732b0a2472ff72b2420e067b02`
- Branch: `feat/a2-minimal-journey-instrumentation-2026-09-18`
- PR: #191 — OPEN / DRAFT
- Scope: minimal journey instrumentation only.

## Objective
Close the A.1 P0 measurement gaps for search, category selection, and add-to-cart without creating a second analytics system or changing order attribution, themes, auth/RLS, or deployment behavior.

## Implemented

### Canonical event contract
`EventType` now includes:
- `visit`
- `product_view`
- `qr_scan`
- `whatsapp`
- `search`
- `category_view`
- `add_to_cart`

### Persistence
- Reused `menu_events` as the only analytics stream.
- Added nullable `category_id` with a foreign key to `categories(id)` and `ON DELETE SET NULL`.
- Added an index for tenant/category/time access.
- Extended the event-type constraint to the new events.
- Existing experiment fields remain unchanged.

### Server-side validation
- `product_view` and `add_to_cart` require a product owned by the resolved tenant.
- `category_view` requires an active category owned by the resolved tenant.
- Tenant continues to resolve from the active published slug.
- Branch continues to resolve within the tenant.
- No client-supplied tenant identity is trusted.

### Measurement behavior
- `search`: emitted when a non-preview public menu receives its first non-empty search query for the mounted session; server-side duplicate protection limits repeat search events to one per tenant/session/event type within 30 minutes.
- `category_view`: emitted for explicit category selections other than `all`; category ID is persisted.
- `add_to_cart`: emitted when an existing public add-to-cart action actually adds/increments a product in the local cart.
- Preview mode does not emit the new customer events.

### Public renderer coverage
Instrumented:
- `PublicMenuView`
- `TasteTemplate` / Heritage
- `ContemporaryRestaurantTemplate` / Editorial
- `SpecialtyCafeTemplate`
- `FastCasualTemplate`

No renderer architecture was replaced.

## Regression coverage
Updated `src/lib/menu/analytics-integrity.test.ts` to verify:
- the new event contract;
- category ownership validation;
- product ownership validation for product view/add-to-cart;
- search duplicate protection;
- migration schema support;
- all active public renderer families emit the three new event types.

## Verification
- VERIFIED: GitHub Quality run `35340567488` passed.
  - route generation: PASS
  - generated route-tree check: PASS
  - typecheck: PASS
  - full repository tests: PASS
  - W7.4–W7.10 contract checks: PASS
  - lint: PASS
  - production build: PASS
  - public all-theme browser QA: PASS
  - Studio browser QA: PASS
  - Platform Admin browser QA: PASS
- VERIFIED: W9 Orders QA run `35340567487` passed, including browser QA.
- VERIFIED: final branch head is `fb3b27218fcd8f732b0a2472ff72b2420e067b02`.
- VERIFIED: final PR diff contains A.1 continuity/audit records plus the A.2 implementation.
- NOT RUN LOCALLY: local test/typecheck/build/browser commands were not available through the GitHub connector environment; GitHub CI is the direct execution evidence.
- NOT DEPLOYED: no merge to `main` and no production deployment occurred.

## Explicitly unchanged
- Order/session attribution.
- Cart-open measurement.
- RLS/security-advisor remediation.
- Themes and public-menu architecture.
- Owner Analytics, Growth, Reports, R2–R9, and R6 experiment semantics.
- Synthetic traffic.
- Production deployment.

## Remaining gaps
- Authoritative anonymous session → order attribution is still missing.
- `menu_events.session_id` remains nullable at the database layer; this contract mismatch was not widened into A.2.
- Cart-open/review measurement remains a P1 decision.
- Six live RLS-disabled tables remain a separate security/data task.

## Exact next task
A.3 — Server-Controlled Anonymous Session → Order Attribution Design. Design only; no implementation until explicitly authorized.
