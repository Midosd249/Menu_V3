# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- **Essential Premium Refinement — DEPLOYED / VERIFIED.** Manual real-device/Opera evidence remains UNKNOWN.
- **Editorial Premium Refinement + Contact/Location Action System + Language-Switch Verification + Temporary Public Theme Testing Access — IMPLEMENTED / VERIFIED / MERGED / INCLUDED IN CURRENT PRODUCTION.**
- Noir implementation refinement is complete; final browser/device closure remains separately blocked and Noir is not being reopened.
- Heritage and Gallery remain untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Editorial Deployment Evidence — CLOSED
- **VERIFIED:** Editorial was squash-merged into `main` as `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` after quality workflow `33941534592` passed typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** Vercel production deployment `dpl_GmryQXLvbcSEKWX296KVLjdzrwK5` is `READY` and deploys `7177cf0e081eed401b09805ad8eaf47804f68629` from `main`.
- **VERIFIED:** `7177cf0e081eed401b09805ad8eaf47804f68629` is 15 commits ahead of Editorial commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`, with the Editorial commit as merge base and zero commits behind; the production deployment therefore contains Editorial.
- **VERIFIED:** production aliases include `menu-v3-kohl.vercel.app`, `menu-v3-midosd2s-projects.vercel.app`, and the `main` branch alias.
- **VERIFIED:** production root returned HTTP 200 with SSR HTML, `lang="ar"`, `dir="rtl"`, and Menu V3 runtime/theme assets.
- **VERIFIED:** Vercel reports no runtime error clusters for the selected last-24-hour window; sampled deployment runtime logs returned 18 HTTP 200 responses.
- **UNKNOWN:** the connector cannot expose local working-tree `git status` or local uncommitted diff.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection remain outside available repository/Vercel evidence.
- **UNKNOWN:** there is no direct production deployment with the exact Editorial SHA; production is serving a verified descendant containing it.

## Permanent Release-Only Vercel Strategy
Vercel is a release platform, not the normal development or design-iteration environment.

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- `main` must remain stable and deployable.
- Use milestone/release branches when a local workflow is available; local commits are allowed as safe checkpoints.
- Do not push each small implementation change merely for visual iteration.
- Preview Deployments are exceptions only when local verification cannot prove deployment-specific behavior, stable candidate sharing, or significant deployment-specific release risk. They are not for ordinary CSS, typography, spacing, theme, RTL, responsive, or small visual changes.
- Production deployment happens only after a complete verified release batch.
- Do not randomly retry Redeploy or failed builds.
- Keep implementation status separate from deployment status. Valid statuses are `IMPLEMENTATION_IN_PROGRESS`, `VERIFIED_LOCALLY`, `READY_TO_PUSH`, `PUSHED`, `DEPLOYED`, `DEPLOYMENT_BLOCKED`, `IMPLEMENTATION_BLOCKED`, `DONE`.
- Never claim `DEPLOYED` without direct Vercel evidence. A descendant production deployment proves inclusion of an earlier merged commit but must not be reported as the exact SHA deployment.
- If Vercel is quota-limited, rate-limited, paused, or unavailable: do not retry randomly; record `DEPLOYMENT_BLOCKED`; do not claim Production equals `main`; preserve verified work as `VERIFIED_LOCALLY` or `READY_TO_PUSH` when justified.
- Urgent production outages, critical security, privacy, or data-loss fixes are the only release-process exception.
- If production breaks after a release, use Vercel Instant Rollback only when an eligible previous production-serving healthy deployment exists; record target/reason and then fix through the normal verified release batch.
- Before any future deployment-related decision, inspect the actual Vercel Usage/Billing page to determine which resource is limited.
- **Exact rule:** visual CSS/theme iteration must not require Vercel deployment.

## Existing Release Policy Constraints
- Do not begin another theme until the authenticated browser/device verification gate is closed.
- Temporary theme testing override must be reviewed and disabled before commercial production launch.
- Implementation status and deployment status must remain separate.

## Project Memory and Learning System
- **VERIFIED:** permanent learned-problem memory is maintained at `docs/project-memory/problems-learned.md`.
- **VERIFIED:** complex tasks and long debugging/design loops must consult the memory before trying new approaches when a similar pattern may exist.
- **VERIFIED:** the memory records root causes, failed/wasteful approaches, working solutions, lessons, anti-patterns, and detection checklists; uncertain details remain labeled `INFERRED` or `UNKNOWN`.
- **TODO:** maintain the memory after future major incidents, expensive milestones, or newly discovered hard problems.

## Exact Current Task
**Authenticated browser/device QA of the five preview variants** — verification-only gate; no theme redesign and no Theme 4 Heritage work.

### Verification performed in this session
- **VERIFIED:** latest `main` is `621f94d534e5064225512ea448ea617913dc585f`.
- **VERIFIED:** quality workflow `33999726885` completed successfully, including Playwright browser-template QA for all five themes.
- **VERIFIED:** direct Vercel SSR preview requests for `/m/nafas` succeeded with HTTP 200 for `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- **VERIFIED:** Arabic SSR preview state returns `lang="ar"`, `dir="rtl"`, `robots=noindex,nofollow`, and the requested preview theme.
- **VERIFIED:** English Editorial SSR preview returns `lang="en"`, `dir="ltr"`, English labels, and the requested preview theme.
- **VERIFIED:** populated customer-menu markup and fixed cart markup are present in the returned preview HTML.
- **UNKNOWN:** actual browser/device viewport geometry, mixed-direction rendering, interaction behavior, safe-area/fixed-control overlap, empty-cart interaction, and post-hydration console output.
- **BLOCKED:** the current session does not expose an interactive browser/device or real-device evidence surface, so the acceptance criteria requiring direct browser/device evidence cannot be closed honestly.

## Acceptance Criteria
- Direct browser/device evidence is captured for the supported preview variants.
- Arabic RTL, English LTR, and mixed-direction behavior are checked.
- Responsive and fixed-control behavior is checked without covering content.
- Empty and populated customer-action states are checked.
- Post-hydration console is inspected where the browser tooling supports it.
- Any failure is isolated and documented before a targeted fix; no unrelated refactor.
- Final continuity records state the evidence, unresolved risks, and exactly one next task.

## Verification Commands
- Repository-defined automated gates remain `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, and `npm run check:auth` when code changes are introduced.
- The latest successful GitHub quality run verified typecheck, tests, lint, production build, Playwright Chromium installation, and browser template QA for all themes.
- For the current verification-only task, no deployment was triggered merely for visual iteration.

## Exact Next Task
Provide direct authenticated browser/device evidence for the five preview variants using an interactive browser/real-device surface, then inspect screenshots and post-hydration console output. Close the gate only if all acceptance criteria pass; otherwise isolate the first failing behavior and make one targeted fix only. Do not begin Theme 4 Heritage work before closure.
