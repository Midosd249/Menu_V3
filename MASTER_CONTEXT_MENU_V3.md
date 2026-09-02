# MENU V3 — MASTER CONTEXT & EXECUTION STATE

Last updated: 2026-09-03
Canonical repository: `Midosd249/Menu_V3`
Source of truth: `main`
Stack: React + TypeScript + TanStack Start/Router + Supabase/PostgreSQL + Vercel
Product: Arabic-first, bilingual, mobile-first multi-tenant digital menu SaaS for Saudi restaurants/cafes, designed to expand across GCC.

## Non-negotiable product architecture

- Do not rebuild from scratch.
- Preserve existing working functionality.
- Studio is the restaurant/menu/product/design/branch workspace.
- Owner is the operational workspace for orders and customer prospects/leads.
- `/admin` remains legacy/platform-admin compatibility unless intentionally removed later.
- `/m/:slug` is the public customer menu and ordering experience.
- Published state must not use localStorage as source of truth.
- Never trust tenant_id from the client.
- Do not bypass authorization/RLS architecture for convenience.
- Keep Preview separate from Published.
- Avoid CSS leakage and duplicated parallel implementations.
- Build success is not product correctness.
- Do not declare a level complete without verification.
- GitHub main, Supabase production schema, and Vercel production must stay synchronized.

## Original roadmap

### LEVEL 0 — Foundation & Audit
Status: CLOSED / completed earlier.

Foundation audit, repository architecture, routing, auth gates, Supabase schema, Vercel deployment, and baseline production structure were established.

### LEVEL 1 — Theme Engine Hardening
Status: CLOSED / implemented.

Theme registry/types, server theme handling, and theme schema fixes were implemented. Canonical `ThemeKey` imports were corrected.

### LEVEL 2 — Menu Experience & Product System
Status: IMPLEMENTED, but historical verification caveats remain; do not treat every sub-item as fully E2E-certified until explicitly re-tested.

Implemented:
- richer public menu experience;
- product detail sheet/modal;
- variants and modifier groups/options;
- product tags and dietary labels;
- calories/allergen-related metadata display where available;
- search, categories, featured products;
- branch selector and branch information;
- hours, WhatsApp, location, phone, Instagram where configured;
- Arabic/English and RTL support;
- preview banner/accessibility/focus states;
- product options/metadata management in Studio;
- batch loading of product options to avoid N+1 queries;
- CSV metadata support;
- CI route-tree generation before typecheck.

Known verification caveats:
- full authenticated E2E for product options and metadata should still be re-verified;
- published cache behavior should be explicitly tested;
- metadata CRUD integration with the main product editor should be confirmed;
- CI success must be checked from GitHub Actions rather than inferred from Vercel.

### LEVEL 3 — Restaurant Operations / Ordering
Status: IN PROGRESS — foundation and main flow implemented, final E2E closure pending.

Implemented on `main`:
- orders schema migration `0009_orders.sql` scoped to `menu_v3`;
- `orders`, `order_items`, and `order_status_events` tables;
- order status lifecycle: `new`, `confirmed`, `preparing`, `ready`, `completed`, `cancelled`;
- order sources: web/WhatsApp/manual/QR;
- tenant/branch/product consistency triggers;
- secure server-side order operations;
- public cart and ordering flow;
- server-side validation of products, variants, modifiers and totals;
- immutable product snapshots in order items;
- Owner workspace at `/owner`;
- Owner includes orders + customer prospects/leads;
- Studio remains responsible for menu/product/design/branch editing;
- explicit workspace entry points on login;
- order status updates and status event recording;
- responsive/mobile Owner UI.

Important remaining Level 3 work:
1. Verify GitHub Actions actually completes Typecheck -> Tests -> Lint. A workflow run was not returned by the commit-specific workflow query; the Vercel status is green, but that is NOT equivalent to GitHub CI.
2. Verify public customer order E2E against a real published tenant/branch/product, without inventing data.
3. Verify Owner receives the created order and can change its status.
4. Verify the status event stores `from_status` -> `to_status` correctly. Current server code still inserts only `to_status`; this should be corrected before declaring the audit trail complete.
5. Owner order detail currently shows summary fields but not full order-item lines/selected options. Add a proper order detail payload and UI before Level 3 closure.
6. Owner "Active" metric currently represents confirmed/preparing/ready but its card does not filter to those statuses. Either implement an active-only filter or make it non-filtering/clearly informational.
7. Remove/avoid duplicate initial Owner data loads caused by overlapping effects.
8. Consider polling/realtime refresh after the basic E2E flow is stable. True Supabase realtime is optional for a later hardening pass.
9. Consider tenant/branch-scoped customer-facing order numbering later; current `order_number` is a global identity sequence.
10. Confirm no regression in `/admin`, Studio, public menu, auth redirects, and existing branches/menu editing.
11. Verify production runtime logs after deployment and check for 4xx/5xx errors on the main public route and operational routes.

## Current workspace contract

### Studio
Primary purpose:
- menu editing;
- products;
- categories;
- variants/modifiers/options;
- branding;
- design/themes;
- branches;
- QR;
- analytics;
- import;
- settings.

### Owner
Primary purpose:
- orders;
- order status operations;
- customer prospects/leads.

It must NOT become a duplicate product editor.

### Admin
Legacy/platform administration and compatibility. Do not remove blindly.

### Public menu
Customer-facing published menu at `/m/:slug`, including ordering when enabled.

## Current deployment state

Latest known production deployment:
- Vercel deployment: `dpl_4kgBupVT2RpYergw7FDZcBBuegge`
- GitHub commit: `f15529e9a3b02464599bca4185db0c3f5d77f71c`
- Commit message: `ci: rerun quality after studio type fix`
- State: READY
- Target: production
- Vercel combined GitHub status: success
- Public `/m/nafas` HTTP status: 200 at verification time.

Do not infer that GitHub Actions passed solely from the Vercel deployment status.

## Supabase production state

Project: `ublxptcqefujkbeepylc`
Schema: `menu_v3`

Migration history includes:
- `20260902210400` — `orders`

The live `orders`, `order_items`, and `order_status_events` schema was verified after the corrected migration was applied.

Important architecture note: application tables are accessed through the server-side database layer; do not claim that all `menu_v3` tables have PostgreSQL RLS enabled unless verified directly.

## Key recent commits

- `9cc907e5dc02d5b9ce80c2c7e5ebb9d93d67846f` — rich published-menu product experience
- `ddd0a478a027264433773fdd0e8fb0a93789dad4` — explicit owner workspace entry
- `a5562394836d5add8c59bf6e39141b85363487ec` — explicit workspace entry points
- `bbfdc1c97507a8706b3e3904ce6b82ade5e6f01c` — orders foundation schema
- `0eea89484e5aec55498dcec6e3a50ea014d3cea9` — secure owner order operations
- `fe6e719803871de32e8daf5202f1a0a62c4d537b` — operational Owner workspace
- `646c67eb6161e22f570a9ee277c80053d7e10f59` — secure public order submission
- `389634a9d5e9c4ab6fdef38076a3c3bd1c1f0d53` — hardened public order option validation
- `387da425c4d9f5b75d2502b653903eed38c454ff` — customer cart/public ordering flow
- `de8d65be8e4b7f9045f12f1a8fb291e9226db53f` — orders migration scoped to `menu_v3`
- `37ce8f912af358e7d2fa32ca0a0e1797c4253b27` — Studio flash compatibility fix
- `f15529e9a3b02464599bca4185db0c3f5d77f71c` — latest known main commit

## Next execution order

1. Verify latest GitHub Actions status and jobs.
2. Inspect the actual current public ordering implementation and Owner implementation before changing them.
3. Fix order status event `from_status` recording.
4. Add complete order-item detail to Owner.
5. Fix Owner Active metric behavior and eliminate duplicate loads.
6. Commit changes to `main`.
7. Re-check GitHub Actions.
8. Re-check Vercel production deployment and runtime logs.
9. Run the real public -> database -> Owner -> status-update E2E flow against safe existing demo data.
10. Only then close LEVEL 3.
11. After Level 3 closure, proceed to LEVEL 4 — Client SaaS & Commercial Platform.

## Later roadmap after Level 3

### LEVEL 4 — Client SaaS & Commercial Platform
Client account lifecycle, tenant membership/roles, commercial onboarding, service/project workflows, subscriptions architecture, and production-grade SaaS boundaries.

### LEVEL 5 — QR / Orders / Customer Journey
QR entry, ordering refinements, customer journey, order communications, operational reliability, and branch-aware customer flows.

### LEVEL 6 — AI & Automation
AI-assisted menu/content/operations only after the core SaaS and ordering foundations are stable. Do not add AI randomly before then.

### LEVEL 7 — Analytics / Growth / Local Visibility
Analytics, growth loops, local visibility, reporting, and actionable restaurant insights.

### LEVEL 8 — Security / Scale / Production Hardening
Authorization review, tenant isolation, rate limits, observability, performance, caching, abuse protection, backups/recovery, and scale testing.

### LEVEL 9 — Commercial Launch
Pricing, subscriptions/payment integration, domain strategy, onboarding, legal/operational launch readiness, monitoring, support, and go-to-market.

## Working rule for every future chat

Start from this file and the live `main` branch. Do not ask the user to repeat the project history unless a required fact is genuinely missing. Verify the current repository/deployment/database state before claiming progress. Keep a concise updated copyable status block in the final response so the next chat can resume without losing context.
