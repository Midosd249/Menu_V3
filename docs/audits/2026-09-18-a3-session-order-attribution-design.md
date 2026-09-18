# A.3 — Server-Controlled Anonymous Session → Order Attribution Design

## Status
- Status: DONE / DESIGN COMPLETE / VERIFIED AGAINST REPOSITORY
- Date: 2026-09-18
- Canonical main baseline: `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27`
- A.2 implementation head: `fb3b27218fcd8f732b0a2472ff72b2420e067b02`
- A.2 PR: #191 — OPEN / DRAFT
- Design branch: `docs/a3-session-order-attribution-design-2026-09-18`
- Scope: design only. No runtime, schema, auth, RLS, deployment, or public UI implementation.

## Objective

Create an authoritative, server-controlled link between anonymous public-menu journey events and a subsequently submitted public order without trusting a client-generated identity.

The design must:
- preserve the canonical `menu_v3.menu_events` stream;
- preserve tenant/branch isolation;
- preserve the existing public order validation, pricing, rate-limit, and idempotency behavior;
- avoid turning an anonymous session identifier into a customer identity;
- support attribution for new orders while leaving historical orders explicitly unattributed;
- remain compatible with the existing public-menu architecture and all five protected themes.

## VERIFIED Current Repository State

### Anonymous journey identity

- `src/lib/menu/session.ts` currently creates or reuses `menu-v3-session` in browser `localStorage`.
- `src/lib/menu/public.ts` accepts `sessionId` from the client and persists it to `menu_events.session_id`.
- A.2 added `search`, `category_view`, and `add_to_cart` to the canonical event stream.
- The A.1 audit identified the direct event → order linkage as missing.
- The database column `menu_events.session_id` is nullable, while the current public-event validator requires a session ID.

### Public order path

- `src/lib/menu/order-public.ts` is the canonical public order submission path.
- Tenant and branch are resolved server-side from the published slug/branch.
- Product availability, variants, modifier ownership, quantities, and prices are validated/recomputed server-side.
- Public order submission already has application-level rate limiting and idempotency records.
- Orders currently persist tenant, branch, source, customer contact fields, totals, and immutable item snapshots.
- `orders` currently has no anonymous session reference.
- The initial `order_status_events` record is created with no authenticated actor, which is appropriate for a public order.
- R9 guest relationships already use pseudonymous guest identity and order history; this design must not replace or weaken that system.

### Tenant boundary

The public host serves multiple tenant menus. A browser-level anonymous cookie must therefore not be treated as a globally portable tenant identity. The server must bind the anonymous session record to the resolved tenant and reject/rotate a session when the tenant context changes.

## Design Decision

### Recommended model

Use a **server-issued opaque anonymous session cookie + server-side session record + nullable order foreign key**.

Do not continue treating browser `localStorage` as the authoritative identity.

Conceptual flow:

```text
Public menu request
  ↓
Resolve tenant + branch from published slug
  ↓
Read server-issued anonymous session cookie
  ↓
Missing / invalid / wrong-tenant session?
  → create a new server session bound to tenant
  ↓
Use session ID server-side for menu_events
  ↓
Guest browses / searches / views / adds to cart
  ↓
Public order submission
  ↓
Resolve the same server session from the request
  ↓
Create order with anonymous_session_id
  ↓
Persist order + initial status event atomically
  ↓
Journey attribution becomes authoritative
```

## Session Contract

### Cookie

PROPOSED cookie contract:

- Name: `__Host-menu_v3_sid`
- Opaque, high-entropy, server-generated value.
- `Secure` in production.
- `HttpOnly`.
- `SameSite=Lax` initially; evaluate `Strict` only after verifying all supported QR/navigation flows.
- `Path=/`.
- No `Domain` attribute.
- Short/controlled lifetime with server-side expiration.
- Never expose the raw value to client JavaScript.
- Never place the session ID in a URL, analytics payload supplied by the client, logs, or customer-visible UI.

This follows the security direction documented by OWASP and MDN: session identifiers should be unpredictable and meaningless, cookies are preferred for session exchange, and sensitive session cookies should use `Secure`, `HttpOnly`, and an explicit `SameSite` policy. citeturn0search0turn0search1turn0search2

### Server-side session record

PROPOSED new table: `anonymous_sessions`.

Conceptual fields:

| Field | Purpose |
|---|---|
| `id` | Opaque server-issued session identifier / primary key |
| `tenant_id` | Mandatory tenant binding |
| `created_at` | Session creation time |
| `last_seen_at` | Activity/retention management |
| `expires_at` | Server-side expiration |
| `revoked_at` | Explicit invalidation when required |

Branch should **not** be the session's permanent identity boundary. The same anonymous guest can legitimately move between branches of one restaurant. Branch remains authoritative per event/order.

### Why tenant-bound but not permanently branch-bound

- Tenant isolation must remain strict.
- Branch selection can change during one public journey.
- Orders already persist the resolved branch.
- Events already persist the resolved branch.
- Therefore the session identifies the anonymous journey within a tenant, while branch is recorded at each event/order boundary.

## Event Contract After A.3

The browser should stop supplying `sessionId` as an authoritative value.

PROPOSED server behavior:

1. Resolve tenant from the published slug.
2. Resolve/read the anonymous session from the cookie.
3. Verify that the session belongs to the resolved tenant and is not expired/revoked.
4. If missing/invalid/wrong-tenant, issue a new session and continue.
5. Persist the server-resolved session ID into `menu_events.session_id`.
6. Keep `menu_events.session_id` nullable only for historical/legacy rows during migration; new rows must always receive a server-resolved session.

This preserves the existing analytics stream rather than introducing a second event identity model.

## Order Attribution Contract

PROPOSED `orders.anonymous_session_id`:

- nullable foreign key to `anonymous_sessions(id)`;
- populated only by the server during public order creation;
- never accepted as a client-supplied order field;
- tenant consistency must be enforced so an order cannot reference a session belonging to another tenant;
- historical orders remain `NULL`;
- authenticated/staff/manual orders may remain `NULL` unless a separate trusted workflow explicitly establishes an anonymous-session relationship.

A foreign key is appropriate because PostgreSQL can enforce referential integrity rather than relying only on application checks. citeturn1search0turn1search1

## Atomicity Requirement

The final implementation must create the public order and its initial attribution consistently.

The intended unit is:

```text
reserve idempotency
→ create order
→ create order_items
→ create initial order_status_events row
→ attach anonymous_session_id
→ finalize idempotency record
```

If the order transaction fails, the system must not leave an apparently successful order-attribution record that points to a non-existent order.

The implementation must preserve the existing idempotency semantics rather than create a second order-submission mechanism.

## Attribution Semantics

An attributed order means:

> The server received the order while the browser held a valid server-issued anonymous session bound to the same tenant, and the order was persisted with that session reference.

It does **not** mean:

- a verified human identity;
- a unique person;
- a device fingerprint;
- cross-browser identity;
- cross-tenant identity;
- proof that every event in the session was generated by the same human.

This distinction is important for Owner Intelligence, Growth, R9, and future conversion reporting.

## Analytics Query Contract

PROPOSED future reporting relationship:

```text
anonymous_sessions
      │
      ├── menu_events.session_id
      │
      └── orders.anonymous_session_id
```

This enables metrics such as:

- sessions with menu visits;
- sessions with product views;
- sessions with search/category/add-to-cart activity;
- sessions producing an order;
- ordered-session conversion rate;
- pre-order product/category behavior.

The reporting layer must continue to scope all joins by tenant and, where relevant, branch.

## Privacy / Retention

The anonymous session is a pseudonymous technical identifier, not a customer profile.

PROPOSED safeguards:

- collect no extra identity data solely for attribution;
- do not store IP/User-Agent as part of the session model unless a separate security requirement explicitly justifies it;
- define a finite retention/expiration policy;
- avoid logging the raw session token;
- use an internal hash/redacted value for operational correlation if logs need session-level diagnostics;
- keep customer contact data in the existing order/R9 boundaries rather than copying it into anonymous session records.

OWASP explicitly recommends protecting session identifiers and avoiding sensitive session values in logs; pseudonymous attribution should therefore remain separate from customer identity. citeturn0search0

## Existing localStorage Migration

The current `menu-v3-session` localStorage value must **not** be promoted to an authoritative order identity.

Recommended migration:

1. Keep existing localStorage temporarily only as a compatibility artifact if required by current client code.
2. Introduce the server cookie/session as the only authoritative source.
3. Stop sending the localStorage value as `sessionId` to server functions.
4. New events use the server session.
5. Historical `menu_events.session_id` values remain historical legacy identifiers.
6. Do not attempt to retroactively attach historical orders to new server sessions.

This avoids a false continuity claim between old client-generated IDs and new server-owned sessions.

## Failure / Edge Cases

| Case | Required behavior |
|---|---|
| No cookie | Create server session |
| Expired cookie | Create replacement session |
| Revoked cookie | Create replacement session |
| Cookie belongs to another tenant | Do not reuse; create tenant-bound session |
| Cookie malformed/unknown | Treat as untrusted; create replacement |
| Browser blocks cookies | Attribution unavailable; order remains valid with `anonymous_session_id = NULL` and telemetry should expose the limitation |
| User clears cookies | New session; no forced identity reconstruction |
| User changes branch | Keep tenant session; record new branch on events/order |
| Duplicate order retry | Existing order idempotency path remains authoritative |
| Manual/admin order | No anonymous attribution unless explicitly established |
| Historical order | Remains unattributed |
| Cross-tenant navigation | Rotate/bind session to the new tenant |

## Security Requirements

The implementation must:

- generate session identifiers with a cryptographically secure source;
- treat the cookie value as untrusted input and validate it server-side;
- never trust client-provided tenant, branch, role, or session ownership;
- prevent a session from being used to attribute an order to another tenant;
- keep order pricing and authorization unchanged;
- preserve existing server-side order rate limiting and idempotency;
- avoid raw session IDs in logs;
- preserve TanStack Start same-origin server-function protections and CSRF controls.

TanStack Start documents server functions as same-origin RPC endpoints and supports server-side cookie access/set operations, making this pattern compatible with the existing framework architecture; the exact repository runtime API must still be verified during implementation. citeturn3search0turn3search3turn3search6

## Proposed Implementation Surface

No implementation is included in A.3. The next implementation task should inspect and minimally change:

- `src/lib/menu/session.ts`
- `src/lib/menu/public.ts`
- `src/lib/menu/order-public.ts`
- `migrations/` with one focused migration
- focused analytics/order regression tests
- any existing server cookie/request helpers discovered during implementation

Do not redesign the public renderers or themes.

## Acceptance Criteria for the Future Implementation

1. A fresh public visitor receives a server-issued anonymous session.
2. The client cannot choose the authoritative session ID.
3. Events and orders resolve the session server-side.
4. An order can reference only a session belonging to the same tenant.
5. Historical orders remain valid and unattributed.
6. Existing order validation, pricing, rate limiting, and idempotency remain intact.
7. Existing `menu_events` remains the canonical analytics stream.
8. No raw session identifier appears in logs or customer-visible payloads.
9. Cross-tenant navigation cannot reuse attribution across tenants.
10. Cookie-disabled browsers can still submit orders; attribution is simply unavailable.
11. Tests cover tenant isolation, cookie/session lifecycle, order linkage, duplicate submission, and failure rollback.
12. No theme/public-menu architecture is replaced.

## Verification Plan for the Future Implementation

Required before marking implementation complete:

- typecheck;
- full tests;
- lint;
- production build;
- auth/security checks;
- focused anonymous-session tests;
- focused order/idempotency tests;
- browser test for fresh session → browse → order;
- browser test for cross-tenant navigation;
- browser test for cookie clearing/replacement;
- browser test for duplicate order submission;
- review of final migration and tenant constraints;
- final diff review.

Production deployment is out of scope for the design task.

## UNKNOWN / BLOCKED

- UNKNOWN: exact TanStack Start cookie API/version currently installed in the repository; official docs confirm the capability, but implementation must verify the repository's installed version and existing server helpers.
- UNKNOWN: whether production traffic/client privacy settings intentionally disable or restrict first-party cookies for this deployment.
- UNKNOWN: whether any existing analytics/reporting query assumes `menu_events.session_id` is a browser-generated localStorage value.
- BLOCKED for implementation until explicit implementation authorization after this design is reviewed.
