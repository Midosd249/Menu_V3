# DELETE_CANDIDATES

This file is an evidence register. No item in this list has been deleted by the repository-organization initiative unless explicitly marked `APPROVED`.

| Path | Classification | Evidence | Risk | Decision |
|---|---|---|---|---|
| `.node_modules.lock` | DELETE_CANDIDATE | Tracked empty file; repository-wide search found no reference | LOW | NOT DELETED |
| `migrations/auth/0001_auth.sql` | DELETE_CANDIDATE / duplicate | Same blob SHA as `migrations/0001_auth.sql`, but `scripts/migration-plan.mjs` documents the nested path as an intentional scaffold/source path | HIGH | KEEP |
| `attachments/grok-workspace.zip` | DELETE_CANDIDATE / historical artifact | 1.8 MB binary; no textual repository reference found; relationship to `.grok/` is not fully verified | MEDIUM | NOT DELETED |
| `screenshots/.gitkeep` | DELETE_CANDIDATE / placeholder | Empty placeholder in an otherwise populated screenshots directory | LOW | KEEP for now |

## Required verification before deletion

### `.node_modules.lock`

```bash
git grep -n --fixed-strings '.node_modules.lock' -- . ':!DELETE_CANDIDATES.md'
```

Expected result: no references.

Then, only after explicit approval, delete the exact file and verify with:

```bash
git status --short
git diff -- .node_modules.lock
```

Deletion is reversible through Git history.

### `migrations/auth/0001_auth.sql`

Do not delete based on duplicate content alone. First retire the documented migration scaffold contract in a separate task and prove no tooling depends on the nested source path.

### `attachments/grok-workspace.zip`

Before deletion, compare its contents with the current `.grok/` workspace and verify that no recovery or agent workflow depends on it.

## Policy

No destructive deletion command is included here. Medium/high-risk candidates require explicit approval and a separate atomic task.
