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
- **Theme 2 — Editorial — DEPLOYED as part of the later verified `main` production release; merged implementation remains protected.**
- **Theme 3 — Noir — implementation refinement COMPLETE; final browser/device closure remains separately blocked.**
- Heritage and Gallery remain untouched.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.**
- **Shared Public Menu Rendering Stabilization — VERIFIED in repository.**

## Editorial Reconciliation — Deployment Evidence
- **VERIFIED:** Editorial implementation was squash-merged into `main` as commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` after quality workflow `33941534592` passed typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** current `main` HEAD is `2ae373561ac0160d68557abe63a7a64fce6f3d4c`.
- **VERIFIED:** Vercel production deployment `dpl_GmryQXLvbcSEKWX296KVLjdzrwK5` is `READY` and deploys GitHub commit `7177cf0e081eed401b09805ad8eaf47804f68629` from `main`.
- **VERIFIED:** GitHub comparison shows `7177cf0e081eed401b09805ad8eaf47804f68629` is 15 commits ahead of `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` with that Editorial commit as the merge base and zero commits behind; therefore the current production deployment contains the merged Editorial implementation.
- **VERIFIED:** production aliases include `menu-v3-kohl.vercel.app`, `menu-v3-midosd2s-projects.vercel.app`, and the `main` branch alias.
- **VERIFIED:** production root request returned HTTP 200 with SSR HTML, `lang="ar"`, `dir="rtl"`, and the expected Menu V3 runtime/theme assets.
- **VERIFIED:** Vercel reports no runtime error clusters in the selected last-24-hour window for the project; deployment runtime log grouping returned 18 HTTP 200 responses in the sampled window.
- **UNKNOWN:** the current connector cannot expose the local working-tree `git status` or local uncommitted diff.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection remain outside the available repository/Vercel evidence.
- **UNKNOWN:** a Vercel deployment whose exact Git SHA is `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` is not the current production deployment; production is instead serving a verified descendant commit containing it.

## Runtime / Browser State
- **VERIFIED:** automated Playwright browser template QA passed for all five themes on the final Editorial verification workflow.
- **VERIFIED:** production is currently served by Vercel deployment `dpl_GmryQXLvbcSEKWX296KVLjdzrwK5` on descendant commit `7177cf0e081eed401b09805ad8eaf47804f68629`.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection for Editorial and the other preview variants.
- **BLOCKED:** browser/device closure cannot be marked complete until direct browser/device evidence is captured and reviewed.

## Permanent Release-Only Vercel Workflow
- **VERIFIED:** Vercel is a release platform, not the normal development or design-iteration environment.
- **VERIFIED:** normal release path is `LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT`.
- **VERIFIED:** `main` remains stable/deployable; milestone/release branches and local checkpoint commits are preferred when a local workflow is available; small visual changes must not be pushed merely to iterate in Vercel.
- **VERIFIED:** Preview Deployments are exceptions only when local verification cannot prove deployment-specific behavior, stable candidate sharing, or material release risk that requires production-like infrastructure. They are not ordinary CSS/theme/typography/spacing/RTL/responsive iteration tools.
- **VERIFIED:** production deployment occurs only after a complete verified release batch; random redeploy/retry behavior is prohibited.
- **VERIFIED:** implementation status is separate from deployment status and uses `IMPLEMENTATION_IN_PROGRESS`, `VERIFIED_LOCALLY`, `READY_TO_PUSH`, `PUSHED`, `DEPLOYED`, `DEPLOYMENT_BLOCKED`, `IMPLEMENTATION_BLOCKED`, `DONE`.
- **VERIFIED:** `DEPLOYED` requires direct Vercel evidence. A descendant deployment is valid evidence that an earlier merged commit is included, but the exact SHA must not be misrepresented.
- **VERIFIED:** quota/rate/build/platform blocks require `DEPLOYMENT_BLOCKED`, no random retry, no claim that Production equals an older commit, and preservation of verified work as `VERIFIED_LOCALLY` or `READY_TO_PUSH` when justified.
- **VERIFIED:** urgent production outage, critical security/privacy issue, or data-loss fix is the only release-process exception and must be narrowly documented.
- **VERIFIED:** post-release breakage may use Vercel Instant Rollback only when an eligible previous production-serving healthy deployment exists; record target/reason, do not delete the rollback target, then fix through the normal verified release batch.
- **VERIFIED:** before any future deployment-related decision, inspect the actual Vercel Usage/Billing page to identify the limited resource.
- **VERIFIED:** exact rule: visual CSS/theme iteration must not require Vercel deployment.

## Project Memory and Learning System
- **VERIFIED:** permanent problem-learning memory is stored at `docs/project-memory/problems-learned.md`.
- **VERIFIED:** `AGENTS.md` requires agents to read the memory before complex work or long debugging/design loops, apply matching detection checklists, avoid recorded anti-patterns, and update the memory after major incidents or expensive milestones.
- **VERIFIED:** this memory is documentation-only and does not change application behavior, templates, schema, auth, subscriptions, dependencies, CI/CD, or deployment configuration.

## Continuity Documents
- `AGENTS.md` contains the permanent Release-Only Vercel Policy and Project Memory rules.
- `PROJECT_STATE.md` records the current verified project state, deployment evidence, release policy, and session continuity.
- `PLAN.md` records the release workflow and exact current/next task.
- `TASKS.md` records the deployment gate and exact next task.
- `SESSION_PROTOCOL.md` contains the permanent release-only execution protocol and project-memory startup/incident-learning rule.
- `docs/release-only-vercel-workflow.md` is the detailed operating procedure.
- `docs/project-memory/problems-learned.md` is the permanent learned-problems record.

## Session Log — 2026-09-06
- **Current task:** verify the Vercel production evidence for the merged Editorial milestone and reconcile continuity state.
- **VERIFIED:** current `main` is `2ae373561ac0160d68557abe63a7a64fce6f3d4c`; Vercel production is `dpl_GmryQXLvbcSEKWX296KVLjdzrwK5` on descendant `7177cf0e081eed401b09805ad8eaf47804f68629`.
- **VERIFIED:** the descendant contains Editorial because the comparison against `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` has that commit as merge base, is 15 commits ahead, and is not behind.
- **VERIFIED:** production root returned HTTP 200; Vercel reported no runtime error clusters in the selected last-24-hour window.
- **UNKNOWN:** local working-tree status/diff and manual Opera/real-device/post-hydration console evidence are unavailable through the current connector surface.
- **Result:** the Editorial deployment evidence gate is closed for production inclusion; browser/device QA remains a separate open verification task.

## Exact Next Task
Execute authenticated browser/device QA for the five preview variants, including Arabic RTL, English LTR, mixed-direction content, responsive states, fixed controls, empty/populated states, and post-hydration console inspection where supported. Record direct browser/device evidence and stop; do not begin Theme 4 Heritage work before this gate is closed.
