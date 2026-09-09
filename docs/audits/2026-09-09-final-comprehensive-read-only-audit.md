# Menu V3 — Final Comprehensive Read-Only Audit

**Date:** 2026-09-09  
**Repository:** `Midosd249/Menu_V3`  
**Branch:** `main`  
**Audit mode:** READ-ONLY during investigation; no application, database, deployment, or configuration changes were made as part of the audit.  
**Owner:** Principal Engineer / Continuity Agent

## 1. Executive decision

### GO WITH CONDITIONS — implementation is stable enough to continue, but the product is **not yet a clean production sign-off**.

The repository and production deployment are currently aligned on `main` at commit `d4c50d1b774ee1cb16c7cda2dff0c8b410d97a8c`, and the current Vercel production deployment is `READY`. The latest repository documentation also records successful Quality run `1153` for typecheck, full tests, lint, production build, Playwright/Chromium, and all-theme browser QA.

The strongest blockers are no longer theme implementation defects. They are:

1. **HIGH:** public guest order submission has no visible application-level abuse/rate-limit/idempotency control in `submitPublicOrder`; fake order flooding remains a production-risk surface.
2. **HIGH:** the live Supabase project has five anonymous-callable `SECURITY DEFINER` RPCs plus one authenticated-callable `SECURITY DEFINER` RPC flagged by Security Advisor; their ownership/parity with the current Menu V3 repository is not fully proven because the current migrations do not contain matching definitions for several of those public RPC names.
3. **MEDIUM:** Supabase Security Advisor reports 25 `menu_v3` tables with RLS enabled but no policies. Repository migrations explicitly state that the server-side application is the authorization boundary, so this is not automatically a vulnerability, but it is a defense-in-depth and exposure-contract item that must remain intentional and documented.
4. **MEDIUM:** `main` is not branch-protected and has no required status checks. A direct push can bypass the quality gate and release discipline.
5. **MEDIUM:** `package.json` and `package-lock.json` are not fully aligned, while CI uses `npm install` rather than `npm ci`; this reduces deterministic dependency reproducibility.
6. **UNKNOWN/BLOCKED:** physical Android/iOS, QR-camera, screen-reader, authenticated Owner keyboard, and device-specific browser verification are still not directly observable through the available connector/runtime environment.

The five canonical themes and their completed visual work are **PROTECTED** and should not be reopened merely because this audit found operational/security work.

## 2. Evidence model

- **VERIFIED:** directly observed in current GitHub, Supabase, or Vercel evidence.
- **INFERRED:** derived from multiple verified source relationships.
- **PROPOSED:** recommendation not yet proven by runtime evidence.
- **UNKNOWN:** evidence is not exposed by the available tools.
- **BLOCKED:** a verification step cannot be completed in the current environment.

## 3. Exact current identity

### Git

- `main` currently points to `d4c50d1b774ee1cb16c7cda2dff0c8b410d97a8c`.
- Commit message: `docs: record successful cross-theme preview verification`.
- The previous `PROJECT_STATE.md` head `1813d013...` is stale and must not be treated as current.
- `main` is currently reported as **not protected**, with required status checks disabled.

### Supabase

- Project ref: `ublxptcqefujkbeepylc`.
- Region: `ap-northeast-2` (Seoul).
- Status: `ACTIVE_HEALTHY`.
- Repository-defined canonical application schema: `menu_v3`.
- The application database adapter explicitly sets PostgreSQL `search_path=menu_v3,public` and uses the `menu_v3` schema for production.
- Supabase live project inspection confirms the same project ref.

### Vercel

- Project: `menu-v3`.
- Project ID: `prj_ydfrFBE7ZJVmuNnCOTv3WjWkhuH1`.
- Team ID: `team_4qTUNnhDhAW00uQId6JvETf4`.
- Current production deployment: `dpl_2jWoXyPwoeKFzAL54MKSiaEvHL43`.
- State: `READY`.
- Target: `production`.
- Deployment commit: `d4c50d1b774ee1cb16c7cda2dff0c8b410d97a8c`.
- Production aliases include `menu-v3-kohl.vercel.app`.
- Current 24-hour Vercel runtime error aggregation returned **no runtime errors**.

## 4. Architecture audit

### VERIFIED strengths

- React 19 + TypeScript + TanStack Start/Router + Vite + PostgreSQL/PGlite-ready data layer + Better Auth + Vercel is coherent with the documented architecture.
- Server functions use explicit authentication middleware for owner/admin operations.
- `authMiddleware` performs same-site/sibling request isolation before resolving the user identity.
- Production PostgreSQL uses a small pool (`max: 2`) with Supavisor-aware connection behavior.
- Production application tables are intentionally isolated in `menu_v3` rather than relying on the legacy public schema.
- PGlite is treated as a development/fallback path and skips incompatible `menu_v3` migrations rather than pretending to execute them.

### INFERRED architecture risk

The system has two security planes that must remain clearly separated:

1. Better Auth + server-side application authorization for Menu V3.
2. Supabase/Postgres RLS, grants, and exposed REST/RPC surfaces.

The code deliberately treats the server application as the authorization boundary. That is valid only if direct database credentials and public Supabase API exposure remain correctly constrained. Future work must not assume that enabling RLS alone provides the application's authorization semantics.

## 5. Authentication / authorization / tenant isolation

### VERIFIED

- Owner Studio server functions use `authMiddleware`.
- Membership is resolved from the authenticated user ID and tenant membership.
- Menu write operations check role before writes.
- Branch-scoped authorization infrastructure exists in `menu_v3`.
- Subscription entitlement enforcement exists at the database boundary.
- Platform-admin access is intended to fail closed and remains server-side.
- Cross-site/sibling scripted requests are rejected by `assertSameSiteRequest()` before per-user data access.

### HIGH finding — SEC-01: live SECURITY DEFINER RPC surface needs final ownership/grant reconciliation

**Evidence:** Supabase Security Advisor observed five anonymous-callable `SECURITY DEFINER` functions:
- `get_public_menu`
- `record_public_menu_event`
- `submit_service_request`
- `submit_visibility_audit`
- `submit_website_brief`

and one authenticated-callable `SECURITY DEFINER` function:
- `manage_tenant_member_by_email`

The current Menu V3 migration/code search does not expose matching definitions for several of these public RPC names; the application primarily uses TanStack server functions and direct PostgreSQL access.

**Impact:** if any legacy or parallel public RPC can read/write sensitive data beyond its intended boundary, it becomes an independent attack surface even if the current application routes are secure.

**Recommended fix:** inventory every live `public` function, exact definition, owner, `search_path`, `EXECUTE` grants, and data touched; compare it against current Menu V3 ownership. Revoke or constrain any function that is not intentionally public. Do not blindly delete functions because legacy functionality may depend on them.

**Verification:** direct SQL/catalog inspection against the canonical project plus negative authorization tests for anonymous and authenticated roles.

**Production blocker:** YES until ownership/grant intent is explicitly proven for the six flagged functions.

### MEDIUM finding — SEC-02: RLS-enabled/no-policy state is intentional in code but needs final exposure proof

**Evidence:** Supabase Security Advisor reports 25 `menu_v3` tables with RLS enabled and no policies. Repository migrations contain comments such as “The application server is the authorization boundary for these tables.”

**Interpretation:** this is not automatically a defect because the application intentionally uses server-side database access. It becomes dangerous if any client-facing role can directly access the schema/table through Supabase Data API or grants.

**Recommended fix:** prove the effective grants/exposed schemas and confirm that `anon`/`authenticated` cannot bypass the server authorization layer. Keep the intentional no-policy design documented if confirmed.

**Production blocker:** CONDITIONAL; blocked only if direct client exposure is found.

## 6. Public menu and order flow

### VERIFIED strengths

- Public menu access validates slug/branch input.
- Published/active tenant checks are server-side.
- Public menu caching includes tenant, branch, and `public_content_version` in the cache key.
- Product options/variants are loaded server-side and filtered by tenant/product ownership.
- Client product details use accessible modal semantics, focus restoration, Escape handling, and keyboard focus containment.
- Arabic/English labels and `bdi`/LTR isolation are used for prices and numeric values.
- Product images use lazy loading, async decoding, and a deterministic fallback.
- The public cart is shared and the order submission path is centralized in `submitPublicOrder`.
- Server-side order pricing is recalculated from authoritative product/variant/modifier data; the client does not supply the final price.
- Variant ownership, availability, modifier membership, min/max selection rules, product availability, and tenant identity are revalidated server-side.
- Item notes are bounded to 500 characters and are persisted as typed order-item metadata.

### HIGH finding — ORDER-01: public order endpoint lacks visible abuse/rate-limit/idempotency protection

**Evidence:** `submitPublicOrder` is a public `POST` server function with guest customer data and no authentication requirement. The schema bounds sizes and quantities, but the source contains no explicit request rate limiter, IP/session throttle, CAPTCHA/anti-bot control, or idempotency key.

**Impact:** an attacker can repeatedly create valid-looking guest orders, creating operational noise for restaurants and potentially consuming database/runtime resources.

**Recommended fix:** add a server-side abuse-control layer appropriate to Vercel/serverless operation. Prefer a tenant-scoped, short-window rate limit plus a signed/idempotency token or deterministic duplicate-order guard. Do not trust a client-only “ordering enabled” flag. Preserve the existing authoritative pricing and tenant checks.

**Verification:** burst tests from one session/IP and replay tests for identical submissions; verify legitimate repeated orders remain possible.

**Production blocker:** YES for a commercial public-ordering launch unless restaurant owners explicitly accept the operational risk.

## 7. Public actions / analytics

### VERIFIED

- Public events are constrained to the documented event taxonomy.
- Visit/QR events have a 30-minute session-based duplicate guard.
- Product view validates product ownership against the tenant.
- WhatsApp/phone/map/social action rendering is capability/data driven rather than blindly rendered.
- Current project has no evidence of a third-party analytics SDK being introduced.

### PROPOSED hardening

Public analytics endpoints should receive the same abuse-control treatment as public ordering if analytics volume becomes material. Current de-duplication reduces noise but is not a general rate limiter.

## 8. Theme and visual system audit

### VERIFIED

The canonical registry contains exactly five active theme keys:

1. `essential` → `small-menu`
2. `editorial` → `contemporary-restaurant`
3. `noir` → `fine-dining-hospitality`
4. `heritage` → `contemporary-restaurant` and the Taste presentation (`مذاق` / `Taste`)
5. `gallery` → `bakery-dessert`

The canonical `ThemeRenderer` is shared by published/public and preview surfaces. Studio Preview currently uses `MenuThemeController` + `ThemeRenderer`, eliminating the previously identified preview-family drift.

### VERIFIED protected work

- Noir retains its cinematic dark identity and is not being homogenized into Taste.
- Heritage/Taste remains the premium Arabic restaurant presentation.
- Gallery retains the Mazaq-inspired hero and the later header/action-dock composition.
- Gallery hero scroll behavior was scoped to Gallery rather than changing the shared renderer.
- Quick Add remains conservative: direct add is only allowed for available simple products; configurable products stay on the details/options flow.
- Item Notes are integrated into the existing cart/order path.
- Shared cart behavior remains intact.

### Visual quality conclusion

The repository evidence supports **DO NOT REOPEN THE FIVE THEMES** as a general redesign task. The existing theme contracts, visual audits, and browser QA are sufficient to continue. Remaining visual evidence gaps are physical-device/manual rather than source-level theme drift.

## 9. Accessibility / RTL / responsive quality

### VERIFIED

- Shared dialogs use `role=dialog`, `aria-modal`, labelled headings, Escape handling, focus restoration, and Tab containment.
- Touch targets in the public order/detail flows are generally sized around the repository's accessibility contract.
- Arabic/English labels and direction-safe price rendering are explicitly handled.
- Existing CI Browser Template QA covers all five themes across mobile/tablet/desktop according to the recorded Quality run.

### UNKNOWN / BLOCKED

- Real Android/iOS pixel rendering.
- QR-camera scanning from an actual device.
- Manual screen-reader behavior.
- Authenticated Owner keyboard traversal.
- Browser-specific behavior outside the CI Chromium coverage.

These are the final human/device verification gaps, not reasons to redesign the themes.

## 10. SEO / discovery / performance

### VERIFIED

- Repository contains explicit SEO/discovery modules and regression tests.
- Public menu sitemap entries include tenant and branch paths.
- The public menu uses a short in-memory cache with a revision-aware key.
- Images use lazy loading and async decoding in the shared public menu.
- CI runs a browser performance audit and uploads a baseline artifact.

### UNKNOWN

- Current production CDN/RUM measurements are not exposed by the available audit surface.
- Exact real-user image transfer and cache-hit distributions are not directly measured here.

## 11. CI / build / release audit

### VERIFIED

- `.github/workflows/quality.yml` runs route generation, typecheck, tests, lint, production build, Playwright installation, browser performance audit, and all-theme Browser Template QA.
- The latest repository session documentation records Quality run `1153` as passing for those gates.
- Vercel currently reports the production deployment for the latest `main` commit as `READY`.
- No runtime errors were found in the current Vercel 24-hour aggregation query.

### MEDIUM finding — REL-01: `main` has no branch protection / required status checks

**Evidence:** GitHub branch API reports `protected=false` and required status checks enforcement `off`.

**Impact:** a direct push can bypass the repository quality workflow and release discipline.

**Recommended fix:** protect `main` with required CI status checks and, if desired, require pull-request review. Keep deployment separate from merge acceptance.

**Production blocker:** NO for the current sole-owner workflow, but HIGHLY RECOMMENDED before onboarding collaborators or relying on unattended releases.

### MEDIUM finding — REL-02: package manifest / lockfile drift and non-deterministic CI install

**Evidence:** `package.json` and the lockfile root dependency list are not identical; the lockfile contains additional Radix packages and version declarations not represented identically in `package.json`. CI uses `npm install`, not `npm ci`.

**Impact:** dependency resolution can change across CI runs and may conceal stale dependency metadata.

**Recommended fix:** reconcile `package.json` and `package-lock.json`, then use `npm ci` in CI when the lockfile is authoritative.

**Production blocker:** NO, but it should be resolved before the next dependency-sensitive release.

## 12. Supabase performance advisor

### VERIFIED observations

- Three unindexed foreign keys were reported in the `public` growth/visibility tables.
- 32 unused indexes were reported across legacy/public and `menu_v3` structures.
- 13 tables were reported with multiple permissive authenticated policies in the public schema.

### Interpretation

These are advisor-level optimization/hygiene signals, not automatically defects. In particular, unused-index counts can reflect a database that has not yet experienced representative production traffic.

### Recommendation

Do not delete indexes based only on the advisor. Review query plans/production workload first. Add missing FK indexes where delete/update/join workloads justify them.

## 13. Documentation / continuity audit

### HIGH operational finding — DOC-01: continuity state is stale relative to the real repository head

`PROJECT_STATE.md` still identifies `1813d013...` as current main head, while GitHub directly reports `main = d4c50d1b...` and Vercel production is deployed from the same `d4c50d1b...` commit.

**Impact:** an agent restarting after an interruption can incorrectly reason from a stale commit and miss the latest preview verification state.

**Resolution:** this audit is being recorded as a durable project artifact, and the continuity state must be reconciled in the same documentation batch.

## 14. External research cross-check

The external research lens was used only for standards/platform context, not as a source of truth for application state. The useful cross-checks were:

- TanStack Start remains an SSR/full-stack React framework with server/client execution boundaries; the repository's server-function architecture is consistent with that model.
- Vercel's current deployment guidance separates successful builds from production promotion and supports deployment checks; this reinforces the repository's release-only workflow.
- WCAG and platform guidance continue to support the repository's emphasis on touch targets, focus, reduced-motion, and accessible dialogs.

The external sources do not override repository/Git/Supabase/Vercel evidence.

## 15. Readiness matrix

| Domain | Status | Decision |
|---|---|---|
| Repository architecture | VERIFIED | GO |
| Theme system | VERIFIED | GO — protect |
| Studio/public theme consistency | VERIFIED | GO |
| Auth/authz | VERIFIED source-level | GO with live-grant review |
| Tenant/branch isolation | VERIFIED source-level | GO |
| Public menu | VERIFIED | GO |
| Guest order integrity | VERIFIED pricing/validation | HOLD for abuse controls |
| Supabase identity | VERIFIED | GO |
| Supabase live grants/RPC inventory | UNKNOWN/HIGH | HOLD for final security sign-off |
| CI quality | VERIFIED by recorded Quality run 1153 | GO |
| Production deployment | VERIFIED READY | GO |
| Runtime errors | VERIFIED none in current 24h aggregation | GO |
| Physical device / QR / screen reader | UNKNOWN/BLOCKED | Final manual gate |
| Main branch protection | VERIFIED absent | Improve before collaboration |
| Dependency reproducibility | MEDIUM risk | Fix before dependency-sensitive release |

## 16. P0–P3 remediation plan

### P0 — before commercial public-order launch
1. Complete live Supabase function/grant inventory and prove the six Security Advisor `SECURITY DEFINER` findings are intentional and safe.
2. Add public order abuse protection and replay/idempotency controls.
3. Run negative authorization tests against the live canonical project for anonymous, authenticated non-member, member, editor, admin, owner, and platform-operator paths.

### P1 — before next major release
1. Reconcile `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` with actual `main` and production deployment evidence.
2. Reconcile `package.json`/`package-lock.json` and move CI to deterministic installation.
3. Protect `main` with required quality checks.

### P2 — final human/device gate
1. Android/iOS small/standard/large widths.
2. Arabic RTL, English LTR, mixed-direction data.
3. Long product names, long SAR prices, missing images.
4. Product details/options, item notes, quick add, cart empty/populated, order submit/error states.
5. Safe-area and bottom-action visibility.
6. QR camera scan.
7. Screen-reader/focus verification.

### P3 — optimization
1. Review advisor-reported unused indexes against representative production workload.
2. Add covering indexes for genuinely hot foreign-key paths.
3. Establish production RUM for menu load, order-submit latency, and public event volume.

## 17. Protected areas

Do not reopen these without new runtime evidence:

- `ThemeRenderer` architecture.
- Essential visual system.
- Editorial visual system.
- Noir cinematic identity.
- Heritage/Taste `مذاق` identity.
- Gallery hero/header/action-dock composition.
- Gallery scroll fix.
- Quick Add conservative decision rule.
- Item Notes + existing cart/order flow.
- Tenant/branch/auth boundaries.
- Existing migration history.
- Release-only Vercel policy.

## 18. Exact next atomic task

**P0 Security + Abuse Gate:** perform a read-only live Supabase catalog/grant/RPC inventory and then implement only the minimum verified hardening for the six flagged `SECURITY DEFINER` functions and public-order abuse control. Do not touch the five themes unless the live-device gate reproduces a visual defect.

## 19. Final status

- Implementation status: `VERIFIED_LOCALLY` is **not claimable** from this connector session because local repository execution is unavailable; CI evidence is the executable source.
- CI status: `VERIFIED` by repository-recorded Quality run `1153`.
- Production status: `DEPLOYED` / `READY` is directly verified in Vercel for `d4c50d1b...`.
- Audit status: `COMPLETED_READ_ONLY`.
- Remaining blocker: final security/RPC inventory + public-order abuse control + physical-device/manual accessibility gate.
