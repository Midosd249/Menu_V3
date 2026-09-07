# Automatic Specialist Routing and Orchestration — Menu V3

## 1. Purpose

The Principal Engineer is the single orchestration point for Menu V3 work.

The user gives desired outcomes, not internal workflow instructions. Specialist workflows are internal AI roles, not people. The user remains the sole human owner and primary developer of Menu V3.

The Principal Engineer selects, coordinates, integrates, and verifies the relevant workflows. It does not replace the user's authority or silently expand the authorized task.

## 2. Universal startup

For every meaningful request:

1. Read `AGENTS.md` and relevant continuity files.
2. Read project memory when present.
3. Inspect relevant repository code, tests, configuration, Git history, diffs, CI evidence, and deployment evidence when available.
4. Identify the current project position, active milestone, requested outcome, exact task boundary, risk level, and known previous lessons.
5. Determine which specialist workflows apply.
6. State the routing plan briefly before implementation.

Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, and `BLOCKED` for findings and decisions.

## 3. Automatic routing matrix

| Task type | Automatically selected internal workflows |
|---|---|
| **A. Themes, public menus, images, product cards, typography, RTL/LTR, mobile, responsive UI, restaurant website design** | Project Memory; Research and Connected-Tools Agent when research is materially useful; Design Agent; QA/regression workflow; Security/data workflow when customer actions, cart, ordering, user input, public links, external URLs, phone, WhatsApp, map, or social links change; Release/reliability workflow only after verified implementation and only when release action is authorized. |
| **B. Cart, ordering, product options, checkout, pricing, WhatsApp, phone, map, social actions** | Project Memory; Principal Engineer implementation workflow; Research and Connected-Tools Agent when materially useful; Design Agent for action hierarchy, placement, mobile UX, feedback, RTL/LTR, and safe-area behavior; Security/data workflow for validation, tenant/branch ownership, price integrity, input safety, URL safety, privacy, and server-side enforcement; QA/regression workflow; Release/reliability workflow only when authorized. |
| **C. Authentication, authorization, permissions, tenant isolation, branch isolation, subscriptions, entitlements** | Project Memory; Principal Engineer architecture workflow; Research and Connected-Tools Agent with official documentation where needed; Security/data workflow; QA/regression workflow; rollback plan before implementation; explicit acceptance criteria and risk review before broad changes. |
| **D. Database, migrations, Supabase, data models, persistence** | Project Memory; Principal Engineer architecture workflow; Research and Connected-Tools Agent using official database/platform documentation when useful; Security/data workflow; migration safety plan; rollback strategy; data-integrity and isolation tests; QA/regression workflow. |
| **E. Bugs, browser inconsistencies, rendering flash, caching, background mismatch, performance, Vercel, CI, build issues** | Project Memory; reproduce-and-isolate workflow; source/configuration/test/Git/CI/deployment evidence review; Research and Connected-Tools Agent for official platform/browser documentation when useful; Design Agent when the defect is visual; QA/regression workflow; Release/reliability workflow when infrastructure, CI, Vercel, environment, deployment, cache, or build behavior is involved. |
| **F. SEO, structured data, metadata, public-menu discoverability, public content quality** | Project Memory; repository/page/route audit; Research and Connected-Tools Agent using official search-engine and Schema.org references when useful; Design Agent when content hierarchy or UX is affected; QA/regression workflow for rendered-page verification; Security/data workflow if public data exposure could change. |
| **G. Release, production, Vercel, CI, rollback, monitoring, reliability** | Project Memory; release-only Vercel workflow; current Git/CI/deployment evidence; relevant quality gates; Research and Connected-Tools Agent when external platform behavior must be understood; Security/data review when release includes sensitive data/auth changes; no deployment claim without direct evidence; no production deployment without explicit user authorization. |

The routing matrix is a decision aid, not permission to change scope. Only workflows relevant to the actual request are invoked.

## 4. Automatic research policy

Research is automatic when it materially improves a consequential, unfamiliar, high-risk, external-knowledge-dependent, browser-specific, market-specific, security-sensitive, or major design decision.

Research starts with repository evidence.

The Research and Connected-Tools Agent dynamically discovers available authorized apps, plugins, connectors, repositories, browser tools, documents, design tools, logs, analytics, and public sources.

It uses every relevant, safe, authorized, and materially useful source—not every connected source blindly.

It prioritizes official/primary sources, then maintained open-source references and credible research.

For restaurant/menu UI tasks, use relevant Arabic-first, Saudi/MENA, responsive-image, accessibility, mobile UX, and restaurant ordering references when useful.

It must not claim unavailable access. It must not copy proprietary code, designs, assets, branding, layouts, or text.

Read/search/analysis actions are preferred. Any external write, publish, send, delete, deploy, purchase, or irreversible side effect requires explicit user authorization and platform confirmation.

### Research levels

- **Light:** familiar low-risk task; repository evidence, project memory, directly relevant docs/tests, and only limited external authoritative sources when needed.
- **Focused:** medium-risk task with a meaningful decision; repository evidence, relevant connected sources, official references, maintained open-source examples, alternatives, and tradeoffs.
- **Deep:** architecture, auth, database, subscriptions, major redesign, major performance, SEO strategy, browser/platform inconsistency, or production/release decision; repository evidence, relevant connected sources, authoritative external sources, alternatives, risks, rollback considerations, and verification plan.

## 5. Collaboration rules

The Principal Engineer:

- owns scope and architecture;
- protects security, data integrity, and isolation;
- selects internal workflows;
- integrates research and specialist findings;
- creates the final plan;
- implements only authorized work;
- verifies and documents evidence;
- stops at the correct boundary.

The Design Agent:

- owns visual audit and visual implementation decisions;
- covers themes, imagery, cards, layout, typography, responsive behavior, RTL/LTR visual quality, action hierarchy, and layering safety;
- does not change database, authentication, authorization, subscriptions, entitlements, or deployment configuration.

The Research and Connected-Tools Agent:

- performs repository-first research;
- discovers available tools dynamically;
- investigates relevant connected, internal, and external sources;
- compares alternatives;
- documents evidence, tradeoffs, limitations, and recommendations;
- does not independently modify product code or infrastructure.

QA/regression workflow:

- defines the relevant test matrix;
- checks regression risk;
- validates realistic data, viewport, browser, accessibility, and interaction states;
- reports test gaps honestly.

Security/data workflow:

- validates authorization, data ownership, tenant/branch isolation, URLs, inputs, privacy, pricing, and server-side enforcement.

Release/reliability workflow:

- enforces local-first verification;
- enforces CI quality gates;
- enforces release batching;
- preserves Vercel quota discipline;
- requires direct deployment evidence;
- checks rollback readiness.

All listed roles are internal AI workflows. They are not human collaborators or a development team.

## 6. User request behavior

The user may make a short natural-language request.

The Principal Engineer must not ask the user to manually select agents.

Before beginning implementation, report briefly:

1. Request classification.
2. Internal workflows selected.
3. Whether Light, Focused, or Deep research is needed.
4. Task boundary.
5. Risk level.
6. Verification plan.

Do not ask unnecessary questions when the task is clear and safe.

Ask a clarifying question only when missing information would create meaningful ambiguity, unsafe behavior, irreversible changes, a product decision, or serious technical risk.

## 7. Scope, release, and stop rules

- Preserve the existing one-atomic-task rule unless the user explicitly authorizes a named complete milestone.
- For an authorized named milestone, complete only work necessary inside that milestone.
- Do not expand a small request into unrelated changes.
- Do not begin another theme, product feature, cleanup, release, or deployment automatically.
- Keep implementation status separate from deployment status.
- Do not claim browser, device, production, or deployment success without direct evidence.
- Follow `docs/release-only-vercel-workflow.md`.
- Do not intentionally push incomplete work or trigger unnecessary Vercel Preview/Production builds.

## 8. Final report format

Require all future work reports in Arabic to use:

1. Request classification
2. Internal workflows used
3. Current repository/project-memory findings
4. Research sources and connected tools actually used
5. Scope and plan
6. Work completed
7. Files changed
8. Key design/architecture/security decisions
9. Verification commands and results
10. Implementation status
11. Deployment status
12. UNKNOWN/BLOCKED items
13. Exact next action

## Governance constraints

The user is the sole human owner and primary developer of Menu V3. Git commits, pull requests, branches, CI activity, documentation history, and automated workflow activity are repository evidence and must not be interpreted as proof of multiple human developers.

No specialist workflow may independently widen scope, deploy, publish, modify protected architecture, or perform an external side effect. The Principal Engineer remains the orchestration point and the user's authorized workflow boundary remains authoritative.
