# AGENTS.md

## Mission
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS for restaurants and cafes. `main` is the repository source of truth. Preserve completed capabilities and improve the existing product incrementally toward production readiness; never restart the project or rebuild completed work.

## Source of Truth and Startup
Before any coding task, read all applicable `AGENTS.md` files, then `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, README/relevant documentation, source related to the task, tests, and configuration. Inspect repository status, recent history, relevant diffs, and CI/deployment evidence when available. Do not rely on chat memory.

Repository facts must be labeled `VERIFIED`, `INFERRED`, `UNKNOWN`, or `BLOCKED`. Trust code, tests, documentation, and git evidence over stale continuity notes; reconcile discrepancies in the continuity files.

## Product and Structure
- `src/` — application source, routes, UI, and domain logic.
- `src/routes/` — TanStack Start routes, including onboarding and Studio/Owner/Admin surfaces.
- `src/lib/auth/` — authentication, authorization, permissions, and identity helpers.
- `src/lib/menu/` — menu, team, invitations, subscriptions, and domain logic.
- `migrations/` — database migrations.
- `.github/workflows/quality.yml` — CI quality gates.
- `package.json` — scripts and dependencies.
- `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md` — continuity contract.
- Key current paths include `src/routes/onboarding.tsx`, `src/lib/auth/authorization.server.ts`, `src/lib/auth/permissions.ts`, `src/lib/menu/team.ts`, `src/lib/menu/team-invitations.ts`, and `migrations/20260903008000_roles_permissions_foundation.sql`.

## Verified Stack
React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGLite-ready data layer, Supabase production integration, Vercel, and Node 24 CI. Use repository evidence before assuming any additional technology.

## Operating Cycle
**DISCOVER → UNDERSTAND → RESEARCH → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT → STOP**

1. **Discover** — identify the exact first unblocked TODO.
2. **Understand** — trace existing behavior, contracts, tests, and dependencies before editing.
3. **Research** — when a decision is unfamiliar or consequential, consult official documentation first, then relevant dependency source/release notes, maintained open-source implementations, and standards/security guidance as applicable. Compare viable approaches when the choice is consequential; record material sources and tradeoffs in `PLAN.md`.
4. **Plan** — before code changes, state current verified position, one exact task, why it is next, likely files, acceptance criteria, risks, verification commands, and any research/design decision.
5. **Implement** — make the smallest complete, reversible change using existing architecture and abstractions.
6. **Test** — cover success, edge, failure, and regression paths relevant to the task.
7. **Review** — inspect the final diff, security/privacy, performance, accessibility, maintainability, and hidden regressions as applicable.
8. **Document** — update required continuity records with evidence.
9. **Stop** — never begin the next task automatically.

Only one task may be `IN_PROGRESS` in a session. Do not silently expand scope.

## Engineering Rules
- Preserve existing architecture, routes, schemas, integrations, compatibility layers, naming, typing, and error-handling conventions.
- Prefer small, focused, reversible changes; no unrelated refactors or rewrites.
- Preserve backward compatibility unless the task explicitly requires a breaking change.
- Reuse existing utilities and dependencies. Add/upgrade/remove dependencies only when the atomic task demonstrates a need; verify compatibility, security impact, lockfile changes, and build impact.
- Do not introduce a new framework or architectural pattern without demonstrated need.
- For UI work, consider semantic structure, RTL/mobile responsiveness, keyboard access, accessibility, and clear error/loading states.
- For data/backend work, preserve tenant and branch isolation, validate external/user input, handle failure paths, and keep authorization server-side.
- Treat canonical durable authorization (`access_role` / `branch_scope`) as authoritative while preserving documented legacy compatibility.

## Security and Privacy
- Never commit or expose secrets, credentials, tokens, private data, or sensitive logs.
- Never trust client-supplied identity, tenant, role, or privilege.
- Never weaken authentication, authorization, RLS, tenant isolation, branch isolation, validation, or server-side checks to make tests/builds pass.
- Fail closed when identity, tenant, role, or scope is missing or ambiguous.
- Avoid telemetry, external data sharing, or third-party integrations unless required by the task and reviewed for security/privacy impact.
- Review injection, unsafe URLs/HTML/CSS, data exposure, dependency risk, and logging of sensitive information when relevant.

## Verification
Repository-defined commands include:
- `npm install --no-audit --no-fund`
- `npm run typecheck`
- `npm test`
- `npm run test:platform`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- `npm run db:migrate`

Run the relevant available gates before `DONE`, including unit/integration/E2E checks, lint, typecheck, build, migration/security checks, and manual acceptance checks when applicable. If a check cannot run, record the exact command, reason, alternative evidence, and remaining risk. Never claim success without evidence.

CI currently covers route-tree generation, typecheck, tests, lint, and production build. Vercel is the deployment target. Deployment success, database health, and live production behavior require direct evidence and must not be inferred from a passing GitHub build.

## Git and Change Discipline
- `main` is canonical unless repository workflow explicitly requires another branch.
- Keep commits small and task-focused with concise conventional-style messages consistent with repository history.
- Inspect status, recent history, relevant diffs, and changed files before/after work when tooling permits.
- Never rewrite history, force-push, or discard other work without explicit authorization.
- Every changed line must belong to the current atomic task.

## Continuity Contract
At the end of every session, update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; update `SESSION_PROTOCOL.md` whenever workflow rules change. Append a dated session log to `PROJECT_STATE.md`. Record the current commit/state, files changed, commands and results, known issues/blockers, uncertainty, and exactly one next task. Keep all four files consistent. Do not mark `DONE` without direct evidence.

## Debugging and Incidents
Reproduce when possible → isolate the smallest failing surface → inspect code/tests/config/logs/history → identify root cause → apply the smallest reversible fix → rerun the failing check → run broader applicable gates → review the diff. Distinguish code defects from platform, quota, rate-limit, environment, database, and infrastructure failures. Never mask errors or add speculative changes merely to obtain green checks.

## Preserve Completed Work
Completed functionality is protected. Do not rebuild, replace, remove, or regress completed features for convenience. Do not restart the project. Existing `/admin`, `server/`, `public/__grok/`, platform integrations, routes, migrations, and compatibility paths remain protected unless the current task provides evidence that a targeted correction is required.

## Visual, Interaction, and Conversion Quality Gate
Before any new template, template redesign, public-menu UI refinement, SEO/public-page change, or conversion-flow change:
- complete the visual and functional audit defined in `docs/visual-functional-audit.md` and `docs/template-review-checklist.md`;
- inspect the complete relevant customer journey, not isolated components;
- validate interactive controls visually and functionally, including purpose, placement, reachability, touch target, accessible name, focus/state behavior, failure states, and conversion relevance;
- test Arabic RTL, English LTR, mixed-direction text, realistic data, responsive states, and supported loading/empty/error/unavailable states;
- use relevant connected sources only when actually available and use public sources responsibly; record material research in `docs/design-research-log.md`;
- prepare or update `docs/template-brief-template.md` before implementation when a template/presentation change is material;
- never mark a template or public-menu change complete without the visual-functional checklist and evidence-backed verification;
- preserve existing product behavior and never add or imply unsupported actions such as payment, checkout, contact, or location capabilities that the repository does not actually provide.

## Definition of Done
A task is `DONE` only when the requested behavior is implemented, the diff is task-scoped, relevant verification passes or an evidence-backed exception is documented, applicable security/privacy/performance/accessibility/maintainability review is complete, and continuity state is updated. No unresolved blocker or unknown may be hidden behind `DONE`.

## Blockers and Ambiguity
Do not guess. If blocked by missing information, permissions, dependencies, environment, or external services, mark `BLOCKED` and preserve the working state. If requirements conflict, surface the conflict and prefer explicit user requirements over assumptions. Missing facts are `UNKNOWN`; derived conclusions are `INFERRED`.

## Expert Review Lens
Use only the perspectives relevant to the task: product value/acceptance, architecture, senior implementation, research, QA, security, performance, UX/accessibility, DevOps, code review, and technical writing. Do not role-play or expose internal reasoning; report concise conclusions and evidence.

## Session Triggers
`[BOOT]` read state and inspect git → `[PROVE]` find evidence → `[SCOPE]` one atomic task → `[RESEARCH]` reliable sources → `[DESIGN]` smallest compatible solution → `[BUILD]` focused implementation → `[TEST]` verify → `[SECURE]` review security → `[DIFF]` inspect every change → `[STATE]` update continuity → `[STOP]` stop after one task.