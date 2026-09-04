# Repository Organization Audit

Date: 2026-09-04
Repository: `Midosd249/Menu_V3`
Audit branch: `chore/repository-organization`
Source revision audited: `11188e2fbc05d58dedf7eb2c249528c65d54aaa6`

## 1. Executive summary

**VERIFIED:** The repository has a sound application architecture and a clear continuity contract, but the repository root contains too much historical documentation and a few maintenance artifacts that obscure the active surface. The application source is already grouped sensibly under `src/`, database history is isolated under `migrations/`, operational tooling is under `scripts/`, server middleware is under `server/`, and CI is isolated under `.github/workflows/`.

**VERIFIED:** No application source, migration, deployment configuration, or test file is being reorganized by this initiative.

**PROPOSED:** Keep only active continuity and entry-point documentation at the root. Move historical reports and completed plans to `docs/archive/`, and group maintained product/deployment/development documentation under `docs/`.

**UNKNOWN:** Local working-tree changes cannot be inspected through the GitHub connector. The remote `main` tree is the audited source of truth for this pass.

## 2. Current repository map

```text
.
├── .github/workflows/quality.yml
├── .grok/                         # agent/tooling workspace
├── attachments/                   # historical binary artifact
├── docs/                          # maintained documentation
├── migrations/                    # production migration history
├── public/                        # public runtime assets
├── screenshots/                   # QA/reference captures
├── scripts/                       # build, DB, preview, QA, performance tooling
├── server/                        # Nitro/Vercel middleware
├── src/                           # application source
├── tests/                         # cross-cutting tests
├── AGENTS.md                      # active repository contract
├── PROJECT_STATE.md               # active continuity state
├── PLAN.md                        # active roadmap
├── TASKS.md                       # active queue
├── SESSION_PROTOCOL.md            # active workflow protocol
├── package.json
├── package-lock.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
├── vercel.json
├── vite.config.ts
└── startup.sh
```

## 3. Verified stack and key commands

**VERIFIED:** `package.json` defines React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PGLite/PostgreSQL-related dependencies, Playwright, and Node-oriented tooling. CI explicitly uses Node 24.

**VERIFIED commands:**

- `npm install --no-audit --no-fund`
- `npm run dev`
- `npm run typecheck`
- `npm test`
- `npm run test:platform`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- `npm run db:migrate`

**VERIFIED:** `npm run build` invokes the Vite build, PGLite asset preparation, and database migration runner.

## 4. Files and folders to keep

**KEEP / VERIFIED:**

- `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md` — required continuity contract.
- `src/` — active application code and protected routes/domain logic.
- `migrations/` — durable database history; never delete or reorder casually.
- `scripts/` — referenced by package scripts and `vite.config.ts`.
- `server/` — referenced by Nitro configuration in `vite.config.ts`.
- `public/` — runtime assets.
- `.github/workflows/quality.yml` — active CI quality gate.
- `package.json` and `package-lock.json` — dependency/build contract.
- `vite.config.ts`, `vercel.json`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc` — active configuration.
- `.grok/` — existing agent/tooling workspace; purpose is materially connected to current development tooling and must not be removed speculatively.
- `screenshots/` — QA/reference evidence; retained pending a separate evidence-based cleanup decision.
- `attachments/grok-workspace.zip` — retained for now because its relationship to the live `.grok/` workspace is not fully verified.
- `.project_id` — retained; it is tracked despite being listed in `.gitignore`, and its platform purpose must be verified before any change.

## 5. Files and folders to reorganize

**PROPOSED / LOW risk, after reference verification:**

| Current path | Proposed destination | Reason | Evidence | Risk |
|---|---|---|---|---|
| `ADMIN_SETUP.md` | `docs/deployment/ADMIN_SETUP.md` | Deployment documentation does not need root placement | No repository code reference found; content is deployment setup | LOW |
| `DESIGN_SYSTEM.md` | `docs/product/DESIGN_SYSTEM.md` | Product design reference belongs under maintained docs | No repository code reference found | LOW |
| `MASTER_CONTEXT_MENU_V3.md` | `docs/development/MASTER_CONTEXT_MENU_V3.md` | Architectural/continuity context is not an entry-point file | No repository code reference found; continuity contract is already represented by root state files | LOW |

These moves preserve file contents and do not change application paths.

## 6. Archive plan

**PROPOSED / LOW risk:** Move historical root records into `docs/archive/`:

- `COMPLETION.md`
- `PLAN_ARCHIVE_2026-09-03.md`
- `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`
- `SESSION_LOG_2026-09-03_G2.md`
- `STATUS_MENU_V3_2026-09-03.md`

The files are historical records and are not part of the active root continuity contract. Their content is preserved verbatim when moved.

## 7. Delete-candidate list

**PROPOSED / NOT DELETED:**

1. `.node_modules.lock` — empty tracked file; no repository reference found. Strong candidate for deletion, but deletion is intentionally deferred to the dedicated candidate list and approval policy.
2. `screenshots/.gitkeep` — empty placeholder. It is harmless and can remain unless the screenshots directory becomes unnecessary.
3. Potential duplicate `migrations/auth/0001_auth.sql` — same blob as `migrations/0001_auth.sql`, but **DO NOT DELETE** now. `scripts/migration-plan.mjs` explicitly documents `migrations/auth/` as an intentional scaffold/source path that is outside the current applier scope. Risk is HIGH until the historical scaffold contract is retired.
4. `attachments/grok-workspace.zip` — 1.8 MB historical binary. No textual repository reference was found, but its relationship to the `.grok/` workspace is not fully verified. Risk MEDIUM; do not delete.

## 8. Unknown files requiring caution

- `.project_id` — **UNKNOWN** platform purpose. Tracked despite `.gitignore`; retain.
- `attachments/grok-workspace.zip` — **UNKNOWN** whether it is a recoverable source artifact for `.grok/`.
- Branches `codex/level4-*` — **UNKNOWN** whether each branch is obsolete, merged, or still needed. No branch deletion was attempted.
- Local working-tree status — **UNKNOWN** because this GitHub-only surface cannot inspect the user's local clone.
- Full production environment contract — **UNKNOWN**; no committed environment example was found.

## 9. Duplicate files and duplicate documentation

**VERIFIED:** `migrations/auth/0001_auth.sql` and `migrations/0001_auth.sql` have the same blob SHA and therefore identical content. The migration planner explicitly says the nested auth path is intentionally out of scope until copied upward, so this is not safe to delete as ordinary duplication.

**INFERRED:** The root historical reports overlap with the information now maintained in `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`, but they should be archived rather than deleted because they preserve historical evidence.

## 10. Dead-code or unused-dependency candidates

**UNKNOWN:** A complete unused-dependency/dead-code proof requires executing the package manager, TypeScript compiler, lint, tests, and preferably a production build in a repository shell. The connected GitHub surface does not provide that shell.

**VERIFIED finding:** `package-lock.json` contains a broader root dependency set than `package.json` (for example packages such as `@radix-ui/react-avatar`, `@radix-ui/react-dropdown-menu`, `@tanstack/react-table`, `kysely`, `recharts`, and `zod` appear in the lockfile root package while not appearing in the current `package.json`). This indicates dependency-manifest drift and should be investigated separately. It is not changed in this organization task because altering dependency state can affect builds.

## 11. Security findings

**VERIFIED:** `.gitignore` excludes `node_modules/`, `.vercel/`, `.project_id`, `.github_repo`, `.env`, and `.env.*`.

**VERIFIED:** `ADMIN_SETUP.md` documents server-side platform-admin checks through `PLATFORM_ADMIN_EMAILS` and `PLATFORM_ADMIN_USER_IDS` and explicitly warns not to commit those values.

**VERIFIED:** `AGENTS.md` requires server-side authentication/authorization, tenant/branch isolation, fail-closed behavior, and no secrets in Git.

**UNKNOWN:** GitHub secret-scanning/code-scanning status is not exposed by the repository content audit. It should be checked in repository settings separately.

**UNKNOWN:** No claim is made about complete PostgreSQL RLS coverage; repository continuity notes explicitly distinguish the server-side data layer from universal RLS.

## 12. Configuration and environment findings

**VERIFIED:** Vercel configuration is minimal and currently sets region `icn1`.

**VERIFIED:** Vite uses the Vercel Nitro preset for production builds and explicitly wires `server/` middleware.

**VERIFIED:** CI uses `npm install`, generates the TanStack route tree, then runs typecheck, tests, lint, production build, Playwright setup, performance audit, and browser template QA.

**UNKNOWN:** A committed `.env.example` or equivalent environment contract is not present in the audited tree.

## 13. Test and quality findings

**VERIFIED:** The test command includes focused application tests and platform/script regression tests.

**VERIFIED:** CI quality workflow covers route generation, typecheck, tests, lint, build, browser performance, and template QA.

**UNKNOWN:** Current local execution results for this branch cannot be produced because the connected GitHub surface has no repository shell.

## 14. CI/CD and Vercel findings

**VERIFIED:** `.github/workflows/quality.yml` is the active quality workflow and does not require organization changes.

**VERIFIED:** The latest audited `main` commit has a Vercel failure status pointing to a `build-rate-limit` upgrade page. This is an external provider limitation, not evidence of an application build failure.

**UNKNOWN:** No current production deployment can be claimed from this audit. The repository itself is not sufficient to prove deployment state.

## 15. Proposed target structure

```text
.
├── .github/
├── .grok/
├── docs/
│   ├── archive/
│   ├── deployment/
│   ├── development/
│   ├── product/
│   └── repository-organization-audit.md
├── migrations/
├── public/
├── screenshots/
├── scripts/
├── server/
├── src/
├── tests/
├── AGENTS.md
├── PROJECT_STATE.md
├── PLAN.md
├── TASKS.md
├── SESSION_PROTOCOL.md
├── DELETE_CANDIDATES.md
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
├── vercel.json
├── vite.config.ts
└── startup.sh
```

## 16. File-by-file move plan

**PROPOSED:**

- `ADMIN_SETUP.md` → `docs/deployment/ADMIN_SETUP.md`
- `DESIGN_SYSTEM.md` → `docs/product/DESIGN_SYSTEM.md`
- `MASTER_CONTEXT_MENU_V3.md` → `docs/development/MASTER_CONTEXT_MENU_V3.md`
- `COMPLETION.md` → `docs/archive/COMPLETION.md`
- `PLAN_ARCHIVE_2026-09-03.md` → `docs/archive/PLAN_ARCHIVE_2026-09-03.md`
- `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md` → `docs/archive/PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`
- `SESSION_LOG_2026-09-03_G2.md` → `docs/archive/SESSION_LOG_2026-09-03_G2.md`
- `STATUS_MENU_V3_2026-09-03.md` → `docs/archive/STATUS_MENU_V3_2026-09-03.md`

No source, route, migration, script, CI, or deployment file is proposed for relocation.

## 17. File-by-file deletion proposal

See `DELETE_CANDIDATES.md`. No medium/high-risk item is approved for deletion by this audit.

## 18. Risk assessment

- Documentation-only moves: LOW.
- Historical archiving: LOW.
- Empty `.node_modules.lock` removal: LOW, but deferred until a dedicated cleanup commit.
- Duplicate migration path: HIGH; retain.
- `.project_id`: HIGH/UNKNOWN; retain.
- `.grok` and its artifacts: MEDIUM/UNKNOWN; retain.
- Dependency manifest drift: MEDIUM; investigate separately.
- Vercel build-rate-limit: external BLOCKED condition.

## 19. Rollback plan

Documentation moves are reversible by restoring each file to its original path with the same content. The organization branch is isolated from `main`. No application code, schema, deployment configuration, or dependency versions are changed by the organization work.

## 20. Verification plan

1. Inspect the organization branch tree and diff.
2. Confirm all moved documentation has identical content.
3. Search the repository for old documentation paths and update references if any appear.
4. Verify no application/import/script/CI/Vercel/migration path was changed.
5. Run the available repository quality commands when a shell is available.
6. Confirm the final branch contains no secrets or generated runtime artifacts.
7. Confirm `main` remains untouched until an explicit merge decision.

## 21. Manual actions required from me

**BLOCKED:** Local working-tree status and local command execution require a repository shell that is not exposed through the current GitHub connector.

If local verification is required, run the commands listed in `DELETE_CANDIDATES.md` and the final report. Do not delete any candidate without explicit approval.

## Evidence references

- `AGENTS.md` — repository operating contract.
- `PROJECT_STATE.md` — current milestone and known deployment limitation.
- `PLAN.md` / `TASKS.md` — current product task remains G7.2.
- `package.json` / `package-lock.json` — command and dependency contract.
- `vite.config.ts` / `vercel.json` — build/deployment wiring.
- `.github/workflows/quality.yml` — CI quality gates.
- `scripts/migration-plan.mjs` — migration directory semantics.
- Git history through the 50 most recent commits — recent work is strongly task-scoped and continuity-driven.

## Audit conclusion

**VERIFIED:** The safest professional organization is a documentation-focused cleanup around an already sound source layout. No application redesign or schema modification is justified.

**PROPOSED:** Apply only the documented low-risk documentation moves and archive operations on `chore/repository-organization`; keep deletion candidates separate; investigate dependency-manifest drift as a future atomic task.
