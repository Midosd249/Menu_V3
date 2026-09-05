# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- **Essential Premium Refinement — DEPLOYED / VERIFIED.** Manual real-device/Opera evidence remains UNKNOWN.
- **Editorial Premium Refinement + Contact/Location Action System + Language-Switch Verification + Temporary Public Theme Testing Access — IMPLEMENTED / VERIFIED / MERGED.** Final Vercel deployment evidence is pending.
- Noir implementation refinement is complete; final browser/device closure remains separately blocked and Noir is not being reopened.
- Heritage and Gallery remain untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Essential Reconciliation
- **VERIFIED:** Essential delegates to `PublicMenuView` and no longer owns duplicate public renderer chrome.
- **VERIFIED:** Essential scoped presentation covers hero, typography, spacing, search/categories, featured cards, product hierarchy, hours, action dock, safe areas, focus, bidi, fallbacks, responsive behavior, and reduced motion.
- **VERIFIED:** GitHub Actions quality run `33938789743` for commit `ed030657bd95f31a180f21118611f9665c5e0836` passed typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** Vercel production deployment `dpl_APYCcu1PbR2cgvd9ALjtZBBSTKJf` is `READY` for commit `ed030657bd95f31a180f21118611f9665c5e0836`.

## Editorial Milestone — Completed Implementation
- **VERIFIED:** `editorial` maps to `contemporary-restaurant`.
- **VERIFIED:** supplied screenshots and source audit identified generic header/image styling, excessive hero occupation, unstable product geometry, and owner-preview layering risk.
- **VERIFIED:** Editorial now uses dedicated hero media, bounded logo, editorial typography, controlled featured composition, stable product cards, compact search/category navigation, opening hours, responsive behavior, and reduced-motion behavior.
- **VERIFIED:** public contact actions are data-driven from existing tenant/branch fields and disappear when absent/invalid.
- **VERIFIED:** external action validation is HTTPS/host allowlisted; phone/WhatsApp are normalized; external links use `noopener noreferrer`.
- **VERIFIED:** public language navigation preserves validated route search state; English is explicit/disabled when required English identity data is missing; root `lang`/`dir` follows locale.
- **VERIFIED:** temporary theme testing override is server-only, expiry-bound, owner/admin-gated, tenant-scoped, and subscription-status-safe.
- **VERIFIED:** Editorial layering is documented and uses 20/40/60/70 priorities without arbitrary large z-index values.
- **VERIFIED:** final Editorial verification workflow `33941534592` passed typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** PR #13 was squash-merged into `main` as `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` after the final quality workflow passed.

## Remaining Evidence Gate
- **UNKNOWN:** final Vercel deployment for merged commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection.
- **BLOCKED:** do not claim Editorial `DEPLOYED` until Vercel evidence points to the merged main release.

## Permanent Release-Only Vercel Strategy
Vercel is a release platform, not the normal development or design-iteration environment.

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- `main` must remain stable and deployable.
- Use milestone/release branches when a local workflow is available; local commits are allowed as safe checkpoints.
- Do not push each small implementation change merely for visual iteration.
- Preview Deployments are exceptions only when local verification cannot prove production-like deployment behavior, stable candidate sharing is required, or significant deployment-specific release risk exists. They are not for ordinary CSS, typography, spacing, theme, RTL, responsive, or small visual changes.
- Production deployment happens only after a complete verified release batch.
- Do not randomly retry Redeploy or failed builds.
- Keep implementation status separate from deployment status. Valid statuses are `IMPLEMENTATION_IN_PROGRESS`, `VERIFIED_LOCALLY`, `READY_TO_PUSH`, `PUSHED`, `DEPLOYED`, `DEPLOYMENT_BLOCKED`, `IMPLEMENTATION_BLOCKED`, `DONE`.
- Never claim `DEPLOYED` without direct Vercel evidence.
- If Vercel is quota-limited, rate-limited, paused, or unavailable: do not retry randomly; record `DEPLOYMENT_BLOCKED`; do not claim Production equals `main`; preserve verified work as `VERIFIED_LOCALLY` or `READY_TO_PUSH` when justified.
- Urgent production outages, critical security, privacy, or data-loss fixes are the only release-process exception and must be narrowly scoped and documented.
- If production breaks after a release, use Vercel Instant Rollback only when an eligible previous production deployment exists; record the target and reason, preserve the rollback target, then fix forward through the normal verified release batch.
- Before any future deployment-related decision, inspect the actual Vercel Usage/Billing page to determine which resource is limited.
- **Exact rule:** visual CSS/theme iteration must not require Vercel deployment.

## Existing Release Policy Constraints
- Do not begin another theme until the merged Editorial deployment evidence is recorded.
- Temporary theme testing override must be reviewed and disabled before commercial production launch.
- Implementation status and deployment status must remain separate.

## Documentation Milestone
- **IN_PROGRESS:** this task updates only the explicitly authorized governance/documentation files and creates only `docs/release-only-vercel-workflow.md`.
- **VERIFIED:** no application code, template, database schema/migration, authentication/authorization, subscription, tenant/branch isolation, product feature, dependency, CI/CD workflow, Vercel setting, `vercel.json`, environment variable, or deployment configuration is being changed.
- **VERIFIED:** no intentional Vercel deployment is part of this documentation milestone.

## Exact Next Action
After the release-only documentation is fully verified, return to the existing evidence gate: check Vercel for a deployment corresponding to merged Editorial commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`. If READY, inspect runtime evidence, record deployment status, and stop. Do not begin another theme.
