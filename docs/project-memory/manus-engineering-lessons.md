# Manus Engineering Lessons — Menu V3

This document records durable engineering lessons extracted from Manus execution on Menu V3. It is not a replacement for repository source-of-truth evidence; code, tests, Git history, CI, and direct deployment evidence remain authoritative.

## 2026-09-10 — Platform Admin / Editorial / Noir focused task

### Verified evidence

- PR: #56 — `fix(admin): remove non-functional subscription actions`
- Head branch: `platform-admin-editorial-noir-review`
- Recorded task commit: `5ba67421e4b516935319b62fa74fcea0ea1bc72b`
- Current documentation commit: `a349fc18bc99fcdbe47a01c5ec91eb228ddcbfe9`
- Base commit: `4b62c5e6ec62b59c4b374d17211153cb50b4f16e`
- Functional changed files: `src/routes/admin.tsx`, `tests/admin-operations.test.mjs`
- This learning document was added as a separate documentation commit on the same PR branch.
- CI workflow `Menu V3 Quality` completed successfully for the functional task commit.
- CI executed and passed: install, route-tree generation, typecheck, tests, lint, production build, Playwright runtime/browser QA for all themes, and performance-baseline upload.
- Editorial and Noir required no source changes because no new concrete defect was proven during the targeted review.

### Lesson 1 — A visible UI action must have a real supported operation

**Problem:** Platform Admin subscription cards exposed actions that navigated back to `/admin` without an implemented independent operation.

**Detection method:** inspect the component implementation and test whether every visible action has a real destination or operation. A button that only returns to the current page is not a valid feature merely because it looks interactive.

**Correct approach:** if the underlying operation does not exist, make the UI read-only rather than exposing a fake action. Preserve the existing metrics and information.

**Regression rule:** add a structural test that asserts the relevant summary component contains the intended read-only content and does not contain fake navigation handlers such as `window.location.assign` or unsupported `onClick` actions.

**Future checklist:**
- For every button/link/action, identify its actual supported operation.
- Trace the destination/action into a real route, server action, API, or existing capability.
- If no supported operation exists, do not invent one.
- Prefer read-only presentation over a misleading interactive control.
- Add a regression test when a non-functional action is removed.

### Lesson 2 — Security review should verify trust boundaries, not just UI visibility

**Verified behavior:** Platform Admin authorization is enforced server-side using trusted authenticated identity. Client-controlled email, role, tenant, branch, localStorage, and query parameters must not grant elevated access.

**Correct approach:** inspect the authorization boundary and the server-side identity source before changing Admin UI. Do not weaken authorization to make an account or UI flow appear functional.

**Future checklist:**
- Confirm authentication occurs before authorization.
- Confirm authorization derives identity from a trusted server-side session/context.
- Test unauthenticated denial.
- Test authenticated non-admin denial.
- Reject client-supplied privilege/tenant/branch/email claims.
- Fail closed when trusted identity/configuration is unavailable.

### Lesson 3 — Targeted theme verification is better than speculative redesign

**Observed result:** Editorial and Noir were reviewed against RTL/LTR, mixed-direction content, long content, prices, images, cards, categories, product details, mobile overflow, safe areas, and layering. No new concrete defect was proven, so no theme source was changed.

**Correct approach:** change a theme only when evidence identifies a real defect. A clean targeted review is a successful result; do not manufacture work to justify a milestone.

**Future checklist:**
- Inspect actual rendering and relevant source/tests.
- Exercise Arabic, English, and mixed-direction content.
- Use long names/descriptions and varied SAR prices.
- Check image-present and image-missing states.
- Check one/many/odd product and category states where relevant.
- Check mobile overflow, safe areas, fixed/sticky/floating UI, and product details.
- Change code only for a proven defect.

### Lesson 4 — Layering problems require structural diagnosis before z-index changes

**Relevant prior incident:** Menu V3 previously experienced a layer/overlay obscuring the public menu.

**Correct diagnostic order:**

`DOM structure → positioning/sizing → stacking contexts → pseudo-elements → animation/paint timing → responsive constraints → targeted z-index`

**Correct approach:** inspect ownership and stacking relationships first. Avoid arbitrary large z-index values, global defensive isolation, full-viewport child layers, duplicate shells, and timing hacks.

**Future checklist:**
- Identify the shell owner.
- Inspect DOM nesting.
- List stacking contexts.
- Inspect fixed/sticky/absolute elements.
- Inspect pseudo-elements and pointer reachability.
- Disable animation when diagnosing paint/visibility problems.
- Test narrow/mobile viewports.
- Change z-index only after the stacking relationship is proven.

### Lesson 5 — Local blockers and CI evidence must be kept separate

The Manus execution reported local `typecheck` and `check:auth` blockers. Direct GitHub Actions evidence for the functional task commit subsequently showed the repository quality workflow passing typecheck, tests, lint, production build, and browser QA.

**Lesson:** a local environment blocker is not proof that the repository or CI is broken. Record the exact environment limitation and then inspect authoritative CI evidence before escalating.

**Future checklist:**
- Record the exact local command and failure reason.
- Do not repair unrelated environment issues merely to make a local command green.
- Check the relevant CI run for the exact commit.
- Distinguish `LOCAL BLOCKED` from `CI PASS`.
- Do not claim a local check passed when it did not run.

### Lesson 6 — GitHub/Vercel integration can create Preview deployments automatically

A Vercel bot comment appeared on PR #56 with a ready Preview deployment after the branch was pushed. This is platform integration behavior, not evidence that an intentional production deployment was performed.

**Lesson:** deployment status must distinguish automatic Preview activity from an intentional Production release.

**Future checklist:**
- Do not trigger extra deployments intentionally for routine iteration.
- Treat automatic Preview creation as separate from Production deployment.
- Never infer Production = `main` from a Preview URL or HTTP success.
- For release claims, require direct Production deployment evidence tied to the intended commit.

### Credit-efficiency rule derived from this task

For small, well-bounded milestones, use a narrow evidence loop:

`continuity files → relevant source/tests → targeted implementation → targeted tests → CI evidence → diff review`

Do not repeat settled infrastructure audits, broad repository audits, or unrelated dependency repair when they do not materially affect the task.
