## 2026-10-23 — QR table ordering continuation handoff

- CLASSIFICATION: security-sensitive public ordering integration; Research/Connected Tools, Backend/Data, Auth/Security, QA, Code Audit and Continuity workflows.
- VERIFIED: main base SHA 74ddc7af44e0472e132416496579b523c847f6a0; branch feat/qr-table-ordering; draft PR #411 open and not merged.
- IMPLEMENTED ON BRANCH: token resolution on both public menu route shapes; submit handler resolves again and validates tenant/branch ownership; only server-resolved table ID is persisted; idempotency includes table identity; token primitives split for native Node testing; test script and regression contracts updated; no-referrer policy added; SQL transaction API corrected; migration role revokes conditional for local fixtures.
- VERIFIED DATABASE SIDE EFFECT: Vercel Preview build at initial feature commit applied migration 20261023120000_restaurant_tables_and_qr_tokens.sql to connected Supabase project. Read-only evidence: menu_v3._migrations entry at 2026-10-23 02:05:57 UTC, tables and orders.table_id exist, new tables contain zero rows, RLS enabled, no policies and no direct client grants. Do not claim no migration was applied. No rollback attempted; owner decision needed.
- VERIFICATION LIMITS: Vercel Preview on code head 5e0401e58ba5f0530f6217b11d3bc3a1e93ec74f is READY. Typecheck and PGLite fixture passed on that head; Quality/W9 final results must be checked on the final head. No local terminal or manual device QA was performed.
- RELEASE: no merge or production deployment. Owner QR management and staff UI remain out of scope.
- EXACT NEXT ACTION: check final-head Quality/W9, then obtain explicit owner decision to keep or roll back the additive schema; do not merge or deploy before that decision.

---

## 2026-10-20 — Invitation context recovery after email verification — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: `main` at task start was `74a4f6c87f3cdf5b5e0dbbdabf9459a5f3537998`. The owner reproduced a new invitee landing in self-service onboarding after signup, email verification, and login.
- VERIFIED FROM CODE: invitation context was read from the current query only, verification callbacks targeted generic login, and onboarding could provision a workspace with no membership.
- IMPLEMENTING: browser-local recovery for the validated invitation token, verification callback directly to `/invite/:token`, and an onboarding guard. Server-side acceptance, verified-email matching, and tenant authorization remain unchanged.
- RESEARCH: Better Auth documents `callbackURL` as the post-verification redirect destination: https://better-auth.com/docs/concepts/email.
- CI: main Quality run `39480542146` and PR #406 Quality `39484797065` / W9 `39484796977` failed before any steps ran. The PR runs were retried once; both attempts still exposed no steps (`runner_id: 0`) and log retrieval returned `BlobNotFound`. Root cause is UNKNOWN; no tests are verified.
- UNKNOWN: no local terminal or interactive browser available; real email-client E2E remains unverified.
- RELEASE: no database change, Supabase mutation, merge, or deployment performed.
- EXACT NEXT ACTION: resolve or obtain evidence for the GitHub Actions pre-step failure, then run Quality and W9 on the same final PR head; do not merge or deploy until those checks pass and the owner retests the real email/browser journey.

---

## 2026-10-19 — P1 public upsell product-details navigation

- STATUS: IMPLEMENTATION_BLOCKED for final-head verification; code is implemented on branch `fix/public-upsell-opens-product-details`, based on `main` at `310495dcef34a6629dfee4bdd8d190c7a3b9e292`.
- VERIFIED: `PublicUpsellPanel` previously recorded `upsell_click` and scrolled to page top, without opening the recommended product.
- IMPLEMENTED ON BRANCH: added a typed browser event bridge with a one-item pending request to handle clicks before a lazy-loaded template registers its listener. The upsell action now requests product details by recommended product ID and preserves the existing single `upsell_click` call. Shared public, Editorial, and Heritage details owners resolve IDs against currently visible products and call existing product-open handlers, preserving `product_view`, options/offers, and required-option validation. Noir/Gallery reuse the shared renderer; Essential uses it directly.
- TEST ADDED: `tests/public-upsell-details.test.mjs`, registered in `npm test`; covers event payload, early click delivery, listener cleanup, scroll-only regression, renderer wiring, and existing options/offer path.
- VERIFIED ON INITIAL PR HEAD `1f93485034926084605b8c18b51192d0a390df50`: Quality passed route-tree generation, typecheck, repository tests, contract tests, lint, and production build. Browser QA could not start because npm returned `ETARGET` for `@typescript-eslint/type-utils@8.72.0`; W9 Orders QA similarly failed installing Playwright due `@typescript-eslint/parser@8.72.0` not being available. These failures occurred during dependency installation, before browser tests.
- UNKNOWN: latest branch head `d0c3d267687d2694c3814ae9bc4c6761ca566533` has not received its own GitHub Actions run; the final early-click queue change is therefore not yet verified by CI. Local tests, TypeScript, lint, build, and browser QA cannot run because no repository checkout/terminal tool is available. Vercel status is a pending preview check only; production deployment was not performed.
- RELEASE: PR #403 is draft/open; not merged. No production deployment or production data/schema change.
- EXACT NEXT ACTION: after the npm registry can resolve the missing package versions, trigger and inspect Quality and W9 on the latest PR head; then review the final diff and stop for owner approval. Do not merge or deploy.

## 2026-10-16 — PR #402 retrospective: mandatory multi-cause CI diagnosis

- VERIFIED: PR #402 merged at `a1009d0595b8e5ab39c5df0e7119e4003db72160`; Quality [38956141584](https://github.com/Midosd249/Menu_V3/actions/runs/38956141584) and W9 [38956141474](https://github.com/Midosd249/Menu_V3/actions/runs/38956141474) passed on tested head `ae3d00f8c264671bf6e28440ad2316e6338d98cd`.
- Before another retry, inspect the latest run's exact SHA, failed job/step, complete log, and artifacts. Do not repeat a run without a new hypothesis or a changed condition.
- Separate test setup defects from application defects: `page.addInitScript` executes on each document, so do not use it to seed a value that must later change and persist. Verify rendered state plus storage across real navigation/reload.
- For browser DB failures, compare fixture setup against migration dependencies in order; do not assume build/typecheck proves fixture completeness.
- For changing browser failures accompanied by `df -h` near 0 MB and Vite `ECONNRESET`, investigate runner resource exhaustion before modifying app routes, auth, shell readiness, or assertions. Preserve request/console/pageerror/trace evidence.
- Stability evidence requires three consecutive full-file runs with retries disabled; any failure resets the streak. Verify Quality and W9 on the same final HEAD.
- Detailed timeline, failed approaches, final fixes, and guardrails: `docs/incidents/PR-402-pricing-contrast-and-ci-debugging.md`.
- Release boundary: merged, not deployed. Production deployment is a separate authorized release workflow.

---

## 2026-10-16 — PR #402 CI follow-up: Studio fixture and browser stability

- VERIFIED: Current PR branch is `fix/pricing-pro-dark-mode-contrast-2026-10-13`; prior head `ce8548f3ab57fb2069a103c86d5274ae901b829b`. PR #402 remains open, base `main`, and is not merged.
- VERIFIED: Quality run `38914485354` first failed during Studio fixture setup because `20260917170000_ph06_commercial_activation.sql` altered `subscription_invoices` before the fixture created it. The Studio fixture had omitted PH-05 invoice creation and later subscription migrations.
- IMPLEMENTED: Quality workflow now applies the missing migrations in dependency order: PH-05 invoices, PH-06 commercial activation, Platform Admin invoice issuance, and self-serve trial. This repairs only the disposable CI Studio database fixture; it does not run or modify production data.
- VERIFIED: Quality run `38914485354` then reached W7.10 but failed while the runner reported 0 MB disk remaining. The failing route varied between attempts and the page remained on the loading shell. This is environment pressure evidence, not a confirmed Studio layout defect.
- IMPLEMENTED: After the built preview, template QA, and golden fixture have completed, CI stops the built preview and removes build-only outputs, Vite cache, and npm download cache before running Studio/Admin browser suites; disk usage is logged before and after cleanup.
- IMPLEMENTED: the Menuun brand browser file will run three consecutive times with `--retries=0` and `--trace=retain-on-failure` in the same CI job. Any failure stops the sequence; retries cannot mask instability.
- VERIFIED: On prior head `2fd3c452049578c71957d5c35933287ace2ced14`, W9 passed but Quality failed due to disk pressure. On `ce8548f3ab57fb2069a103c86d5274ae901b829b`, Quality passed after the migration and cleanup changes; W9 result is tracked separately.
- UNKNOWN: Quality/W9 results and the three-run stability result for the final continuity-updated HEAD; visual browser/device inspection of the pricing preview is unavailable in this connected session.
- SCOPE: no homepage or pricing redesign; no app/database schema migration added; no production data changed. No merge or production deployment.
- EXACT NEXT ACTION: wait for latest-head Quality and W9; inspect all failures, confirm the three consecutive brand-browser runs passed, review the final diff, then stop without merge/deploy.

---

## 2026-10-16 — PR #402: Cross-navigation theme persistence test correction

- VERIFIED: Quality run `38888689177` failed in `tests/menuun-brand-browser.spec.ts:94`, specifically `theme preference survives route navigation and reload without resetting storage`. The 27 other tests in that file passed. The observed failure was `data-platform-theme=dark` after navigating to `/terms?lang=en`, while the test expected `light`.
- ROOT CAUSE: the test used `page.addInitScript(() => localStorage.setItem("menu-theme", "dark"))`. Playwright runs this init script on every new document, including route navigation and reload, so it overwrote the user's newly selected `light` preference with `dark`. This was a test-fixture defect, not evidence of an application persistence defect.
- IMPLEMENTED: commit `966eb67472aaf3ac7e3fbeb107d6497057164236` seeds `dark` once using the pricing page's origin storage, reloads to exercise the real root bootstrap, toggles to `light`, then checks actual theme and storage across navigation to English Terms and another reload. No assertions were removed or weakened; the 20 route/language/theme combinations remain.
- SCOPE: test-only change; no app code, pricing CSS, homepage, workflow, dependency, or production data changed.
- VERIFIED: the prior run's Typecheck, repository tests, contract suites, lint, production build, and all-theme template QA passed. Its browser QA failed only at the persistence-navigation test above. W9 Orders QA run `38888689121` passed on implementation parent `6b66039b2d4c1b7dc4d2b8902b7498dcf3064983`; it does not validate the newer test commit.
- UNKNOWN: results for the corrected test on the final continuity-updated HEAD; three consecutive full-file runs with retries disabled; visual preview/device checks.
- DEPLOYMENT: NOT_PERFORMED. PR #402 remains open and must not be merged or deployed as part of this task.
- EXACT NEXT ACTION: finish continuity updates, then inspect Quality and W9 on the final HEAD; run the complete browser spec three consecutive times with retries disabled in CI-equivalent conditions and inspect any failure before proceeding.

---

## 2026-10-14 — Pricing Dark-Mode CI Follow-up — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: Quality run `38479836616` failed at `tests/menuun-brand-browser.spec.ts:83`, waiting for persisted `menu-theme` after the document theme attribute changed; 7/8 tests passed. W9 Orders QA run `38479836649` passed.
- CORRECTION: the preview server did become ready; the final failure was the browser persistence assertion, not preview startup.
- IMPLEMENTED: `src/components/theme-toggle.tsx` now persists an explicit `nextPreference` before changing React/DOM theme state. Code commit: `bda2c94a11b5350e87d7f7d7124b25416a869c70`.
- CONTINUITY: `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` updated with the corrected diagnosis and pending verification.
- UNKNOWN: no workflow run was returned yet for the newest branch head; combined status currently shows Vercel Preview pending, which is not a production deployment signal. Local execution is unavailable in this connected session.
- DEPLOYMENT: NOT_PERFORMED. PR #402 is open and must not be merged/deployed automatically.
- EXACT NEXT ACTION: retrieve the latest PR-head Quality and W9 Orders QA results; if the persistence assertion remains failing, inspect its error context and fix the actual storage failure without weakening/skipping the test.

---

## 2026-10-14 — Pricing Dark-Mode PR CI Follow-up — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: Quality run `38473900942` failed only in `tests/menuun-brand-browser.spec.ts`, test `platform theme preference stays independent from language across marketing, auth, pricing and legal routes`; 7 of 8 tests in that browser spec passed. W9 Orders QA run `38473900945` passed.
- VERIFIED: failure was a theme toggle hydration readiness assertion (`data-theme-toggle-ready` remained `false` for repeated polls), not the new pricing CSS contract. The browser matrix navigated routes with `waitUntil: "domcontentloaded"`, then immediately relied on the component-ready signal.
- IMPLEMENTED: changed this route-matrix navigation to wait for `networkidle` before asserting hydration readiness, and expanded the readiness assertion timeout to 10 seconds with route/language/theme context in the failure message. This improves synchronization and diagnosability; it does not bypass the readiness assertion.
- UNKNOWN: whether this timing adjustment resolves the CI failure; the updated commit is `e162d520e3883482eaaca8443eb6732b4c2fae42`, and a matching workflow run has not yet appeared in the queried run list.
- DEPLOYMENT: NOT_PERFORMED. No merge or production deployment.
- EXACT NEXT ACTION: retrieve the latest Quality and W9 Orders QA runs for the updated PR head, inspect any failed-step logs, and fix the underlying issue if readiness remains false.

---

## 2026-10-13 — Pricing Pro Dark-Mode Contrast — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: `/pricing` uses the recommended-plan card with `bg-ink text-paper`; shared dark-mode variables and broad platform selectors can override utility colors and cause the card's intended contrast to collapse.
- IMPLEMENTED: added pricing-page and recommended-plan data hooks, plus dark-mode-only scoped CSS for the recommended card, its badge, divider, and CTA. Light-mode styles and homepage markup are not changed.
- IMPLEMENTED: added a contract test asserting the page-scoped selectors and explicit contrast colors.
- RESEARCH: W3C WCAG 2.2 SC 1.4.3 requires at least 4.5:1 contrast for normal text; official guidance: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html.
- FILES: `src/routes/pricing.tsx`, `src/platform-theme.css`, `tests/public-pages-themes-contract.test.mjs`.
- VERIFICATION: source-level review only so far; local test/build/browser execution and physical-device QA are UNKNOWN in this connected session.
- DEPLOYMENT: NOT_PERFORMED. No merge or production deployment.
- EXACT NEXT ACTION: run GitHub Quality and review its results for this branch/PR; do not merge or deploy automatically.

---

# SESSION_PROTOCOL

## 2026-10-09 — Dark-Mode Visual Follow-up — VERIFIED IN CI

- Latest code-head GitHub Quality run `37936864400` and W9 Orders QA run `37936864385` passed.
- PR #389 remains open and unmerged. Implementation branch: `fix/dark-mode-contrast-audit-2026-10-09`.
- Performance: Golden fixture and browser performance-baseline upload passed. P1.9 real-route evidence remained skipped by the workflow condition; LCP/INP and physical-device QA remain unknown.
- No merge or deployment was performed. Exact next action: review PR #389; stop before merge/deployment.

## Start
1. Read all applicable `AGENTS.md` files, then `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README/relevant documentation, task-related source, tests, and configuration.
2. Treat `main` as the source of truth; inspect repository status, recent history, relevant diffs, and available CI/deployment evidence.
3. Use `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, and `PROPOSED` explicitly; reconcile continuity state against code and git evidence.
4. Identify the highest-value unblocked atomic task from repository evidence and explicit user scope.
5. For template/public-menu work, complete the permanent quality gate before implementation.
6. For complex tasks or when symptoms resemble a known incident, read `docs/project-memory/problems-learned.md` before beginning a long debugging or design-iteration loop.

## Permanent Release-Only Vercel Workflow
Vercel is a release platform, not the normal development or design-iteration environment. The normal path is:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

### Local-first rules
- `main` must remain stable and deployable.
- When a local workflow is available, use a milestone/release branch for the atomic task and local commits as safe checkpoints.
- Do not push each small implementation change merely to obtain visual feedback.
- Visual CSS/theme iteration must not require Vercel deployment.
- Typography, spacing, card layout, theme styling, RTL, responsive behavior, and ordinary animation refinement are verified locally first.

### GitHub quality and release-batch gate
Before merging to `main`, complete the applicable unit/integration/E2E, lint, typecheck, build, browser/visual, accessibility, mobile/responsive, Arabic RTL, English LTR, mixed-direction, security/authz/tenant/branch/input-validation, public-menu/critical-flow, SEO, database-safety, final-diff, continuity, and rollback checks. Then form one coherent release batch and merge only after the batch is verified.

### Preview Deployment exception policy
Vercel Preview Deployments are exceptions, not ordinary development environments. Use one only when local verification cannot prove deployment-specific behavior, such as production-like environment variables, third-party integrations, domain/routing/edge behavior, deployment-specific runtime behavior, stable candidate sharing, or significant release risk that cannot be locally verified. Before creating a preview, record why local verification is insufficient, the exact behavior being tested, branch/commit, and success criteria. Do not use previews for ordinary CSS, typography, spacing, theme, RTL, responsive, or small visual changes.

### Production deployment policy
Production deployment occurs only after a complete verified release batch is merged to `main`. Prefer one Vercel production deployment for the batch. Do not intentionally trigger repeated deployments, Redeploy, or failed-build retries without a documented reason. CI success is not deployment evidence. `DEPLOYED` requires direct Vercel evidence showing the deployed production commit/state.

### Quota, rate, pause, and build-block handling
Before any future deployment-related decision, inspect the actual Vercel Usage/Billing page and determine which resource is limited. If Vercel is quota-limited, rate-limited, paused, or unavailable:
- do not retry randomly;
- record `DEPLOYMENT_BLOCKED`;
- do not claim Production equals `main`;
- preserve verified work as `VERIFIED_LOCALLY` or `READY_TO_PUSH` when justified;
- record the exact blocker and evidence;
- continue local work only when it does not depend on the blocked deployment.

### Urgent exception
Urgent production outages, critical security/privacy issues, and data-loss fixes are the only release-process exception. Scope the exception narrowly, document why the normal path could not be followed, verify the fix, and return to the normal release workflow immediately afterward.

### Rollback
If production is broken after a release, use Vercel Instant Rollback only when an eligible previous production-serving healthy deployment exists. Record the rollback target and reason. Do not delete or invalidate the rollback target. Then fix forward through the normal local verification → quality gates → coherent release batch → `main` → production workflow. Not every preview deployment is an eligible rollback target.

## Design Agent Workflow
- `docs/agents/design-agent.md` defines the permanent Menu V3 Design Agent, a separate visual/layout/image/theme/site-consistency specialist.
- For significant visual, layout, image, theme, or site-consistency tasks, invoke that workflow in addition to the main repository workflow.
- The Design Agent must read the continuity files plus relevant `docs/design-intelligence.md`, `docs/design-research-log.md`, `docs/template-review-checklist.md`, template brief/audit records, and `docs/project-memory/problems-learned.md` when visual issues resemble known problems.
- The Design Agent may propose visual changes and may implement them only when explicitly authorized. It must not take ownership of architecture, data, auth/authz, entitlements, subscriptions, tenant/branch isolation, CI/CD, Vercel, deployment, or unrelated product logic.
- Design work must preserve the implementation status of Essential, Editorial, Noir, Heritage, and Gallery unless explicit evidence and authorization require a change.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, and `BLOCKED` for design findings and decisions. Major visual fixes belong in `docs/template-audits/`.

## Research and Connected-Tools Discovery Workflow
- For consequential, unfamiliar, high-risk, external-knowledge-dependent, or major design work, invoke `docs/agents/research-connected-tools-agent.md`.
- Begin with current repository evidence, then dynamically inspect all currently available connected tools/apps/plugins/connectors and use only relevant authorized capabilities.
- Do not hard-code a provider list, claim unavailable access, or use tools merely because they exist.
- Prefer read/search/analysis operations. External write, publish, send, delete, purchase, deploy, or other side-effect actions require explicit user authorization and any required platform confirmation.
- The user is the sole human owner and primary developer; the Research Agent is an internal AI workflow and not a human collaborator or development-team role.
- Use the research depth appropriate to risk: Light, Focused, or Deep. Record material findings with `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, and `BLOCKED` labels and hand off to the Principal Engineer or the applicable specialized workflow.

## Automatic Specialist Routing and Orchestration
- For every meaningful user request, the Principal Engineer is the single orchestration point: classify the request, read continuity/project memory, identify applicable internal AI workflows, state the routing plan briefly, integrate findings, implement only authorized work, verify, document, and stop at the correct boundary.
- The user must not be required to manually select Research, Design, QA/regression, Security/data, or Release/reliability workflows.
- Use `docs/automatic-specialist-routing.md` as the canonical routing matrix and orchestration contract. Select workflows by task relevance rather than invoking every workflow indiscriminately.
- Research is automatic when it materially improves a consequential, unfamiliar, high-risk, external-knowledge-dependent, browser-specific, market-specific, security-sensitive, or major design decision. It remains repository-first and dynamically discovers currently available connected capabilities.
- Public-menu/theme/UI work invokes the Design Agent when relevant; QA/regression, Security/data, and Release/reliability workflows are invoked when their risk surface applies.
- All specialist roles are internal AI workflows, not human teammates, collaborators, contributors, or developers. The user remains the sole human owner and primary developer.
- Route: classify request → select relevant internal workflows → `[MEMORY]` check lessons → `[RESEARCH]` proportional repository-first research → `[PLAN]` → `[BUILD]` → `[TEST]` → `[STATE]` → `[STOP]`.

## Work
1. Preserve completed work; do not restart, rebuild, replace, or remove completed features.
2. Before material template changes, create/update the template brief and visual/functional audit.
3. Record material research in `docs/design-research-log.md`.
4. Implement the smallest complete, reversible change using existing architecture.
5. Run relevant tests, typecheck, lint, build, performance, accessibility, and manual checks available for the task.
6. Inspect final diff and confirm every changed line belongs to the single task.
7. Update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; update this protocol when workflow rules change.
8. Stop after one atomic task.

## Visual and Functional Gate
- First-screen clarity, restaurant identity, typography, hierarchy, spacing, alignment, wrapping, clipping, overlap, contrast, cards, categories, search, prices, image behavior, sticky/fixed controls, safe areas, dialogs, scroll, RTL/LTR, and theme/segment fit must be reviewed.
- Interactive controls require clear purpose, expected placement, reachability, accessible naming, visible focus where relevant, adequate touch targets, correct states, and clear feedback.
- Real-data tests must include long names, Arabic/English/mixed content, SAR price variation, missing/poor images, sold-out states, modifiers where supported, sparse/dense categories, and multiple branches where supported.
- No theme is premium if decoration compromises readability, scanability, contrast, or conversion clarity.

## Incident Learning: Preview Covering-Layer Failure
1. Treat a visible covering layer as a rendering/stacking-system problem first.
2. Inspect DOM structure, positioning/sizing, stacking contexts, pseudo-elements, animation/paint timing, responsive constraints, then targeted z-index changes.
3. Do not introduce `isolation` or defensive stacking contexts without evidence; the prior successful fix removed a stacking trap rather than adding another one.
4. Preview must not depend on scroll progress to make content visible.
5. Keep the template as the owner of its presentation shell; avoid duplicated route/template shells.
6. Prefer structural regression tests over HTTP 200 as proof of visibility.
7. When another agent discovers a successful fix, study the exact successful diff and convert its engineering principle into protocol.

## Incident Learning: Public Theme Flash and Action Visibility
1. Do not rely on a client-only effect to establish the theme for the first paint when the server already knows the theme.
2. Bootstrap the route-known theme identity/tokens in the document head before hydration.
3. Do not return dependency-effect cleanup that clears shared theme tokens during ordinary theme/location updates; clear only on true controller unmount.
4. Avoid duplicate `.menu-public-shell` ownership between route and template layers.
5. Shared customer actions that are supported and verified must not depend solely on a deep nested template section for discoverability; use one consistent shared action surface.
6. Keep fixed action surfaces outside owner preview mode and reserve document space so they cannot obscure content.
7. Test empty and populated Cart states explicitly; absence of a populated state must not remove the entry point.

## Project Memory and Learning System
- `docs/project-memory/problems-learned.md` is the permanent evidence-based record of hard problems, root causes, failed/wasteful approaches, working solutions, lessons, anti-patterns, and detection checklists.
- Before entering a long debugging or design-iteration loop, check the memory for similar symptoms and apply its detection checklist first.
- If symptoms match a recorded problem, do not repeat the recorded anti-pattern merely because it is familiar; first test the recorded causal explanation.
- After any major incident or expensive milestone, propose an update to the memory. After resolving a new hard problem, add the root cause, lessons, anti-patterns, and detection checklist.
- Keep uncertain details marked `INFERRED` or `UNKNOWN`; memory must not become a second source of truth that overrides code, tests, Git, or direct platform evidence.

## Stop
1. Stop after the single current task is completed or blocked.
2. Update continuity files and append a dated session log. If the task has an explicitly restricted file allowlist, record the session entry in an already-authorized continuity file rather than creating an unapproved path.
3. Record files changed, commands/results, commit evidence, uncertainty, blockers, and exactly one next task.
4. Do not begin another template automatically.

## Status Labels
- `VERIFIED` — directly confirmed by repository/tool/test/source evidence.
- `INFERRED` — derived from verified evidence but not directly observed.
- `UNKNOWN` — insufficient evidence.
- `BLOCKED` — cannot proceed due to environment, dependency, permission, or other hard constraint.
- `PROPOSED` — recommended but not yet proven.
- `TODO` — planned and not started.
- `IN_PROGRESS` — the single current execution task.
- `DONE` — completed with explicit evidence.
- `CLOSED` — milestone completed and verified to release criteria.
- `IMPLEMENTATION_IN_PROGRESS` — implementation work is active and not yet locally verified.
- `VERIFIED_LOCALLY` — implementation has passed applicable local verification but is not yet pushed/released.
- `READY_TO_PUSH` — local release batch is verified and ready for the controlled push/merge step.
- `PUSHED` — the release batch has been pushed to its intended remote branch; this is not deployment evidence.
- `DEPLOYED` — direct Vercel evidence confirms the intended production deployment.
- `DEPLOYMENT_BLOCKED` — implementation/release is blocked specifically by Vercel availability, quota, rate, pause, build, or platform conditions.
- `IMPLEMENTATION_BLOCKED` — implementation cannot proceed because of a hard technical, permission, dependency, or environment blocker.

## Project Ownership and Human Roles
- The user is the sole human owner and primary developer of Menu V3.
- Do not assume collaborators, teammates, contributors, or a development team.
- Git commits, pull requests, branches, CI activity, and documentation history are repository evidence, not proof of multiple human developers.
- Refer to prior work as prior repository work, prior sessions, historical commits, or user-authorized AI-assisted work unless the user explicitly confirms a human collaborator.
- The user remains the only human authority for product, architecture, security, release, and deployment decisions.

## Documentation Commit Batching
- When remote-only repository tools create commits directly, prepare and review all documentation changes first.
- Create one coherent documentation commit per documentation-only task whenever the available tool supports batching.
- Do not create one commit per file unless batching is technically impossible.
- If separate commits are technically unavoidable, state the limitation before writing and keep commits minimal.
- Do not create avoidable commits for intermediate wording, partial reports, or duplicated continuity updates.
- Avoid unnecessary pushes because connected Git workflows may trigger CI and Vercel activity.
- A documentation-only task must not intentionally trigger deployment, but any automatic external status must be reported honestly.


## 2026-10-09 — Login Dark-Mode Footer Reachability — IMPLEMENTATION_IN_PROGRESS

- Base SHA: `b1f9c5fa9eee8fe899cd23b24e4948e6682cd578`; branch: `fix/login-dark-footer-overflow-2026-10-09`.
- The login page's vertically centered grid was replaced with a flex-column shell and vertical auto margins, preserving centering when content fits while allowing normal top-to-bottom scrolling when it does not.
- Added a browser regression test at 390×650 for the final footer link/copyright across Arabic/English and light/dark themes.
- VERIFIED: latest-head Quality and W9 Orders QA both passed on `a0641ad1ac4ebc034ea78f35db06d45676cbe72d`; the new footer reachability browser test passed.
- UNKNOWN: deployment and physical-device verification remain unperformed. Do not merge/deploy automatically.
- Exact next action: owner review PR #390 and its diff, then stop before release.

- CI follow-up: first browser run failed due to test setup accessing localStorage before navigation (`about:blank` security error), not a layout assertion. Test now initializes theme after navigating to the app origin; latest-head CI rerun pending.


## 2026-10-09 — Login Footer Contrast Correction — IMPLEMENTATION_IN_PROGRESS

- Corrected scope after owner clarification: this is a contrast/color defect in the last footer section on /login in dark mode, not primarily a scrolling/reachability issue.
- The login footer keeps a light brand surface. Its text-bearing links and paragraphs must use dark foreground colors in dark mode; override is scoped to [data-auth-page] and the footer only.
- Added Playwright coverage for Arabic and English that calculates contrast ratio for all text links and both footer paragraphs; target >= 4.5:1.
- Do not alter homepage/footer appearance outside login, auth behavior, public-menu themes, or release/deployment configuration.
- VERIFIED: Quality run 37957188131 and W9 Orders QA run 37957188277 passed on code/test head 1d4f4999ad06d5156e82775ba40ef856dbdaedcb; the Menuun brand browser QA step succeeded.
- Superseded by the PR #390 merge/continuity record below.

## 2026-10-09 — PR #390 Merge and Continuity Update — MERGED / POST-MERGE QUALITY VERIFIED

- Verified PR #390 was open, mergeable, and targeted `main`; changed files were limited to continuity docs, login route, platform theme CSS, and its browser regression test.
- Squash merge succeeded. Merge commit/PR #390 merge SHA: `1d4a347a37928f4f8661ee48fb417b8457f10929`.
- Pre-merge CI: Menu V3 Quality `37958748646` and W9 Orders QA `37958748617` succeeded on PR head `a8507826958fea08fec3c4805aabaf314c1bcac4`.
- VERIFIED: main-branch Quality run `37961255049` completed successfully on merge SHA `1d4a347a37928f4f8661ee48fb417b8457f10929`.
- No deployment was requested or performed. Do not infer deployment from merge.
- Exact next action after this continuity PR merges: verify `main` contains these records, then stop.

## 2026-10-09 — Final State After PR #390 and PR #391 — VERIFIED

- PR #390 merged the login footer dark-mode contrast correction and browser regression at `1d4a347a37928f4f8661ee48fb417b8457f10929`.
- PR #391 merged continuity documentation at `ee8db7dc1fd0c83422f3100f797445d72e840559`; verified `main` HEAD at the time of this record.
- PR #391 Quality run `37963664719` and W9 Orders QA run `37963664727` both succeeded on head `57df76ebb2b38ff71a5aa76c3c58702bfedf5ad0`.
- Post-merge Quality run `37961255049` succeeded on PR #390 merge SHA.
- No production deployment was requested or performed. Real-device QA remains UNKNOWN.
- Exact next action: stop; no more implementation or deployment without a new request.

## 2026-10-14 — Pricing Dark-Mode CI Readiness Race — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: Quality run `38489491216` passed route generation, typecheck, npm tests, the W7.4–W7.10 contract suites, lint, production build, and performance audit, but failed in `Browser template QA — all themes`. Exact failed gate: `essential · mobile-390 · visible content headings · 0`.
- ROOT CAUSE: `scripts/template-qa.mjs` used an OR readiness predicate: it stopped waiting as soon as `document.documentElement.dataset.menuTheme` existed, even if the page heading had not rendered yet. It then immediately counted headings, creating a render-timing race.
- IMPLEMENTED: commit `6897d88dabb7083e7b67dbd9f136a551b0d59dd1` changes the readiness predicate to require both resolved theme and a rendered heading before assertions. This preserves the heading assertion and waits for the actual content; it does not skip the gate.
- IMPLEMENTED: prior commit `eec455c196cb403bb615e561bd1ab04d9e6685ed` changes the platform-theme route matrix from `networkidle` to `domcontentloaded`; subsequent assertions still verify direction, theme, hydration readiness, toggle behavior, and persistence.
- VERIFIED: W9 Orders QA run `38489491178` succeeded. Quality run `38489491216` failed only at the template browser QA gate; the PR-specific platform-theme browser test had not yet been reached in that run.
- UNKNOWN: CI result for the new head, and visual confirmation of the pricing card in the actual deployed site.
- DEPLOYMENT: NOT_PERFORMED. PR #402 remains open and unmerged.
- EXACT NEXT ACTION: inspect latest-head Quality and W9 Orders QA; if Quality fails, inspect its exact failing step. If both pass, review final diff and stop for owner decision.

---

## 2026-10-14 — Follow-up Contract Test Alignment — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: Quality run `38490253666` reached `Tests` after route generation and typecheck passed, then failed one test: `Phase 7 waits for preview hydration before evaluating rendered theme gates`. The assertion expected the old OR readiness predicate after `scripts/template-qa.mjs` was corrected to wait for both theme resolution and a rendered heading.
- IMPLEMENTED: commit `78a9b39f81f235e397585a57ed496cc74a6e59a6` updates `tests/phase7-theme-regression.test.mjs` to assert both conditions and their AND relationship. This strengthens the contract instead of removing it.
- VERIFIED: previous Quality run `38489491216` passed typecheck, npm tests, lint, build and performance audit but failed the template QA readiness race at Essential/mobile-390 with heading count 0. W9 Orders QA run `38489491178` passed.
- UNKNOWN: full CI result after the test-contract alignment and whether template QA passes all themes across the viewport matrix on the new head.
- DEPLOYMENT: NOT_PERFORMED. PR #402 remains open and unmerged.
- EXACT NEXT ACTION: inspect Quality and W9 Orders QA for the latest branch head. Fix only failures shown by the actual logs; if both green, review final diff and stop for owner decision.

---


## 2026-10-16 — Pricing Theme Toggle Hydration and CI Install Follow-up

- VERIFIED: Quality run `38490484286` failed in `tests/menuun-brand-browser.spec.ts:77` because `getByRole` searched for the dark-state Arabic label before React hydration updated the server-rendered button. The root theme was already dark while initial component state could still be light.
- IMPLEMENTED: commit `0b7b104c9df5e9c8c599d516b1328d786ce101de` selects the toggle by readiness attribute, waits for hydration, asserts the expected accessible name, then clicks; no assertions were removed.
- VERIFIED: W9 run `38885933076` failed because transient Playwright installation removed the Vite executable; W9 run `38886351310` passed after Vite was installed explicitly. The Quality transient Playwright install also hit npm ERESOLVE due optional peer dependency incompatibility; workflow now uses explicit Vite plus `--legacy-peer-deps` for that transient install.
- VERIFIED: W9 run `38886351310` is green. Quality run `38886351402` passed typecheck, tests, contracts, lint, production build, Playwright runner and Chromium installation; all-theme browser QA remains in progress at last check.
- DEPLOYMENT: NOT_PERFORMED. PR #402 remains open/unmerged.
- EXACT NEXT ACTION: inspect Quality run `38886351402` to completion. If it fails, read the exact failing step and error context; if green, review the final diff and stop for owner decision.


## 2026-10-19 — PR #403 CI dependency resolution follow-up

- VERIFIED: dependency-fix commit is `65cdd340f3926eab1603265fe6ccb44e15aaf2cb` (`fix(ci): pin typescript-eslint to locked version`). It changes only `package.json` and the root devDependency metadata in `package-lock.json`, pinning `typescript-eslint` to `8.69.0`; lockfile-resolved `typescript-eslint`, `@typescript-eslint/parser`, and `@typescript-eslint/type-utils` are all already `8.69.0` on `main` and the PR branch.
- ROOT CAUSE: the workflow's supplemental Playwright install uses `npm install --no-save --no-package-lock`, which re-resolves the dependency graph outside the committed lockfile. The root range `^8.56.1` allowed npm to select a newer `typescript-eslint` release that requested unpublished `@typescript-eslint/type-utils@8.72.0`. Official npm registry search found parser `8.71.2` as the latest published version, and no published `8.72.0`.
- VERIFIED: previous Quality run `39292009756` and W9 Orders QA run `39292009701` both failed at their supplemental Playwright install steps with `ETARGET No matching version found for @typescript-eslint/type-utils@8.72.0`; application tests/build were not shown to fail at that step.
- VERIFIED: branch head was advanced to `65cdd340f3926eab1603265fe6ccb44e15aaf2cb`; the GitHub API reports no Actions runs associated with that SHA. Updating the branch ref through the connected GitHub tool did not create new workflow runs, and the available GitHub connector exposes no workflow-dispatch action. The PR remains draft/open and unmerged; no production deployment was performed.
- UNKNOWN: Quality, W9 Orders QA, `npm test`, and Build on the dependency-fix commit have not yet been rerun. No claim of success is permitted.
- EXACT NEXT ACTION: create and push an empty commit from the owner’s authenticated local checkout on `fix/public-upsell-opens-product-details` to trigger GitHub Actions on the current branch head; then inspect the actual Quality and W9 run results and their npm-test/build steps before considering merge.
