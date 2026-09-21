# A.1 — Customer Journey & Event Truth Audit

## Status
- Status: DONE / AUDIT-ONLY
- Date: 2026-09-18
- Baseline main: c3afb623559ea1d6e015a5abeb6a59ebc26a4f27
- Scope: current-state audit only. No runtime code, schema migration, UI redesign, deployment, or analytics rewrite.

## Verified current state
- Canonical main is c3afb623559ea1d6e015a5abeb6a59ebc26a4f27.
- Supabase project ublxptcqefujkbeepylc is ACTIVE_HEALTHY.
- menu_v3.menu_events currently contains 314 rows across visit, qr_scan, product_view and whatsapp.
- Event counts: visit 131, qr_scan 21, product_view 161, whatsapp 1.
- Distinct sessions: visit 54, qr_scan 10, product_view 25, whatsapp 1.
- Tenant/branch consistency query returned 0 invalid event rows.
- Live orders contain 6 historical rows: 2 cancelled, 1 completed, 1 confirmed, 1 new, 1 preparing. All 6 are linked to guest profiles.
- orders has no anonymous session_id. Event-session → order linkage is therefore not directly persisted.

## Journey map

| Step | Current state | Classification |
|---|---|---|
| Public menu entry | Published tenant + active branch resolution exists | VERIFIED |
| QR entry | src=qr records qr_scan | VERIFIED |
| Anonymous session | getGuestSessionId() uses first-party localStorage | VERIFIED |
| Search | Client-side filtering exists | VERIFIED |
| Search measurement | No canonical persisted search event | MISSING |
| Categories | Filtering exists | VERIFIED |
| Category measurement | No canonical persisted category-selection event | MISSING |
| Product view | product_view is persisted and product ownership is server-validated | VERIFIED |
| Add to cart | Local cart / Quick Add exists | VERIFIED |
| Add-to-cart measurement | No canonical persisted event | MISSING |
| Cart review | Cart UI exists | VERIFIED |
| Cart measurement | No canonical persisted event | MISSING |
| Order submission | Server-validated public order flow exists | VERIFIED |
| Order creation event | No canonical analytics event | MISSING |
| Order outcome | orders.status + order_status_events | VERIFIED |
| Event → order linkage | No direct session/order key | MISSING |
| Guest relationship linkage | Tenant/branch-scoped pseudonymous guest profile linkage | VERIFIED |
| Growth / Owner / Reports | Existing consumers of menu_events | VERIFIED |
| R6 experiment | Stable session assignment + persisted experiment fields | VERIFIED |
| R6 real exposure | Below documented meaningful-exposure target | INSUFFICIENT |

## Event contract
Canonical public recorder: src/lib/menu/public.ts.

Accepted public event types:
- visit
- product_view
- qr_scan
- whatsapp

Stored dimensions:
- tenant
- branch
- optional product
- event type
- language
- anonymous session
- timestamp
- optional experiment key/variant

Duplicate behavior:
- visit and qr_scan have a 30-minute tenant/session/event-type duplicate guard.
- product_view and whatsapp do not have equivalent persistence-level suppression.

Validation:
- tenant is resolved server-side from an active published slug;
- product-view validates product ownership against the tenant;
- branch is resolved within the tenant;
- public input is schema-validated;
- live tenant/branch consistency is currently clean.

Contract mismatch:
- application validation requires a session ID;
- database menu_events.session_id remains nullable.
This is an A.2 hardening candidate, not an A.1 migration.

## Order truth
The order model is authoritative for outcomes:
- statuses include new, confirmed, preparing, ready, completed, cancelled;
- order_status_events records status transitions;
- public order creation uses server-side validation, rate limiting and idempotency;
- orders link to guest profiles using tenant/branch-scoped pseudonymous identity hashes.

### Critical measurement gap
There is no direct anonymous-session key on orders. Current data cannot prove deterministic individual journey conversion such as visit/QR → product_view → cart → order. Time/tenant/branch correlation would be observational inference, not authoritative attribution.

Do not introduce a client-trusted order/session relationship.

## Existing systems that must not be replaced
- menu_events canonical persistence.
- Owner Analytics.
- Growth and Reports.
- R2–R9 systems.
- R6 experiment semantics.
- Existing public order architecture.
- Existing themes and public-menu renderer.

## Privacy / security
- Anonymous analytics uses a first-party browser storage identifier; it is not a logged-in identity.
- Existing owner analytics is tenant-scoped.
- Event rows carry tenant/branch boundaries.
- No client tenant ID is trusted by the public recorder.
- localStorage persists across browser sessions, so retention/purpose/disclosure should be explicit before expanding longitudinal tracking.

### Separate live security finding
The Supabase security advisor currently reports RLS disabled on six menu_v3 tables, including guest_profiles and menu_upsell_recommendations. This is outside A.1 implementation scope and was not changed. Enabling RLS without appropriate policies could block legitimate access; this requires a dedicated security/data task.

## Gap matrix

| Finding | Status | Priority | A.2? | Change now? |
|---|---|---:|---|---|
| Search event | MISSING | P0 | Yes | No |
| Category event | MISSING | P0 | Yes | No |
| Add-to-cart event | MISSING | P0 | Yes | No |
| Cart-open/review event | MISSING | P1 | Maybe | No |
| Anonymous session → order linkage | MISSING | P0 | Yes, if required | No |
| DB session_id nullability | CONTRACT MISMATCH | P1 | Yes | No |
| Visit/QR duplicate guard | IMPLEMENTED | — | Preserve | No |
| Product ownership validation | IMPLEMENTED | — | Preserve | No |
| Tenant/branch consistency | VERIFIED | — | Preserve | No |
| Owner Analytics tenant scope | IMPLEMENTED | — | Preserve | No |
| R6 stable assignment | IMPLEMENTED | — | Preserve | No |
| R6 sufficient real exposure | INSUFFICIENT | P0 evidence | No code | No synthetic traffic |
| Six live RLS-disabled tables | BLOCKED / SECURITY | P0 security | Separate task | No auto-fix |

## Smallest safe A.2
1. Re-verify A.1 against latest main/branch state.
2. Define only the missing search/category/add-to-cart measurements.
3. Reuse menu_events; no parallel analytics stream.
4. Preserve existing event semantics and R6.
5. Decide whether cart-open measurement is worth adding before implementing it.
6. Design server-controlled session → order linkage only if an authoritative conversion metric is required.
7. Add focused tests for emitters, tenant/branch ownership, duplicate behavior and failures.
8. Re-run applicable quality gates and review the diff.
9. Stop.

## Explicitly unchanged
No runtime code, schema, auth/RLS, themes, public-menu architecture, R2–R9 systems, deployment configuration, synthetic traffic, or production deployment was changed.

## Evidence labels
- VERIFIED: repository/Git/Supabase facts and observed current behavior.
- INFERRED: limitations caused by the absence of a persisted order session key.
- PROPOSED: A.2 sequence.
- UNKNOWN: physical device QA, current production environment values, sufficient R6 exposure.
- BLOCKED: six live RLS-disabled tables require a separate security task.

## Research references
- MDN Web Storage: localStorage is origin-scoped and persists across browser sessions.
- Supabase RLS: table grants and policies jointly control access; exposed tables require explicit security configuration.
- ICO online-tracking/data-minimisation guidance was used only as privacy-design reference, not as a Saudi legal-compliance conclusion.
