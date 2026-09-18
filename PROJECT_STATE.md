# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Verified Position — 2026-09-18
- VERIFIED: canonical `main` is `1a09cfeb92105b2e01ae0d4db223b1bfbda6caf9` after PR #197 merge.
- VERIFIED: PR #197 is CLOSED / MERGED at `1a09cfeb92105b2e01ae0d4db223b1bfbda6caf9`.
- VERIFIED: Quality run `35364239274` passed all configured quality, browser, and performance stages.
- VERIFIED: W9 Orders QA run `35364239435` passed.
- VERIFIED: GitHub combined status for current `main` contains only the Vercel `failure` context caused by the documented build/deployment rate-limit surface; this is not CI Quality failure.
- UNKNOWN: direct Vercel Production deployment identity/configuration for this `main`.
- UNKNOWN: physical real-device production QA.
- UNKNOWN: direct production HTTP 404 verification for invalid public menu URLs.

- VERIFIED: canonical `main` is `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`; this is the current canonical post-A.3 continuity head.
- VERIFIED: PR #179 `feat: add platform new-customer notifications` is CLOSED / MERGED at `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 `docs: close platform notification continuity` is CLOSED / MERGED at `e8677a9d20c19ab03eff84d39358a66918b932b2`.
- VERIFIED: PR #161, #174, and #176 are now CLOSED as obsolete/superseded historical work.
- VERIFIED: current `main` includes both PR #179 and PR #180.
- VERIFIED: no runtime code changes are part of this continuity reconciliation.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.

## PH Lifecycle — Completed

PH-01 through PH-06 are completed historical milestones. No additional PH milestone is currently defined.

## PH-01 — Self-Serve Customer Lifecycle — CLOSED / VERIFIED / MERGED
PR: #170
Merge commit: `7e91778bfafa67b24efd1edf4387e1f3014fae9d`

### Customer lifecycle contract
- New customer: Home → Registration → secure workspace provisioning → Studio.
- New customers do not depend on a manual approval/request queue before entering the product.
- Existing customer: Home → Login → email OR phone + password → existing workspace / Studio.
- Platform Admin customer control remains centered on `/admin/users` and is server-authorized.
- Tenant and branch isolation, fail-closed provisioning, authentication, authorization, and server-side trust boundaries remain protected.

### Legacy retirement
- Legacy Leads / Service Requests are removed from the active Platform Admin customer lifecycle surface.
- The previous approval/request gating dependency was retired rather than merely hidden.
- Legacy request-record/trigger cleanup included in PR #170 is recorded as completed in the PR scope.
- No replacement approval queue was introduced.

### Platform Admin
- `/admin/users` remains the supported customer-control surface.
- Legacy Service Requests / Leads are not the customer lifecycle control surface.
- Admin navigation and route behavior were corrected and verified during the PR work.

### Verification
- VERIFIED BY MANUS REPORT: Quality gates passed for the final PH-01 batch.
- VERIFIED BY MANUS REPORT: W9 Orders QA passed.
- VERIFIED FROM GITHUB: merge commit is verified.
- Manus reported that a prior local TypeScript/baseUrl check failed because of a local toolchain/version mismatch; official CI was the authoritative quality gate for the merged batch.

## Completed Protected Product Work
- G1–G7.2 — CLOSED / VERIFIED.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for activation/measurement implementation; outcome remains pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 internal product experience work — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; its draft PR history remains protected separately.

## Production / Release Gates
- VERIFIED: GitHub `main` contains the PH-01 merge and protected prior work.
- VERIFIED: GitHub `main` now contains PR #172 homepage runtime fix.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.
- BLOCKED / NON-BLOCKING: the PR #172 Vercel deployment attempt was rate-limited by the known free daily deployment quota; no retry was performed.
- Do not use Vercel as an iteration loop or trigger unnecessary deployment retries.

## Current Strategic Direction
The current Activation workstream is closed; the repository is awaiting the owner's next explicitly scoped task.

```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Guest Relationships
→ Customer Self-Serve Lifecycle
→ Existing implemented commercial/admin capabilities
```

Do not turn the product into a generic AI chatbot, POS, accounting system, or autonomous restaurant operator.

## Continuity Rule
At the end of every atomic task:
1. reconcile Git head against GitHub `main`;
2. distinguish implementation, CI, deployment, and device evidence;
3. update continuity files when canonical state changes;
4. record exactly one next authorized task;
5. never infer authorization for deferred payment/commercial work.

## 2026-09-18 — A.3 Implementation — CLOSED / VERIFIED
- VERIFIED: runtime implementation is on `feat/a3-session-order-attribution-2026-09-18`.
- VERIFIED: final implementation head before squash merge is `e1d406edb4def53355d7e6c623b70108a5940a9d`.
- VERIFIED: canonical `main` is `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: no production deployment was performed.
- VERIFIED: GitHub Quality run `35344719541` and W9 Orders QA run `35353500533` passed.

## 2026-09-17 — Homepage Runtime Regression — CLOSED / VERIFIED
- VERIFIED: PR #172 fixed the public homepage `React.Children.only` crash.
- VERIFIED: root cause was multi-child `Button asChild` composition: `Link` plus trailing `ArrowUpLeft` icon.
- VERIFIED: `src/components/ui/button.tsx` now uses Radix `Slottable` for multi-child `asChild` composition.
- VERIFIED: `tests/public-pages-themes-contract.test.mjs` contains regression protection.
- VERIFIED: Quality run `35266109690` and W9 Orders QA `35266109691` passed.
- VERIFIED: merge commit is `8050d2f08a2904f5ee2d9085454c47bdba601392`.
- UNKNOWN: physical real-device Production QA for the latest main.
- Durable incident record: `docs/project-memory/2026-09-17-homepage-react-children-only.md`.

## A.1 — Customer Journey & Event Truth Audit — CLOSED / VERIFIED
- VERIFIED: audit completed against repository baseline `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27` and live Supabase.
- VERIFIED: no runtime code, schema, auth/RLS, theme, or deployment changes were made.
- VERIFIED: audit: `docs/audits/2026-09-18-a1-customer-journey-event-truth-audit.md`.
- VERIFIED: A.2 implementation is on branch `feat/a2-minimal-journey-instrumentation-2026-09-18` at `fb3b27218fcd8f732b0a2472ff72b2420e067b02`.
- VERIFIED: PR #191 is CLOSED / SUPERSEDED by PR #192.
- VERIFIED: A.2 adds canonical `search`, `category_view`, and `add_to_cart` events to `menu_events` with tenant-scoped category validation/storage.
- VERIFIED: GitHub Quality run `35340567488` passed; W9 Orders QA run `35340567487` passed.
- VERIFIED: no production deployment or synthetic traffic was used.
- VERIFIED: remaining gaps are authoritative event → order linkage, cart-open measurement, and the existing `menu_events.session_id` nullability mismatch.
- BLOCKED: Supabase security advisor reports RLS disabled on six live tables; separate security task required.
- UNKNOWN: physical Production device QA, current Production environment values, sufficient real R6 exposure.

## A.2 — Minimal Journey Instrumentation — CLOSED / VERIFIED BY CI
- Scope was limited to search/category/add-to-cart measurement.
- Canonical `menu_events` was extended; no parallel analytics stream was introduced.
- Existing tenant/branch validation, product ownership validation, R6 experiment semantics, Owner Analytics, Growth, Reports, R2–R9, and public-menu architecture were preserved.
- Focused regression coverage was added for the server contract and all live public renderer families.
- Quality and W9 Orders CI passed on the final head.

## A.3 — Server-Controlled Anonymous Session → Order Attribution — CLOSED / VERIFIED BY CI
- VERIFIED: implementation branch `feat/a3-session-order-attribution-2026-09-18`.
- VERIFIED: final implementation head before squash merge is `e1d406edb4def53355d7e6c623b70108a5940a9d`.
- VERIFIED: canonical `main` is `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: PR #192 is CLOSED / MERGED at `42f0a7e3caf8939b28672685ac2d578578c9d90c`.
- VERIFIED: server-issued `__Host-menu_v3_sid` is opaque, HttpOnly, Secure, SameSite=Lax, host-only, bounded, and server-validated.
- VERIFIED: canonical `menu_events` now receives the server-resolved session; public event calls no longer accept client-supplied `sessionId`.
- VERIFIED: public orders attach `anonymous_session_id` only from a valid server-issued tenant-bound session.
- VERIFIED: tenant/session consistency is enforced by a composite foreign key at the database boundary.
- VERIFIED: historical orders/events remain untouched; no retroactive relinking was introduced.
- VERIFIED: existing order validation, pricing, rate limiting, idempotency, and status-event flow remain protected.
- VERIFIED: GitHub Quality run `35353500574` passed after the final R6 experiment-session alignment correction.
- VERIFIED: GitHub W9 Orders QA run `35353500533` passed.
- VERIFIED: typecheck, full tests, lint, production build, public all-theme browser QA, Studio browser QA, Platform Admin browser QA, and performance stages passed in Quality.
- VERIFIED: no production deployment occurred.
- UNKNOWN: physical real-device QA and live production cookie behavior.
- BLOCKED / NON-BLOCKING: Vercel PR status failed because the connected Vercel account hit its build/deployment rate limit; no retry was performed.

## Exact Next Task
**Release Evidence @GitHub — assemble and verify the repository-side release evidence batch before any production deployment decision.**

Do not deploy automatically. Do not begin product/category deep links or native Web Share automatically.

## 2026-09-18 — A.4 International Boundary Audit — CLOSED / VERIFIED
- VERIFIED: A.4 was authorized explicitly and audited against canonical `main` at `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: audit record: `docs/audits/2026-09-18-a4-international-boundary-audit.md`.
- VERIFIED: no runtime, schema, auth, RLS, theme, or deployment changes were made.
- VERIFIED: Menu V3 is Saudi-first but not fundamentally Saudi-architected; tenant country/currency are represented as data, while several formatting and lifecycle seams remain Saudi-bound.
- VERIFIED: largest technical gap identified is inconsistent explicit time-zone handling; reusable currency formatting also remains SAR-specific.
- VERIFIED: Saudi self-serve phone onboarding is an intentional commercial/security boundary and was not broadened.
- VERIFIED: external i18n research covered W3C Internationalization, Unicode CLDR, and JavaScript Intl guidance.
- UNKNOWN: local runtime/browser/device behavior for any future implementation derived from A.4.
- BLOCKED: no blocker for the audit itself; production deployment was not part of A.4.


## 2026-09-18 — A.5 Public Shareability / Deep-Link Audit — CLOSED / VERIFIED
- VERIFIED: A.5 audit completed against canonical `main` at `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: audit record: `docs/audits/2026-09-18-a5-public-shareability-deep-links.md`.
- VERIFIED: public tenant and branch routes are structurally direct-addressable and server-resolved.
- VERIFIED: QR URLs, locale state, canonical URLs, hreflang, theme-preview noindex behavior, tenant/branch isolation, and all-theme route architecture were inspected.
- VERIFIED: competing robots/sitemap implementations exist across `src/lib/menu/seo-discovery.ts` + `server/middleware/seo-discovery.ts` and `src/lib/seo/crawl.ts` + `server/middleware/grok-pwa.ts`.
- GAP: invalid public-menu handling returns an application-level `not_found` result rather than a proven route-level HTTP 404; runtime confirmation is still required.
- GAP: `/m/:slug` has first-active-branch ambiguity for multi-branch tenants; branch-specific sharing is deterministic via `/m/:slug/:branch`.
- DEFERRED: product/category deep links and native Web Share API are growth opportunities, not part of the remediation gate.
- UNKNOWN: current production HTTP behavior for invalid routes because runtime/device execution was not available in this audit.
- Exact next task: **A.5 Remediation — unify public discovery ownership and establish a verified HTTP 404 contract for public menu routes.**


## 2026-09-18 — A.5 Remediation — CLOSED / VERIFIED
- VERIFIED: PR #196 `fix: unify public discovery and establish route-level 404s` merged into `main` at `b98e3e1ae832c389157de2205979be4801fce63b`.
- VERIFIED: `server/middleware/seo-discovery.ts` is the sole active owner of `/robots.txt` and `/sitemap.xml`; superseded `src/lib/seo/crawl.ts` and PWA ownership were removed.
- VERIFIED: canonical sitemap retains locale-aware branch URLs, reciprocal `hreflang` alternates where English content exists, and deterministic duplicate suppression.
- VERIFIED: both public route variants now throw TanStack Router `notFound()` for `getPublicMenu` `not_found` results.
- VERIFIED: Quality run `35363323737` passed; W9 Orders QA run `35363323728` passed.
- BLOCKED / NON-BLOCKING: Vercel remains rate-limited; no deployment or retry was performed.
- UNKNOWN: direct production HTTP verification of invalid public URLs and physical real-device QA remain release-stage evidence.
- Protected public themes, ordering, analytics, tenant/branch isolation, auth/RLS boundaries, and deployment policy were not redesigned or weakened.

## Exact Next Task
**Release Evidence @GitHub — assemble and verify the repository-side release evidence batch before any production deployment decision.**

Do not deploy automatically. Do not begin product/category deep links or native Web Share automatically.
