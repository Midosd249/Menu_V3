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

## Project Memory and Learning System
- **VERIFIED:** permanent problem-learning memory is now stored at `docs/project-memory/problems-learned.md`.
- **VERIFIED:** the memory records hard incidents and expensive rework across Vercel/release strategy, theme QA, UI layering, RTL/language switching, continuity drift, branching/release batching, build/dependency tooling, and authentication runtime behavior.
- **VERIFIED:** `AGENTS.md` now requires agents to read the memory before complex work or long debugging/design loops, apply matching detection checklists, avoid recorded anti-patterns, and update the memory after major incidents or expensive milestones.
- **VERIFIED:** this memory is documentation-only and does not change application behavior, templates, schema, auth, subscriptions, dependencies, CI/CD, or deployment configuration.

## Continuity Documents
- `AGENTS.md` contains the permanent Release-Only Vercel Policy and Project Memory rules.
- `PROJECT_STATE.md` records the permanent release policy, project-memory system, and this documentation-only milestone.
- `PLAN.md` records the release workflow and project-memory maintenance as governing workflow.
- `TASKS.md` records the release workflow and project-memory maintenance as permanent gates.
- `SESSION_PROTOCOL.md` contains the permanent release-only execution protocol and project-memory startup/incident-learning rule.
- `docs/release-only-vercel-workflow.md` is the detailed operating procedure.
- `docs/project-memory/problems-learned.md` is the permanent learned-problems record.
- Dated session log: `docs/sessions/2026-09-05-editorial-premium-refinement.md` remains historical; no new session-log file is created in this documentation-only task because the authorized file scope is exact.

## Documentation Milestone — Project Memory
- **IN_PROGRESS:** creating and wiring the permanent project-memory learning system using only authorized documentation paths.
- **VERIFIED:** no application/template/database/auth/subscription/tenant/product/dependency/CI/CD/Vercel-setting/environment/deployment-configuration change is in scope.
- **VERIFIED:** no intentional Vercel deployment is part of this task.

## Exact Next Action
After this documentation-only milestone is verified, the next product task remains the existing deployment evidence gate: verify Vercel deployment for merged Editorial commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`, inspect available runtime evidence, update deployment status, and stop. Do not begin another theme.
