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

## Verified Stack
React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGLite-ready data layer, Supabase production integration, Vercel, and Node 24 CI. Use repository evidence before assuming any additional technology.

## Operating Cycle
**DISCOVER → AUDIT → SEGMENT → RESEARCH → DESIGN BRIEF → PLAN → IMPLEMENT → REAL-DATA TEST → VISUAL REVIEW → FUNCTIONAL REVIEW → VERIFY → DOCUMENT → STOP**

1. Discover the exact unblocked TODO from repository evidence.
2. Audit the complete relevant customer journey before material UI/template work.
3. Segment the restaurant concept, target customer, business goal, and supported capabilities before choosing a visual direction.
4. Research only when material; use repository evidence first, actually connected sources second, then authoritative public sources and credible Saudi/MENA examples.
5. Prepare the design brief before material template/presentation changes.
6. Plan one atomic task with acceptance criteria, risks, rollback, and verification commands.
7. Implement the smallest complete, reversible solution inside the existing architecture.
8. Test with realistic data, responsive states, and supported failure paths.
9. Review visual hierarchy, interaction behavior, accessibility, performance, SEO, security/privacy, and regressions.
10. Verify with direct evidence; document uncertainty instead of guessing.
11. Update continuity records and stop after the atomic task.

Only one task may be `IN_PROGRESS` in a session. Do not silently expand scope.

## Premium Digital Menu Design, Visual, and Functional Quality
For every future public-menu, template, theme, SEO, customer-action, or conversion-flow task, use the permanent workflow above and apply only the relevant expert lenses: restaurant product strategist, Saudi-market researcher, digital-menu UX/UI designer, mobile-first interaction designer, Arabic/RTL typography reviewer, design-system architect, frontend engineer, accessibility reviewer, performance reviewer, local SEO reviewer, QA/visual-regression reviewer, and security/privacy reviewer for customer actions and external links. Do not role-play; turn these lenses into concrete decisions and tests.

### Permanent research rules
- Repository code, data models, components, tests, Git history, and deployment evidence are the first source of truth.
- Use connected GitHub/design/analytics/browser/deployment sources only when actually connected and accessible.
- Use official framework/library documentation, W3C guidance, official search guidance, maintained open-source references, credible UX research, and relevant Saudi/MENA public examples when they materially improve a decision.
- Do not claim broad competitor coverage.
- Do not copy proprietary UI, assets, screenshots, text, branding, layouts, or source code.
- Record material research in `docs/design-research-log.md` with source, date, category, VERIFIED finding, transferable principle, relevance, limitation, confidence, and what must not be copied.

### Permanent visual audit
Before implementation, inspect the full relevant journey across supported small/standard/large mobile, tablet, and desktop states. Review Arabic RTL, English LTR, mixed-direction content, long names, long categories, long restaurant names, SAR price lengths, missing/poor images, varied image ratios, missing descriptions, sold-out/available items, modifiers/discounts when supported, sparse/dense categories, one/multiple branches, and loading/empty/error/offline/unavailable states when supported.

Inspect first-screen clarity, restaurant identity, hero/header, typography, hierarchy, alignment, wrapping, clipping, overlap, contrast, spacing, card readability, category navigation, search, price/currency, image crop/fallbacks, sticky/fixed controls, safe areas, dialogs/bottom sheets, scroll behavior, RTL/LTR quality, mobile usability, and theme/restaurant fit. Never call a theme premium when decoration harms readability, scanability, contrast, or interaction.

### Permanent functional UI audit
Every existing button, icon, link, card, sticky control, and action must have a clear purpose, expected placement, adequate reachability, safe state behavior, accessible naming, visible focus where relevant, correct RTL/LTR placement, and clear feedback. Use at least 24×24 CSS pixels as the WCAG 2.2 pointer-target minimum baseline with applicable exceptions; prefer approximately 44×44 CSS pixels for important mobile controls when practical.

Audit supported cart/order, WhatsApp, phone, map/location, social, search, and category actions. Show actions only when verified data/capabilities exist. Preserve ordering, pricing, tenant/branch isolation, authorization, privacy, and existing analytics semantics. Never invent checkout, payment, booking, contact, location, or other customer actions.

### Real-data and quality gate
No material template/public-menu change is complete until the applicable `docs/template-review-checklist.md` is satisfied, the design brief is current, realistic data states are tested, and evidence is documented. Browser/device visual claims require browser/device evidence when available; otherwise mark the visual portion `UNKNOWN` and state the exact evidence needed later. Do not use HTTP 200, source inspection, or unit tests as proof of visual success.

## Engineering Rules
- Preserve existing architecture, routes, schemas, integrations, compatibility layers, naming, typing, and error-handling conventions.
- Prefer small, focused, reversible changes; no unrelated refactors or rewrites.
- Preserve backward compatibility unless the task explicitly requires a breaking change.
- Reuse existing utilities and dependencies.
- For UI work, consider semantic structure, RTL/mobile responsiveness, keyboard access, accessibility, and clear error/loading states.
- For data/backend work, preserve tenant and branch isolation, validate external/user input, handle failure paths, and keep authorization server-side.

## Security and Privacy
- Never commit or expose secrets, credentials, tokens, private data, or sensitive logs.
- Never trust client-supplied identity, tenant, role, or privilege.
- Never weaken authentication, authorization, RLS, tenant isolation, branch isolation, validation, secrets, or privacy boundaries to make tests/builds pass.
- Avoid telemetry or external data sharing unless required and reviewed.

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
- `npm run qa:template`
- `npm run performance:audit`

If a check cannot run, record the exact command, reason, alternative evidence, and remaining risk. Never claim success without evidence.

## Git and Change Discipline
- `main` is canonical unless repository workflow explicitly requires another branch.
- Keep commits task-focused and concise.
- Inspect status, recent history, relevant diffs, and changed files before/after work when tooling permits.
- Never rewrite history, force-push, or discard other work without explicit authorization.
- Every changed line must belong to the current atomic task.

## Continuity Contract
At the end of every session, update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; update `SESSION_PROTOCOL.md` whenever workflow rules change. Append a dated session log to `PROJECT_STATE.md`. Record current commit/state, files changed, commands/results, known issues/blockers, uncertainty, and exactly one next task. Keep continuity files consistent. Do not mark `DONE` without direct evidence.

## Debugging and Incidents
Reproduce when possible → isolate the smallest failing surface → inspect code/tests/config/logs/history → identify root cause → apply the smallest reversible fix → rerun the failing check → run broader applicable gates → review the diff. Treat visual covering layers as rendering/stacking problems first and inspect DOM structure, positioning/sizing, stacking contexts, pseudo-elements, animation/paint timing, responsive constraints, then targeted z-index changes.

## Preserve Completed Work
Completed functionality is protected. Do not rebuild, replace, remove, or regress completed features for convenience. Do not restart the project. Existing routes, server integrations, public preview paths, migrations, and compatibility paths remain protected unless the current task provides evidence that a targeted correction is required.

## Definition of Done
A task is `DONE` only when the requested behavior is implemented, the diff is task-scoped, relevant verification passes or an evidence-backed exception is documented, applicable security/privacy/performance/accessibility/maintainability review is complete, and continuity state is updated. No unresolved blocker or unknown may be hidden behind `DONE`.

## Blockers and Ambiguity
Do not guess. If blocked by missing information, permissions, dependencies, environment, or external services, mark `BLOCKED`. Missing facts are `UNKNOWN`; derived conclusions are `INFERRED`; recommendations are `PROPOSED`.

## Session Triggers
`[BOOT]` read state and inspect git → `[PROVE]` find evidence → `[SCOPE]` one atomic task → `[RESEARCH]` reliable sources → `[DESIGN]` compatible solution → `[BUILD]` focused implementation → `[TEST]` verify → `[SECURE]` review → `[DIFF]` inspect → `[STATE]` update continuity → `[STOP]` stop.
