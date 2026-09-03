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
3. Research official documentation first for unfamiliar or consequential decisions; use maintained open-source references and security standards when relevant, compare viable approaches when needed, and record material sources and tradeoffs in `PLAN.md`.
4. Before editing code, define the exact task, objective, likely files, acceptance criteria, risks, verification commands, and research/design decision when applicable.
5. Implement the smallest complete, reversible change with explicit failure handling and focused tests.
6. Keep authentication, authorization, tenant/branch isolation, validation, secrets, and privacy boundaries server-side.
7. Run relevant tests, typecheck, lint, build, migration/security checks, and manual acceptance checks available for the task. If an unrelated pre-existing blocker prevents verification, classify it explicitly and stop rather than expanding scope.
8. Inspect the final diff and confirm every changed line belongs to the single task.
9. For template work, keep presentation separate from menu data and business rules; preserve existing `ThemeKey` compatibility until a replacement family passes its acceptance gates.
10. For template work, validate real Arabic/English content, long text, missing images, availability, modifiers, responsive behavior, RTL, accessibility, and performance as applicable.

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
