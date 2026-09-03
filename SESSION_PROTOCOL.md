# SESSION_PROTOCOL

## Start
1. Read all applicable `AGENTS.md` files, then `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README/relevant documentation, task-related source, tests, and configuration.
2. Treat `main` as the source of truth; inspect repository status, recent history, relevant diffs, and available CI/deployment evidence.
3. Use `VERIFIED`, `INFERRED`, `UNKNOWN`, and `BLOCKED` explicitly; reconcile continuity state against code and git evidence.
4. Identify the first unblocked TODO and make it the only execution target. Confirm no other task is `IN_PROGRESS`.

## Work
1. Preserve completed work; do not restart, rebuild, replace, or remove completed features.
2. Follow `DISCOVER → UNDERSTAND → RESEARCH → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT → STOP`.
3. Research official documentation first for unfamiliar or consequential decisions; use maintained open-source references and security standards when relevant, compare viable approaches when needed, and record material decisions in `PLAN.md`.
4. Before editing code, define the exact task, objective, likely files, acceptance criteria, risks, verification commands, and research/design decision when applicable.
5. Implement the smallest compatible, reversible solution with explicit failure handling and focused tests.
6. Keep authentication, authorization, tenant/branch isolation, validation, secrets, and privacy boundaries server-side.
7. Run relevant tests, typecheck, lint, build, migration/security checks, and manual acceptance checks available for the task. Never claim success without evidence.
8. Inspect the final diff and confirm every changed line belongs to the single task.

## Stop
1. Stop after the single current task is completed or blocked; never start the next task automatically.
2. Update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; update this file when workflow rules change.
3. Append a dated session log to `PROJECT_STATE.md`.
4. Record files changed, commands/results, commit evidence, known issues, blockers, uncertainty, and exactly one next task.
5. Leave all other queued tasks untouched.

## Status Labels
- `VERIFIED` — directly confirmed by repository/tool evidence.
- `INFERRED` — derived from verified facts but not directly executed/observed.
- `UNKNOWN` — insufficient evidence; never guess.
- `BLOCKED` — cannot proceed with available dependencies/environment/permissions.
- `TODO` — planned and not started.
- `IN_PROGRESS` — the single current execution task.
- `DONE` — completed with explicit verification evidence.
- `CLOSED` — milestone completed and verified to its release criteria.