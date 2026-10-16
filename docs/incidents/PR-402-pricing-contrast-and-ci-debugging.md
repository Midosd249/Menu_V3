# Incident Retrospective: PR #402 — Pro Pricing Dark-Mode Contrast and CI Failures

**Date:** 2026-10-16  
**PR:** [#402](https://github.com/Midosd249/Menu_V3/pull/402)  
**Branch:** `fix/pricing-pro-dark-mode-contrast-2026-10-13`  
**Final PR head verified in CI:** `ae3d00f8c264671bf6e28440ad2316e6338d98cd`  
**Merge commit:** `a1009d0595b8e5ab39c5df0e7119e4003db72160`  
**Outcome:** MERGED; NOT_DEPLOYED.

## Executive summary

The task took multiple failed attempts because several distinct problems were incorrectly treated at different times as if one explanation would account for all failures. The final result required separating the original pricing-card contrast fix from browser-test semantics, database-fixture completeness, and hosted-runner disk pressure. The final Quality and W9 workflows both passed on the exact final PR head before merge. The repository owner separately confirmed the preview looked correct.

## Failure timeline and what was learned

### 1. Initial pricing-card contrast and regression coverage

- **Goal:** Restore readable dark-mode contrast for the recommended Pro card on `/pricing`, without changing the homepage or pricing logic.
- **Approach retained:** Scope the styling to the recommended Pro card on the pricing route and preserve a regression contract for page-scoped selectors.
- **Lesson:** A narrowly scoped visual fix still needs route-specific assertions and the full existing quality gates; visual CSS alone is not sufficient evidence.

### 2. Theme-toggle readiness timeout

- **Observed failure:** `tests/menuun-brand-browser.spec.ts` timed out waiting for `button[data-theme-toggle-ready]` to reach `data-theme-toggle-ready="true"` in a route/language/theme combination. A Playwright `session closed` message appeared after the test timeout.
- **Earlier unsuccessful direction:** Readiness and timing were investigated, but the error label alone did not prove a React hydration defect. Increasing a timeout or changing readiness markers would not establish the actual cause.
- **Lesson:** Treat a timeout as a symptom. Inspect the complete test output, page errors, console, requests, trace, and remaining test budget before changing application readiness or increasing waits. A session-closed error after the runner times out may be secondary cleanup noise rather than an independent root cause.

### 3. Theme persistence test overwrote the state it was meant to test

- **Verified root cause:** The persistence test used `page.addInitScript(() => localStorage.setItem("menu-theme", "dark"))`. Playwright runs an init script on every new document, so navigation/reload reapplied `dark` after the test deliberately changed the user's preference to `light`.
- **Final correction:** Seed the initial preference once using the pricing origin's storage, reload to exercise the real application bootstrap, toggle to light, and then assert the actual document theme and stored value across navigation and reload.
- **Coverage preserved:** No route/language/theme combinations or assertions were removed or weakened. The full matrix remained covered, and the final workflow runs the complete brand-browser spec three consecutive times with `--retries=0`.
- **Lesson:** Test setup must not reapply initial state during the transitions under test. Distinguish initialization from persistence and verify both rendered behavior and storage.

### 4. Studio browser fixture failed on migration ordering

- **Observed failure:** The disposable Studio browser database attempted to apply PH-06 commercial activation before the invoice table existed, producing a missing `menu_v3.subscription_invoices` relation.
- **Root cause:** The browser fixture did not apply the prerequisite PH-05 invoice migration and later subscription-related migrations in dependency order.
- **Final correction:** Apply the existing PH-05 invoice, PH-06 commercial activation, Platform Admin invoice issuance, and self-serve trial migrations in the Studio test fixture, in the correct order.
- **Boundary:** This change is limited to CI's disposable test database. It does not authorize or perform production schema/data changes.
- **Lesson:** Build/typecheck success does not prove a browser database fixture contains every schema dependency. Read the migration chain and fixture setup together.

### 5. Studio responsive browser QA exhausted runner disk

- **Observed evidence:** The failing Studio route varied between attempts (including `/studio/qr` at 1024px and `/studio/branches` at 768px). The browser page remained on its loading shell, Vite logged `Error: aborted` / `ECONNRESET`, and the runner reported only about 5 MB free, later reaching 0 MB.
- **Root-cause assessment:** The changing route plus near-zero disk and server connection errors supported runner resource exhaustion/unstable server execution rather than a confirmed route-specific layout bug. The exact pending application request was not established and must remain UNKNOWN.
- **Final correction:** After built-preview and template QA complete, stop the preview server, remove only build outputs and caches no longer needed, remove unused preinstalled hosted-runner SDKs (Android, .NET, GHC, PowerShell), clean apt cache, and log disk usage before/after. Preserve Node, npm project dependencies, PostgreSQL, and Playwright/Chromium.
- **Lesson:** If failures move across routes while disk is exhausted and the server emits connection resets, inspect runner resources and diagnostics before modifying auth, shell readiness, route assertions, or timeouts.

## Final verified evidence

All results below refer to the same final PR head, `ae3d00f8c264671bf6e28440ad2316e6338d98cd`:

- [Quality run #38956141584](https://github.com/Midosd249/Menu_V3/actions/runs/38956141584): **success**. Typecheck, tests, W7.4–W7.10 contracts, lint, production build, all-theme browser QA, homepage/login Arabic-English browser QA, golden performance fixture, Studio responsive browser QA, Platform Admin responsive browser QA, and diagnostics upload passed. The three-run brand-browser stability step is part of the Quality workflow and uses `--retries=0`.
- [W9 Orders QA run #38956141474](https://github.com/Midosd249/Menu_V3/actions/runs/38956141474): **success**.
- The repository owner confirmed manual preview inspection looked correct before requesting merge.
- PR #402 was merged as `a1009d0595b8e5ab39c5df0e7119e4003db72160`.
- No production deployment was performed by this task. CI success and preview readiness are not production-deployment evidence.

## Operating rules to prevent recurrence

1. **Boot from repository truth:** read the current branch/HEAD, diffs, instructions, continuity records, source, tests, workflows, and latest CI logs before acting. Do not reuse a stale SHA or old failure explanation.
2. **Name the exact failing step and SHA:** distinguish code-head failures, merge/test fixture failures, environmental failures, and unrelated failures.
3. **Form competing hypotheses:** application bug, test-fixture defect, state leakage, lifecycle/timeout, dependency/CI environment. Record the evidence that supports and rules out each one.
4. **Do not guess from error wording:** a message saying “hydration failed” is a test's diagnostic label, not proof that hydration is the root cause.
5. **Preserve behavior and coverage:** never solve a flaky test by skipping it, reducing assertions, adding fixed sleeps, or relying on retries. Keep a real cross-route persistence scenario as well as isolated matrix coverage.
6. **Test initialization separately from persistence:** use one-time setup for initial storage, then assert the user's state survives navigation/reload without setup code overwriting it.
7. **Read database migrations in dependency order:** verify every browser fixture's prerequisites and run the fixture itself; build success is insufficient.
8. **Measure runner resources before changing product code:** capture `df -h`, cache/build sizes, server logs, browser console/page errors, and request failures. Preserve trace/artifacts on the original failing attempt.
9. **Repeat stability tests honestly:** run the complete spec three consecutive times with retries disabled; a failure resets the streak after diagnosis and correction.
10. **Verify the exact final HEAD:** Quality and W9 must both pass on the same final PR head. Any new commit invalidates claims tied to the previous SHA.
11. **Separate preview, merge, and production:** a preview can be manually reviewed, but it is not production. Record merge SHA and deployment status independently.
12. **Stop at scope:** do not redesign the homepage or broaden a pricing fix to unrelated systems; fix unrelated CI infrastructure only when it is a demonstrated blocker to the required gate.

## Remaining limitations

- The connected session verified CI evidence and the owner reported successful visual review; it did not independently capture physical-device screenshots.
- The exact application request that stalled during the disk-exhausted Studio runs was not identified.
- No production deployment or production-device QA is claimed.
