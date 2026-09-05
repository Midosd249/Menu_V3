# TASKS

## Completed Task
### Editorial Deployment Evidence Gate — CLOSED / VERIFIED
- **VERIFIED:** Editorial implementation was squash-merged into `main` as `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` after quality workflow `33941534592` passed typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, and cleanup.
- **VERIFIED:** Vercel production deployment `dpl_GmryQXLvbcSEKWX296KVLjdzrwK5` is `READY` and serves descendant commit `7177cf0e081eed401b09805ad8eaf47804f68629` from `main`.
- **VERIFIED:** GitHub comparison establishes Editorial commit `81a7e0efbdf46bcf320699d0945e1a5d7d29c964` as the merge base of the production commit, with 15 commits ahead and zero behind; therefore Editorial is included in the production release.
- **VERIFIED:** production aliases include `menu-v3-kohl.vercel.app`, `menu-v3-midosd2s-projects.vercel.app`, and the `main` branch alias.
- **VERIFIED:** production root returned HTTP 200 with SSR HTML, Arabic RTL document state, and Menu V3 runtime/theme assets.
- **VERIFIED:** Vercel reports no runtime error clusters in the selected last-24-hour window; sampled deployment runtime logs returned 18 HTTP 200 responses.
- **UNKNOWN:** local working-tree `git status` and local uncommitted diff are not exposed by the current connector.
- **UNKNOWN:** manual Opera/real-device screenshots and post-hydration console inspection remain pending.
- **IMPORTANT:** there is no direct production deployment whose exact Git SHA is the Editorial merge commit; production serves a verified descendant containing it.

## Protected Scope
- Essential is not being redesigned or reopened.
- Noir, Heritage, and Gallery are not redesigned by this task.
- No database schema/migration changes.
- No weakening of authentication, authorization, tenant/branch isolation, subscription status, SEO, routing, CI/CD, or deployment controls.
- No client-controlled entitlement bypass.

## Temporary Testing Access
- `MENU_THEME_TESTING_OVERRIDE=true`
- `MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT=<future ISO-8601 timestamp>`
- Both are required; expired/missing override is OFF.
- Override applies only to premium theme entitlement checks for authenticated owner/admin users; subscription status remains enforced.
- Review and disable before commercial production launch.

## Permanent Quality Gate
Every future template/public-menu UI task must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, `docs/visual-functional-audit.md`, and `docs/design-research-log.md`.

## Project Memory and Learning System
- **VERIFIED:** permanent learned-problem memory is maintained at `docs/project-memory/problems-learned.md`.
- **VERIFIED:** complex tasks and long debugging/design loops must consult the memory before trying new approaches when a similar pattern may exist.
- **VERIFIED:** current memory covers Vercel/release strategy, theme visual QA, UI layering/overlays, RTL/language switching, continuity drift, branching/release batching, build/dependency tooling, and authentication runtime behavior.
- **TODO:** update the memory after future major incidents, expensive milestones, or newly discovered hard problems.

## Current Task
### Authenticated Browser/Device QA of the Five Preview Variants — IN_PROGRESS / BLOCKED
- **VERIFIED:** latest `main` is `621f94d534e5064225512ea448ea617913dc585f` before this documentation-only evidence update sequence; the current branch now advances through the continuity commits for this QA record.
- **VERIFIED:** latest successful quality run `33999726885` completed typecheck, tests, lint, production build, Playwright Chromium installation, and Browser template QA for all five themes.
- **VERIFIED:** direct Vercel SSR preview requests for `/m/nafas` succeeded with HTTP 200 for `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- **VERIFIED:** Arabic SSR preview state resolves `lang="ar"`, `dir="rtl"`, preview theme mode, and the requested theme.
- **VERIFIED:** English Editorial SSR preview resolves `lang="en"`, `dir="ltr"`, English labels, and the requested theme.
- **VERIFIED:** populated preview markup contains menu categories/products/SAR prices and fixed customer-action markup where rendered.
- **UNKNOWN:** mixed-direction rendering, actual responsive viewport geometry, fixed-control overlap/safe-area behavior, interactive language switching, item dialog/action behavior, empty-cart interaction, and post-hydration console output.
- **BLOCKED:** the available connector surface has no interactive browser/device or real-device screenshot/console capability. The acceptance criteria requiring direct browser/device evidence therefore cannot be closed honestly in this session.
- **STOP RULE:** do not redesign themes, start Theme 4 Heritage, or make unrelated fixes while this evidence gate is blocked.

## Acceptance Criteria
- Direct browser/device evidence exists for the supported preview variants.
- Arabic RTL, English LTR, and mixed-direction behavior are verified.
- Responsive and fixed-control behavior is verified without covering menu content.
- Empty and populated customer-action states are verified.
- Post-hydration console is inspected where supported.
- Any failure is isolated and documented before a targeted fix.
- Continuity records are updated with evidence, remaining risks, and exactly one next task.

## Exact Next Task
Provide direct authenticated browser/device evidence for the five preview variants using an interactive browser/real-device surface, then inspect screenshots and post-hydration console output. Close the gate only if all acceptance criteria pass; otherwise isolate the first failing behavior and make one targeted fix only. Do not begin Theme 4 Heritage work before closure.
