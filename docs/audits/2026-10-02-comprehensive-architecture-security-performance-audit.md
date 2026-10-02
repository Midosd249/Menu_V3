## P1.1 Closeout Addendum — 2026-10-02 — VERIFIED

### Implementation
- VERIFIED: PR #351 implementation head is the final P1.1 PR head, directly based on main 9e2272f5cf626e0b7a8546f1442ff2172ab473f0.
- VERIFIED: getPublicMenu is public-safe and no longer resolves/creates anonymous sessions during SSR.
- VERIFIED: getPublicMenuAttribution is a POST, resolves the published active tenant from the public slug, and returns private, no-store attribution data.
- VERIFIED: public routes use public, max-age=0, s-maxage=15, stale-while-revalidate=30. Existing process-local menu caching remains 15s and is keyed by tenant slug, branch slug, and content revision.
- VERIFIED: last_seen_at updates are throttled to five minutes and still require session ID + tenant ID.
- VERIFIED: experiment assignment remains server-derived and is reset across menu navigation.
- PROTECTED: P0.1/P0.2 order security, Order Value Analytics, preparation-time/ETA, image delivery, five themes, auth/RLS, and unrelated migrations were not changed.

### Measurement
- SOURCE-LEVEL baseline: before P1.1, a valid anonymous-session public-menu request performed a session read and last_seen_at write after menu loading; invalid/new cookies could create a session. Public HTML was private/no-store and menu content cache was process-local for 15s.
- SOURCE-LEVEL outcome: cacheable public SSR now performs no anonymous-session DB read/write; attribution is a separate POST; valid-session last_seen_at updates are limited to the five-minute interval.
- UNKNOWN: runtime TTFB, DB read/write counters, CDN cache-hit ratio, HTML/SSR payload size, and production LCP before/after.

### Isolation and verification
- VERIFIED by source review, contract tests, and GitHub CI: public cached output does not depend on cookie/session identity; attribution is private/no-store; tenant resolution is server-side; menu queries remain tenant/branch scoped; branch cache identity is explicit.
- VERIFIED: Quality #2756 passed typecheck, 466 tests, lint, production build, all-theme browser QA, Menuun brand QA, performance fixture, Studio browser QA, and Platform Admin browser QA.
- VERIFIED: W9 Orders QA #892 passed.
- VERIFIED: PR #351 remains open/unmerged; no automatic merge or Production deployment occurred.
- VERIFIED: Vercel Preview for the final PR head is SUCCESS. No Production deployment was performed.

TanStack Start's current guidance distinguishes public non-personalized cacheable server functions from cookie/session-dependent output and recommends private/no-store for personalized responses. Vercel's current CDN guidance likewise warns against publicly caching cookie-dependent output. The implementation follows those boundaries.

## EXACT NEXT TASK

**P1.2 — Theme Code Splitting**

Before implementation, establish bundle-size, JS transfer/parse/evaluation, and selected-theme runtime/browser baselines. Preserve all five themes and public-menu behavior. Do not start P1.3 or deploy automatically.

---

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


# 2026-10-02 — Current-State Reconciliation After P0.1 + P0.2 — VERIFIED

## Supersession rule

This addendum supersedes the historical baseline and action-status claims above wherever they conflict with current repository/Git/CI evidence. The audit remains valuable as the original architectural/security/performance baseline, but current code, Git, CI and runtime evidence take precedence.

## Git/CI current state

- VERIFIED: P0.1 merged as PR #348, merge commit `7bfa8ceafff4340466d776d5410fe455d07d2f15`.
- VERIFIED: P0.2 merged as PR #349, merge commit `5e2cdf847251f0bc6a8688667a7d3e060e768419`.
- VERIFIED: P0.2 final Quality #2731 passed.
- VERIFIED: P0.2 final W9 Orders QA #869 passed.
- VERIFIED: the continuity PR #350 head `917809310cd0a0c56b09ec8f52e69d52a472456f` has Quality #2733 = success, W9 #870 = success, and Vercel status = success.
- UNKNOWN: PR #350 merge state until the merge is directly confirmed.
- UNKNOWN: Production deployment corresponding to P0.2/PR #350; no deployment was performed by this closeout.

## Resolved audit findings

### P0.1 — Atomic Public Order Creation
**VERIFIED — RESOLVED**

The historical non-atomic idempotency finding is resolved by PR #348. Reservation, order, order_items, status event, and idempotency finalization now share the transaction boundary. Do not reimplement this fix unless new evidence shows a regression.

### P0.2 — Layered Public Order Abuse Protection
**VERIFIED — RESOLVED / MERGED**

The historical limiter finding is resolved by PR #349. The implementation adds server-issued anonymous-session + request-IP layering, separate invalid-request throttling, and accepted-quota consumption after full business validation while preserving server-side tenant/branch authority and the P0.1 atomic boundary.

Do not weaken or replace these controls in P1.1.

## Remaining prioritized work

### P1.1 — Public Menu Cache/Session Decoupling
**EXACT NEXT TASK**

Before implementation, establish a measurement baseline for:
- TTFB;
- DB reads and writes;
- menu-cache hit/miss behavior;
- anonymous-session attribution reads/writes, especially `last_seen_at`;
- HTML/SSR payload size;
- LCP where browser evidence is available.

Then safely separate public-safe menu content caching from anonymous-session attribution. Reduce/stabilize attribution writes without changing tenant/user semantics. Prove that no cache can cross user/tenant boundaries.

**Guardrail:** do not introduce shared/CDN caching merely because it is theoretically faster. Evidence must establish safety and benefit first.

### P1.2 — Theme Code Splitting
Remain queued after P1.1. Do not begin automatically.

### P1.3 — Migration Reconciliation
Remain queued after P1.2. Do not blindly replay migration files.

### P1.4 — Leaked Password Protection
Remain queued after P1.3.

## Protected systems

The following are explicitly protected from opportunistic refactors during P1.1:
- Order Value Analytics tenant/branch scope and its existing verified behavior;
- P0.1 transaction boundary;
- P0.2 layered abuse controls;
- server-authoritative order pricing/validation;
- preparation-time/ETA concurrency protections;
- auth, RLS, SECURITY DEFINER, tenant and branch isolation;
- existing image delivery;
- the five existing themes and their shared renderer contracts;
- migration history/schema until the dedicated reconciliation task.

## Verification boundary

**VERIFIED:** current GitHub CI evidence for P0.1/P0.2 and the documentation PR head.

**UNKNOWN:** production cache-hit ratio, DB-write volume, TTFB and LCP baseline; these must be measured as part of P1.1 where tooling permits.

**UNKNOWN:** authenticated Production browser smoke and physical-device QA.

**BLOCKED:** local shell execution is unavailable in the current connector-only execution surface.

## Exact cross-chat handoff

Start the next chat at **P1.1 — Public Menu Cache/Session Decoupling**.

First action: boot from repository/Git evidence and confirm the continuity PR #350 is merged before creating or editing a P1.1 implementation branch.

Do not start P1.2, deployment, redesign, cleanup, or unrelated migration work automatically.


## P1.2 Closeout Addendum — 2026-10-02 — VERIFIED

### Theme loading
- VERIFIED: PR #352 merged into `main` as `66d46d0512f9d50120f053e4826dcfc3ca62278b`.
- VERIFIED: the selected canonical public-menu theme is loaded through `getLazyThemeTemplate()` and React `Suspense`; theme implementations are no longer statically imported by the public route or shared renderer.
- VERIFIED: all five canonical mappings remain intact: Essential/Small Menu, Editorial/Signal Table, Noir/Fine Dining Hospitality, Heritage/Taste, Gallery/Bakery Dessert.
- VERIFIED: Quality #2769 and W9 Orders QA #904 passed. Quality included all-theme browser QA and the configured performance fixture.
- VERIFIED: Vercel Preview reached Ready for the final PR state.

### Security / regression boundary
- VERIFIED: no changes to tenant/branch authorization, RLS, authentication, server-authoritative pricing, P0.1 atomic order creation, P0.2 abuse protection, Order Value Analytics, preparation-time/ETA, image delivery, or unrelated migrations.
- UNKNOWN: direct physical-device verification and Production performance measurements remain outstanding.

### Performance interpretation
- VERIFIED: P1.2 changes code-loading structure only; it does not by itself establish a numeric Production LCP/TTFB improvement.
- UNKNOWN: actual Production JS transfer, parse/evaluation, selected-theme runtime cost and user-device impact.
- PROPOSED NEXT: P1.3 should establish a post-P1.2 runtime measurement baseline before any further optimization.

## EXACT NEXT TASK

**P1.3 — Public Menu Runtime Performance / Observability**


## P1.2 Closeout Addendum — 2026-10-02 — VERIFIED

- VERIFIED: PR #352 merged into `main` as `66d46d0512f9d50120f053e4826dcfc3ca62278b`.
- VERIFIED: selected public-menu theme implementations are lazy-loaded through `getLazyThemeTemplate()`; route and shared renderer no longer statically import the theme implementations.
- VERIFIED: Quality #2769 and W9 Orders QA #904 passed.
- VERIFIED: all five canonical theme mappings remain intact.
- VERIFIED: P0.1/P0.2, P1.1, auth/RLS, tenant/branch boundaries, order validation/atomicity/abuse protection, Order Value Analytics, preparation-time/ETA, image delivery and unrelated migrations were not changed by P1.2.
- UNKNOWN: numeric Production performance impact and physical-device evidence.

## EXACT NEXT TASK

**P1.3 — Public Menu Runtime Performance / Observability**

## P1.3 Runtime Performance / Observability — Closeout — 2026-10-02

### Baseline
- VERIFIED: CI golden 30-product fixture at 390x844 measured 20,587 bytes HTML transfer, 20,287 decoded HTML bytes, 31 image resources, 202,708 image-transfer bytes, and FCP 116 ms.
- VERIFIED: separate Editorial browser evidence measured 40 JS requests / 48,957 transfer bytes, 6 font requests / 226,752 transfer bytes, 10 image requests / 698,810 transfer bytes, and FCP 324 ms.
- UNKNOWN: Production TTFB, real cache hit/miss ratio, DB reads/writes per public-menu request, and real-device Arabic/English performance.

### Evidence-backed bottleneck
The existing 15-second revision-keyed process-local menu cache still performed a `public_content_version` database lookup before checking whether a fresh cached menu existed. This made a cache hit pay one DB read.

### Atomic improvement
PR #354 adds a tenant/branch-scoped in-process fast path with the same 15-second TTL. The key is server-derived as `tenantSlug:branchSlug/default`; a fresh entry returns before `getSql()` and revision lookup. Misses retain the existing revision-keyed cache and SQL tenant/branch filters. Cache invalidation clears both maps.

### Security / isolation
- VERIFIED: no client-supplied identity, tenant, branch, role, entitlement or price is trusted by the new path.
- VERIFIED: no shared/CDN cache was introduced.
- VERIFIED: no auth, RLS, SECURITY DEFINER, order, abuse-protection, analytics, ETA, image-delivery, theme-identity, or migration behavior was changed.

### Verification
- VERIFIED: Quality #2785 = SUCCESS, including typecheck, full npm test, lint, production build, all-theme browser QA, Arabic/English browser QA, golden performance fixture, Studio/Platform Admin browser QA and diagnostics.
- VERIFIED: W9 Orders QA #918 = SUCCESS.
- VERIFIED: PR #354 squash-merged into `main` as `67f05fff4f7f6c07e87b56df1a9a676f2aee896d`.
- UNKNOWN: the new contract's pre-implementation RED state was not captured because the test file was not initially registered in `npm test`; registration was corrected before final verification and the final suite passed.
- BLOCKED: Vercel Preview is independently rate-limited by `api-deployments-free-per-day`; no Production deployment was attempted.

## EXACT NEXT TASK

**P1.4 — Leaked Password Protection**

Remain queued. Do not start automatically.

# 2026-10-02 — Owner Reprioritization Addendum — P1.4 DEFERRED

- VERIFIED: the original audit found no Critical vulnerability.
- VERIFIED: the historical P0.1 and P0.2 medium findings have since been resolved and verified by the current repository/CI evidence.
- VERIFIED: the current P1.1/P1.2/P1.3 implementation sequence has also been completed.
- DECISION: **P1.4 — Leaked Password Protection is DEFERRED / OUT OF CURRENT SCOPE.**
- REASON: current Supabase subscription does not expose leaked-password protection; Supabase currently documents the feature as available on Pro Plan and above.
- IMPORTANT: this does **not** change the Severity Matrix finding from "Medium" to "Resolved". The underlying Security Advisor warning may remain until the feature is enabled; it is simply an owner-approved deferred item.
- REPRIORITIZED NEXT ACTION: **Audit Follow-up — Supabase Migration Three-Way Reconciliation**.
- RATIONALE: it is an independent operational/DR integrity concern and can be investigated without changing the current auth/security architecture.
- GUARDRAIL: reconciliation must compare repository migration files, `supabase_migrations.schema_migrations`, and actual live `pg_catalog` state. Do not blindly replay migrations.
- NO CODE CHANGE: this addendum changes task priority only.

## Current Severity Interpretation

### Already addressed
- P0.1 — Public-order idempotency atomicity: **RESOLVED / VERIFIED**.
- P0.2 — Public-order abuse limiting: **RESOLVED / VERIFIED**.
- P1.1 — Public-menu cache/session decoupling: **COMPLETED / VERIFIED**.
- P1.2 — Theme code splitting: **COMPLETED / VERIFIED**.
- P1.3 — Public-menu runtime performance/observability: **COMPLETED / VERIFIED**.

### Deferred
- P1.4 — Leaked Password Protection: **DEFERRED / OUT OF CURRENT SCOPE**.

### Remaining actionable audit work
1. **Migration history/repository/schema reconciliation — Medium operational/DR risk.**
2. **Offline ordering — Medium capability gap, only if offline ordering becomes an explicit product requirement.**
3. **18 unindexed foreign keys — Low; investigate only with query/workload evidence.**
4. **Generated `any` — Low; enforce authored-source typing without hand-editing generated output.**
5. **Saudi fixed UTC+03 — Low; address only when multi-timezone scope expands.**
6. **AI token/cost/concurrency budgets — Low/conditional; add when AI cost or abuse evidence warrants it.**

### Non-matrix security hardening to keep in view
- Better Auth `trustedProxyHeaders: true` remains a configuration boundary that must stay behind a genuinely trusted reverse proxy. This is a hardening invariant, not a new task unless evidence shows a concrete exposure.

## EXACT NEXT TASK

**Audit Follow-up — Supabase Migration Three-Way Reconciliation**

Do not start automatically. Re-boot from current Git/CI/runtime evidence before implementation or any schema action.


# 2026-10-02 — Supabase Migration Three-Way Reconciliation — VERIFIED

## Scope
Read-only reconciliation of repository migrations, `menu_v3._migrations`, `supabase_migrations.schema_migrations`, and live PostgreSQL catalog metadata. No migration replay or database mutation occurred.

## Repository inventory
- 70 SQL files under `migrations/`.
- 69 top-level files are consumed by `scripts/migrate.mjs`.
- `migrations/auth/0001_auth.sql` is nested and intentionally excluded by `scripts/migration-plan.mjs`.
- Two files share timestamp prefix `20260909001000`: `order_archive_operations` and `public_order_abuse_controls`.

## Application ledger
- 69 rows / 69 distinct names in `menu_v3._migrations`.
- The set matches the 69 active top-level repository basenames.
- Latest applied migration: `20261002090000_layered_public_order_abuse_controls.sql`.
- 20 filename/application-time position mismatches exist: **ORDERING ANOMALY**, not evidence of missing application.

## Supabase CLI history
- 46 rows in `supabase_migrations.schema_migrations`.
- Only two exact version overlaps with repository filenames: `20260903025817`, `20260925105134`.
- 44 history versions are **HISTORY-ONLY** relative to the current repository inventory.
- Several names are semantically related to current migrations but use different versions.
- Repository has no `supabase/migrations/` or `supabase/config.toml`; the active application runner is custom.
- Classification: **EXPECTED / BENIGN** for current architecture, with Medium operational/continuity risk if the wrong ledger is assumed canonical. Do not replay or repair automatically.

## Live schema inventory
- 45 tables; 441 columns; 189 constraints; 148 indexes; 30 functions; 33 non-internal triggers; 7 RLS policies; 44 RLS-enabled tables; 0 views/materialized views.
- Extensions: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`, `uuid-ossp`.
- 67 foreign keys; 0 unvalidated.
- Latest migration-controlled objects verified live: branch ordering tables, product offers, order-item offer snapshot fields, order preparation fields, and layered public-order rate-limit tables.
- `public_order_invalid_rate_limits` is the only `menu_v3` table without RLS and has no client table grants.
- 14/30 functions are SECURITY DEFINER; inspected server-only authorization/provisioning functions do not have PUBLIC/anon/authenticated EXECUTE.

## Classification matrix
| Finding | Classification | Action |
|---|---|---|
| 69 repo migrations vs 69 active ledger rows | VERIFIED MATCH | No repair |
| Nested auth duplicate basename | EXPECTED / BENIGN | No repair |
| 20 historical ordering mismatches | ORDERING ANOMALY | Document only |
| Duplicate `20260909001000` prefix | ORDERING ANOMALY | Separate strategy task |
| 46 Supabase CLI rows vs 69 active custom migrations | HISTORY-ONLY / EXPECTED-BENIGN | No history repair |
| 44 Supabase history versions absent from repo | HISTORY-ONLY | No replay; provenance remains UNKNOWN |
| Latest live objects present | VERIFIED MATCH | No repair |
| 0 unvalidated FKs | VERIFIED MATCH | No repair |

## Security/performance observations
- Security Advisor: leaked-password protection disabled (already deferred) and 37 RLS-enabled/no-policy informational findings.
- Performance Advisor: 18 unindexed foreign keys plus unused-index informational findings.
- These are separate findings, not migration drift, and were not modified.

## Final decision
**RECONCILIATION_COMPLETED — READ ONLY.** No migration replay, history repair, schema/RLS/function/trigger change, or deployment.

## EXACT NEXT TASK

**Migration Ledger Strategy — decide whether Menu V3 should retain the custom `menu_v3._migrations` architecture or migrate to canonical Supabase CLI migration tracking.**


# 2026-10-02 — Migration Ledger Owner Decision — VERIFIED

- **DECISION:** The existing project operational migration ledger, `menu_v3._migrations`, remains the **canonical operational migration record** for Menu V3.
- **DECISION:** `supabase_migrations.schema_migrations` is **not** the operational source of truth and is excluded from operational migration tracking, replay, and repair decisions for the current architecture.
- **DECISION:** No migration repair, replay, reset, history modification, or migration-tracking migration is authorized by this decision.
- **CONTINUITY GUARDRAIL:** Future agents/workflows must not infer pending migrations, schema drift, or required replay solely from differences between `supabase_migrations.schema_migrations` and the repository/custom ledger.
- **ROLE BOUNDARY:** The project has one human owner/developer. ChatGPT is the internal AI orchestration workflow. Agent names in project documentation denote workflows, not additional human owners or teammates.
- **REQUIRED BOOT RULE:** Before any migration action, read the repository migration runner and this decision. Treat `menu_v3._migrations` plus the repository runner as the operational migration chain unless the owner explicitly changes this decision.
- **SUPABASE HISTORY RULE:** Supabase CLI history may be inspected for audit/evidence, but it must not be used as the operational canonical ledger under the current decision.

## EXACT NEXT TASK

**Audit Follow-up — prioritize the next actionable audit finding from the current repository audit, excluding deferred P1.4 and the already-completed migration reconciliation.**

## 2026-10-02 — Supabase PostgreSQL 17.11 Security-Patch Readiness Audit — VERIFIED

### Research / evidence
- VERIFIED: Supabase project `ublxptcqefujkbeepylc` reports `ACTIVE_HEALTHY`, PostgreSQL `17.6.1.166`, server `17.6`, database size approximately 18 MB.
- VERIFIED: Supabase official changelog announces rollout of PostgreSQL `15.19 / 17.11` from `15.14 / 17.6`, with existing-project Dashboard upgrade availability from 2026-09-28.
- VERIFIED: PostgreSQL 17.11 official release/security documentation fixes multiple 17.x vulnerabilities, including CVE-2026-14666, CVE-2026-14664, and CVE-2026-14662.
- VERIFIED: no logical replication slots, no active streaming replicas visible in the database session, and no user-schema `reg*` columns.
- VERIFIED: `ltree` and `btree_gist` are not installed and no affected indexes were found.
- VERIFIED: `pgcrypto` is installed, but no user-schema `bytea` columns or database/repository PGP encrypt/decrypt paths were identified.
- VERIFIED: no affected non-extension custom operators were returned by the official detection query.
- VERIFIED: no self-hosted PG17-incompatible extensions from the official Supabase upgrade guidance are installed.

### Interpretation
- INFERRED: the project is on the pre-17.11 upstream minor line and should be treated as awaiting provider-level patch verification/upgrade, but the connected Supabase project metadata does not expose Dashboard eligibility or provider-side backport details.
- UNKNOWN: exact project-specific upgrade eligibility, blockers, scheduled maintenance, and provider backport status.

### Decision
**READINESS AUDIT COMPLETED — NO DATABASE MUTATION.** No pre-upgrade schema/data remediation was identified from the documented detection checks. The next action is owner-controlled Dashboard verification and maintenance/backup planning, not an automatic upgrade.

### Exact next action
**Verify the Supabase Dashboard upgrade eligibility/blockers for project `ublxptcqefujkbeepylc`, confirm backup readiness and a maintenance window, then explicitly authorize the upgrade if proceeding.** Re-read the project version after any upgrade before claiming the security patch is applied.

## 2026-10-02 — PostgreSQL 17.11 Pre-Upgrade Safety Check — VERIFIED

### Repository / release evidence
- VERIFIED: main remains `83d0dce84de97a46c0ddec7372babd24dcd4ceb5`.
- VERIFIED: PR #359/#360/#361 are documentation-only. Required GitHub workflow runs inspected for their heads passed. Vercel for #360/#361 is currently `failure` with a `build-rate-limit` target; no deployment success is claimed.
- VERIFIED: no application/database changes were introduced by this safety check.

### Supabase live evidence
- VERIFIED: project `ublxptcqefujkbeepylc` = `ACTIVE_HEALTHY`; PostgreSQL `17.6.1.166` / server `17.6`; database size `18 MB`.
- VERIFIED: owner Dashboard evidence shows target `17.11.0.002` and an available `Upgrade project` action. No action was taken.
- VERIFIED: 0 replication slots, 0 streaming replicas, 0 affected `reg*` columns in `menu_v3/public`, 0 custom operators in `menu_v3/public`, 0 user `ltree` objects, no `btree_gist` extension, and 0 md5 login roles.
- VERIFIED: installed extensions are `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`, and `uuid-ossp`; no deprecated Postgres 17 extension is installed.
- VERIFIED: live schema snapshot is 45 tables / 441 columns / 189 constraints / 148 indexes / 30 functions / 33 non-internal triggers / 7 policies, with 0 unvalidated constraints.
- VERIFIED: 44/45 `menu_v3` tables have RLS enabled; no RLS/auth/migration change was made.
- VERIFIED: `menu_v3._migrations` contains 69 applied migrations and latest is `20261002090000_layered_public_order_abuse_controls.sql`.
- VERIFIED: current 24-hour PostgreSQL log review found no ERROR/FATAL/PANIC events outside `mgmt-api`; observed management API errors corresponded to audit/tooling SQL attempts, not application failures.

### Compatibility analysis
- VERIFIED: PostgreSQL 17.11 is a minor release; PostgreSQL states dump/restore is not required within 17.x and calls out ltree, btree_gist, logical replication, and pgcrypto-related data as upgrade-sensitive. citeturn2view2
- VERIFIED: Supabase requires no read replicas, no logical replication slots, no unsupported extensions, and no problematic reg* data for its in-place upgrade path. citeturn2view1
- VERIFIED: no current live evidence shows those blockers in Menu V3.

### Backup / recovery gate
- VERIFIED: current Supabase organization plan is `free`.
- VERIFIED: Supabase documents daily automated backups for Pro/Team/Enterprise and recommends free-tier projects maintain their own logical/off-site exports; PITR is a Pro/Team/Enterprise add-on. citeturn2view0
- UNKNOWN: current backup artifact/recency, restore test, and PITR recovery window for this project.

### Decision
**PRE-UPGRADE SAFETY CHECK COMPLETE — EXECUTION BLOCKED BY UNVERIFIED BACKUP/RECOVERY READINESS.** No schema/data remediation is required from the compatibility checks performed. No PostgreSQL upgrade, migration, reindex, extension change, or configuration mutation was performed.

### Exact next action
**Create and verify a fresh logical backup of the ~18 MB database, record recovery evidence, then choose the maintenance window. After explicit owner authorization, perform the Supabase Dashboard upgrade and re-read version/health before declaring success.**
