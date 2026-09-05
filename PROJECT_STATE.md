# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DEPLOYED / VERIFIED.**
- **Theme 2 — Editorial — IMPLEMENTED / VERIFIED / MERGED on 2026-09-05; Vercel deployment evidence for the merged release is pending.**
- **Theme 3 — Noir — implementation refinement COMPLETE; final browser/device closure remains separately blocked.**
- Heritage and Gallery remain untouched.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.**
- **Shared Public Menu Rendering Stabilization — VERIFIED in repository.**

## Essential Reconciliation — Current Evidence
- **VERIFIED:** Essential `SmallMenuTemplate` delegates directly to `PublicMenuView`; duplicate template chrome is removed.
- **VERIFIED:** Essential scoped presentation covers canvas, typography, hero, search/categories, featured composition, product hierarchy, hours, fixed action dock, safe areas, focus, bidi handling, fallbacks, responsive behavior, and reduced motion.
- **VERIFIED:** commit `ed030657bd95f31a180f21118611f9665c5e0836` restored the missing React type declarations needed by the quality workflow.
- **VERIFIED:** GitHub Actions quality run `33938789743` completed successfully for `ed030657bd95f31a180f21118611f9665c5e0836`: typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup all passed.
- **VERIFIED:** Vercel production deployment `dpl_APYCcu1PbR2cgvd9ALjtZBBSTKJf` is `READY` and points to `ed030657bd95f31a180f21118611f9665c5e0836`.
- **UNKNOWN:** manual real-device/Opera screenshots and post-hydration console inspection remain outside repository/CI evidence.

## Editorial Milestone — Completed Implementation
- **VERIFIED:** `editorial` maps to `contemporary-restaurant` in the canonical theme registry.
- **VERIFIED:** supplied Editorial screenshots showed oversized logo treatment, excessive hero occupation, unstable/large product media presentation, and owner-preview chrome beneath the public menu.
- **VERIFIED:** source audit found broad Editorial selectors in the previous stylesheet (`header img`, `header > div`, generic sticky/button descendants) plus additional Editorial rules in shared refinement layers.
- **VERIFIED:** Editorial now uses dedicated semantic hero/action/search/category/product/hour regions with stable media geometry and a distinct editorial typography/composition system.
- **VERIFIED:** Editorial action hierarchy keeps ordering/cart primary and contact/location/social secondary.
- **VERIFIED:** reusable public action logic uses existing tenant/branch fields: tenant `whatsapp`/`whatsappTemplate`/`instagramUrl`; branch `mapsUrl`/`phone`/address.
- **VERIFIED:** action destinations are hidden when missing/invalid; external URLs are HTTPS-only and host-allowlisted; phone/WhatsApp values are normalized; external links use `noopener noreferrer`.
- **VERIFIED:** public language switching preserves route search state; English is explicitly disabled when the menu lacks the required English identity data instead of fabricating English content; root `lang`/`dir` follows the selected locale.
- **VERIFIED:** temporary theme testing override is server-only, owner/admin-gated, tenant-scoped, subscription-status-safe, and requires a future expiry timestamp.
- **VERIFIED:** layering is documented and uses the Editorial scale: navigation 20, cart 40, dialogs 60, success 70.
- **VERIFIED:** no database schema/migration change was introduced.
- **VERIFIED:** final Editorial branch quality workflow `33941534592` passed typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** PR #13 was squash-merged into `main` as commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` after the final quality workflow passed.

## Runtime / Browser State
- **VERIFIED:** automated Playwright browser template QA passed for all five themes on the final Editorial verification commit.
- **UNKNOWN:** final merged Editorial Vercel deployment until the platform exposes a deployment for commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection for Editorial.
- **BLOCKED:** do not claim Editorial `DEPLOYED` until Vercel evidence points to the merged main release.

## Continuity Documents
- `PROJECT_STATE.md` reconciled with current repository, Git history, CI, and Vercel evidence.
- `PLAN.md` moved from Essential to Editorial and now records the completed implementation plus deployment evidence gate.
- `TASKS.md` records Editorial implementation and all remaining evidence requirements.
- `SESSION_PROTOCOL.md` workflow is unchanged.
- Dated session log: `docs/sessions/2026-09-05-editorial-premium-refinement.md`.

## Exact Next Action
Verify Vercel deployment for merged commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`. If READY, inspect available deployment/runtime evidence, update deployment status in continuity files, and stop. Do not begin another theme.
