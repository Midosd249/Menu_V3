## 2026-10-23 — QR table ordering public-flow integration — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: main base SHA is 74ddc7af44e0472e132416496579b523c847f6a0; work is isolated on feat/qr-table-ordering. Draft PR #411: https://github.com/Midosd249/Menu_V3/pull/411.
- IMPLEMENTED ON BRANCH: both public menu route shapes resolve opaque QR tokens through a server function; public order submission resolves the token again, validates tenant and branch ownership, and persists only the server-derived table_id. Idempotency distinguishes tables. src=qr alone does not prove table identity.
- IMPLEMENTED: dependency-light SHA-256/random token primitives, focused token test in npm test, public-order security regression contract, Referrer-Policy: no-referrer on public menu routes, supported sql.transaction usage, and conditional role revokes so local PostgreSQL fixtures without Supabase roles can apply the migration.
- VERIFIED CI HISTORY: an earlier Quality run failed because a cache contract expected the previous exact header object; updated the test to account for Referrer-Policy. An earlier W9 run failed because local PostgreSQL lacks the Supabase anon role; migration revokes are now conditional. Typecheck and PGLite fixture passed on the latest checked code head 5e0401e58ba5f0530f6217b11d3bc3a1e93ec74f, but full Quality/W9 outcomes must be checked on the final head after this documentation commit.
- VERIFIED DATABASE SIDE EFFECT: Vercel Preview build dpl_6kq3jL2GzMRCjeyHAiFtKasgaG9P at commit 0a0fb8e8f1dc064be77587bc85e2896a1fc84435 ran npm run build, which invokes npm run db:migrate, and its logs explicitly report applying 20261023120000_restaurant_tables_and_qr_tokens.sql. Read-only checks confirmed the row in menu_v3._migrations (2026-10-23 02:05:57 UTC), both new tables exist, orders.table_id exists, both new tables have zero rows, RLS is enabled, no policies exist, and direct grants are only to postgres. The migration was applied by the automated Preview build, not by a direct SQL action in this session. No rollback was attempted.
- VERIFICATION: Vercel Preview for code head 5e0401e58ba5f0530f6217b11d3bc3a1e93ec74f is READY; this is not a production deployment. No local terminal/manual real-device test was performed.
- UNKNOWN/BLOCKED: final-head Quality/W9 checks; owner confirmation whether the linked Supabase schema change should be retained or rolled back. Owner QR management UI and staff table display remain outside this increment.
- RELEASE: PR #411 remains draft and unmerged. No production deployment was performed; do not describe the connected database as unchanged.
- EXACT NEXT ACTION: after checking final-head Quality/W9, obtain the owner's decision to retain the additive schema or authorize a rollback; do not merge or deploy until the database-state decision is explicit.

---

## 2026-10-22 — P1/P2 subscription lifecycle remediation — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: latest `main` base is `624764b789c7ad2bb228871f8c1fe908bfa28db5`; changes are isolated on `fix/subscription-trial-expiry-atomic-audit-2026-10-22`.
- VERIFIED from the live PostgreSQL function definition: `menu_v3.enforce_subscription_entitlement()` checks subscription status but does not expire `trialing` rows by `trial_ends_at`; it does preserve unlimited Pro products. The expiry guard must precede the status/limit decision.
- IMPLEMENTED: application-side lazy expiry no longer suppresses reversion because of prior audit history; the database guard also treats a `trialing` row with a missing end timestamp as expired.
- IMPLEMENTED IN THIS CHANGESET: a corrective migration downgrades expired trials to active Free, clears `trial_ends_at`, resets billing interval to monthly, then evaluates the requested write against Free limits in the same transaction. Missing active Free plan fails closed. Existing trigger definitions and client grants are not broadened.
- VERIFIED from the live audit-table constraint: `billing_interval_changed` was missing from the allowed action list even though the application emits that event. The corrective migration adds it before the atomic billing-interval path can rely on audit success.
- IMPLEMENTED IN THIS CHANGESET: Platform Owner plan, billing interval, trial, subscription-status, and account-freeze mutations now place the state change and audit insert in one `sql.transaction`. Subscription rows are locked before state is read/mutated; an audit failure rolls the mutation back.
- TESTS ADDED: the existing PH-04 test file (already registered in `npm test`) now checks expiry ordering, downgrade fields, preserved Pro unlimited-product behavior, function grants, and transactional audit wiring. Tests have not yet run in this remote-only session.
- RESEARCH: current repository code/tests, live Supabase function definition, Supabase documentation search, and official PostgreSQL trigger/row-lock documentation via Exa. No production migration was applied.
- UNKNOWN/BLOCKED: no local checkout or terminal/browser runner is available in this session. GitHub Actions verification on the final PR SHA is pending. No Supabase mutation, merge, or deployment.
- EXACT NEXT ACTION: inspect Quality/W9 on the final PR head; fix only failures demonstrated by logs, then review the diff and stop. Do not merge or deploy.

---

## 2026-10-20 — Invitation context recovery after email verification — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: `main` is `74a4f6c87f3cdf5b5e0dbbdabf9459a5f3537998` (PR #405 merge). Owner reproduced: new invitee signs up, verifies email, signs in, then lands in self-service onboarding and can create a separate restaurant instead of returning to the inviter's workspace.
- VERIFIED FROM CODE: `/login` derived the invitation only from the current URL query; the verification callback targeted the generic login page, and onboarding could provision a workspace when the account had no membership. The previous tests checked string wiring, not context recovery after the URL changed.
- IMPLEMENTED ON PR #406: persist the validated invitation token in browser-local recovery state, return verification callbacks directly to the invitation route, recover context at login, and redirect out of onboarding before workspace provisioning when an invitation is pending. Acceptance remains explicit and server-verified; no role/tenant trust moved client-side.
- RESEARCH: Better Auth official email docs state that verification redirects to the supplied `callbackURL`. Official reference: https://better-auth.com/docs/concepts/email. Repository evidence shows the application had no durable fallback if the callback URL/query was lost.
- CI: post-merge Quality run `39480542146` and PR #406 Quality `39484797065` / W9 `39484796977` failed before any steps ran. The PR runs were retried once; both attempts still exposed no steps (`runner_id: 0`) and log retrieval returned `BlobNotFound`. Root cause is UNKNOWN; this is not evidence of an application test failure, and it does not establish test success.
- UNKNOWN: no local checkout, terminal, or interactive browser is available in this session; actual email-client/browser end-to-end behavior remains unverified until CI and owner-side manual testing.
- RELEASE: no database schema changes, no Supabase mutation, no merge, and no deployment authorized/performed.
- EXACT NEXT ACTION: resolve or obtain evidence for the GitHub Actions pre-step failure, then run Quality and W9 on the same final PR head; do not merge or deploy until those checks pass and the owner retests the real email/browser journey.

---
## 2026-10-20 — PR #405 CI failure root-cause repair — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: PR #405 remains open/draft on `fix/complete-team-invitation-journey`; latest code/test head before this continuity update was `be22866e143a869a166384ea52f45dea28c8e651`. No merge, database mutation, or deployment occurred.
- VERIFIED: Quality run `39474163001` passed route generation and TypeScript typecheck, then failed in `npm test` with 4 contract assertions; 505 tests passed. Lint, production build, and later browser checks were skipped because the test step failed.
- ROOT CAUSES: (1) `tests/onboarding-blockers.test.mjs` incorrectly prohibited all `sessionStorage` use, although signup intentionally stores the pending registration email so verification/resend can recover it. (2) Two `tests/registration-contract.test.mjs` assertions pinned the old `navigate('/verify-email')` implementation and rejected the current hard navigation that preserves the invitation token. (3) `tests/p1-4-request-waterfall.test.mjs` pinned `getMyStudio()` without arguments, but StudioGate now explicitly selects the invitation-accepted tenant and safely falls back only if membership validation returns forbidden.
- IMPLEMENTED: Updated those contracts to assert the intended behavior rather than obsolete implementation details: pending email persistence, invitation token preservation through verification, selected-tenant loading, and forbidden-selection fallback. Invitation-specific acceptance/security assertions remain intact; no application runtime code was changed to silence tests.
- RESEARCH: Reviewed Node.js test-writing guidance and test-quality guidance via Exa; conclusions align with updating assertions to preserve behavior contracts rather than weakening them.
- VERIFICATION: On the previous code head, route generation and TypeScript typecheck passed; repository tests failed as above. New-head Quality run `39475956609` and W9 Orders QA run `39475956866` were observed in progress, with hosted-runner setup/install taking longer than usual. Their final outcomes are not yet verified. No local checkout, terminal, or interactive browser QA was available in this connected session.
- RISK/UNKNOWN: Until the latest-head Quality job completes, the updated test assertions, lint, build, and downstream browser checks remain unverified. A successful W9 run alone does not establish the full invitation journey.
- EXACT NEXT ACTION: Inspect the latest-head Quality and W9 runs after the continuity commit; read every failed step/log, fix only evidence-backed regressions within the invitation journey, then review the final diff and stop without merge/deployment.

---

## 2026-10-20 — PR #404 merged: invalid-order rate-limit RLS drift correction — MERGED / PRE-MERGE CI VERIFIED

- VERIFIED: PR #404 merged by squash as `ed567e00090436b7999956bb638daa30c236d060`; PR: https://github.com/Midosd249/Menu_V3/pull/404.
- VERIFIED: tested PR head `4f5359ec4c00aa2ed6073cdcf8dd170ebbed2c78`. GitHub Actions Quality run `39371689056` and W9 Orders QA run `39371689058` both completed successfully on that head.
- VERIFIED (owner-reported): owner manually tested the Vercel Preview, the restaurant journey worked, and creating a new account succeeded.
- VERIFIED (Supabase evidence recorded in PR): migration `20261020080000_reconcile_public_order_invalid_rate_limits_rls.sql` is recorded; `menu_v3.public_order_invalid_rate_limits` has RLS enabled, FORCE RLS disabled, and no direct table grants to PUBLIC/anon/authenticated.
- IMPLEMENTED: migration enables RLS and revokes privileges from PUBLIC, anon, and authenticated. Regression contract added in `tests/public-order-hardening.test.mjs`. Historical migration retained; no order-flow logic or tenant/branch isolation changes.
- ACCEPTED/DEFERRED BY OWNER: Preview builds may run `db:migrate` against the shared Supabase database. Owner states Preview is currently used privately for testing and asks to defer this risk. Revisit before exposing Preview to other people or treating it as an untrusted environment.
- UNKNOWN: root cause of the original schema drift; exact production application runtime role; post-merge main-branch CI run and production deployment status are not established by the evidence collected here. Pre-merge CI and owner Preview testing do not prove deployment.
- RELEASE STATUS: PR merged; do not label production DEPLOYED without direct Vercel production evidence.
- EXACT NEXT TASK: read-only backup and restore readiness audit for Supabase/PostgreSQL and the Menu V3 production data path. Do not change backup settings or run a restore without explicit authorization.

---

## 2026-10-20 — Invalid-order rate-limit RLS drift correction — IMPLEMENTATION_IN_PROGRESS

- BASE: `main` SHA `1869bef93c44080123f836ca26fbc5b9332f0187`; branch `fix/public-order-invalid-rate-limits-rls-drift`; draft PR #404.
- VERIFIED: Supabase project `ublxptcqefujkbeepylc` has `menu_v3.public_order_invalid_rate_limits`; live catalog reports RLS disabled and table owner `postgres`. `anon` and `authenticated` have no direct table privileges and lack `USAGE` on schema `menu_v3`. The application migration ledger records the original migration, so the live schema and recorded migration state disagree.
- IMPLEMENTED ON BRANCH: added `migrations/20261020080000_reconcile_public_order_invalid_rate_limits_rls.sql`, which enables RLS and revokes all privileges from `PUBLIC`, `anon`, and `authenticated`, without granting client access or forcing RLS on the table owner. Added a contract assertion in `tests/public-order-hardening.test.mjs`.
- UNKNOWN: the exact historical cause of the drift; the SQL connector's `current_user=postgres` does not independently establish the production application connection role. No direct production DDL was applied.
- VERIFICATION: latest-head GitHub Quality/W9 results pending. Local tests/typecheck/lint/build were not run in this connected session. No merge or deployment.
- EXACT NEXT ACTION: inspect Quality and W9 on the latest PR #404 head, then review the final diff and stop for owner decision. After the correction is merged/released through the controlled process, the next owner-requested task is a read-only backup/restore-readiness audit.

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

## 2026-10-16 — PR #402 merged: Pro pricing contrast and CI root-cause closeout

- VERIFIED: PR #402 merged successfully as `a1009d0595b8e5ab39c5df0e7119e4003db72160`; final tested PR head was `ae3d00f8c264671bf6e28440ad2316e6338d98cd`.
- VERIFIED: Quality run [38956141584](https://github.com/Midosd249/Menu_V3/actions/runs/38956141584) and W9 Orders QA run [38956141474](https://github.com/Midosd249/Menu_V3/actions/runs/38956141474) both succeeded on the same final PR head. The Quality job completed Studio and Platform Admin responsive browser QA successfully.
- VERIFIED: the repository owner confirmed the pricing preview looked correct before requesting merge. No production deployment was performed.
- ROOT CAUSES RECORDED: (1) persistence test's `addInitScript` reapplied dark storage on every document and overwrote the user's light preference; (2) Studio fixture omitted prerequisite invoice/subscription migrations; (3) Studio browser QA runner ran out of disk, with varying failing routes and Vite ECONNRESET; not proven to be a route-specific application defect.
- IMPLEMENTED: corrected the persistence fixture, completed disposable CI migration ordering, added build/cache/unused-SDK cleanup before Studio browser QA, and retained the full coverage matrix with three consecutive brand-browser runs at `--retries=0`.
- LESSON: diagnose each failing step from the current SHA and complete logs; do not infer app hydration or route defects from error labels; inspect fixture dependencies and disk pressure before changing product code.
- RECORD: detailed retrospective in `docs/incidents/PR-402-pricing-contrast-and-ci-debugging.md` and permanent prevention rules in `docs/project-memory/problems-learned.md`.
- RELEASE: MERGED; NOT_DEPLOYED. No homepage redesign or production data/schema change was made.
- EXACT NEXT ACTION: stop this task; any production deployment must follow the separate release-only workflow and explicit authorization.

---

## 2026-10-16 — PR #402: Studio browser QA runner disk exhaustion

- VERIFIED: Quality run [38917634867](https://github.com/Midosd249/Menu_V3/actions/runs/38917634867) on head `0bc68abb9f4ca684e5678012c221474927663178` failed in the Studio browser QA job. The first W7.10 matrix attempt failed at `/studio/qr`/1024px; the second failed at `/studio/branches`/768px. Both displayed only the Studio loading state, while 11 of 12 tests passed in each attempt.
- VERIFIED: The runner explicitly warned only 5 MB disk remained during the browser suite. Vite then logged repeated `Error: aborted` / `ECONNRESET`; the failing route changed between attempts. This supports runner disk exhaustion/unstable server execution as the current cause, not a route-specific responsive bug. No direct request trace was attached, so the exact pending application request remains UNKNOWN.
- REVIEWED: StudioGate leaves the loading state only after `getMyStudio()` settles; its failure branch renders ErrorState. The browser suite's varying route failures plus near-zero disk and Vite ECONNRESET point to environment instability; do not alter auth, shell readiness, or route assertions without contrary evidence.
- IMPLEMENTED: commit `a0d183673f68a57cf2957e3a707931ed2827dea6` adds cleanup of unused hosted-runner SDKs (Android, .NET, GHC, PowerShell) and apt cache immediately before Studio/Admin browser QA, while preserving Node, npm project dependencies, PostgreSQL, and Playwright/Chromium.
- UNKNOWN: whether this cleanup restores enough disk and makes Quality pass; the run triggered by the updated workflow must be inspected through completion. W9 on prior head `0bc68abb9f4ca684e5678012c221474927663178` passed, but it does not certify the new HEAD.
- SCOPE: CI runner only; no application behavior, authorization, database schema, production data, homepage, or pricing UI changed. No merge or deployment.
- EXACT NEXT ACTION: inspect the new HEAD and latest Quality/W9 runs; verify disk space after cleanup and browser results. If W7.10 still stalls, use the newly available runner space to capture request/console/server diagnostics before any further change. Preserve the 20 theme combinations and all existing assertions.
 
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

- VERIFIED: Quality run `38479836616` failed only in `tests/menuun-brand-browser.spec.ts`, test `platform theme preference stays independent from language across marketing, auth, pricing and legal routes`; 7/8 tests passed. Typecheck, repository tests, focused contracts, lint, production build, and all-theme browser QA passed. W9 Orders QA run `38479836649` passed.
- VERIFIED: preview server did become ready on `127.0.0.1:8081`; the earlier interpretation that server startup itself was the final failure was incorrect. The actual failure was the browser assertion waiting for `localStorage["menu-theme"]` to reflect the theme after the root `data-platform-theme` attribute changed.
- IMPLEMENTED: `src/components/theme-toggle.tsx` now computes an explicit `nextPreference` and persists it before updating React state and the document theme attribute, so persisted state is committed before the visual state becomes observable. Commit: `bda2c94a11b5350e87d7f7d7124b25416a869c70`.
- UNKNOWN: whether this ordering change resolves the browser failure; the CI run for the new commit has not appeared in the first query. No tests were executed locally in this GitHub-connected session.
- DEPLOYMENT: NOT_PERFORMED. PR #402 remains open; no merge or production deployment.
- EXACT NEXT ACTION: inspect Quality and W9 Orders QA on the latest branch head; if the persistence assertion still fails, use the browser error context and correct the actual persistence failure rather than increasing timeouts or weakening the test.

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

## 2026-10-09 — Studio Logo Dark-Mode Contrast — DONE / VERIFIED IN CI

- VERIFIED: base `main` at task start was `5b58696ce73a52aa580c920785978b5439b6df78`; implementation branch: `fix/studio-logo-dark-mode-2026-10-09`.
- VERIFIED root cause: both approved platform SVG wordmarks use dark `#1F2022` paths and transparent backgrounds. The Studio shell renders them directly over the platform surface, which becomes dark in dark mode. The homepage already uses a light brand plate to preserve the supplied logo without filters.
- IMPLEMENTED: added a Studio-only `data-studio-brand-logo` hook to the desktop logo link and mobile logo wrapper, with a dark-mode-only light plate scoped under `[data-platform-chrome]`. No SVG assets, logo colors, light-mode styles, homepage/login styles, public-menu themes, or business logic were changed.
- IMPLEMENTED: extended the W7.4 Studio browser spec to verify logo asset loading and opacity, transparent/no-border appearance in light mode, and the exact light plate/border in dark mode at 390×844 and 1280×800. The mobile wrapper is hidden at desktop widths so the visible-logo selector remains deterministic.
- PREVIOUS-CHECK LESSON: the earlier Studio contrast assertion failed because it assumed the inactive control's default muted color even while the browser applied a white hover color. The existing fix validates actual contrast in normal and hover states. This change does not weaken or rewrite that assertion; the new logo checks do not depend on hover-sensitive colors.
- VERIFIED: GitHub Quality run `37984937077` and W9 Orders QA run `37984937046` both passed on code/test head `535b4bef52411032b63ef8afe1539365cc15480e`. Quality passed route freshness, typecheck, repository tests, focused W7.4–W7.10 contracts, lint, production build, all-theme browser QA, homepage/login Arabic-English browser QA, Golden 30-product performance fixture, Studio Shell/Home/Menu/Growth/Customers responsive browser QA, Platform Admin responsive browser QA, and performance-baseline upload.
- VERIFIED: the new Studio browser test passed at 390×844 and 1280×800. It confirms the logo asset loads with opacity 1 and no filter; light mode retains transparent background, zero border width, and zero padding; dark mode applies the scoped `#fffdf8` plate, `#e8e5dd` border, and 4px padding; toggling back to light removes the plate. The initial test-only failure was corrected by checking zero border width rather than assuming Tailwind's global border style is `none`; no runtime CSS was altered to accommodate the test.
- UNKNOWN: manual screenshot review and physical-device QA were not available in this connected session. The viewport-based browser verification passed.
- VERCEL: status check remains FAILURE due the explicit build-rate-limit target. No retry, merge, or production deployment was performed; this logo fix does not require a deployment to verify in CI.
- DEPLOYMENT: NOT_PERFORMED. No merge or deployment was requested or executed.
- EXACT NEXT ACTION: owner review of PR #393; do not merge or deploy automatically.

---

## 2026-10-09 — Dark-Mode Visual/Functional Follow-up — VERIFIED IN CI

- VERIFIED: base `main` at task start was `4fd65ac1dee3ed56745d6ea1aed009f058b6e4d5`; implementation branch is `fix/dark-mode-contrast-audit-2026-10-09`; review PR is #389.
- VERIFIED: latest code-head GitHub Quality run `37936864400` passed: generated-route freshness, typecheck, repository tests, focused W7.4–W7.10 contracts, lint, production build, all-theme browser QA, homepage/login Arabic-English browser QA, Golden 30-product performance fixture, Studio Shell/Home/Menu/Growth/Customers and responsive browser QA, Platform Admin responsive browser QA, and browser performance-baseline upload.
- VERIFIED: latest code-head W9 Orders QA run `37936864385` passed.
- VERIFIED: the initial Studio contrast test failed only because the browser computed the inactive button's hover color as white rather than the default muted color. The final assertion accepts the normal and hover colors and checks actual text/background contrast in both states; latest-head Studio browser QA passed. The product CSS remains deliberately high-contrast in either state.
- IMPLEMENTED: opaque dark Studio mobile navigation with clearer border, strong active state, and high-contrast labels; explicit underlined/high-contrast dark login secondary actions; a light brand plate for the homepage footer logo matching the header treatment.
- RESEARCH: WCAG 2.2 SC 1.4.3 text contrast target is 4.5:1 for normal text; SC 1.4.11 specifies 3:1 for essential non-text UI/state visuals. Sources: https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html.
- SCOPE REVIEW: only platform theme CSS, homepage logo styling, login presentation attributes, browser tests, and continuity records changed. No public-menu theme files, auth behavior, business logic, schema, dependency, or deployment configuration changed.
- PERFORMANCE: Golden 30-product performance fixture passed and browser performance baseline was uploaded. The optional P1.9 real-route evidence step was skipped by its existing workflow condition; no new LCP/INP or production/physical-device performance claim is made.
- VISUAL LIMITATION: CI browser tests and computed-style/contrast assertions passed. Manual human screenshot inspection and physical-device QA were not available in this GitHub-connected session.
- DEPLOYMENT: NOT_PERFORMED. No merge or production deployment was requested or executed.
- EXACT NEXT ACTION: review PR #389 and its latest-head checks; do not merge or deploy automatically.

---

## 2026-10-09 — Footer Contact Icon & App Identity Follow-up — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: PR #385 head before this follow-up failed only at the Menuun brand browser step; its assertion still expected the visible email address after the footer changed to icon + accessible label. Typecheck, unit tests, lint, build, and all-theme browser QA passed in that run; W9 Orders QA passed.
- FIXED: browser assertions now verify the exact mailto/WhatsApp destinations, accessible names, visible icons, one link each, no visible phone/email text, legal links, and dynamic copyright year.
- IMPLEMENTED: added `public/menuun-app-icon.svg`, a dedicated square icon with opaque brand background and centered mark inside the maskable safe zone; manifest now references it instead of treating the transparent favicon as maskable.
- ADDED: contract coverage for Menuun title/favicon/manifest and app-icon metadata.
- VERIFIED: official MDN/W3C manifest guidance confirms scalable SVG icons are valid and that maskable artwork must respect a central safe zone; platform-specific icon rendering still needs real-device/browser verification.
- UNKNOWN: latest-head GitHub Actions runs have not yet been confirmed as completed; no merge or production deployment performed. Vercel currently reports a PR Preview status only, not production.
- Current follow-up code/test head: `55e3cf4dd98c440534ed6991be858aa714f98b51` (verify current branch HEAD again after continuity commits).
- Exact next task: inspect latest-head CI results, fix any remaining failures, review final diff, and stop before release if a required gate is not green.

---

## 2026-10-09 — Marketing Footer Structure Fix — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: base `main` HEAD is `fd3d92cbac172476c4f7507b4b0b9582ce91b821`; implementation branch is `fix/marketing-footer-structure-2026-10-09`.
- VERIFIED: before the fix, `src/components/marketing-footer.tsx` rendered email and WhatsApp twice (once under the brand block and again under Contact), included a separate About paragraph duplicating the tagline, and placed Contact before Links.
- IMPLEMENTED: footer order is now Brand → Links → Contact → Copyright in shared markup used by Arabic RTL and English LTR; contact actions exist only in Contact; the redundant About block and duplicate tagline are removed.
- VERIFIED BY SOURCE: footer Links includes Pricing, Preview, Sign in, `/terms`, and `/privacy`; regression coverage now spans `tests/public-pages-themes-contract.test.mjs` and `tests/menuun-brand-browser.spec.ts`, checking destinations, section order, RTL/LTR direction, and single contact hrefs.
- VERIFIED: GitHub Quality run `37878156218` passed on implementation/test head `7056b42edca4602e9382ab523b34ee1898de2073`; typecheck, tests, lint, production build, all-theme browser QA, and Menuun homepage/login browser QA in Arabic and English succeeded.
- VERIFIED: W9 Orders QA run `37878156194` passed on the same head.
- VERIFIED: Vercel PR status check is SUCCESS for the PR preview; no Production deployment was triggered.
- UNKNOWN: physical-device QA and local shell execution remain unverified. The live Production footer is unchanged until the owner approves a future release.
- RELEASE: one review PR only; do not merge or deploy before owner review.

## Exact next task

PR #385 is open as Draft. Owner review is the next action; do not merge or deploy without explicit approval.

---

## 2026-10-09 — Public Legal Pages & Share Metadata — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: the current homepage uses the shared `MarketingFooter`; before this change its links included Pricing, Preview, and Sign in, while `/terms` and `/privacy` did not exist.
- IMPLEMENTED: added bilingual `/terms` and `/privacy` routes, linked them from the shared marketing footer, and added Arabic/English homepage Open Graph and Twitter Card metadata.
- VERIFIED: `public/og.jpg` is a JPEG with dimensions 1200 × 630 (blob SHA `9efe69d064762539c2d16a0da46261412a0665d8`).
- RESEARCH: official SDAIA/National Data Governance Platform guidance describes Saudi PDPL and its implementing regulations as the relevant personal-data framework. The policy explicitly avoids claiming certification or a completed compliance audit.
- UNKNOWN: local typecheck/test/lint/build could not be run in this connected GitHub-only workspace; the PR's GitHub Actions quality run must be checked.
- UNKNOWN: visual rendering of `og.jpg` in actual social platforms has not been directly observed; its file format and dimensions are verified.
- RELEASE: one review PR only; do not merge or deploy until owner reviews the legal wording.

## Exact next task

Review the open PR's legal wording and CI evidence with the owner. Do not merge or deploy without explicit owner approval.

---

## 2026-10-04 — Official Nafas Studio Sync — VERIFIED

- VERIFIED: the prior blocker was resolved by using the correct menu_v3 schema in the connected Supabase project. The earlier public-schema query was the wrong source and must not be repeated.
- VERIFIED: demo-nafas is a real tenant in menu_v3, with 12 current products, 5 categories, 1 branch, 7 branch-hour rows, and 1 active product offer.
- IMPLEMENTED: DEMO_MENU now uses the current 12 Studio products and their selected product image URLs.
- IMPLEMENTED: exact Studio logo and cover are packaged as public/demo/nafas-logo.webp and public/demo/nafas-cover.webp; this avoids CI/preview 404s from the Studio media endpoint and avoids embedding large Base64 media in the JS fixture.
- IMPLEMENTED: demo-only enrichment remains limited to selected real products: variants, modifier groups/options, and the existing V60 offer.
- VERIFIED: GitHub Quality #2888 = SUCCESS; W9 Orders QA #1006 = SUCCESS.
- VERIFIED: Vercel Preview for head 79e9d73e931b43c12714932229cd47a06b29995b = READY.
- UNKNOWN: direct physical-device QA remains unverified.
- BLOCKED: none for the authorized demo implementation.
- PRODUCTION: unchanged; no production deployment and no merge to main.

## EXACT CURRENT STATE

Official Nafas Demo Sync: IMPLEMENTATION COMPLETE / VERIFIED LOCALLY + CI / PREVIEW

Branch: feat/official-nafas-demo-2026-10-04
PR: #377
Verified head: 79e9d73e931b43c12714932229cd47a06b29995b

## EXACT NEXT TASK

Final diff review → owner approval → merge PR #377 → one production deployment → real-device QA. P1.9 remains deferred.

# 2026-10-04 — Official Nafas Demo Hardening — IMPLEMENTED / VERIFICATION PENDING

- VERIFIED: `main` HEAD before this task was `fad0ad90ece050631dea668138ed4a70c8ba1db2` (P1.8 Performance Gates).
- VERIFIED: the public demo is intentionally served from static `DEMO_MENU` for the `nafas` slug; this task preserves deterministic separation from real tenant data.
- IMPLEMENTED: the official Nafas demo was expanded to 20+ products across five categories while preserving the existing logo path, cover image, and core products.
- IMPLEMENTED: demo-only branch data, opening hours, social/contact links, allergens, dietary labels, tags, variants, modifier groups/options, and item offers.
- IMPLEMENTED: focused regression coverage protects demo richness and rejects the old placeholder Instagram/WhatsApp values.
- RESEARCH: repository-first review plus Exa/Unsplash licensing research; Unsplash states its images are available for commercial and noncommercial use subject to its license and restrictions.
- SCOPE: no database mutation, tenant data mutation, auth/RLS change, schema change, Vercel deployment, or production release.
- VERIFIED: GitHub Quality run `37175844434` / run #2870 passed all repository quality, build, browser-template, Menuun brand, performance-fixture, Studio, and Platform Admin gates; W9 Orders QA run `37175844371` / run #988 also passed.
- VERIFIED: the final preview deployment for head `1f68f1cdd177c2a9b74522083a2d11449ff59e7b` reached Vercel `READY`.
- DEPLOYMENT STATUS: NOT_PERFORMED.
- EXACT NEXT TASK: P1.9 — Real-route performance evidence and budget decision, unless the owner explicitly authorizes another atomic task first.

---

# 2026-10-03 — P1.8 Performance Gates — CLOSED / VERIFIED

- VERIFIED: P1.7 PR #375 was merged into `main` before P1.8 started; current P1.8 implementation head is `dfbecb52d765169668c48184215f24a031719a48`.
- IMPLEMENTED: `scripts/performance-audit.mjs` now captures Playwright initial request count, HTML/JS/CSS/image/font transfer evidence, long-task evidence, and optional client-transition evidence.
- IMPLEMENTED: LCP/CLS/INP fields remain nullable/explicitly supported rather than being fabricated when the headless environment does not expose them.
- IMPLEMENTED: regression coverage was added to `scripts/quality-workflow.test.mjs`.
- VERIFIED: GitHub Quality #2860 passed, including typecheck, tests, lint, production build, browser QA, golden performance fixture, Studio QA, Platform Admin QA, and browser performance baseline upload.
- VERIFIED: W9 Orders QA #979 passed.
- VERIFIED: controlled preview baseline recorded 103 initial requests, 771.7ms DCL, 776ms FCP, 0 long tasks, and 48,957 transferred JS bytes.
- VERIFIED: golden 30-product fixture recorded 32 initial requests, 28.4ms DCL, 44ms FCP, and 20,587 transferred HTML bytes.
- UNKNOWN: client-transition numeric baseline because no real transition selector is configured in the current harness.
- UNKNOWN: LCP in the current headless measurement.
- DECISION: no hard numeric performance budget was introduced yet; current evidence is sufficient for repeatable measurement, not for a stable production-equivalent threshold.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT STATE

**P1.8 — Performance Gates: CLOSED / VERIFIED**

Branch: `perf/p1-8-performance-gates-2026-10-03`

Audit: `docs/performance/p1-8-performance-gates-audit.md`

## ACCEPTANCE STATUS

- [x] Initial request count evidence.
- [x] DCL/load evidence.
- [x] HTML/JS/CSS/image/font transfer evidence.
- [x] Long-task/main-thread evidence.
- [x] Optional client-transition measurement path.
- [x] LCP/CLS/INP support state recorded.
- [x] Regression contract.
- [x] Quality #2860.
- [x] W9 Orders QA #979.
- [ ] Client-transition numeric baseline.
- [ ] Production/real-device LCP.
- [ ] Hard numeric budgets.

## EXACT NEXT TASK

**P1.9 — Real-route performance evidence and budget decision**

Use the new measurement surface on representative public-menu and ordinary client-transition flows. Only after stable repeated evidence exists should hard numeric regression budgets be proposed.

---

# 2026-10-03 — P1.7 Vite/Rolldown Chunk Optimization — CLOSED / VERIFIED — NO CODE CHANGE

- VERIFIED: P1.6 continuity PR #374 was squash-merged into `main` as `1f1dbc3a853efcfaa3aca620989635dcc3ffecc5`.
- VERIFIED: current production client build uses Vite 8.2.2/Rolldown.
- VERIFIED: the current production client build produced 142 JavaScript asset rows; the largest client chunk was `index-BDOzjaAe.js` at 272.62 kB raw / 88.49 kB gzip.
- VERIFIED: no client chunk exceeded Vite's default 500 kB warning threshold.
- VERIFIED: automatic code splitting is already enabled; no `manualChunks` or `rolldownOptions` override exists.
- VERIFIED: current evidence does not identify duplicated module ownership or a safe manual grouping with a proven net request/transfer benefit.
- VERIFIED: no runtime/configuration code was changed by P1.7.
- UNKNOWN: browser-level initial JS transfer, client-transition request count, cache reuse, main-thread execution cost, and route-specific module dependency graphs.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT STATE

**P1.7 — Vite/Rolldown Chunk Optimization: CLOSED / VERIFIED — NO CODE CHANGE REQUIRED**

Branch: `perf/p1-7-vite-rolldown-chunk-optimization-2026-10-03`

Audit: `docs/performance/p1-7-vite-rolldown-chunk-audit.md`

## ACCEPTANCE STATUS

- [x] Current main and P1.6 continuity merge verified.
- [x] Vite/Rolldown production build baseline captured from GitHub Quality.
- [x] Client chunk inventory analyzed.
- [x] Oversized/duplicated chunk evidence assessed.
- [x] Manual chunking risk assessed against current Rolldown behavior.
- [x] No speculative chunking introduced.
- [ ] Browser-level JS transfer/cache/client-transition measurements remain UNKNOWN.
- [x] Deployment not performed.

## EXACT NEXT TASK

**P1.8 — Performance Gates**

Turn the existing performance targets into repeatable regression evidence for request count, client transitions, DCL/LCP, JS/CSS transfer, main-thread work, and representative DB/API measurements where the available tooling supports them.

---

# 2026-10-03 — P1.6 Analytics Boundary & Caching — CLOSED / VERIFIED

- VERIFIED: PR #373 was squash-merged into `main` as `f2f1271d4ffb146ffe64ffb2dac5f3665d324855`.
- VERIFIED: `getOwnerAnalytics` now uses one authorized server-side SQL boundary with a tenant-scoped `MATERIALIZED` CTE and server-side JSON aggregation.
- VERIFIED: `authMiddleware`, server-derived tenant membership, validated `days` input, response shape, and analytics semantics were preserved.
- VERIFIED: GitHub Quality #2836 and W9 Orders QA #958 passed on the final P1.6 head.
- VERIFIED: no personalized analytics caching was added because current evidence does not justify shared/private cache complexity.
- VERIFIED: no schema, migration, index, auth/RLS, or tenant-isolation change was made.
- VERIFIED: no current UI was proven to require traversal beyond existing bounded analytics/dashboard result pages, so no speculative cursor pagination API was introduced.
- UNKNOWN: end-to-end browser/network request reduction and production analytics latency remain unmeasured.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT NEXT TASK

**P1.7 — Vite/Rolldown Chunk Optimization**

Start with repository-first production build/chunk evidence. Optimize only a proven oversized or duplicated chunk; do not add speculative manual chunking and do not deploy automatically.

---

# 2026-10-03 — P1.5 Database Query Consolidation — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: current `main` = `d9d83c89c0070413c61f8a75e3120447006e4828` and P1.4 is closed/merged.
- VERIFIED: repository audit identified correlated `order_items` aggregation in `getOrdersDashboard` and `getPlatformOrders`, plus per-tenant correlated count subqueries in `getPlatformDashboard`.
- IMPLEMENTED: bounded order pages now aggregate `order_items` once and join the aggregate; Platform dashboard tenant counts use grouped CTEs.
- PROTECTED: auth/Better Auth, RLS, tenant/branch isolation, order lifecycle, analytics authorization, preparation-time/ETA, themes, subscriptions, SEO, and migrations.
- UNKNOWN: exact runtime DB execution time, exact DB round-trip reduction, and deep pagination requirements.
- BLOCKED: local shell execution unavailable; GitHub CI is the available automated verification source.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT STATE

**P1.5 — Database Query Consolidation: IMPLEMENTATION_IN_PROGRESS**

Branch: `perf/p1-5-query-consolidation-2026-10-03`
Base: `main` at `d9d83c89c0070413c61f8a75e3120447006e4828`

## ACCEPTANCE STATUS

- [x] Repository-first audit.
- [x] Proven correlated order-item paths identified.
- [x] Proven Platform tenant count paths identified.
- [x] Query consolidation implemented.
- [x] Regression coverage added.
- [ ] GitHub Quality/W9 verification.
- [ ] Final diff review after CI.
- [ ] Runtime query-plan measurement.

## EXACT NEXT TASK

**Finish P1.5 verification and continuity closeout.**

---
# 2026-10-03 — P1.4 Request Waterfall Consolidation — CLOSED / VERIFIED

- VERIFIED: P1.4 started from main `6b2eef2b619c7aa003649b516a1ca0fbbbab88e4` after P1.2/P1.3 closeout.
- VERIFIED: repository audit proved duplicate `getMyStudio()` calls on `/studio/analytics` and `/studio/reports`; `StudioGate` already loaded the same authorized `StudioSnapshot` and exposed it through `useStudio()`.
- VERIFIED: Analytics and Reports now reuse `useStudio().snapshot`; `getOwnerAnalytics()` remains an independent loading boundary.
- VERIFIED: `tests/p1-4-request-waterfall.test.mjs` was added and registered in `npm test`.
- VERIFIED: GitHub Quality #2824 = SUCCESS and W9 Orders QA #949 = SUCCESS on head `5ee71e1ae7c64bf6d359f171126675fb56955259`.
- VERIFIED: final PR #370 diff was reviewed and squash-merged into `main` as `1bb30fc675ee2cdf448cba380223dd00240dee0a`.
- UNKNOWN: exact browser/network request-count reduction, production DCL/LCP, physical-device performance, and local-shell verification remain unmeasured/unavailable.
- DEPLOYMENT STATUS: NOT_PERFORMED.

## EXACT CURRENT STATE

**P1.4 — Request Waterfall Consolidation: CLOSED / VERIFIED**

PR: #370
Verified implementation head: `5ee71e1ae7c64bf6d359f171126675fb56955259`
Merge commit: `1bb30fc675ee2cdf448cba380223dd00240dee0a`

## ACCEPTANCE STATUS

- [x] Request boundaries audited across public menu, Studio, Admin, Auth, preview, and not-found flows.
- [x] Proven duplicate Studio snapshot request identified.
- [x] Duplicate removed from Analytics.
- [x] Duplicate removed from Reports.
- [x] Regression contract added and registered.
- [x] Full GitHub Quality/W9 verification passed.
- [x] Final diff reviewed and PR merged.
- [ ] Exact production/browser request-budget measurement.

## EXACT NEXT TASK

**P1.5 — Database Query Consolidation and Pagination**

Do not begin implementation from the roadmap wording alone. Start with repository-first query/code audit and evidence for `owner.ts`, `orders.ts`, `platform.ts`, analytics modules, and any N+1 path. Preserve tenant/branch authorization and do not introduce migrations or query changes until a concrete DB/request inefficiency is proven.

# 2026-10-03 — P1.2 Active Theme Stylesheet Code Splitting — VERIFIED / PR #366

- VERIFIED: PR #366 targets `main` and its final implementation head `d1809de4f5ff02032c5bd443a511a625d0c23b75` has passed GitHub Quality #2816 and W9 Orders QA #943.
- VERIFIED: Quality #2816 completed with conclusion `success`.
- VERIFIED: W9 Orders QA #943 completed with conclusion `success`.
- VERIFIED: Vercel status for the verified PR head is `success`; the latest Preview deployment is `Ready`.
- VERIFIED: P1.2 acceptance contracts are satisfied by repository/GitHub evidence: no eager theme CSS in root, active-theme SSR stylesheet mapping, client stylesheet synchronization, five-theme registry, and regression coverage.
- VERIFIED: no Production deployment was performed by P1.2.
- UNKNOWN: direct physical-device and independent production performance measurements remain unknown; the <15-request and <500ms DCL targets are engineering targets, not yet runtime-verified budgets.
- BLOCKED: local shell execution is unavailable through the current connector-only execution surface; GitHub CI is the available automated verification evidence.
- PROTECTED: existing lazy theme template architecture, auth/RLS, tenant/branch isolation, ordering, analytics authorization, preparation-time/ETA, image delivery, subscriptions, SEO, and migrations were not intentionally changed by P1.2.

## EXACT CURRENT STATE

**P1.2 — Active Theme Stylesheet Code Splitting: CLOSED / VERIFIED**

Branch: `perf/p1-2-theme-css-code-splitting-2026-10-03`
PR: #366
Verified head: `d1809de4f5ff02032c5bd443a511a625d0c23b75`

## EXACT NEXT TASK

**P1.3 — Route Code-Splitting / Client Transition Budget**

Start with repository-first boot, current `main`/PR verification, and a measurement baseline. Do not assume the <5 client-transition target is currently met. Inspect the actual TanStack Start/Vite integration before changing code-splitting configuration. Do not deploy automatically.

## STOP CONDITION

Do not begin P1.4, database consolidation, analytics caching, or unrelated cleanup during P1.3. After P1.3 verification, update continuity with exactly one next task and stop.


## 2026-10-03 — P1.3 CLOSEOUT — VERIFIED / NO CODE CHANGE

- VERIFIED: P1.3 was evaluated against the actual TanStack Start/Vite integration on main.
- VERIFIED: the repository uses tanstackStart(); a standalone tanstackRouter() plugin is not present.
- VERIFIED: official TanStack evidence indicates Start has automatic route code splitting enabled by default; the attempted explicit router.autoCodeSplitting setting was redundant and was not merged.
- VERIFIED: PR #367 was closed without merge.
- VERIFIED: Quality #2820 = SUCCESS; W9 Orders QA #946 = SUCCESS.
- VERIFIED: production-build client chunk inventory before/after the explicit setting remained 145 unique JS chunks, with route chunk sizes unchanged.
- UNKNOWN: exact production client-transition request count and quantified initial-route JS reduction remain unverified; the existing build already produces route-specific chunks.
- BLOCKED: Vercel Preview for PR #367 reported a platform build-rate-limit failure; no production deployment was attempted.
- PROTECTED: auth/RLS, tenant/branch isolation, ordering, analytics authorization, themes, SEO, subscriptions, migrations, and P1.2 were not changed by P1.3.

## EXACT CURRENT STATE

**P1.3 — Route Code-Splitting / Client Transition Budget: CLOSED / VERIFIED — NO CODE CHANGE REQUIRED**

## EXACT NEXT TASK

**P1.4 — Request Waterfall Consolidation**

Start with repository-first request mapping and evidence for public menu, Studio, Admin, Auth, preview, and not-found flows. Do not begin database/query consolidation or caching unless request evidence directly requires it.


# 2026-10-04 — External Product Action Retirement — VERIFIED / PR #378

- VERIFIED: main baseline before this task is a7f642d5fe8a7f46abfa84f80c74ac129995b3fa, which already includes the official Nafas demo and P1.4–P1.8 performance work.
- VERIFIED: external Quick Add was still visible in Gallery because the existing retirement stylesheet was loaded only for Heritage/Taste; Heritage/Taste also had a local product action.
- IMPLEMENTED: quick-add-compact-refinement.css now retires both .public-menu-quick-add and .public-menu-options-action, plus the local Heritage/Taste control.
- IMPLEMENTED: the existing stylesheet is loaded last for all five canonical themes; no new network dependency was introduced.
- PROTECTED: product details/options, modifiers, variants, notes, cart/order behavior, analytics, auth/RLS, tenant isolation, Supabase data, and P1.4–P1.8 performance architecture.
- VERIFIED: GitHub W9 Orders QA #1011 passed; GitHub Quality #2894 passed through browser template QA for all themes and the remaining Studio/Platform browser gates on implementation head 2466b20f681c2b9dff2fee3f32a72109be896460.
- UNKNOWN: direct real-device production visual verification of the final merged state has not been performed; no deployment was requested or executed.
- STATUS: PR #378 is open and implementation head is pushed/CI-verified. P1.9 remains deferred.
- EXACT NEXT TASK: Review/merge PR #378 when release authorization is given; do not deploy as part of this task.


## 2026-10-09 — Platform Light/Dark Mode — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: base `main` HEAD for this task is `771c6a78aa8ce8c2be5028eb109e262089f1f016`.
- VERIFIED: the platform already has shared semantic aliases in `src/colors.css` and `src/styles.css`; the internal Studio/Admin visual scope also contains hard-coded light surfaces. The marketing homepage has a separate `--mq-*` palette. This is partial centralization, not a fully tokenized cross-site system.
- VERIFIED: Tailwind CSS v4 is installed; no root `tailwind.config.js` or `tailwind.config.ts` exists. No Tailwind dark-mode strategy was previously configured.
- VERIFIED: language persistence is `localStorage["menu-lang"]`; theme preference uses analogous `localStorage["menu-theme"]` values `light`/`dark`, defaults to `prefers-color-scheme`, and updates the root `data-platform-theme` attribute.
- IMPLEMENTED: added scoped platform theme tokens/CSS and an accessible sun/moon toggle to Studio, homepage, pricing, login/signup, Terms, and Privacy. Added early root-document preference initialization to reduce theme flash.
- PROTECTED: no public-menu theme stylesheet was edited. New CSS explicitly scopes to `data-platform-chrome` and excludes `.menu-public-shell` subtrees.
- PALETTE: `#0F1115` canvas, `#171B22` surface, `#1F252E` elevated, `#252B35` subtle, `#FFF7ED` text, `#D0D5DD` secondary, `#A7AFBA` muted, `#3A414D` border, `#FF5A1F` Ember, `#1FD1A5` Digital Mint. Automated contrast assertions were added; final check results are pending CI.
- UNKNOWN: local shell/test/typecheck/lint/build/browser QA cannot be inferred from GitHub file edits; run evidence must be checked on the PR head.
- RELEASE: one review PR only; no merge and no deployment without owner review.
- Exact next task: inspect the new theme contract tests, create one review PR, and verify latest-head CI plus available browser coverage; fix failures before asking for review.


## 2026-10-09 — Platform Theme Browser Regression — VERIFIED IN CI / PR #386

- VERIFIED: latest source/test commit `6a28131d8cb688ee703e8e2d7a3520febb68098b` passed GitHub Quality run [37910685922](https://github.com/Midosd249/Menu_V3/actions/runs/37910685922) and W9 Orders QA run [37910686056](https://github.com/Midosd249/Menu_V3/actions/runs/37910686056).
- VERIFIED: typecheck, unit/contract tests, lint, production build, all-theme browser QA, Menuun Arabic/English browser QA (including light/dark × RTL/LTR across marketing/auth/pricing/legal routes), Golden 30-product performance fixture, Studio browser QA, and Platform Admin browser QA all passed on that SHA.
- ROOT CAUSE 1: the SSR-rendered theme button can be visible before React attaches its handler. The theme regression test now waits for `data-theme-toggle-ready="true"` before clicking; the toggle sets this signal after synchronizing the initial theme.
- ROOT CAUSE 2: the Studio shell test switched the UI back to Arabic but still asserted English navigation labels. The assertions now match the current Arabic locale and the test also waits for theme-toggle readiness.
- VERIFIED performance evidence from the same CI run: controlled Editorial preview returned HTTP 200 / `ok: true`, 98 initial requests, DOMContentLoaded 1223 ms, load 1662.2 ms, CLS 0, and 0 long tasks. Golden 30-product fixture returned HTTP 200 / `ok: true`; current-cover variant recorded 32 requests, DCL 24.2 ms, load 39.9 ms; legacy-cover variant recorded 31 requests, DCL 39 ms, load 40.1 ms; both had CLS 0 and 0 long tasks.
- LIMITATION: LCP/INP were not populated by these synthetic CI measurements. P1.9 real-route evidence was skipped by its workflow condition and is not claimed as verified.
- PERFORMANCE GUARDIAN STATUS: the repository's existing `performance:audit` CI path and Golden fixture ran successfully. A separately registered agent named “Performance Guardian” is NOT present on `main`; PR #365 was closed unmerged. Its proposed fixed budget of fewer than 15 requests is not adopted because the current measured preview baseline is 98 requests and P1.9's budget decision remains deferred.
- RELEASE: PR #386 remains open and draft pending latest-head verification; no deployment has been performed.
- EXACT NEXT ACTION: verify the continuity-only commit's CI on the latest branch head, then review and complete the explicitly requested PR merge; do not start a deployment.


## 2026-10-09 — Login Dark-Mode Footer Reachability — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: `main` baseline at task start was `b1f9c5fa9eee8fe899cd23b24e4948e6682cd578`; isolated branch `fix/login-dark-footer-overflow-2026-10-09` created from that commit.
- VERIFIED: `/login` used a vertically centered grid (`min-h-dvh place-items-center`) around a tall content stack ending in the shared `MarketingFooter`; this layout can center overflowed content above/below the viewport on short screens. This is the only route being changed.
- IMPLEMENTED: changed the login page shell to a column flex layout and gave its content wrapper vertical auto margins. This centers the content when space is available and lets it start at the top and scroll normally when content exceeds the viewport.
- ADDED: browser regression coverage for the final privacy link and copyright area at 390×650 in Arabic/English and light/dark themes.
- RESEARCH: WCAG 2.2 SC 1.4.10 Reflow requires content at 320 CSS px width without loss of information/functionality or two-dimensional scrolling; official source: https://www.w3.org/TR/WCAG22/.
- VERIFIED: PR #390 latest-head checks passed on `a0641ad1ac4ebc034ea78f35db06d45676cbe72d`: Menu V3 Quality and W9 Orders QA both succeeded; browser test confirmed footer privacy link/copyright reachability at 390×650 in Arabic/English and light/dark themes.
- UNKNOWN: production deployment and real-device verification remain pending. No deployment performed.
- EXACT NEXT ACTION: owner review PR #390 and final diff; do not merge or deploy automatically.

- CI DIAGNOSIS: first PR browser run exposed a regression-test setup error, not an application failure: the test attempted to access `localStorage` on the initial opaque `about:blank` origin. The test now navigates to `/login` first, sets the theme on the app origin, reloads, and verifies the footer. Rerun on the latest head is pending.


## 2026-10-09 — Login Footer Dark-Mode Contrast — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: the prior PR #390 change addressed footer reachability, not the reported contrast defect.
- VERIFIED: the shared marketing footer retains a light cream background and uses muted text utility classes; platform dark-mode token overrides can make descendants pale against that light background inside /login.
- IMPLEMENTED: scoped dark-theme text-color override to text links and paragraphs inside the login page's marketing footer only. Homepage/shared-footer theme behavior and public-menu themes are untouched.
- ADDED: Playwright regression asserting contrast ratio >= 4.5:1 for every text-bearing footer link and paragraph in Arabic and English on a 390×844 viewport in dark mode.
- VERIFIED: GitHub Quality run 37957188131 and W9 Orders QA run 37957188277 both completed successfully on code/test head 1d4f4999ad06d5156e82775ba40ef856dbdaedcb. The Menuun brand browser QA step passed.
- UNKNOWN: production deployment and physical-device QA remain unperformed.
- Superseded by the PR #390 merge/continuity record below.

## 2026-10-09 — PR #390 Merged: Login Footer Dark-Mode Contrast — MERGED / POST-MERGE QUALITY VERIFIED

- VERIFIED: PR #390 merged into `main` using squash merge. PR #390 merge commit SHA: `1d4a347a37928f4f8661ee48fb417b8457f10929`.
- VERIFIED: pre-merge head `a8507826958fea08fec3c4805aabaf314c1bcac4` passed Menu V3 Quality run `37958748646` and W9 Orders QA run `37958748617`.
- VERIFIED: main-branch Menu V3 Quality run `37961255049` completed successfully on merge SHA `1d4a347a37928f4f8661ee48fb417b8457f10929`.
- INCLUDED: login-only dark-theme footer foreground override and Arabic/English Playwright contrast regression; prior login overflow/reachability fix remains included.
- DEPLOYMENT: no deployment was requested or performed. Physical-device QA remains UNKNOWN.
- EXACT NEXT ACTION after this continuity PR merges: verify `main` contains these records, then stop. Do not deploy or start another task automatically.

## 2026-10-09 — Continuity Closure After PR #391 — VERIFIED

- VERIFIED: PR #390 implementation merged at `1d4a347a37928f4f8661ee48fb417b8457f10929`.
- VERIFIED: continuity-only PR #391 merged at `ee8db7dc1fd0c83422f3100f797445d72e840559`; this is the verified `main` HEAD as of this record.
- VERIFIED: PR #391 Menu V3 Quality run `37963664719` and W9 Orders QA run `37963664727` both completed successfully on PR head `57df76ebb2b38ff71a5aa76c3c58702bfedf5ad0`.
- VERIFIED: post-merge Menu V3 Quality run `37961255049` succeeded on PR #390 merge commit `1d4a347a37928f4f8661ee48fb417b8457f10929`.
- IMPLEMENTATION: login footer dark-mode contrast fix and Arabic/English Playwright regression are merged. Previous login footer reachability fix remains.
- DEPLOYMENT: no production deployment was requested or performed. Real-device QA remains UNKNOWN.
- EXACT NEXT ACTION: stop. No additional implementation or deployment is authorized by this task.

## 2026-10-14 — Pricing Dark-Mode CI Contract Follow-up — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: PR #402 remains open. Before the latest test correction, branch comparison showed 18 commits ahead of `main`, 0 behind.
- VERIFIED: Quality run `38481511698` failed in `scripts/color-contract.test.mjs`, not in the browser suite. Its assertion expected `storedPreference.current = nextDark ? "dark" : "light"`, while the implementation uses explicit `nextPreference` and persists it before `applyTheme(nextDark)`.
- IMPLEMENTED: commit `9ef6c88e3f1f86a31a27cb7bd1774b4ede8f281a` updates the static contract to assert the explicit preference, storage call, and persistence-before-DOM ordering. This corrects a stale assertion; it does not bypass the test.
- VERIFIED: W9 Orders QA run `38481511725` succeeded on the previous head. Latest-head workflow runs have not yet been returned; Vercel status is pending and is not production evidence.
- UNKNOWN: whether Quality and browser tests pass on the updated head. Browser/visual QA has not been re-confirmed after the static contract failure.
- DEPLOYMENT: NOT_PERFORMED. PR #402 remains unmerged; no production deployment.
- EXACT NEXT ACTION: inspect latest Quality and W9 Orders QA for the updated branch head; if green, review the final diff and stop for owner decision. If a failure remains, fix only that evidenced failure.

---

## 2026-10-14 — Pricing Dark-Mode CI Follow-up — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: PR #402 remains open. Branch head is `4417ed43428fff18668cc481057a997ede96b6e9`; comparison against `main` shows 23 commits ahead and 0 behind.
- VERIFIED: Quality run `38481511698` failed at `scripts/color-contract.test.mjs` because its static contract expected an outdated inline preference expression. The implementation now persists explicit `nextPreference` before applying the DOM theme.
- IMPLEMENTED: contract test updated to assert the current explicit preference and persistence ordering. Commit `4417ed43428fff18668cc481057a997ede96b6e9` also corrects regex escaping identified during diff review.
- VERIFIED: latest-head Quality run `38482806793` and W9 Orders QA run `38482806825` are in progress. Previous-head W9 Orders QA run `38481511725` passed. Vercel status is pending and is not production evidence.
- UNKNOWN: latest-head CI outcome; local test/browser execution unavailable in this connected session.
- DEPLOYMENT: NOT_PERFORMED. No merge or production deployment.
- EXACT NEXT ACTION: retrieve final latest-head Quality and W9 Orders QA results; if both pass, final diff review and stop. Otherwise repair only the newly evidenced failure.

---

## 2026-10-14 — Pricing Dark-Mode CI Browser Timeout Follow-up — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: latest completed Quality run `38483406369` failed only in `Menuun brand browser QA — homepage and login in Arabic and English`; W9 Orders QA run `38483406272` succeeded. The failed Playwright case was `platform theme preference stays independent from language across marketing, auth, pricing and legal routes` and exceeded 30 seconds in `page.goto(..., { waitUntil: "networkidle" })` while navigating to the local preview. The log showed the preview eventually served, and 7 of 8 browser tests passed.
- IMPLEMENTED: commit `eec455c196cb403bb615e561bd1ab04d9e6685ed` changes that route-matrix navigation to `domcontentloaded`. The test separately verifies `dir`, `data-platform-theme`, toggle hydration readiness, click behavior, and persisted preference, so it does not need to wait for every network connection to become idle.
- VERIFIED: this is a browser-test synchronization fix based on the exact timeout trace, not a suppression of assertions. No production code or pricing styles changed in this follow-up.
- UNKNOWN: CI result on the new head, and real visual confirmation of the pricing card on the deployed site.
- DEPLOYMENT: NOT_PERFORMED. PR #402 remains open and unmerged.
- EXACT NEXT ACTION: inspect Quality and W9 Orders QA for commit `eec455c196cb403bb615e561bd1ab04d9e6685ed`; if Quality fails again, inspect the new failing step and fix only that evidenced cause. If green, review the final diff and stop for owner decision.

---

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

- VERIFIED: PR #402 head at start of this follow-up was failing Quality run `38490484286` in `tests/menuun-brand-browser.spec.ts`: on Arabic `/pricing` with persisted dark theme, the test queried the dark-theme accessible name before React hydration updated the server-rendered button label. Root `data-platform-theme="dark"` can be applied by the bootstrap while the component initially renders `dark=false`; this is a synchronization race, not proof the pricing CSS failed.
- IMPLEMENTED: commit `0b7b104c9df5e9c8c599d516b1328d786ce101de` now locates the theme toggle by `button[data-theme-toggle-ready]`, waits for `data-theme-toggle-ready="true"`, then asserts the expected accessible name before clicking. It preserves the label, toggle, and persistence assertions.
- VERIFIED: W9 run `38886351310` passed after the W9 workflow install adjustment. Its previous attempt failed at `spawn ./node_modules/vite/bin/vite.js ENOENT` after the temporary Playwright install pruned the transitive Vite executable.
- IMPLEMENTED: W9 workflow now installs Vite explicitly alongside Playwright and uses `--legacy-peer-deps` only for the transient QA-tool install. Quality workflow uses the same approach to resolve the observed optional peer conflict (`better-auth` optional Vitest peer range vs installed Vitest 5). Workflow commits: `bd4ebe3edb548a7c03736745ad983927d0ca928b`, `d6b23b4c967119b6b89236a567015dcdcaa8a4b7`.
- VERIFIED: on head `d6b23b4c967119b6b89236a567015dcdcaa8a4b7`, W9 Orders QA run `38886351310` succeeded. Quality run `38886351402` passed route generation, typecheck, unit tests, contract suites, lint, production build, Playwright installation and Chromium installation; all-theme browser QA is still in progress at last check.
- UNKNOWN: final Quality result on this head; pricing visual behavior on the deployed production site is not verified. No merge or production deployment.
- EXACT NEXT ACTION: wait for Quality run `38886351402` to finish, inspect its final result and logs. If the theme-toggle browser test fails, diagnose its new error context; if Quality passes, review the final PR diff and stop without merge/deploy.


## 2026-10-19 — PR #403 CI dependency resolution follow-up

- VERIFIED: dependency-fix commit is `65cdd340f3926eab1603265fe6ccb44e15aaf2cb` (`fix(ci): pin typescript-eslint to locked version`). It changes only `package.json` and the root devDependency metadata in `package-lock.json`, pinning `typescript-eslint` to `8.69.0`; lockfile-resolved `typescript-eslint`, `@typescript-eslint/parser`, and `@typescript-eslint/type-utils` are all already `8.69.0` on `main` and the PR branch.
- ROOT CAUSE: the workflow's supplemental Playwright install uses `npm install --no-save --no-package-lock`, which re-resolves the dependency graph outside the committed lockfile. The root range `^8.56.1` allowed npm to select a newer `typescript-eslint` release that requested unpublished `@typescript-eslint/type-utils@8.72.0`. Official npm registry search found parser `8.71.2` as the latest published version, and no published `8.72.0`.
- VERIFIED: previous Quality run `39292009756` and W9 Orders QA run `39292009701` both failed at their supplemental Playwright install steps with `ETARGET No matching version found for @typescript-eslint/type-utils@8.72.0`; application tests/build were not shown to fail at that step.
- VERIFIED: branch head was advanced to `65cdd340f3926eab1603265fe6ccb44e15aaf2cb`; the GitHub API reports no Actions runs associated with that SHA. Updating the branch ref through the connected GitHub tool did not create new workflow runs, and the available GitHub connector exposes no workflow-dispatch action. The PR remains draft/open and unmerged; no production deployment was performed.
- UNKNOWN: Quality, W9 Orders QA, `npm test`, and Build on the dependency-fix commit have not yet been rerun. No claim of success is permitted.
- EXACT NEXT ACTION: create and push an empty commit from the owner’s authenticated local checkout on `fix/public-upsell-opens-product-details` to trigger GitHub Actions on the current branch head; then inspect the actual Quality and W9 run results and their npm-test/build steps before considering merge.


## 2026-10-19 — PR #403 CI resource diagnostics

- VERIFIED: CI-only commit `8c30dafac81d935446ddc5670301cb06635ba7bc` adds early runner disk cleanup, `df -h`/`free -m` snapshots, Studio route warm-up, failure log tails, and always-uploaded diagnostics to Quality. Commit `d2049b4bc1fefcc6b7f80f9901b0750f1602f1f9` applies cleanup/resource snapshots, W9 route warm-up, failure log tails, and preserves its always-uploaded artifact.
- EVIDENCE: the recorded PR #402 incident had 5 MB free and Vite ECONNRESET/aborted errors with different failing routes. This supports runner disk pressure or unstable Vite execution, but does not prove the exact pending StudioGate/getMyStudio request.
- SCOPE: workflow-only; no product/auth/database/order/pricing behavior, dependencies, PR #400/#402, or assertions changed. Vite dev remains in use; warm-up is supplemental and does not replace Playwright assertions.
- UNKNOWN: CI results for these changes are pending; no merge/deployment is claimed. PR #403 remains draft/open pending all required gates on one final SHA.
- EXACT NEXT ACTION: inspect Quality and W9 results on the final branch SHA; use captured resource data and the last 200 server-log lines for any next fix, then require three consecutive successful runs of each workflow.

## 2026-10-20 — Team invitation journey repair — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: `main` was at `fbefe5a7263e600acb166bfbd002eacbf63a463a` when this task began. A separate branch `fix/complete-team-invitation-journey` was created from that SHA; no merge, deployment, production setting change, or database mutation was performed.
- ROOT CAUSE VERIFIED IN SOURCE: email signup sent verification callbacks to `/login?verified=1` without carrying the `invite` token, and then navigated to `/verify-email` without invitation context. The resend-verification callback also discarded the token. OAuth sign-in already passed a same-origin invitation callback.
- IMPLEMENTED ON BRANCH: preserve a validated invitation token across signup, email verification, and verification resend; add invitation preview metadata and a bilingual invitation summary with explicit sign-in/sign-up/accept actions; require the database user's email to be verified before acceptance; perform membership insertion and invitation consumption in one database transaction with a row lock; revoke expired pending invitations before reissue to comply with the existing partial unique index; clarify manual link sharing and copy confirmation in the team UI.
- TEST ADDED: `tests/team-invitations.test.mjs` is referenced by the existing `npm test` script but was absent from the current repository tree; a focused regression contract was added. It has not yet been executed in this session.
- UNKNOWN/BLOCKED: no local checkout/terminal/browser runner is available through the connected tools, so local typecheck, unit tests, integration tests, Playwright, visual/accessibility checks, and build have not run. CI has not yet been observed for this branch. After acceptance, the accepted tenant ID is saved in sessionStorage and passed to `getMyStudio`; the server validates active membership before loading that tenant snapshot. This selection path remains unverified by CI/browser.
- RELEASE: no merge or deployment. Production status is unchanged/UNKNOWN.
- Additional verified schema detail: Better Auth stores verification state in the quoted, case-sensitive `"emailVerified"` column; acceptance queries that column explicitly.
- EXACT NEXT ACTION: inspect Quality/W9 CI and the final diff for the latest PR #405 head, address only evidence-backed failures, and stop without merge/deployment.

- CI FOLLOW-UP: Quality and W9 on earlier head `26d4e135ef90ad663dd46241e99292cf7ee21187` failed TypeScript checks because `setLastCreated`, `setCopied`, `lastCreated`, and `copied` were referenced without state declarations in `src/routes/studio/team.tsx`. The missing state declarations were added in commit `271f1bac1b0f57fd3c303378c3cb0b6c03e20dfa`. The latest-head Quality/W9 runs are still in progress; this is not yet verified.
- CURRENT HEAD at this note: `271f1bac1b0f57fd3c303378c3cb0b6c03e20dfa`. Vercel status is pending; no production deployment evidence exists.


## 2026-10-20 — PR #405 invitation link and CI follow-up

- VERIFIED: Quality run 39471424785 and W9 Orders QA run 39471425235 failed at TypeScript, before tests/browser checks. Exact error: `src/routes/studio/team.tsx(82,82): TS2322 Role is not assignable to "admin" | "editor"; "owner" is not assignable`.
- ROOT CAUSE: the invitation result's public role type is the broader `Role` union even though creation accepts only `admin | editor`; UI copied that broad type into the invitation summary state.
- IMPLEMENTED: invitation summary now uses the already validated selected `inviteRole`, removing the invalid broad-union assignment without widening privileges or casting unsafely.
- IMPLEMENTED: owner-generated links now open `/invite/:token` directly instead of landing first on `/login?invite=...`. The invitation page now displays four explicit bilingual steps: review details, sign in/create an account using the invited email, verify email and return to the same link if prompted, then explicitly accept.
- TEST ADDED/UPDATED: invitation contract assertions cover direct invitation links and the bilingual step guidance.
- SECURITY: no role/tenant authority was moved to the client; acceptance remains server-side and token possession does not accept the invitation.
- UNKNOWN: latest-head CI and full browser journey have not yet been verified. Do not claim success until Quality and W9 complete on the final head and the independent-browser signup/verification journey is exercised.
- DEPLOYMENT: no merge, database mutation, or production deployment performed.
- EXACT NEXT ACTION: inspect current PR #405 head and its latest Quality/W9 checks; repair only any evidenced failures, then stop without merge/deployment.


## 2026-10-23 — QR table management increment

- IMPLEMENTED ON BRANCH: added authenticated, tenant/branch-scoped table listing, creation and QR-token rotation server functions; added a bilingual table QR manager to the existing Studio QR page. The server checks `settings.read`/`settings.write` and active branch membership; tokens are returned only on creation/rotation and stored as hashes by the existing helper. Rotation warns that previous printed codes stop working.
- UX: Arabic/English copy, responsive form/list, visible errors, copy/download actions and explicit rotation confirmation.
- VERIFICATION: pending CI on the new commit. No local terminal/browser was available in this connected session; no typecheck, tests, lint, build or browser QA is claimed yet.
- RELEASE: PR #411 remains unmerged; no production deployment authorized. Existing connected-Supabase migration side effect remains as documented above; no rollback attempted.
- EXACT NEXT ACTION: verify the new commit with Quality and W9, fix evidenced failures, then complete public theme token forwarding and Studio table-label visibility in the next atomic increment. Do not merge or deploy.


## 2026-10-23 — QR table ordering completion checkpoint

- IMPLEMENTED ON BRANCH: Studio QR now includes table listing, creation, QR generation/download, and confirmed token rotation; management endpoints require authenticated membership and `settings.read`/`settings.write` with active branch scope. Public QR routes carry only a server-verified table label into the shared renderer and use `private, no-store` for table-bound pages; normal public menus retain the existing shared-cache policy. Taste and Signal Table forward the opaque token. Studio order data joins the table label only within the order's tenant and branch.
- SECURITY: token hashes remain the stored representation; plaintext tokens are returned only at create/rotate time. `Referrer-Policy: no-referrer` remains enabled. The existing additive migration was applied by an earlier Vercel Preview build to the connected Supabase project; no rollback was attempted.
- UX: Arabic/English, mobile-responsive table controls, rotation confirmation, QR download/copy, and visible errors. QR generation/rotation failures should remain recoverable.
- VERIFICATION: Quality run 39899063412 and W9 Orders QA run 39899063447 were still in progress at last check, on code head 4b534345975299c3ab51f076b8caa97d1fcdfd9d. Vercel combined status for that head was pending. No local terminal or real-device QA was available; no tests/build/browser checks are claimed passed for these changes yet.
- RELEASE: PR #411 remains Draft/open/unmerged. No production deployment or merge performed. Preview is not production evidence.
- UNKNOWN/BLOCKED: final CI conclusions and Preview result for the latest head. The owner decision about retaining versus rolling back the already-applied additive schema is still unresolved; do not roll back without confirming the target environment and explicit authorization.
- EXACT NEXT ACTION: verify final-head Quality/W9 and Vercel Preview status, fix only evidence-backed failures, then stop. Do not merge or deploy.
