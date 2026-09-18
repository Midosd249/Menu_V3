# Menu V3 — Master Execution Plan & Continuity Contract

## 0. Purpose
This document is the durable execution contract for Menu V3. Its purpose is to make the project resumable from any future chat/session without depending on chat memory, screenshots, stale prompts, or undocumented assumptions.
It defines the product direction, exact execution methodology, phase boundaries, dependencies, anti-regression rules, research and specialist routing, evidence requirements, Git/PR/release discipline, continuity requirements, stop conditions, and recovery procedure.

## 1. Source of Truth Hierarchy
Use this order when sources disagree:
1. Current repository code on the verified canonical branch.
2. Current database/schema/migration evidence.
3. Current automated tests and CI evidence.
4. Current Git history, branch, commit, diff, and PR evidence.
5. Direct deployment/runtime evidence.
6. Current repository continuity documents.
7. Current project-memory documents.
8. Current connected-tool evidence.
9. Current authoritative external documentation/research.
10. Previous chat messages, screenshots, old reports, and remembered plans.
A lower-ranked source must never silently override higher-ranked evidence.

### Evidence labels
- VERIFIED — directly confirmed by code, test, Git, database, browser/device evidence, connected source, or authoritative documentation.
- INFERRED — logically derived from verified evidence but not directly observed.
- PROPOSED — recommendation or design choice not yet proven.
- UNKNOWN — evidence is insufficient.
- BLOCKED — progress cannot continue because of a hard dependency, permission, environment, or platform constraint.
- TODO — planned work not started.
- IN_PROGRESS — the single active execution task.
- DONE — complete with required evidence.
- CLOSED — milestone complete and verified.
- IMPLEMENTATION_IN_PROGRESS — runtime implementation is active and not locally verified.
- VERIFIED_LOCALLY — applicable local verification passed but release has not occurred.
- READY_TO_PUSH — verified release batch is ready for controlled remote integration.
- PUSHED — exists on the intended remote branch; this is not deployment evidence.
- DEPLOYED — direct Vercel evidence proves the intended production deployment.
- DEPLOYMENT_BLOCKED — release is blocked by Vercel/platform conditions.
- IMPLEMENTATION_BLOCKED — implementation is blocked by a hard technical dependency.
Never convert UNKNOWN or BLOCKED into VERIFIED by assumption.

## 2. Product Mission and Protected Scope
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS for restaurants and cafes, with public customer menus and internal restaurant-management surfaces.
The project is mature. The current strategy is gap closure, not rebuilding or uncontrolled feature expansion.
Protected completed capabilities include:
- bilingual Arabic/English and RTL/LTR;
- Essential, Editorial, Noir, Heritage/Taste, and Gallery themes;
- public menu, search, category navigation, product details, availability, cart, Quick Add, Item Notes, and order flow;
- variants/modifiers and required selections;
- server-side price/options/availability validation;
- public-order rate limiting and idempotency;
- Studio Orders, order status/history, and notifications;
- Menu Intelligence, Owner Intelligence, Growth Engine, Reports, and evidence-based upsell;
- guest profiles, loyalty, campaigns, feedback, and retention;
- AI provider routing, structured output, image/PDF ingestion, menu AI, and grounded Guest Assistant;
- self-serve registration/provisioning/recovery;
- subscriptions, entitlements, limits, Platform Admin, teams, branches, import, billing, and QR;
- SEO/local discovery, accessibility/performance contracts, CI, and release-only Vercel workflow.
Rule: a protected capability must not be rebuilt, replaced, removed, or duplicated unless new repository evidence proves a specific regression or missing boundary.

## 3. Current Verified Baseline
As of 2026-09-18:
- VERIFIED: canonical main = c3afb623559ea1d6e015a5abeb6a59ebc26a4f27.
- VERIFIED: PR #179 and PR #180 are merged.
- VERIFIED: PR #161, #174, and #176 are obsolete/superseded historical work.
- VERIFIED: the current repository contains completed PH-01 through PH-06 work and the protected systems above.
- VERIFIED: a current-code gap audit identified a small set of real remaining gaps.
- UNKNOWN: physical Android/iOS Production QA for the latest main.
- UNKNOWN: current Production environment-variable values.
- UNKNOWN: sufficient real R6 experiment exposure for directional outcome evaluation.
Documentation branch currently carrying this plan: docs/current-product-gap-audit-2026-09-18.
PR #190 is the documentation-only reconciliation PR. It is not a production deployment and does not prove that these documents are on main until merged.

## 4. Non-Negotiable Operating Principles
### 4.1 One source of truth
Before implementation, prove the current state from the repository. Never implement from a remembered description when the same fact can be checked in code, tests, Git, migrations, or configuration.
### 4.2 Prove absence before adding
For every proposed capability: search routes, components, domain/lib functions, database schema/migrations, tests, analytics/metric consumers, and useful Git history; inspect actual behavior; only then classify it as missing. If it exists, extend it.
### 4.3 Smallest complete change
Every implementation must solve the complete atomic problem, fit the existing architecture, be reversible, avoid unrelated refactors, preserve compatibility where practical, include focused regression coverage, and avoid unjustified dependencies.
### 4.4 Security boundaries are permanent
Never weaken authentication, authorization, RLS, tenant isolation, branch isolation, entitlements, subscription enforcement, server identity, server pricing, validation, privacy, secret handling, or data integrity.
### 4.5 No parallel architectures
Do not create a second analytics taxonomy, cart, order model, customer system, AI router, theme system, subscription model, notification system, authorization layer, or SEO system. Reuse existing contracts.
### 4.6 No accidental scope expansion
One session has one active atomic task. Newly discovered issues become documented findings, future tasks, or blockers; they do not silently become implementation scope.

## 5. Permanent Session Method
Every meaningful session follows: BOOT → PROVE → SCOPE → MEMORY → RESEARCH → DESIGN/ARCHITECTURE → BUILD → TEST → SECURITY → DIFF → STATE → STOP.
### BOOT
1. Identify repository and canonical branch.
2. Read applicable AGENTS.md.
3. Read PROJECT_STATE.md.
4. Read PLAN.md.
5. Read TASKS.md.
6. Read SESSION_PROTOCOL.md.
7. Read README and task-relevant docs.
8. Read docs/project-memory/problems-learned.md.
9. Read relevant specialist workflow documents.
10. Inspect current Git branch, recent history, relevant PRs, and diff evidence.
11. Verify current main SHA before relying on any continuity claim.
### PROVE
1. Locate the requested capability in current code.
2. Map entry points, routes, components, server functions, data models, tests, and consumers.
3. Check alternate names and existing equivalent behavior.
4. Compare implementation with the requested outcome.
5. Record contradictions as UNKNOWN until resolved.
### SCOPE
Record request classification, workflows, research depth, exact boundary, protected areas, risks, acceptance criteria, verification plan, affected systems, and explicit out-of-scope items. Only one task becomes IN_PROGRESS.
### MEMORY
Before complex work or repeated debugging, inspect project memory, apply matching detection checklists, avoid recorded wasteful approaches, and add a new lesson after a genuinely new hard problem is resolved.
### RESEARCH
Light: repository evidence plus directly relevant docs/tests and only minimal authoritative external research.
Focused: repository evidence, relevant connected tools, official references, maintained open-source examples, alternatives and tradeoffs.
Deep: repository evidence, relevant connected tools, authoritative external sources, alternatives, risks, rollback, and verification strategy.
Research must answer a concrete question. Do not browse merely to collect information.
### DESIGN / ARCHITECTURE
Before material implementation: define current contract, smallest extension, compatibility, security/privacy/data implications, migration needs, observability, rollback, tests, and manual/browser/device checks. Visual work also follows the Design Agent workflow.
### BUILD
Use a focused branch when appropriate. Change only task-relevant files. Reuse abstractions. Keep commits focused. Do not alter deployment configuration unless required. Do not trigger Vercel merely for development feedback.
### TEST
Run the smallest relevant checks first, then broader gates. Repository commands include npm install --no-audit --no-fund, npm run typecheck, npm test, npm run test:platform, npm run lint, npm run build, npm run check:auth, npm run db:migrate, npm run qa:template, and npm run performance:audit. Add browser/E2E/accessibility/security checks when applicable.
If a check cannot run, record the exact command, exact reason, alternative evidence, and remaining risk. Never claim success without evidence.
### SECURITY
For runtime/data tasks verify trusted server identity, tenant/branch ownership, authorization, RLS, input validation, price/entitlement authority, privacy, rate limiting, idempotency, failure behavior, and secret boundaries.
### DIFF
Inspect changed files and final diff. Confirm every changed line belongs to the task. Confirm no secrets/debug/generated/unrelated files were added.
### STATE
Update PROJECT_STATE.md, PLAN.md, TASKS.md, SESSION_PROTOCOL.md when workflow rules change, relevant audits/research notes, and project memory after new hard problems. Record date, current SHA, task, status, files, tests, PR/commit evidence, deployment evidence, UNKNOWN/BLOCKED, and exactly one next task.
### STOP
Stop when the atomic task is complete, the authorized milestone boundary is reached, or a hard blocker prevents safe continuation. Do not automatically start the next task.

## 6. Specialist Routing
The Principal Engineer is the orchestration point; the user does not need to name internal workflows.
- Research / Connected Tools: consequential, unfamiliar, external-knowledge-dependent, market-specific, security-sensitive, major design or architecture work.
- Design Agent: public menu, themes, layout, imagery, typography, RTL/LTR, responsive, customer conversion and visual quality.
- QA / Regression: runtime behavior, critical journeys, browser/E2E, accessibility, performance and regressions.
- Security / Data: auth, authorization, RLS, tenant/branch isolation, privacy, pricing, subscriptions, database and external actions.
- Release / Reliability: CI, Vercel, deployment, rollback and production evidence.
Use only workflows that materially improve the task.

## 7. Research and Connected-Tool Rules
1. Start with current repository evidence.
2. Dynamically inspect currently available connected capabilities when warranted.
3. Use only relevant, authorized, safe, materially useful sources.
4. Prefer read/search/analysis.
5. Prefer primary/official sources.
6. Use maintained open-source references when useful.
7. Do not copy proprietary code, assets, branding, layouts, screenshots, or text.
8. Never claim a tool/source was used when it was not.
9. Never claim unavailable access.
10. External writes, sends, deletes, publishes, purchases, deployments, or other side effects require explicit authorization and required confirmation.
11. Record material research using repository documentation conventions.

## 8. Current Gap Program — Exact Dependency Chain
The current plan is intentionally narrow: Journey truth → minimal missing instrumentation → outcome-linked intelligence → international boundary audit → shareability audit → release evidence.
### A.1 — Customer Journey & Event Truth Audit
Status: READY_FOR_AUTHORIZATION.
Boundary: audit only. No runtime implementation, schema migration, UI redesign, deployment, or unrelated refactor.
Exact procedure:
1. Verify current main.
2. Read continuity and project-memory documents.
3. Inventory every public menu route/template/theme.
4. Inventory every analytics emitter.
5. Inventory every analytics event name/payload.
6. Locate event recorder and persistence contract.
7. Inspect tables, migrations, constraints, indexes, retention and privacy assumptions.
8. Trace anonymous session creation and lifecycle.
9. Trace visit and QR events.
10. Trace search actions.
11. Trace category interactions.
12. Trace product-view events.
13. Trace add-to-cart actions.
14. Trace cart review/open actions.
15. Trace order submission.
16. Trace order creation and server-side validation.
17. Trace order status transitions and outcomes.
18. Trace return/revisit behavior if represented.
19. Trace Growth metric consumers.
20. Trace Owner Intelligence metric consumers.
21. Trace Reports consumers.
22. Trace R6 experiment assignment/exposure/variant/conversion/guardrail logic.
23. Check whether one action is emitted under multiple event names.
24. Check duplicate-event behavior.
25. Check failed-request behavior.
26. Check privacy and tenant/branch boundaries.
27. Check whether anonymous session IDs can safely cross menu→order.
28. Produce one gap matrix: implemented / duplicated / missing / unsafe / unknown.
29. Propose one minimal canonical journey event vocabulary only where evidence requires it.
30. State explicitly what remains unchanged.
31. Define the smallest possible A.2 implementation.
32. Stop.
A.1 acceptance: every current event has an identified emitter; every event has an identified consumer or explicit no-consumer finding; every journey step is classified; session/order linkage is classified; experiment semantics are preserved; duplicate/failure/privacy behavior is classified; no runtime code changes.
### A.2 — Minimal Journey Instrumentation
Dependency: A.1 complete.
1. Re-verify A.1 findings against the latest repository state.
2. Confirm no newer change already solved a finding.
3. Define the smallest compatible event additions.
4. Reuse existing persistence and naming conventions.
5. Add privacy-preserving anonymous session linkage only if proven necessary.
6. Keep identity, tenant, branch, pricing and entitlements server-authoritative.
7. Add focused unit/integration tests.
8. Add journey/regression coverage.
9. Verify R6 behavior is unchanged.
10. Verify failure and idempotency behavior.
11. Run applicable quality gates.
12. Review diff and continuity.
13. Stop.
Explicitly prohibited: wholesale analytics rewrite.
### A.3 — Outcome-Linked Owner Intelligence
Dependency: A.2 complete.
1. Inventory existing owner actions.
2. Inventory recommendation records.
3. Inventory existing outcome metrics.
4. Define the smallest action identifier/linkage needed.
5. Map action → intended metric → observed outcome.
6. Define attribution window and limitations.
7. Avoid causal claims when evidence is only directional/observational.
8. Reuse existing dashboards and surfaces.
9. Add UI only if a real workflow gap is proven.
10. Add tests, evidence, security/privacy review, and continuity.
11. Stop.
### A.4 — International Boundary Audit
Dependency: A.1; implementation only after explicit authorization.
Audit currency, subscription pricing, money formatting, phone normalization/validation, locale, RTL/LTR, timezone, business hours, tax presentation, payment providers, messaging channels, map/location providers, compliance adapters, and market-specific defaults.
Exact procedure:
1. Search hard-coded market assumptions.
2. Classify each as domain invariant, Saudi default, or market-dependent.
3. Identify adapter/configuration boundaries.
4. Identify unsafe coupling.
5. Define minimum abstraction boundary.
6. Verify Saudi behavior remains unchanged.
7. Do not implement broad international payments/compliance during the audit.
8. Produce a market-readiness matrix.
9. Stop.
### A.5 — Public Shareability / Deep-Link Audit
Dependency: A.1.
1. Inventory public routes.
2. Inventory query parameters and UI state.
3. Inspect canonical URLs.
4. Inspect hreflang.
5. Inspect robots/sitemap.
6. Inspect Restaurant structured data.
7. Inspect QR destinations.
8. Inspect product sharing.
9. Inspect category sharing.
10. Inspect copied/shared URLs after state changes.
11. Check refresh/direct navigation.
12. Decide whether dedicated product/category routes are actually necessary.
13. Add routes only if current architecture cannot meet a proven requirement.
14. Verify SEO/accessibility/analytics implications.
15. Stop.

## 9. Release Evidence Track
Release evidence is separate from feature development.
Pending: meaningful real R6 exposure, physical Android/iOS Production QA, current Production configuration evidence.
Rules: no synthetic experiment traffic; no Vercel iteration loop; do not infer production state from CI, preview, HTTP 200, or old deployments; record exact evidence and date.

## 10. Permanent Public Menu / Visual Gate
For public menu/theme work: inspect actual implementation and full journey; test small/standard/large mobile, tablet and desktop where relevant; Arabic RTL; English LTR; mixed direction; long/short restaurant and product names; long categories; SAR price lengths; missing/poor images; varied image ratios; missing descriptions; available/sold-out items; modifiers/options; sparse/dense categories; one/odd/many products; loading/empty/error/offline states where supported; hierarchy; touch targets; fixed/sticky/overlay stacking; safe areas; RTL/LTR alignment; accessibility; performance; SEO. Never claim browser/device success without browser/device evidence.

## 11. Release-Only Vercel Policy
Normal flow: LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER/VISUAL QA → TESTS → CI QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MAIN → ONE PRODUCTION DEPLOYMENT → REAL-DEVICE QA → RECORD RESULT.
Vercel is not a development loop. Preview deployments are exceptions. Before deployment decisions inspect actual Vercel Usage/Billing evidence. Never randomly retry builds/redeploys. CI success is not deployment evidence. DEPLOYED requires direct Vercel evidence. If Vercel is blocked, record DEPLOYMENT_BLOCKED. If production breaks and an eligible healthy previous deployment exists, Instant Rollback may contain the incident, then fix forward normally.

## 12. Git / PR Discipline
1. Verify base SHA.
2. Create focused branch when appropriate.
3. Keep task-scoped commits.
4. Inspect diff before PR.
5. Run quality gates.
6. Create one coherent PR/release batch.
7. Do not merge without required evidence and authorization.
8. After merge, verify the new main SHA.
9. Only then consider production release.
10. After deployment, verify Vercel production commit and perform real-device QA.
Never force-push or rewrite history without explicit authorization.

## 13. Rollback / Incident Procedure
Reproduce when possible → isolate smallest failing surface → inspect code/tests/config/history/logs → compare project memory → identify root cause → smallest reversible fix → rerun failing check → broader gates → final diff → update memory if new → update continuity → stop.
For visual covering-layer issues, inspect DOM, positioning, sizing, stacking contexts, pseudo-elements, animation/paint timing, and responsive constraints before changing z-index.

## 14. New-Chat / Interrupted-Session Recovery
1. Verify current main SHA.
2. Read AGENTS.md.
3. Read this master plan.
4. Read PROJECT_STATE.md, PLAN.md, TASKS.md, SESSION_PROTOCOL.md.
5. Read task-relevant docs and project memory.
6. Inspect open PRs and recent commits.
7. Identify the exact task marked as current next task.
8. Verify it was not already completed by a newer commit/PR.
9. Reconcile stale documentation before implementation.
10. Report current verified position.
11. Continue only with the single documented task.
If the previous chat ended unexpectedly, never assume unfinished code. Inspect Git/PR/CI evidence and classify the state. If a tool fails, record the failed operation, use an authorized alternative if available, and mark UNKNOWN/BLOCKED when evidence remains unavailable.
If chat context is lost, this repository contract is the recovery mechanism. Current code/Git/CI/deployment evidence still outranks this document. The exact next task in continuity is the only automatic resume target.

## 15. Completion Contract
A task may be DONE only when requested scope is complete, no hidden scope expansion occurred, relevant tests passed or documented exceptions exist, applicable security/privacy/accessibility/performance/browser review is complete, final diff is reviewed, continuity is synchronized, UNKNOWN/BLOCKED items are explicit, and exactly one next task is recorded. Deployment status is always separate.

## 16. Exact Current Next Task
A.1 — Customer Journey & Event Truth Audit.
Status: READY_FOR_AUTHORIZATION.
Boundary: audit only; no runtime implementation; no schema migration; no UI redesign; no deployment; no unrelated refactor.
A.1 is the only task that may automatically resume from a new chat unless current repository evidence proves it has already been completed or the user explicitly changes scope.

## 17. Final Rule
Never optimize for appearing productive. Optimize for preserving the correct repository state, proving the next smallest necessary change, and leaving enough evidence that another session can continue without guessing.