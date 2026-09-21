# A.5 Session Log — Public Shareability / Deep-Link Audit

## Date
2026-09-18

## Classification
Audit-only public routing / shareability / SEO discovery task.

## Verified baseline
- Canonical `main`: `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- A.4 PR #194 is merged.
- No production deployment was performed for A.5.

## Work completed
- Audited `/m/:slug` and `/m/:slug/:branch`.
- Audited QR deep-link generation and `src=qr` handling.
- Audited Arabic/English route state and canonical/hreflang behavior.
- Audited theme-preview indexation.
- Audited robots/sitemap implementations.
- Audited invalid-menu handling.
- Audited product/category deep-link support and public share surfaces.
- Audited tenant/branch/data boundaries and all-theme route architecture.

## Material findings
1. Direct public routing is structurally supported.
2. Branch-specific URLs are the stronger share contract; tenant-level URLs have default-branch ambiguity.
3. QR tracking is separated from canonical identity.
4. Arabic/English canonical/hreflang behavior is coherent when English content exists.
5. Two competing robots/sitemap implementations exist and must be unified.
6. Invalid public-menu handling does not currently prove a real HTTP 404 and requires runtime verification plus a focused fix.
7. Product/category deep links are not first-class and remain deferred.
8. No Web Share API implementation was found; this is deferred growth work.

## Verification
- Repository/GitHub inspection: VERIFIED.
- Runtime/browser/device verification: UNKNOWN.
- Production HTTP status for invalid routes: UNKNOWN.


## A.5 Remediation Closeout — 2026-09-18

### Classification
Focused P0 release-correctness remediation.

### Work completed
- Unified `/robots.txt` and `/sitemap.xml` ownership under `server/middleware/seo-discovery.ts`.
- Removed `src/lib/seo/crawl.ts` and crawler response handling from `server/middleware/grok-pwa.ts`.
- Preserved the canonical locale-aware sitemap contract and added deterministic duplicate suppression.
- Added router-level `notFound()` handling to both public menu route variants.
- Added regression contracts for discovery ownership and both public 404 route variants.
- Merged PR #196 at `b98e3e1ae832c389157de2205979be4801fce63b`.

### Verification
- VERIFIED: Quality run `35363323737` — SUCCESS.
- VERIFIED: W9 Orders QA run `35363323728` — SUCCESS.
- VERIFIED: final PR diff reviewed before merge.
- UNKNOWN: direct production HTTP 404 behavior.
- UNKNOWN: physical real-device QA.
- BLOCKED / NON-BLOCKING: Vercel rate-limit status; no deployment/retry.

### Exact next task
**Release Evidence @GitHub — assemble and verify the repository-side release evidence batch before any production deployment decision.**

Do not deploy automatically. Do not begin product/category deep links or native Web Share automatically.
