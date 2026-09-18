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

## Exact next task
**A.5 Remediation — unify public discovery ownership and establish a verified HTTP 404 contract for public menu routes.**

Do not begin product/category deep links, native share UI, Release Evidence, or deployment automatically.
