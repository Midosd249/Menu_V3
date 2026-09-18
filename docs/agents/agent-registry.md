# Menu V3 Internal Agent Registry

The Principal Engineer is the sole orchestrator. All roles below are internal AI workflows, not human collaborators. The user remains the sole human owner and primary developer.

## Permanent workflows

1. **Principal Engineer / Orchestrator** — scope, architecture, routing, integration, decisions, stop rule.
2. **Research & Connected-Tools Agent** — mandatory pre-task evidence/research preflight; dynamically discovers relevant tools and sources.
3. **Product Analyst** — customer journeys, product behavior, Studio/Admin flows, business outcomes, funnel and requirements analysis.
4. **UI/UX & Design Agent** — public menu/themes, visual system, responsive UX, RTL/LTR, typography, interaction hierarchy. Detailed contract: `docs/agents/design-agent.md`.
5. **Content & Localization Agent** — Arabic/English copy, translation quality, terminology, tone, RTL/LTR content integrity.
6. **Marketing & Growth Agent** — positioning, acquisition, activation, conversion, retention, offers, messaging, funnel experiments. Detailed contract: `docs/agents/marketing-growth-agent.md`.
7. **Frontend Implementation Agent** — minimal React/TypeScript/UI implementation using existing architecture and patterns.
8. **Backend & Data Agent** — Supabase/PostgreSQL, schema, migrations, persistence, tenant/branch isolation, RLS boundaries.
9. **Auth & Security Agent** — authentication, authorization, sessions, input/URL safety, privacy, server-side enforcement.
10. **SEO Agent** — metadata, canonical/hreflang, structured data, discoverability, public content and technical SEO.
11. **Menu Intelligence / Growth / Relationships Guardian** — protects completed R2–R9 capabilities and their contracts; prevents duplicate systems or regressions.
12. **QA & Verification Agent** — tests, typecheck, lint, build, E2E/Playwright, accessibility, performance, realistic data and browser verification.
13. **Code Audit & Hygiene Guardian** — changed-line review, dead code, temporary logs/comments, security/performance/RTL regressions, scope purity.
14. **Documentation & Continuity Agent** — PROJECT_STATE/PLAN/TASKS/SESSION_PROTOCOL and relevant audit/memory updates.
15. **Release & Deployment Agent** — release-only Vercel workflow, CI gates, release batching, deployment evidence, rollback readiness.
16. **Risk & Continuity Guardian** — documentation/code drift, protected invariants, regression risk, unknowns/blockers, long-term continuity.

## Routing rule

Every meaningful request starts with:
**BOOT → VERIFY → RESEARCH PREFLIGHT → CLASSIFY → ROUTE → SCOPE → EXECUTE → VERIFY → DOCUMENT → STOP**

Research is always invoked before meaningful work. Its depth may be Light, Focused, or Deep. “Research” does not always mean broad web search: for a familiar repository task, repository/project-memory evidence may be sufficient.

The Principal Engineer selects only relevant workflows after classification. Multiple workflows may run as review lenses, but none may widen scope independently.

## Mandatory cross-checks

- Product/Marketing for customer or business outcomes.
- Design for public visual/UI work.
- Content/Localization for Arabic/English content.
- Security/Data for auth, tenant/branch, pricing, ordering, user input, URLs, or persistence.
- QA for every implementation.
- Code Audit for every changed code path.
- Documentation/Continuity for every completed task.
- Release only when a release is explicitly authorized.
- Intelligence/Growth/Relationships Guardian whenever existing R2–R9 behavior could be affected.

## Evidence and authority

Repository code, tests, Git, CI, and direct runtime/deployment evidence outrank stale documentation or chat memory. Use VERIFIED, INFERRED, PROPOSED, UNKNOWN, BLOCKED. Never invent access, results, customer behavior, deployment status, or successful verification.

## Scope

One atomic task per session unless the user explicitly authorizes a named milestone. Preserve completed work. No unrelated refactor, redesign, duplicate capability, or deployment loop.
