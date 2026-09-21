# Project Memory — Problems We Learned From

This file exists to prevent Menu V3 from repeating expensive engineering mistakes. It records hard problems, their root causes, the approaches that failed or consumed time, and the lessons that should shape future work. It is intended for both human developers and AI agents. Update it after major milestones, incidents, repeated debugging loops, or other work that reveals a durable engineering lesson.

**Evidence rule:** repository code, tests, documentation, Git history, and direct platform evidence are authoritative. Uncertain details are marked `INFERRED` or `UNKNOWN` rather than presented as facts.

## Problem: Vercel became part of the visual iteration loop

- Date / Context: 2026-09-03 to 2026-09-05; theme preview, performance, and release verification work.
- Symptoms: repeated deployment-related blockers appeared while visual/theme work and runtime verification were still changing; Git history also records a Vercel build-rate-limit blocker and later a permanent release-only workflow.
- Root cause: `INFERRED` — Vercel was being used too close to normal iteration, while the repository lacked an explicit release-only boundary. A provider build-rate limit then made deployment feedback an unreliable development loop.
- What we tried (and failed or wasted time): repeated deployment-oriented verification and Vercel-specific fixes occurred before the permanent local-first/release-batch policy was codified. The history includes `c924f3240dc42f756b3940f9fa140423dfe210a1` (Vercel build-rate-limit blocker) and a sequence of policy commits from `286f4c474cae9d87effecec6d8e743acb65e952` through `c542a2a6afe56c0c903a8ea4035feca8854bfde3`.
- Final working solution: use Vercel only as a controlled release platform; perform local development, browser/visual QA, tests, CI, and diff review first, then one coherent release batch and one intentional production deployment. Preview deployments are exception-only.
- Files / components involved: `docs/release-only-vercel-workflow.md`, `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, Vercel deployment state.
- Related commits / PRs (by hash or short description): `c924f3240dc42f756b3940f9fa140423dfe210a1`; `286f4c474cae9d87effeceec6d8e743acb65e952`; `f23e37d84842851a0ce13d35fd585ce92319c56a`; `c542a2a6afe56c0c903a8ea4035feca8854bfde3`.
- Lessons for future: deployment evidence and implementation evidence are different. Visual CSS/theme iteration must not require Vercel. Inspect Usage/Billing before deployment decisions and never randomly retry a quota/rate/build blocker.
- Rules added to AGENTS.md or other docs: permanent Release-Only Vercel Policy and release-only workflow.
- Anti-patterns to avoid: pushing every small visual change to obtain a preview; treating CI or HTTP 200 as deployment proof; repeated Redeploy attempts without a changed condition.
- Detection checklist for next time: Is this change reproducible locally? Is deployment-specific behavior actually being tested? Was Vercel Usage/Billing inspected? Is there one coherent verified release batch? Is the intended production commit directly evidenced?

## Problem: Theme preview visual QA entered long correction loops

- Date / Context: 2026-09-04 to 2026-09-05; all-theme preview work and Essential/Editorial refinement.
- Symptoms: theme previews repeatedly needed fixes for rendering stability, first-paint behavior, shared actions, presentation ownership, and visual hierarchy.
- Root cause: multiple presentation layers and broad selectors allowed theme-specific CSS and preview shells to interfere with shared public-menu rendering. Source evidence also shows broad Editorial selectors and duplicated presentation ownership risks.
- What we tried (and failed or wasted time): the history contains successive preview fixes including `9ae67c101120e8770c93a05955bd658042cea41d`, `150435be61ffd343e142371e7f35fbe88ba452c3`, `dcbd23f6f8cef4660b2e9bddce6ce5236867f9b1`, `4282aa25ab99c820b9e1ba61895efba944f2022c`, `d691c4929825c1d5bd6116c42b17fc3f610c5207`, `bd5083c3dd2178a4354ebc4c4b34557fbd8dfe9b`, and `1031598d234e2dad1f5cb467cf9e0bdf2410584e`. `INFERRED:` the repeated sequence indicates that symptom-level visual changes were initially less efficient than reducing the rendering system to a simpler ownership model.
- Final working solution: inspect the complete render chain before styling; keep the shared public renderer as the owner of shared behavior; let each theme own scoped presentation; remove duplicate preview shells; make preview rendering deterministic and test structural invariants.
- Files / components involved: `src/components/public-menu.tsx`, theme templates/styles, preview routes, `tests/preview-shell.test.mjs`, `docs/INCIDENT_PREVIEW_COVERING_LAYER.md`, theme audit documents.
- Related commits / PRs (by hash or short description): `47b0d2c4536dd8ddc2ffb574214f2acbded8abc4`; `bd5083c3dd2178a4354ebc4c4b34557fbd8dfe9b`; `1031598d234e2dad1f5cb467cf9e0bdf2410584e`; `ce2295cd7ac7be4a1d7d5966ae03394b5352fca3`; `e14eee02ea45888e5c003387ca1872f11272218d`.
- Lessons for future: a theme is a presentation layer, not a second application shell. Browser visual evidence is required for visual claims; source inspection and HTTP success are insufficient.
- Rules added to AGENTS.md or other docs: permanent visual/functional audit gate; preview incident diagnostic order; no nested preview shell; structural regression tests.
- Anti-patterns to avoid: broad descendant selectors, duplicate `.menu-public-shell` ownership, animation-dependent preview visibility, and fixing visual symptoms with arbitrary stacking values.
- Detection checklist for next time: identify shell owner; inspect DOM nesting; check broad selectors; compare public route and preview route; test top/middle/bottom scroll; test Arabic/English; verify fixed controls; then inspect browser rendering.

## Problem: UI layering, z-index, and full-screen overlays obscured the menu

- Date / Context: 2026-09-04; theme preview incident.
- Symptoms: a visual layer obscured menu content and made the preview appear unusable.
- Root cause: the preview presentation chain contained unnecessary stacking/viewport layers. The documented incident identifies duplicate shells, a full-screen child rule, stacking blockers, and animation/paint interactions as contributors.
- What we tried (and failed or wasted time): early safety styling introduced `isolation: isolate` and child `z-index: 1`; the later successful correction deliberately returned preview content to normal paint order. The history also records repeated overlay and stacking corrections before the final structural cleanup.
- Final working solution: remove unnecessary stacking blockers and the full-screen child rule `.menu-public-shell > div { min-height: 100dvh; }`; remove the extra outer preview shell; keep preview content in a deterministic visible state; use documented layer priorities only where a real interaction hierarchy exists.
- Files / components involved: preview CSS, preview routes, public menu shell, theme presentation layers, `tests/preview-shell.test.mjs`.
- Related commits / PRs (by hash or short description): `47b0d2c4536dd8ddc2ffb574214f2acbded8abc4`; `bd5083c3dd2178a4354ebc4c4b34557fbd8dfe9b`; `1031598d234e2dad1f5cb467cf9e0bdf2410584e`; `ce2295cd7ac7be4a1d7d5966ae03394b5352fca3`; `e14eee02ea45888e5c003387ca1872f11272218d`.
- Lessons for future: diagnose `DOM structure → positioning/sizing → stacking contexts → pseudo-elements → animation/paint timing → responsive constraints → targeted z-index` in that order.
- Rules added to AGENTS.md or other docs: incident learning rules in `SESSION_PROTOCOL.md` and `AGENTS.md`; documented Essential/Editorial layer scales.
- Anti-patterns to avoid: `z-index` escalation without proving the stacking relationship, global defensive isolation, full-viewport child layers, and pseudo-elements that intercept input.
- Detection checklist for next time: inspect computed position/size; list stacking contexts; locate fixed/sticky elements; inspect pseudo-elements; disable animation; test narrow viewports; verify pointer reachability; only then change z-index.

## Problem: Language switching and RTL/LTR state could drift across URL, SSR, and document direction

- Date / Context: 2026-09-03 to 2026-09-05; public locale and Editorial verification work.
- Symptoms: the history shows several consecutive fixes around public locale state, URL synchronization, SSR direction, loader context, and locale-toggle typing.
- Root cause: locale state had to be aligned across the validated route search parameter, loader context, server-rendered document direction, and client navigation rather than being treated as an isolated client UI toggle.
- What we tried (and failed or wasted time): consecutive fixes `d2dc13506f6fdbdc1f52dcd3b344edce1fdc0327`, `e03c2bebd3ac8cd9bca7aeb22b56e44b5b80e8af`, `fde333d05d6c344f7e01deeac111f8f600ba0a3a`, and `4cb283ab8037506374f9711788cd0e576207e260` show the state being corrected across multiple layers. `INFERRED:` this was a cross-layer synchronization problem rather than a single toggle styling issue.
- Final working solution: use the validated `lang` search parameter as the route-level source of locale intent; keep loader/context state aligned with it; set root `lang`/`dir` from the selected locale; explicitly disable English when required English identity data is unavailable instead of fabricating content.
- Files / components involved: public menu route/loader, locale context/toggle, document root direction handling, theme/public-menu presentation.
- Related commits / PRs (by hash or short description): `d2dc13506f6fdbdc1f52dcd3b344edce1fdc0327`; `e03c2bebd3ac8cd9bca7aeb22b56e44b5b80e8af`; `fde333d05d6c344f7e01deeac111f8f600ba0a3a`; `4cb283ab8037506374f9711788cd0e576207e260`.
- Lessons for future: locale is routing/data state as well as presentation state. SSR, URL, loader, client state, and document direction must agree.
- Rules added to AGENTS.md or other docs: public language-switch verification and no fabricated English content; RTL/LTR included in permanent visual QA.
- Anti-patterns to avoid: client-only locale state disconnected from the URL, changing direction after the first meaningful render, and assuming translated UI chrome proves translated menu data is valid.
- Detection checklist for next time: inspect `lang` URL state; validate loader context; verify SSR `dir`; test Arabic RTL, English LTR, and mixed-direction content; preserve unrelated search parameters; verify missing-English behavior.

## Problem: Repository continuity files could diverge from actual repository state

- Date / Context: 2026-09-04 to 2026-09-05; repeated milestone closures, reconciliation work, and repository organization audit.
- Symptoms: multiple commits exist specifically to align `README`, `PROJECT_STATE`, `PLAN`, and `TASKS` with current work; the organization audit explicitly notes that local working-tree status cannot be inspected through the GitHub-only surface.
- Root cause: `INFERRED` — active work, historical records, branch state, CI state, and deployment state can change at different times; continuity documents can therefore become stale if they are updated independently or if evidence is not reconciled before a new task.
- What we tried (and failed or wasted time): history contains repeated `docs: align`, `docs: record`, `docs: close`, and `docs: update state` commits, including `3d822f3febfb4e694f0248b85454a0e8ad048f0f`, `9304a911028f945a804bae2a9c18100c49a8ca78`, `c865968986cddee267e564010dd291c602ad1bd6`, and `024d63f0b9cd1f3ce10b269e24956f40001e8538`. The organization audit records local status as `UNKNOWN` through the connector.
- Final working solution: treat code, tests, Git history, and direct deployment evidence as source of truth; reconcile continuity files at task start and end; keep one exact current task and one exact next task; explicitly label `VERIFIED`, `INFERRED`, `UNKNOWN`, and `BLOCKED`.
- Files / components involved: `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, `docs/sessions/`, `docs/repository-organization-audit.md`.
- Related commits / PRs (by hash or short description): `3d822f3febfb4e694f0248b85454a0e8ad048f0f`; `9304a911028f945a804bae2a9c18100c49a8ca78`; `c865968986cddee267e564010dd291c602ad1bd6`; `024d63f0b9cd1f3ce10b269e24956f40001e8538`.
- Lessons for future: continuity is a contract, not an independent source of truth. Never mark a milestone closed because a state file says so; verify the underlying evidence first.
- Rules added to AGENTS.md or other docs: startup reconciliation, explicit evidence labels, exact-next-task discipline, and session logging.
- Anti-patterns to avoid: copying stale state forward, treating chat memory as repository truth, hiding unknown deployment/runtime evidence behind `DONE`.
- Detection checklist for next time: inspect `main` HEAD; inspect recent history; inspect relevant changed files/diffs; compare state docs with code/tests; check CI/deployment evidence; record unresolved unknowns explicitly.

## Problem: Branching and release work became fragmented across many task branches and small commits

- Date / Context: 2026-09-03 to 2026-09-05; G-level work, theme refinements, preview fixes, and release documentation.
- Symptoms: the repository currently contains numerous purpose-specific branches, including `editorial-premium-refinement`, `editorial-premium-refinement-v2`, `feat/theme-1-essential-refinement`, `feat/theme-2-editorial-refinement`, `feat/theme-3-noir-refinement`, `fix/google-oauth-redirect`, and several `codex/level4-*` branches.
- Root cause: `INFERRED` — work was frequently split into narrow implementation, verification, and documentation checkpoints before the later release-batch policy established a stronger boundary between local checkpoints and remote release candidates.
- What we tried (and failed or wasted time): Git history shows repeated tiny fix/documentation checkpoints and later consolidation, including the final Editorial PR #13 squash merge into `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`. The release-only policy was then added to make coherent batching explicit.
- Final working solution: use a dedicated milestone/release branch when appropriate; allow local commits as safe checkpoints; verify the complete batch; merge once to `main`; deploy once for the coherent release batch. Do not push every small iteration for visual feedback.
- Files / components involved: Git branches, PR workflow, `AGENTS.md`, `docs/release-only-vercel-workflow.md`, continuity files.
- Related commits / PRs (by hash or short description): PR #13 → `81a7e0efbdf46bcf320699d0945e1a5d7d29c964`; branch names listed above; `286f4c474cae9d87effeceec6d8e743acb65e952` release policy.
- Lessons for future: branch purpose must be explicit and release batching should happen before remote deployment, not after many preview-driven iterations.
- Rules added to AGENTS.md or other docs: milestone/release branches, coherent release batch, `main` stability, one deployment per release batch.
- Anti-patterns to avoid: overlapping branches with unclear purpose, pushing every checkpoint to obtain Vercel feedback, and mixing unrelated fixes into a release batch.
- Detection checklist for next time: name the branch by one atomic milestone; identify its merge target; define acceptance criteria; keep unrelated changes out; perform final diff review before merge; confirm only one release batch is being prepared.

## Problem: Dependency and build configuration changes caused avoidable restore/reconciliation loops

- Date / Context: 2026-09-03 to 2026-09-05; CI, Vercel build, performance audit, and preview tooling.
- Symptoms: the history contains repeated dependency restoration and build-environment fixes, including React type declarations, Vite React plugin, Radix tooltip/popover versions, QR runtime dependency, PGlite asset placement, and package-manifest restoration.
- Root cause: build/runtime tooling has a tight dependency and packaging contract across local builds, CI, Vercel, and PGlite runtime assets. Small uncoordinated dependency edits can break another gate.
- What we tried (and failed or wasted time): representative commits include `63f2b13683247a53a4a33c47ce3e2539ed767d04` (restore exact package manifest), `c8e09fdc6f63f4a8a6aa017ba9321aef8e582e2e` (restore package manifest version), `7e96843459aae7bc61a59e44c9e5d31bc8c6fcd8` and `3d48e39cb31e48045b022902a61187d73bf00011` (tooltip version/pin restoration), `b5f90b0e9b893c6059a56592e8748aef14c6c8a3` (Vite React plugin), and `ed030657bd95f31a180f21118611f9665c5e0836` (React type declarations).
- Final working solution: preserve exact existing dependency versions/ranges unless the task requires a dependency change; verify package manifest and lockfile together; test build/runtime packaging in the same task; keep PGlite asset placement and Vercel packaging explicit.
- Files / components involved: `package.json`, `package-lock.json`, Vite/Nitro configuration, PGlite asset scripts, CI workflow.
- Related commits / PRs (by hash or short description): `63f2b13683247a53a4a33c47ce3e2539ed767d04`; `7e96843459aae7bc61a59e44c9e5d31bc8c6fcd8`; `3d48e39cb31e48045b022902a61187d73bf00011`; `b5f90b0e9b893c6059a56592e8748aef14c6c8a3`; `ed030657bd95f31a180f21118611f9665c5e0836`.
- Lessons for future: dependencies are part of the release contract. A passing local edit is not enough; verify typecheck, tests, lint, build, and deployment-specific packaging before declaring success.
- Rules added to AGENTS.md or other docs: preserve existing architecture/dependency pins and use focused verification gates.
- Anti-patterns to avoid: opportunistic upgrades, replacing exact ranges during unrelated work, editing package files without checking the lockfile, and assuming CI tooling will provide undeclared packages transitively.
- Detection checklist for next time: inspect `package.json` and lockfile diff together; identify runtime/build consumers; run typecheck/tests/lint/build; inspect CI; check Vercel-specific packaging only when deployment behavior is the actual task.

## Problem: Authentication runtime behavior differed from the apparently-correct implementation

- Date / Context: 2026-09-04; legacy credential reconciliation and Vercel runtime verification.
- Symptoms: sign-in returned HTTP 401 in a deployed runtime with `function crypt(unknown, unknown) does not exist` even though the credential migration bridge itself was intended to support migrated Supabase bcrypt credentials.
- Root cause: production Supabase exposes `pgcrypto` in the `extensions` schema, while the application connection search path did not include that schema; the verifier called unqualified `crypt(...)`.
- What we tried (and failed or wasted time): an initial legacy-auth bridge was reverted as unverified in `f47d83cf5796b709441d225fffded10b49283609`. The deployed runtime then exposed the actual schema-qualification problem. This was followed by the corrected implementation and documentation.
- Final working solution: call `extensions.crypt($1, $2)` and `extensions.gen_salt(...)`, preserving the existing tenant membership/user identity model and avoiding plaintext credentials.
- Files / components involved: authentication verifier, PostgreSQL `pgcrypto`, Better Auth integration, Vercel runtime.
- Related commits / PRs (by hash or short description): `f47d83cf5796b709441d225ec559b3bc3c4b2` (reverted unverified bridge); `c9bb54276267bfb99675a4c5be2f34d955a3844b` (migrated bcrypt support); `48d9f0dd4edb538b28af5a15653a42b9b18136a5` (qualified extension functions); `b454f483f8a944941b8f597a43fb2b6f8b3c6700` (recorded runtime root cause).
- Lessons for future: runtime database behavior must be verified against the actual production schema/search path. Do not infer that a function is available just because the extension exists.
- Rules added to AGENTS.md or other docs: server-side auth invariants, fail-closed behavior, direct runtime evidence for deployment claims, and explicit `UNKNOWN`/`BLOCKED` handling.
- Anti-patterns to avoid: unqualified database extension functions, unverified compatibility bridges, and treating unit/CI success as proof of deployed authentication behavior.
- Detection checklist for next time: inspect production extension schema; verify search path; reproduce the exact runtime error; test the qualified function directly; rerun auth invariants; only then release.

## Maintenance Rule
When a new incident consumes significant time, causes repeated retries, exposes a hidden architectural assumption, or requires another agent to discover a better fix, add a concise entry here before the next major milestone. Record the causal lesson, not just the patch. Preserve uncertainty explicitly.
