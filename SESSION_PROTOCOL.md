# SESSION_PROTOCOL

## Start
1. Read `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, and `SESSION_PROTOCOL.md`.
2. Treat `main` as the source of truth.
3. Inspect current repository tree, relevant docs, source, config, tests, CI, recent history, branches, and diffs before changing code.
4. Confirm exactly one task is `IN_PROGRESS`.
5. Identify the first unblocked TODO and make it the only execution target.

## Work
1. Preserve completed work; do not rebuild or replace it.
2. Use verified repository evidence; label facts `VERIFIED`, `INFERRED`, `UNKNOWN`, or `BLOCKED`.
3. Keep security/tenant boundaries server-side.
4. Make the smallest coherent change that completes the current task.
5. Add or update focused regression tests.
6. Run relevant typecheck/tests/lint/build/verification available in the environment.
7. Never claim DONE without evidence.

## Stop
1. Stop immediately after the single current task is completed or blocked.
2. Update all four continuity files.
3. Append a dated session log to `PROJECT_STATE.md`.
4. Record commit hashes and verification evidence.
5. Leave all other queued tasks untouched.

## Status Labels
- `VERIFIED` — directly confirmed by repository/tool evidence.
- `INFERRED` — derived from multiple verified facts but not directly executed/observed.
- `UNKNOWN` — the repository/tooling does not expose enough evidence.
- `BLOCKED` — cannot proceed without an unavailable dependency, credential, environment, or required decision.
- `TODO` — planned and not started.
- `IN_PROGRESS` — the single current execution task.
- `DONE` — completed with explicit verification evidence.
- `CLOSED` — milestone completed and verified to its release criteria.
