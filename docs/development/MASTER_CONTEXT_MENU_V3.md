# MENU V3 — MASTER CONTEXT & EXECUTION STATE

Last updated: 2026-09-03
Canonical repository: `Midosd249/Menu_V3`
Source of truth: `main`
Stack: React + TypeScript + TanStack Start/Router + Supabase/PostgreSQL + Vercel
Product: Arabic-first, bilingual, mobile-first multi-tenant digital menu SaaS for Saudi restaurants/cafes, designed to expand across GCC.

## Non-negotiable architecture

- Do not rebuild from scratch.
- Preserve working functionality.
- Studio owns menu/product/design/branch editing.
- Owner owns orders + customer prospects/leads.
- `/admin` remains legacy/platform-admin compatibility.
- `/m/:slug` is the public customer menu and ordering experience.
- Published state must not use localStorage as source of truth.
- Never trust tenant_id from the client.
- Do not bypass authorization/security for convenience.
- Keep Preview separate from Published.
- Avoid CSS leakage and duplicate parallel implementations.
- Build success is not product correctness.
- Do not declare a level complete without verification.
- Keep GitHub main, Supabase production schema, and Vercel production synchronized.

## Roadmap status

### LEVEL 0 — Foundation & Audit
Status: CLOSED.

### LEVEL 1 — Theme Engine Hardening
Status: CLOSED.

### LEVEL 2 — Menu Experience & Product System
Status: IMPLEMENTED.

Implemented: rich public menu, product detail, variants/modifiers, tags/dietary metadata, search/categories/featured products, branches/hours/contact information, bilingual RTL UX, preview/accessibility states, Studio options management, batch option loading, CSV metadata support, and CI route-tree generation.

Historical verification caveats remain for some authenticated E2E/cache/editor-integration sub-items and should be re-tested during later hardening. Do not represent those historical caveats as Level 3 blockers.

### LEVEL 3 — Restaurant Operations / Ordering
Status: CLOSED — verified 2026-09-03.

Implemented and verified:
- `migrations/0009_orders.sql` for `menu_v3` orders schema;
- `migrations/0010_order_trigger_schema_qualification.sql` for production trigger hardening;
- `orders`, `order_items`, `order_status_events`;
- order lifecycle: new, confirmed, preparing, ready, completed, cancelled;
- order sources: web, whatsapp, manual, qr;
- tenant/branch/product consistency guards;
- public cart and ordering;
- server-side product/variant/modifier/quantity validation;
- server-side price recomputation;
- immutable product/option snapshots in order items;
- Owner workspace at `/owner` for orders + leads;
- complete Owner order details;
- Owner status transitions with `from_status` / `to_status` audit events;
- explicit workspace entry points on login;
- responsive/mobile Owner UI;
- auth hook hardening;
- GitHub CI and Vercel production verification;
- live Supabase order-flow smoke test with cleanup.

## Level 3 verification record

GitHub current `main` commit after the closure documentation commit:
- `077d0b527a7cf56427f17e1cc6219f5ce42dcf9d`

Quality verification:
- latest quality run before the closure docs commit: `33685195512` — SUCCESS;
- DB-hardening code run: `33685136956` — SUCCESS;
- pipeline includes route-tree generation, typecheck, tests, and lint.

Vercel:
- latest production deployment for the closure checkpoint is expected to follow `main` automatically;
- preceding DB-hardening production deployment `dpl_HLTeWcFz8iidMekxNquJx5aPx8SA` was READY;
- the latest production deployment at verification time was READY;
- build error-only inspection returned no build errors;
- production `/m/nafas`, `/login`, `/owner`, `/admin`, `/studio`, and `/studio/branches` all returned HTTP 200;
- runtime error/fatal query for the latest deployment returned no entries in the checked window.

Supabase:
- project `ublxptcqefujkbeepylc` is ACTIVE_HEALTHY;
- migration history contains `orders` and `order_trigger_schema_qualification`;
- live order trigger functions explicitly resolve `menu_v3` tables and set a function search path.

Live order-flow verification used existing published data only:
- tenant: `mndy-alwtnya`;
- branch: `main-branch`;
- product: `8733c6ab-ebe9-4338-9cb0-db0107233534`;
- creation, item snapshot, initial `null -> new`, `new -> confirmed`, audit event verification, and cleanup all succeeded;
- final QA order count: zero.

No browser automation tool was available in the execution environment, so no manual browser-click E2E claim is made. The public route was independently verified over production HTTP and the complete order transaction path was verified against live Supabase data/server logic.

## Current workspace contract

### Studio
Menu editing, products, categories, variants/modifiers/options, branding, design/themes, branches, QR, analytics, import, settings.

### Owner
Orders, order status operations, customer prospects/leads. It must not become a duplicate product editor.

### Admin
Legacy/platform administration and compatibility. Do not remove blindly.

### Public menu
Published customer menu and ordering at `/m/:slug`.

## Production/security notes

Supabase advisor currently reports several pre-existing security hardening notices, including mutable search paths on older functions and intentionally public SECURITY DEFINER functions. These are separate from the Level 3 order trigger issue and are not falsely marked resolved here.

The application uses the server-side database layer for the `menu_v3` application tables; do not claim universal PostgreSQL RLS coverage without direct verification.

Deferred items:
- true Supabase realtime/push refresh;
- tenant/branch-scoped customer order numbering (current order number is a global identity sequence);
- broader security advisor remediation;
- Level 2 historical authenticated/cache/editor E2E re-verification.

## Key Level 3 commits

- `9cc907e5dc02d5b9ce80c2c7e5ebb9d93d67846f` — rich published-menu product experience
- `646c67eb6161e22f570a9ee277c80053d7e10f59` — secure public order submission
- `389634a9d5e9c4ab6fdef38076a3c3bd1c1f0d53` — hardened public order option validation
- `387da425c4d9f5b75d2502b653903eed38c454ff` — customer cart/public ordering flow
- `f0e7d43034c8c5491439b578877800b2b9be3967` — schema-qualified order tenant guards
- `077d0b527a7cf56427f17e1cc6219f5ce42dcf9d` — Level 3 closure checkpoint

## Next execution: LEVEL 4 — Client SaaS & Commercial Platform

Do not start random features. Level 4 should establish:
1. client account lifecycle;
2. tenant membership and role boundaries;
3. client onboarding;
4. client/tenant operational isolation;
5. service/project workflows;
6. SaaS-ready architecture and observability;
7. production-safe commercial foundations.

Do not add AI, payments, or domain work before the Level 4 foundation is properly designed and implemented.

## Working rule for every future chat

Start from this file and the live `main` branch. Do not ask the user to repeat project history unless a required fact is genuinely missing. Verify repository/deployment/database state before claiming progress. Keep a concise updated copyable status block in the final response.
