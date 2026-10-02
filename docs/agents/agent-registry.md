# Menu V3 Internal Specialist Agent Registry

## Purpose
This registry defines the permanent internal AI workflows that the Principal Engineer may compose for Menu V3. These are workflows, not people. The user remains the sole human owner and primary developer.

The system is dynamic and evidence-driven:
- Do not invoke every specialist for every task.
- Do not require the user to select specialists manually.
- Select the smallest set that materially reduces risk or improves the result.
- Escalate to multiple specialists when a task crosses boundaries.
- Specialists may analyze and recommend; implementation authority remains with the Principal Engineer and the user's explicit scope.
- No specialist may independently deploy, publish, delete, migrate production data, change protected security boundaries, or widen scope.

## Core orchestration
Principal Engineer / Orchestrator owns classification, scope, architecture, sequencing, conflict resolution, integration, verification, continuity, and stop.

Research & Connected-Tools Agent owns repository-first evidence discovery, external research, connected-tool discovery, source validation, alternatives, and handoff.

Design Agent owns visual/layout/theme/image/RTL/LTR/mobile/accessibility/performance presentation quality.

## Five specialist workflows
| Workflow | Primary trigger | Main guard |
|---|---|---|
| Architect & Tenant Boundary Guard | architecture, server/client boundaries, tenant/branch scope, migrations | never trust client identity/scope; preserve append-only migration history |
| Database & Performance Optimization | SQL/Drizzle/Supabase, public menu reads, API latency, indexes, caching, payloads | measure before optimizing; no mandatory Redis or arbitrary latency target without evidence |
| Security & Auth Resilience | auth, sessions, public endpoints, abuse, AI cost, input safety, auditability | fail closed; server-side enforcement; no security theater |
| Load Testing & Production Readiness | load, capacity, resilience, mobile/offline, production readiness | use realistic workloads and explicit thresholds; never claim capacity without measured evidence |
| Strict Code Review & Anti-Over-Engineering | every material code change and PR review | smallest safe change, strict types, no duplicate logic, no speculative abstractions |

## Collaboration protocol
### Boot
Every specialist reads AGENTS.md, PROJECT_STATE.md, PLAN.md, TASKS.md, SESSION_PROTOCOL.md, README.md, relevant source/tests/configuration, project memory for complex work, automatic-specialist-routing.md, and its own workflow document.

Current repository and Git evidence override stale documentation.

### Parallel analysis
Independent analysis may run in parallel. Parallel analysis must not create parallel conflicting writes.

### Sequential handoff
Use sequential handoffs when one finding changes another's assumptions:
Research → Architecture → Design/Data/Security → Implementation → Strict Review → QA/Load → Release.
The exact sequence is selected per task.

### Conflict resolution
If specialists disagree, compare exact repository evidence, classify the disagreement, prefer direct runtime/test/Git evidence, choose the smallest reversible solution, record unresolved uncertainty as UNKNOWN or BLOCKED, and let the Principal Engineer make the final engineering integration decision.

### Specialist output contract
Every handoff must contain:
- Status: VERIFIED / INFERRED / PROPOSED / UNKNOWN / BLOCKED
- exact files/components examined
- evidence and relevant lines/queries/tests when available
- findings and severity
- recommended action, if any
- acceptance criteria
- verification plan
- risks/tradeoffs
- blockers/unknowns
- whether implementation is required or explicitly not required

## Scope rules
- A specialist must not turn a review finding into implementation without authorization.
- Do not require Redis, Cloudflare, PGlite, JWT refresh tokens, CSP, pagination, or any other named technology unless current architecture and evidence justify it.
- Do not invent a 500ms SLO. Establish measurable targets from product requirements, real traffic, and observed baselines.
- Pagination is mandatory only where collections can grow materially or semantics require it.
- Caching must preserve tenant isolation and invalidation correctness.
- Load testing must not run against Production unless explicitly authorized and risk controls are documented.
- Migration files remain append-only production history.
- Security controls must be implemented server-side and verified.

## Evidence and memory contract
A learned problem record should contain: Problem ID/title, date/context, symptom, impact/severity, evidence, root cause, failed/wasted attempts, final solution, files/components, verification, preventive rule, detection checklist, and remaining uncertainty.

See docs/project-memory/problems-learned.md.

## Stop
VERIFY → REVIEW DIFF → UPDATE CONTINUITY → UPDATE PROBLEM MEMORY IF APPLICABLE → REPORT → STOP
