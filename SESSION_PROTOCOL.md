# SESSION_PROTOCOL

## Start
1. Read all applicable `AGENTS.md` files, then `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README/relevant documentation, task-related source, tests, and configuration.
2. Treat `main` as the source of truth; inspect repository status, recent history, relevant diffs, and available CI/deployment evidence.
3. Use `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, and `PROPOSED` explicitly; reconcile continuity state against code and git evidence.
4. Identify the highest-value unblocked atomic task from repository evidence and explicit user scope.
5. For template/public-menu work, complete the permanent quality gate before implementation.

## Premium Template Workflow
For every future public-menu, template, theme, SEO, accessibility, performance, or conversion-flow task:

**DISCOVER → AUDIT → SEGMENT → RESEARCH → DESIGN BRIEF → PLAN → IMPLEMENT → REAL-DATA TEST → VISUAL REVIEW → FUNCTIONAL REVIEW → VERIFY → DOCUMENT → STOP**

- Repository evidence is first priority.
- Connected tools are used only when actually connected.
- Public sources must be authoritative/reputable and material to the decision.
- Saudi/MENA examples are used for transferable principles, not copying.
- The complete customer journey is audited, not only the hero or one screenshot.
- Review supported mobile/tablet/desktop sizes, Arabic RTL, English LTR, mixed-direction text, real-data stress states, and supported loading/empty/error/unavailable states.
- Audit cart/order, WhatsApp, phone, map/location, social, search, category navigation, and icons only when those capabilities exist.
- Do not add or imply unsupported actions.
- Browser/device visual claims require browser/device evidence; otherwise mark them `UNKNOWN` and record exact follow-up evidence.

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

## Stop
1. Stop after the single current task is completed or blocked.
2. Update continuity files and append a dated session log.
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
