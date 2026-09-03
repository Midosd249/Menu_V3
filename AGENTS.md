# AGENTS.md

## Mission
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS. The repository is the source of truth. Preserve existing capabilities and evolve the product incrementally toward a production-ready commercial SaaS.

## Repository Structure
- `src/` — application source, routes, UI, and domain logic.
- `src/routes/` — TanStack Start routes, including onboarding and Studio.
- `src/lib/auth/` — authentication, authorization, and permissions.
- `src/lib/menu/` — menu, team, invitation, and related domain logic.
- `migrations/` — database migrations.
- `.github/workflows/quality.yml` — CI quality gates.
- `package.json` — scripts and dependencies.
- `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md` — continuity state.
- Important paths: `src/routes/onboarding.tsx`, `src/lib/auth/authorization.server.ts`, `src/lib/auth/permissions.ts`, `src/lib/menu/team.ts`, `src/lib/menu/team-invitations.ts`, `migrations/20260903008000_roles_permissions_foundation.sql`.

## Stack
Verified repository evidence identifies React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGLite-ready data layer, Supabase production integration, Vercel, and Node 24 CI. Do not assume additional technologies without repository evidence.

## Engineering Conventions
- Read every applicable `AGENTS.md` before coding, then read `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README, and relevant documentation.
- Follow the existing architecture, naming, types, route patterns, authorization model, and compatibility boundaries.
- Prefer small, reversible, focused changes. Avoid unrelated refactors, rewrites, scaffolding, or replacement architectures.
- Treat canonical durable authorization (`access_role` / `branch_scope`) as authoritative while preserving documented legacy compatibility.
- Consider architecture, correctness, security, privacy, performance, accessibility, and maintainability for every change.
- Research official documentation and reputable open-source references when repository evidence is insufficient; record material references in `PLAN.md`.

## Testing, Build, and Deployment
Repository-defined commands include:
- `npm install --no-audit --no-fund`
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- `npm run test:platform`
- `npm run db:migrate`

CI covers route-tree generation, typechecking, tests, lint, and production build. Deployment targets Vercel. Never claim deployment success without deployment evidence.

## Security and Privacy
- Never expose secrets, credentials, tokens, or private user data.
- Never weaken authentication, authorization, RLS, tenant isolation, branch isolation, or server-side permission checks for convenience.
- Validate authorization on the server using trusted membership state; never trust client-supplied identity or privilege.
- Fail closed when tenant or branch scope is missing or ambiguous.
- Do not add telemetry, external data sharing, or third-party integrations without a justified task and security/privacy review.

## Dependency Policy
- Reuse existing dependencies whenever possible.
- Add, upgrade, remove, or replace dependencies only when required by the atomic task.
- Verify compatibility, security implications, lockfile/package changes, and build impact before accepting dependency changes.

## Git and Commits
- Treat `main` as the canonical branch unless an explicit repository workflow requires otherwise.
- Keep commits small and task-focused; use concise conventional-style messages consistent with repository history, such as `docs: ...` and `fix(auth): ...`.
- Never rewrite history, force-push, or discard other work without explicit authorization.
- Inspect status, recent history, relevant diffs, and changed files before and after work when tooling permits.

## One Atomic Task Rule
1. **Discover** the exact first unblocked TODO.
2. **Understand** the existing implementation and acceptance criteria.
3. **Plan** the smallest complete solution, risks, and verification.
4. **Implement** only that task.
5. **Test** the relevant gates.
6. **Review** the diff and behavior.
7. **Document** the result in all required state files.
8. **Stop**; do not begin the next task.

Only one task may be `IN_PROGRESS`. Never silently expand scope.

## Definition of Done
A task is `DONE` only when the requested behavior is implemented, the final diff is task-scoped, applicable tests/typecheck/lint/build and other gates pass (or an evidence-backed exception is documented), security/privacy/accessibility/performance/maintainability implications are reviewed as applicable, and repository state is accurately documented. Required evidence includes exact commands, CI run/commit identifiers, or manual verification. No unresolved blocker may be hidden behind `DONE`.

## Debugging and Incident Handling
- Reproduce before changing code when possible.
- Isolate the smallest failing surface; inspect logs, tests, configuration, and recent changes.
- Fix the root cause with the smallest reversible change.
- Re-run the failing verification, then broader applicable quality gates.
- Distinguish code/build failures from platform, quota, rate-limit, environment, and infrastructure failures.
- Never mask errors, weaken security, or add speculative changes to make checks appear green.

## Preserve Completed Work
- Treat completed functionality as protected unless the current task directly requires a change.
- Do not rebuild, replace, or remove completed features merely for convenience.
- Preserve existing routes, migrations, integrations, compatibility layers, and documented platform files unless evidence shows they are broken and the atomic task requires correction.

## Continuity State
Before coding, read `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, and `SESSION_PROTOCOL.md`. After the one task, update all four so they agree on the current state/commit, completed and in-progress work, exact next unblocked task, verification evidence, known issues/blockers/uncertainty, and session log requirements. Never mark `DONE` without evidence.

## Uncertainty and Blockers
Use `VERIFIED`, `INFERRED`, `UNKNOWN`, and `BLOCKED` explicitly. Missing information is `UNKNOWN`, never guessed. If verification is prevented by a dependency, environment, permission, or external service, mark the work `BLOCKED` or keep it `IN_PROGRESS` and record the exact reason. Distinguish repository facts from assumptions and recommendations. Stop rather than inventing requirements, commands, APIs, credentials, or repository state.

## Operating Cycle
**Discover → Understand → Plan → Implement → Test → Review → Document → Stop**

Operate as a senior Codex-style software engineer: inspect first, preserve previous work, make the smallest complete change, verify with evidence, document state, and stop after one atomic task.