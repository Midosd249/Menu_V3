# SESSION_PROTOCOL

## Start
1. Read all applicable `AGENTS.md` files, then `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README/relevant documentation, task-related source, tests, and configuration.
2. Treat `main` as the source of truth; inspect repository status, recent history, relevant diffs, and available CI/deployment evidence.
3. Use `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, and `PROPOSED` explicitly; reconcile continuity state against code and git evidence.
4. The active `PLAN.md` may replace an obsolete roadmap only after the old plan is archived and completed work is explicitly preserved.
5. Identify the highest-value unblocked atomic task from repository evidence, not from stale task ordering. If verification reveals a separate hard blocker, record it and do not silently expand the current task.

## Work
1. Preserve completed work; do not restart, rebuild, replace, or remove completed features.
2. Follow `DISCOVER → UNDERSTAND → RESEARCH → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT → STOP`.
3. Research official documentation first for unfamiliar or consequential decisions; use maintained open-source references and security standards when relevant, compare viable approaches when needed, and record material sources and tradeoffs in `PLAN.md` and `docs/design-research-log.md`.
4. Before editing code, define the exact task, objective, likely files, acceptance criteria, risks, verification commands, and research/design decision when applicable.
5. For template/public-menu UI, SEO, accessibility, performance, or conversion work, complete the visual/functional quality gate in `docs/template-review-checklist.md` and use `docs/template-brief-template.md` before material presentation changes.
6. Implement the smallest complete, reversible change with explicit failure handling and focused tests.
7. Keep authentication, authorization, tenant/branch isolation, validation, secrets, and privacy boundaries server-side.
8. Run relevant tests, typecheck, lint, build, migration/security checks, and manual acceptance checks available for the task. If an unrelated pre-existing blocker prevents verification, classify it explicitly and stop rather than expanding scope.
9. Inspect the final diff and confirm every changed line belongs to the single task.
10. For template work, keep presentation separate from menu data and business rules; preserve existing `ThemeKey` compatibility until a replacement family passes its acceptance gates.
11. For template/public-menu work, validate real Arabic/English content, long text, missing images, availability, modifiers, responsive behavior, RTL, accessibility, performance, SEO, and supported conversion states as applicable.
12. Never claim visual success from HTTP 200, source inspection, or a passing unit test alone; browser/device evidence is required for visual claims when available.

## Permanent Visual / Functional Audit Gate
Before any new template, template redesign, public-menu UI refinement, SEO/public-page change, or conversion-flow change:
1. Inspect the entire relevant customer journey and the repository capability surface.
2. Create/update a complete design brief when the presentation change is material.
3. Perform material research using repository evidence first, then actually available connected sources, then authoritative public sources; record material findings in `docs/design-research-log.md`.
4. Run the visual scan across supported mobile/tablet/desktop sizes, Arabic RTL, English LTR, mixed-direction content, realistic data, and supported state variants.
5. Run the functional interaction scan for purpose, placement, reachability, touch targets, accessibility, feedback, failure states, privacy-safe analytics, and conversion relevance.
6. Audit supported cart/order, WhatsApp, phone, map/location, search, category navigation, and icons only when those capabilities exist in the repository.
7. Verify real-data resilience, mobile safe areas, accessibility, performance, and public-page SEO.
8. Review screenshots/visual regression when browser tooling is available; otherwise mark the visual portion UNKNOWN and record the exact evidence required later.
9. Do not mark the template/public-menu change complete until the checklist is satisfied or a documented evidence-backed exception is accepted.
10. Do not add or imply unsupported customer actions.

## Incident Learning: Preview Covering-Layer Failure
1. Treat a visible covering layer as a **rendering/stacking-system problem first**, not automatically as a single `z-index` problem.
2. Before changing stacking order, inspect the complete paint chain: nested shells, pseudo-elements, positioned descendants, `isolation`, full-viewport sizing, animation state, and route-level wrappers.
3. Do not introduce a defensive stacking context merely because an overlay is suspected. In this incident, the first safety-layer implementation used `isolation: isolate` plus child `z-index: 1`; the later fix removed that stacking trap and returned preview children to normal paint order with `isolation: auto`. This is now a regression pattern to avoid.
4. Preview must be treated as a distinct rendering mode. Published-menu animation behavior must not be allowed to make preview content appear absent or dependent on scroll progress. The successful fix explicitly disables preview card animation and forces visible opacity/transform state.
5. Avoid route/template duplication. The final preview fix removed the extra outer `.menu-public-shell` so the menu template remains the owner of its own presentation shell.
6. Prevent regressions with focused source-level tests for structural invariants, not only HTTP success. A route returning HTTP 200 does not prove that the user can see the menu.
7. When a fix is discovered externally (for example by another coding agent), study the exact successful diff and its parent sequence, then convert the underlying engineering principle into repository protocol rather than copying changes blindly.
8. For future visual bugs, prefer this diagnostic order: **DOM structure → positioning/sizing → stacking contexts → pseudo-elements → animation/paint timing → responsive constraints → only then targeted z-index changes.**

## Plan Reset Protocol
1. When the current plan is declared obsolete, archive it as `PLAN_ARCHIVE_<YYYY-MM-DD>.md` before replacing it.
2. Create a self-contained active `PLAN.md` with verified state, fresh findings, priorities/dependencies, acceptance/verification, risks, research, rollback, uncertainty, progress, and exactly one current task.
3. Keep completed milestones in the new plan only when repository evidence supports them; never reopen them merely because the ordering changed.
4. Update `PROJECT_STATE.md`, `TASKS.md`, and this protocol when the reset changes continuity semantics.

## Stop
1. Stop after the single current task is completed or blocked; never start the next task automatically.
2. Update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; update this file whenever workflow rules change.
3. Append a dated session log to `PROJECT_STATE.md`.
4. Record files changed, commands/results, commit evidence, known issues, blockers, uncertainty, and exactly one next task.
5. Leave all other queued tasks untouched.

## Status Labels
- `VERIFIED` — directly confirmed by repository/tool evidence.
- `INFERRED` — derived from verified facts but not directly executed/observed.
- `UNKNOWN` — insufficient evidence; never guess.
- `BLOCKED` — cannot proceed with available dependencies/environment/permissions, or verification is prevented by a hard blocker.
- `PROPOSED` — an explicit recommendation not yet proven by repository evidence.
- `TODO` — planned and not started.
- `IN_PROGRESS` — the single current execution task.
- `DONE` — completed with explicit verification evidence.
- `CLOSED` — milestone completed and verified to its release criteria.
