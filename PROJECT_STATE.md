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
- **VERIFIED:** no database schema/migration change was introduced for Editorial.
- **VERIFIED:** final Editorial branch quality workflow `33941534592` passed typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** PR #13 was squash-merged into `main` as commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` after the final quality workflow passed.

## Runtime / Browser State
- **VERIFIED:** automated Playwright browser template QA passed for all five themes on the final Editorial verification commit.
- **UNKNOWN:** final merged Editorial Vercel deployment until the platform exposes a deployment for commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection for Editorial.
- **BLOCKED:** do not claim Editorial `DEPLOYED` until Vercel evidence points to the merged main release.

## Permanent Release-Only Vercel Workflow
- **VERIFIED:** Vercel is a release platform, not the normal development or design-iteration environment.
- **VERIFIED:** normal release path is `LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT`.
- **VERIFIED:** `main` remains stable/deployable; milestone/release branches and local checkpoint commits are preferred when a local workflow is available; small visual changes must not be pushed merely to iterate in Vercel.
- **VERIFIED:** Preview Deployments are exceptions only for deployment-specific behavior that local verification cannot prove, stable candidate sharing, or material release risk that requires production-like infrastructure. They are not ordinary CSS/theme/typography/spacing/RTL/responsive iteration tools.
- **VERIFIED:** production deployment occurs only after a complete verified release batch; random redeploy/retry behavior is prohibited.
- **VERIFIED:** implementation status is separate from deployment status and uses `IMPLEMENTATION_IN_PROGRESS`, `VERIFIED_LOCALLY`, `READY_TO_PUSH`, `PUSHED`, `DEPLOYED`, `DEPLOYMENT_BLOCKED`, `IMPLEMENTATION_BLOCKED`, `DONE`.
- **VERIFIED:** `DEPLOYED` requires direct Vercel evidence. Quota/rate/build/platform blocks require `DEPLOYMENT_BLOCKED`, no random retry, no claim that Production equals `main`, and preservation of verified work as `VERIFIED_LOCALLY` or `READY_TO_PUSH` when justified.
- **VERIFIED:** urgent production outage, critical security/privacy issue, or data-loss fix is the only release-process exception and must be narrowly documented.
- **VERIFIED:** post-release breakage may use Vercel Instant Rollback only when an eligible previous production deployment exists; record target/reason, do not delete the rollback target, then fix through the normal verified release batch.
- **VERIFIED:** before any future deployment-related decision, inspect the actual Vercel Usage/Billing page to identify the limited resource.
- **VERIFIED:** exact rule: visual CSS/theme iteration must not require Vercel deployment.

## Continuity Documents
- `AGENTS.md` contains the permanent Release-Only Vercel Policy and startup/quality contract.
- `PROJECT_STATE.md` records verified project state and session continuity.
- `PLAN.md` records the release workflow and exact next task.
- `TASKS.md` records the task queue and closure evidence.
- `SESSION_PROTOCOL.md` contains the permanent release-only execution protocol.
- `docs/release-only-vercel-workflow.md` is the detailed operating procedure.
- `docs/design-research-log.md`, `docs/visual-functional-audit.md`, and `docs/template-review-checklist.md` remain the permanent quality evidence set.

## Homepage Demo Source-of-Truth Reconciliation — IN_PROGRESS
- **VERIFIED:** the marketing homepage CTA/live card uses slug `nafas`.
- **VERIFIED:** production database project `ublxptcqefujkbeepylc` contains `menu_v3.tenants.id=demo-nafas`, `slug=nafas`, `name_ar=نَفَس`, `name_en=Nafas`, `is_published=true`, `theme_key=editorial`.
- **VERIFIED:** `demo-nafas.owner_user_id=lyFgwXjJpkPirr0inS1TxvJbM09yXKXp` resolves in `menu_v3."user"` to `midosd2.mm@gmail.com`; `menu_v3.tenant_members` gives that user role `owner`.
- **VERIFIED:** the tenant has one active branch.
- **VERIFIED:** `demo-nafas` was inactive and has been activated so the published public loader can serve the real tenant.
- **VERIFIED:** before this task, `getPublicMenu` returned static `DEMO_MENU` whenever the slug was `nafas`, so dashboard changes could not flow to the homepage-linked public menu.
- **IMPLEMENTED:** the `nafas` hard-coded public-loader short-circuit was removed on branch `fix/homepage-demo-source-of-truth`; published tenant data is now the source of truth.
- **VERIFIED:** the repository homepage and database point to the same tenant slug and tenant ID mapping; the ownership is the requested `midosd2.mm@gmail.com` account.
- **UNKNOWN:** production deployment/browser confirmation of the new dynamic flow until CI and release deployment complete.

## Latest Release Evidence
- **VERIFIED:** `main` currently points to commit `3c3bd3716be6477d9b8a82a79771fe6aeec5f519`, whose parent is `f2695c7316b32ba423616f22434b142e9dd61a6c`.
- **IN_PROGRESS:** branch `fix/homepage-demo-source-of-truth` contains the public-loader correction plus continuity updates.
- **UNKNOWN:** final CI status for the new branch.

## Exact Next Action
Run the branch quality gates, review the final diff, merge the coherent source-of-truth correction into `main` only after CI passes, then verify one real dashboard edit is reflected in the homepage-linked `/m/nafas` public menu. Do not begin another theme.
