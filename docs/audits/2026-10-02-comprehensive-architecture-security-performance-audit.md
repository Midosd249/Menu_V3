# Menu V3 — Comprehensive Architecture, Security, Performance & Reliability Audit

**Date:** 2026-10-02  
**Repository:** `Midosd249/Menu_V3`  
**Audited branch:** `main`  
**Audited HEAD:** `5acf2e8ad7e9f9aafc410f0d3a25ba905e764c4a`  
**Baseline PR:** #346  
**Method:** repository-first evidence, Git/CI/deployment evidence, live Supabase evidence, then authoritative external research.  
**Evidence labels:** VERIFIED / INFERRED / PROPOSED / UNKNOWN / BLOCKED.

> **Continuity contract:** This is the canonical audit baseline for future work involving auth/authz, tenant/branch isolation, public ordering, public-menu performance/themes, Order Value Analytics, database/RLS/migrations, or offline resilience. Read it before implementation, while still re-verifying current code/Git/CI/runtime evidence. Current repository evidence always wins if it differs from this snapshot.

## 1. Executive result

**VERIFIED:** No Critical vulnerability was confirmed in the audited surfaces.

### Top 3 structural risks

1. **MEDIUM — Public-order idempotency is not fully atomic with order creation.** The reservation is written before the complete order/order_items flow. A failure after reservation can leave a temporary “already processing” state until TTL expiry.
2. **MEDIUM — Public-order abuse limiting can be bypassed operationally by rotating identifiers.** The current dimensions include tenant/branch/client token/phone/window, and quota can be consumed before full business validation.
3. **MEDIUM — Public-menu scale path.** Public responses use `private, no-store`; anonymous-session resolution can still perform DB read/write work such as `last_seen_at`; the menu cache is process-local (15s); all five themes are statically bundled.

These are structural risks, not evidence of a current production outage.

---

## 2. Scope audited

- Tenant isolation, server-side authorization, Better Auth, cookies, trusted origins, proxy headers, platform-admin guards.
- Guest Assistant/AI abuse and cost controls.
- Public-menu query shape, cache headers, session attribution, image delivery, lazy loading, theme loading.
- Public order validation, server-authoritative pricing, idempotency and rate limits.
- Order status concurrency and audit semantics.
- Order Value Analytics tenant/branch scope, periods, statuses, currency, averages and trends.
- Preparation time and timestamps.
- Supabase RLS, grants, SECURITY DEFINER functions, `search_path`, Security Advisor and Performance Advisor.
- Migration history versus repository migrations.
- TypeScript explicit `any`.
- Offline/PGlite boundary and resilience.
- CI/deployment evidence and explicit unknowns.

No runtime/application code was changed by this audit.

---

## 3. Git/CI baseline

**VERIFIED**

- `main` HEAD: `5acf2e8ad7e9f9aafc410f0d3a25ba905e764c4a`.
- HEAD is PR #346 merge: `docs(analytics): close tenant scope verification`.
- PR #345 is the preceding Order Value Analytics tenant-scope correction.
- GitHub Quality `36962518687` = PASS.
- Vercel status for the audited HEAD was SUCCESS during the evidence review.
- **UNKNOWN:** authenticated real-Production browser smoke and physical Android/iOS QA for this exact baseline.

---

# 4. Tenant isolation / auth / security

## 4.1 Tenant and branch isolation

**VERIFIED — strong**

Order Value Analytics obtains identity from authenticated server context (`context.userId`), resolves membership server-side, checks `analytics.read`, and validates branch scope against trusted tenant-owned data. Client role/permission claims are not authoritative.

No tenant-isolation bypass was found in the audited analytics path.

## 4.2 Platform admin

**VERIFIED**

Platform-admin authorization starts from DB-backed `menu_v3.is_platform_admin(userId)`, with configured environment allowlists as fallback. Client role is not trusted.

## 4.3 SECURITY DEFINER

**VERIFIED**

Inspected live SECURITY DEFINER functions use controlled `search_path` and were not executable by `anon`, `authenticated`, or `public`. Functions reviewed included `get_public_menu`, `is_platform_operator`, `is_tenant_member`, `is_tenant_owner`, `provision_restaurant`, `record_public_menu_event`, `submit_service_request`, `submit_visibility_audit`, and `submit_website_brief`.

No confirmed SECURITY DEFINER privilege-escalation path was found.

## 4.4 Better Auth

**VERIFIED**

`src/lib/auth/server.ts` uses:

- required Vercel `BETTER_AUTH_SECRET`;
- explicit/fallback base URL handling;
- production/preview/local host allowlists;
- `trustedOrigins`;
- `__Host-grok-auth.session_token`;
- `SameSite=Lax`;
- secure cookie attributes;
- bounded session cookie cache.

**MEDIUM hardening:** `advanced.trustedProxyHeaders: true` is enabled. This must remain limited to a genuinely trusted reverse-proxy boundary; end users must not be able to forge the forwarded host/protocol headers.

No confirmed auth bypass was found.

## 4.5 Guest AI abuse

**VERIFIED — good baseline**

Guest Assistant uses server-issued anonymous sessions, tenant binding, per-minute limits, IP-based limits, daily tenant limits, atomic rate-limit upsert before provider invocation, Zod validation and deterministic fallback.

**PROPOSED:** add explicit token/cost budgets and concurrency caps per tenant/provider if AI usage becomes commercially material.

---

# 5. Public menu / mobile performance

## 5.1 Queries

**VERIFIED:** `loadPublicMenu()` is not classic N+1. Modifier options use batched `ANY(productIds)`; the main path is a bounded query sequence.

## 5.2 Caching/session attribution

**VERIFIED**

- menu cache TTL: 15s, process-local;
- public response: `private, no-store`;
- anonymous-session resolution can still SELECT and often UPDATE `last_seen_at`.

**MEDIUM:** process-local cache is not shared across Vercel instances, and public page traffic can still cause DB attribution writes.

**PROPOSED sequence:**

1. decouple public content caching from session attribution;
2. throttle `last_seen_at` updates;
3. prove cache safety across users/tenants;
4. measure TTFB, DB reads/writes, cache-hit ratio, HTML/SSR payload and LCP;
5. only then adopt shared CDN caching.

## 5.3 Images

**VERIFIED / PROTECTED**

Existing media path already uses lazy loading, async decoding, `fetchPriority`, responsive `srcSet` when available, and long-lived immutable tenant-media caching.

Do not rebuild it without new evidence.

## 5.4 Themes

**VERIFIED**

Five themes are implemented: Essential, Editorial, Noir, Heritage, Gallery.

**MEDIUM:** theme templates/components are statically imported rather than split by selected theme, potentially increasing initial JS transfer/parse/evaluation.

**PROPOSED:** measure bundle cost, then split theme code dynamically without changing shared public-menu contracts.

---

# 6. Order processing/business logic

## 6.1 Public order validation

**VERIFIED — strong**

Server validates tenant from slug, branch ownership, product ownership, availability, variants, modifiers, current prices/offers and totals. Client totals are not authoritative.

## 6.2 Status concurrency

**VERIFIED**

Order status mutation uses row locking and preserves status/audit consistency.

PostgreSQL documents `FOR UPDATE` as a row-level lock that blocks conflicting writers/lockers until the transaction ends. The audited implementation follows this model.

## 6.3 Public-order idempotency

**MEDIUM — confirmed reliability defect**

Current conceptual flow in `src/lib/menu/order-public.ts`:

1. reserve `public_order_idempotency`;
2. create order/order_items;
3. finalize idempotency.

If reservation succeeds and creation fails, the reservation can remain and a retry may be treated as already processing until its TTL (approximately 10 minutes in the audited behavior).

**Required fix:** make reservation + order + items + event + finalization atomic in one transaction, or redesign the reservation as a recoverable state machine.

**Required regression tests:**

- failure after reservation;
- concurrent duplicate submit;
- successful replay;
- mismatched payload replay;
- expired reservation recovery.

---

# 7. Public-order abuse/rate limiting

**MEDIUM**

Current limiting uses roughly tenant + branch + normalized phone/client token + window.

Risks:

- attacker can rotate phone/client identifiers;
- valid-order quota can be consumed before full structural/business validation.

This is an operational spam/kitchen-load risk; no evidence was found that it defeats server-authoritative pricing.

**Required fix:** layered tenant + branch + anonymous session/client token + IP + normalized phone limits; separate invalid-request throttling from valid-order quota; consume valid-order quota only after inexpensive structural/business validation.

---

# 8. Order Value Analytics

**VERIFIED**

Supports Today/Week/Month/Custom, Sunday week start, `Asia/Riyadh`, SAR, branch scope, tenant scope, averages and daily trend.

Eligible statuses: `confirmed`, `preparing`, `ready`, `completed`.  
Excluded: `new`, `cancelled`.

Aggregates use `orders` only. Zero eligible orders return value 0, count 0, average null and empty trend. SAR consistency is checked before aggregation.

**VERIFIED:** PR #345 fixed the multi-tenant issue where the prior handler could resolve the earliest membership when no tenant was selected. PR #346 closed the continuity/verification record.

**PROTECTED:** do not rebuild this scope without new evidence.

**LOW:** Saudi-only analytics uses fixed UTC+03. Keep it for Saudi-only scope; move to IANA timezone abstraction if non-Saudi/multi-timezone support is introduced.

---

# 9. Preparation time/timestamps

**VERIFIED**

Preparation duration and estimated ready time are persisted using server-side time and existing concurrency protections. Treat this implementation as completed unless new evidence shows a defect.

**UNKNOWN:** no new production/browser timing experiment was performed during this audit.

---

# 10. Supabase/RLS/database audit

## 10.1 Live baseline

**VERIFIED**

- Supabase project: `ublxptcqefujkbeepylc`.
- PostgreSQL: 17.6.
- Core `menu_v3` tables have RLS enabled.
- Inspected core tables had no grants to `anon`, `authenticated`, or `public`.

## 10.2 Security Advisor

**VERIFIED**

- 1 WARN: leaked password protection disabled.
- 37 INFO: RLS enabled with no policy.

The 37 INFO findings are not automatically vulnerabilities because many inspected tables are server-only and have no client grants.

**MEDIUM:** enable leaked-password protection before commercial launch.

## 10.3 Performance Advisor

**VERIFIED:** 18 unindexed foreign keys.

Do not mass-create indexes. Use query plans/workload and existing composite indexes to decide which are useful.

---

# 11. Migration consistency

**MEDIUM — operational/DR risk**

Recorded production migration history stops at:

`20260925105134_security_rls_and_search_path_hardening.sql`

Repository contains newer migrations:

- `migrations/20260930010000_menu_branch_ordering.sql`
- `migrations/20260930022000_product_offer_revision_trigger.sql`
- `migrations/20260930023000_menu_ordering_offers_rls.sql`

Live DB already contains some corresponding protections, so this is **not proof of a broken production schema**.

Risk is divergence among:

1. repository migration files;
2. `supabase_migrations.schema_migrations`;
3. actual `pg_catalog` schema/functions/triggers/RLS.

**Required action:** formal three-way reconciliation before the next schema release. Do not blindly replay missing files.

---

# 12. TypeScript/code quality

**LOW**

Generated `src/routeTree.gen.ts` contains explicit `any`; ESLint disables `@typescript-eslint/no-explicit-any`.

Most reviewed authored code uses `unknown`/structured types.

**Recommended:** fix generator if possible; otherwise narrowly exempt generated output and enforce `no-explicit-any` for authored source. Never hand-edit generated output.

---

# 13. Offline/PGlite

**MEDIUM capability gap if offline ordering is required**

`src/lib/db.ts` prevents browser-side direct server SQL access.

Existing menu resilience: sessionStorage cache, retry, timeout, fallback UI.

Not present as a complete offline ordering system:

- durable mutation queue;
- background sync;
- conflict resolution;
- reconnect/idempotency queue reconciliation.

**Conclusion:** offline menu reading is partially resilient; offline order submission is not implemented.

If offline ordering becomes a requirement, design it as a separate architecture task rather than adding an ad-hoc client database.

---

# 14. Severity matrix

| Severity | Finding | Action |
|---|---|---|
| Critical | None confirmed | Preserve fail-closed boundaries; re-audit after material security/data changes |
| Medium | Non-atomic public-order idempotency | Atomic transaction/recoverable state + failure/concurrency tests |
| Medium | Identifier-rotatable order abuse limiting | Layer IP/session/phone/tenant/branch; separate invalid/valid quotas |
| Medium | Public menu `private, no-store` + session DB work | Decouple attribution; throttle writes; measure before CDN caching |
| Medium | Five themes statically bundled | Measure and split selected theme |
| Medium | Migration history/repo/schema drift risk | Three-way migration reconciliation |
| Medium | Leaked password protection disabled | Enable Supabase protection |
| Medium | Offline ordering absent | Implement only after explicit product/architecture approval |
| Low | 18 unindexed FKs | Prioritize with workload/query plans |
| Low | Generated explicit `any` | Fix generator/narrowly exempt generated output |
| Low | Fixed Saudi UTC+03 | IANA abstraction if timezone scope expands |
| Low | No explicit AI token/cost/concurrency budget | Add when AI cost warrants it |

---

# 15. Prioritized action plan

## P0.1 — Atomic Public Order Creation

Acceptance:

- reservation/order/items/event/finalization are atomic or deterministically recoverable;
- failure cannot leave misleading idempotency state;
- concurrent duplicates create one logical order;
- successful replay returns authoritative existing result;
- mismatched replay is rejected;
- regression tests cover failure-after-reservation and concurrency.

**Do not touch analytics, themes, unrelated migrations or deployment.**

## P0.2 — Layered Public Order Abuse Protection

Acceptance:

- rotating only phone/client token cannot bypass all limits;
- invalid traffic is throttled separately;
- valid quota is consumed after structural/business validation;
- tenant/branch authority remains server-side.

## P1.1 — Public Menu Cache/Session Decoupling

- separate public-safe cache from attribution;
- throttle anonymous-session writes;
- prove no cross-tenant/user cache leakage;
- measure DB writes, TTFB, cache hits, HTML and LCP.

## P1.2 — Theme Code Splitting

- selected theme avoids shipping all themes;
- no Arabic/English/RTL/LTR or visual regression;
- shared renderer contracts remain unchanged;
- bundle/runtime metrics improve or remain neutral.

## P1.3 — Migration Reconciliation

- reconcile repo migrations + Supabase migration history + live schema;
- explain discrepancies;
- no blind replay.

## P1.4 — Leaked Password Protection

- enable setting;
- controlled test rejects known leaked passwords;
- normal auth remains functional;
- no credential logging.

## P2

- enforce authored-source `no-explicit-any`;
- investigate FK indexes with workload evidence;
- add AI budgets if justified;
- decide explicitly whether offline ordering is a requirement;
- adopt IANA timezones if product scope expands.

---

# 16. Protected work / anti-regression rules

Do not:

- rebuild Order Value Analytics tenant scope;
- replace server-authoritative order pricing/validation;
- rebuild image delivery;
- redesign all five themes as a generic performance fix;
- mass-add indexes without workload evidence;
- blindly apply missing migrations;
- treat CI as Production proof;
- use Vercel as normal visual-development loop;
- weaken RLS/auth/tenant boundaries to make tests pass;
- introduce client-trusted tenant/role/branch authority.

---

# 17. Verification and unknowns

**VERIFIED:** Git baseline, CI Quality, source review for auth/public-menu/order/analytics/themes/data boundaries, live Supabase RLS/grants/SECURITY DEFINER/search_path, Security Advisor, Performance Advisor, and authoritative external research.

**UNKNOWN:**

- authenticated Production browser smoke for exact audit baseline;
- physical Android/iOS QA;
- production cache-hit/DB-write/LCP metrics;
- dedicated migration-history reconciliation;
- whether any unindexed FK is currently a measurable production bottleneck.

**BLOCKED:** none for documentation.

---

# 18. Research record

Repository-first research was followed by focused authoritative-source review.

### Better Auth
- Security: https://better-auth.com/docs/reference/security
- Cookies: https://better-auth.com/docs/concepts/cookies
- Options: https://better-auth.com/docs/reference/options

Finding: trusted proxy headers require a genuinely trusted proxy boundary; trusted origins and secure SameSite cookies are part of the CSRF/origin defense.

### PostgreSQL
- SELECT/locking: https://www.postgresql.org/docs/current/sql-select.html
- Application-level consistency: https://www.postgresql.org/docs/18/applevel-consistency.html

Finding: `FOR UPDATE` provides row locking, but correctness still depends on transaction boundaries and actual writes.

### Supabase
- Password security: https://supabase.com/docs/guides/auth/password-security

Finding: leaked-password protection uses the HaveIBeenPwned Pwned Passwords API to reject known leaked passwords.

### Vercel
- Cache-Control: https://vercel.com/docs/caching/cache-control-headers
- CDN cache: https://vercel.com/docs/caching/cdn-cache

Finding: dynamic responses can use CDN caching headers, but per-user data must not be accidentally shared by a public cache.

---

# 19. Audit decision

**AUDIT_COMPLETED**

No application code changed.

**EXACT NEXT TASK: P0.1 — Atomic Public Order Creation.**

Convert public-order idempotency reservation + order/order_items/event/finalization into one atomic/recoverable transaction boundary, with regression tests for failure-after-reservation and concurrent duplicate submissions.

Do not automatically begin P0.2, P1, deployment, redesign, cleanup or unrelated work.

---

# 2026-10-02 — Current-State Continuity Addendum

**Current main after P0.1:** 7bfa8ceafff4340466d776d5410fe455d07d2f15.

## P0.1 status

- **VERIFIED:** PR #348 merged P0.1 into current main.
- **VERIFIED:** public-order idempotency reservation, order, items, status event, and finalization now share one transaction boundary.
- **VERIFIED:** the historical P0.1 audit finding is **RESOLVED** by the current code.
- **UNKNOWN:** authenticated Production browser smoke and physical Android/iOS QA remain outside GitHub connector evidence.

## P0.2 status

- **VERIFIED:** current main still had the older phone/client-token limiter and consumed accepted quota before full business validation.
- **IMPLEMENTATION_IN_PROGRESS:** P0.2 is being implemented on feat/p0-2-layered-public-order-abuse-2026-10-02.
- **Scope:** preserve tenant/branch server authority; layer server-issued anonymous session and trusted request IP rate identities; keep invalid-request throttling separate; consume accepted-order quota only after product/variant/modifier/offer/business validation; preserve the existing atomic idempotency boundary.
- **Acceptance:** rotating phone/client identifiers alone cannot bypass both session and IP limits; invalid traffic is throttled separately; valid quota is consumed after business validation; tenant/branch authority remains server-side.

The original audit baseline remains historical evidence. Current code, Git, CI and runtime evidence supersede any stale baseline claim.

## Current verification boundary

- **VERIFIED:** repository source and Git baseline were re-read before P0.2 implementation.
- **VERIFIED:** focused RED conditions were added to tests/public-order-hardening.test.mjs; local execution is **BLOCKED** in this connector-only environment.
- **UNKNOWN:** final GitHub Quality/W9 results until the P0.2 PR is opened and workflows complete.
- **UNKNOWN:** live Production abuse-limit behavior until an authorized runtime smoke is available.

## Exact next task

**Run the P0.2 GitHub Quality/W9 gates on the implementation PR, review the final diff, and only then decide the controlled merge. Do not deploy automatically.**
