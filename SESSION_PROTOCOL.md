# SESSION_PROTOCOL

## Start
1. Read `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, and `SESSION_PROTOCOL.md`.
2. Treat `main` as the source of truth.
3. Audit repository documentation, source, configuration, tests, package files, environment examples, CI/CD, recent history, branches, tags, and available diffs.
4. Confirm exactly one task is `IN_PROGRESS`.
5. Identify the first unblocked TODO and make it the only execution target.

## Work
1. Preserve completed work; do not rebuild or replace it.
2. Use verified repository evidence; label facts `VERIFIED`, `INFERRED`, `UNKNOWN`, or `BLOCKED`.
3. Keep authorization and tenant boundaries server-side.
4. Make the smallest coherent change that completes the current task.
5. Add focused regression tests.
6. Run relevant typecheck/tests/lint/build/manual verification available in the environment.
7. Never claim DONE without evidence.

## Stop
1. Stop after the single current task is completed or blocked.
2. Update all four continuity files.
3. Append a dated session log to `PROJECT_STATE.md`.
4. Record commit hashes and verification evidence.
5. Leave all other queued tasks untouched.

## Status Labels
- `VERIFIED` — directly confirmed by repository/tool evidence.
- `INFERRED` — derived from verified facts but not directly executed/observed.
- `UNKNOWN` — insufficient evidence.
- `BLOCKED` — cannot proceed with available dependencies/environment.
- `TODO` — planned and not started.
- `IN_PROGRESS` — the single current execution task.
- `DONE` — completed with explicit verification evidence.
- `CLOSED` — milestone completed and verified to release criteria.
