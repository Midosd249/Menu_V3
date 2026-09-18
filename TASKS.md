# TASKS

## Current State — 2026-09-18

- VERIFIED: canonical `main` = `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`; this is the current canonical post-A.3 continuity head.
- VERIFIED: PR #179 is CLOSED / MERGED at `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 is CLOSED / MERGED at `e8677a9d20c19ab03eff84d39358a66918b932b2`.
- VERIFIED: A.2 implementation is complete on branch `feat/a2-minimal-journey-instrumentation-2026-09-18` at `fb3b27218fcd8f732b0a2472ff72b2420e067b02`.
- VERIFIED: PR #191 is CLOSED / SUPERSEDED by PR #192.
- VERIFIED: Quality run `35340567488` passed and W9 Orders QA run `35340567487` passed.
- VERIFIED: no production deployment or synthetic traffic was used.
- UNKNOWN: physical real-device Production QA for latest `main`.

## PH Lifecycle — Completed

PH-01 through PH-06 are completed historical milestones. No additional PH milestone is currently defined.

## PH-01 — CLOSED / VERIFIED / MERGED

PR #170: `fix: retire legacy customer approval and request flows`

Merge commit: `7e91778bfafa67b24efd1edf4387e1f3014fae9d`

### Acceptance state
- New customer: Home → Registration → secure workspace provisioning → Studio.
- Existing customer: Home → Login → email OR phone + password → existing workspace / Studio.
- New customers no longer depend on manual approval/request gating.
- `/admin/users` remains the server-authorized customer-control surface.
- Legacy Leads and Service Requests are retired from the active Platform Admin lifecycle surface.
- Tenant/branch isolation, fail-closed provisioning, auth, authorization, and server-side trust boundaries remain protected.

### Verification provenance
- GitHub confirms PR #170 merged into `main` at `7e91778...`.
- Manus reported successful Quality and W9 Orders QA gates.
- Manus reported the remaining local TypeScript/baseUrl check was a local toolchain/version mismatch rather than an application failure.

## Homepage Runtime Fix — CLOSED / VERIFIED / MERGED

PR #172: `fix: prevent homepage React.Children.only crash`

Merge commit: `8050d2f08a2904f5ee2d9085454c47bdba601392`

### Acceptance state
- Public homepage signup CTAs no longer crash when `Button asChild` contains a Link plus an icon.
- Radix `Slottable` keeps the Link as the slotted interactive element while preserving sibling content.
- Regression contract covers the homepage multi-child `asChild` pattern.
- No backend, database, authentication, RLS, tenant isolation, pricing, theme renderer, or deployment configuration changes were introduced.

### Verification
- GitHub Actions Quality run `35266109690` — SUCCESS.
- Typecheck — SUCCESS.
- Full repository tests — SUCCESS.
- Lint — SUCCESS.
- Production build — SUCCESS.
- Public all-theme browser QA — SUCCESS.
- Studio browser QA — SUCCESS.
- Platform Admin browser QA — SUCCESS.
- W9 Orders QA run `35266109691` — SUCCESS.
- Physical production device QA — UNKNOWN / release-stage pending.

## Completed Strategic Tasks

- P0 Public Order Hardening — CLOSED / VERIFIED.
- P1 Production/Continuity Hardening — CLOSED / VERIFIED.
- P2 Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir Theme Hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for implementation; outcome pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; existing draft PR history remains separate.

## Production / Commercial Readiness

- Repository-side implementation through the completed PH lifecycle plus the homepage runtime fix is present in `main`.
- Physical Android/iOS production QA remains UNKNOWN / release-stage pending.
- Current production environment-variable values remain UNKNOWN from repository evidence.
- Do not use Vercel as the development iteration loop.

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## A.1 — CLOSED / VERIFIED
- Customer Journey & Event Truth Audit completed.
- Audit: `docs/audits/2026-09-18-a1-customer-journey-event-truth-audit.md`.
- No runtime/schema/deployment changes.
- Verified gaps: search/category/add-to-cart measurement and direct anonymous session → order linkage.
- Live RLS-disabled tables are recorded as a separate security blocker.

## A.2 — CLOSED / VERIFIED BY CI
- Search measurement added with session-level duplicate protection.
- Category selection measurement added with tenant-scoped `category_id` validation/storage.
- Add-to-cart measurement added to all active public renderer families.
- Focused regression coverage added.
- Existing analytics, R6, order, theme, and security boundaries preserved.

## A.3 — CLOSED / VERIFIED BY CI — Server-Controlled Anonymous Session → Order Attribution
- Implementation complete on `feat/a3-session-order-attribution-2026-09-18`.
- Final head: `3dfda5e9b4dc93f4f33855595993e1ce568210a5`.
- PR #192 is CLOSED / MERGED at `42f0a7e3caf8939b28672685ac2d578578c9d90c`.
- Server-controlled `__Host-menu_v3_sid`, tenant-bound `anonymous_sessions`, server-side event attribution, and tenant-safe order attribution are implemented.
- Client-supplied canonical event session IDs are removed.
- Quality run `35344719541` and W9 Orders QA run `35353500533` passed.
- No production deployment occurred.
- Vercel preview status is rate-limit failure only; no retry was performed.

## Release Evidence — 2026-09-18 — IN_PROGRESS / REPOSITORY EVIDENCE ASSEMBLED
- VERIFIED: canonical `main` is `1a09cfeb92105b2e01ae0d4db223b1bfbda6caf9` after PR #197 merge.
- VERIFIED: PR #197 is CLOSED / MERGED at `1a09cfeb92105b2e01ae0d4db223b1bfbda6caf9`.
- VERIFIED: Quality run `35364239274` passed all configured quality, browser, and performance stages.
- VERIFIED: W9 Orders QA run `35364239435` passed.
- VERIFIED: GitHub combined status for current `main` contains only the Vercel `failure` context caused by the documented build/deployment rate-limit surface; this is not CI Quality failure.
- UNKNOWN: direct Vercel Production deployment identity/configuration for this `main`.
- UNKNOWN: physical real-device production QA.
- UNKNOWN: direct production HTTP 404 verification for invalid public menu URLs.

## Exact Next Task
**Release Evidence @GitHub — assemble and verify the repository-side release evidence batch before any production deployment decision.**

Do not deploy automatically. Do not begin product/category deep links or native Web Share automatically.

## A.5 — CLOSED / VERIFIED — Public Shareability / Deep-Link Audit
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
- VERIFIED: PR #196 merged to `main`: `b98e3e1ae832c389157de2205979be4801fce63b`.
- VERIFIED: `server/middleware/seo-discovery.ts` is the sole active discovery owner; `src/lib/seo/crawl.ts` was removed and `grok-pwa.ts` no longer handles robots/sitemap.
- VERIFIED: public tenant and branch routes now throw `notFound()` for `not_found` menu resolution.
- VERIFIED: Quality `35363323737` and W9 Orders QA `35363323728` passed.
- VERIFIED: final PR diff was reviewed before merge.
- BLOCKED / NON-BLOCKING: Vercel rate limit; no deployment/retry.
- UNKNOWN: direct production HTTP 404 verification and physical device QA.

## Exact Next Task
**Release Evidence @GitHub — assemble and verify the repository-side release evidence batch before any production deployment decision.**

Do not deploy automatically. Do not begin product/category deep links or native Web Share automatically.
