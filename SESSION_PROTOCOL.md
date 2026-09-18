# SESSION_PROTOCOL

## Canonical Detailed Runbook

The durable, detailed execution and recovery contract is maintained in docs/master-execution-plan.md.

This file remains the operational session protocol index. Before meaningful work:
1. Read AGENTS.md.
2. Read docs/master-execution-plan.md.
3. Read PROJECT_STATE.md.
4. Read PLAN.md.
5. Read TASKS.md.
6. Read this SESSION_PROTOCOL.md.
7. Read README and task-relevant documentation.
8. Read docs/project-memory/problems-learned.md.
9. Read relevant specialist workflow documents.
10. Verify current main SHA and current Git/PR/CI evidence.

If any continuity document conflicts with current code/Git, stop and reconcile the documentation before implementation.

## Start

1. Treat main as the source of truth.
2. Classify the request.
3. Select only relevant internal workflows.
4. Set Light, Focused, or Deep research according to risk.
5. Define one atomic task and explicit boundary.
6. Record risks, acceptance criteria, and verification plan.
7. Prove whether the requested capability already exists before adding anything.

## Permanent Workflow

BOOT → PROVE → SCOPE → MEMORY → RESEARCH → DESIGN/ARCHITECTURE → BUILD → TEST → SECURITY → DIFF → STATE → STOP.

The master execution plan contains the detailed procedure for every stage.

## Permanent Release-Only Vercel Workflow

LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT.

Vercel is a release platform, not a development loop. Preview deployments are exceptions. Never claim DEPLOYED without direct Vercel evidence. Before deployment decisions inspect actual Vercel Usage/Billing evidence. Do not retry builds/redeploys randomly.

## Specialist Routing

- Research / Connected Tools: consequential, unfamiliar, external-knowledge-dependent, market-specific, security-sensitive, architecture or major design work.
- Design Agent: public menu, themes, imagery, layout, typography, RTL/LTR, responsive and visual quality.
- QA / Regression: runtime behavior, critical journeys, browser/E2E, accessibility, performance and regression risk.
- Security / Data: auth, authorization, RLS, tenant/branch isolation, privacy, pricing, subscriptions and database.
- Release / Reliability: CI, Vercel, deployment, rollback and production evidence.

The user remains the sole human owner and primary developer. Specialist roles are internal AI workflows.

## Work Rules

- Preserve completed work.
- Prove absence before adding capabilities.
- Extend existing contracts; do not create parallel architectures.
- One atomic task per session.
- Do not weaken auth, authorization, RLS, tenant/branch isolation, entitlements, pricing, validation or privacy.
- Use realistic data for relevant UI/public-menu work.
- Run applicable verification and record failures/limitations precisely.
- Review final diff.
- Update continuity and stop.

## Current Gap Program

A.1 Journey & Event Truth Audit → A.2 Minimal Journey Instrumentation → A.3 Outcome-Linked Owner Intelligence.

A.4 International Boundary Audit and A.5 Public Shareability / Deep-Link Audit are separate audit tracks.

Release evidence remains separate from feature development.

## Current Exact Next Task

A.1 — Customer Journey & Event Truth Audit.

Boundary:
- audit only;
- no runtime implementation;
- no schema migration;
- no UI redesign;
- no deployment;
- no unrelated refactor.

## Recovery From New Chat / Interrupted Session

1. Verify current main SHA.
2. Read the master execution plan.
3. Read all continuity files.
4. Inspect open PRs and recent commits.
5. Verify whether the documented next task is already completed.
6. Reconcile stale documentation.
7. Resume only the single documented task.
8. If evidence is missing, classify UNKNOWN or BLOCKED rather than guessing.

## Stop Rule

Do not automatically begin the next task. At the end of the session record exact state, evidence, files, tests, deployment status, UNKNOWN/BLOCKED items, and exactly one next task.

## Status Labels

Use VERIFIED, INFERRED, PROPOSED, UNKNOWN, BLOCKED, TODO, IN_PROGRESS, DONE, CLOSED, IMPLEMENTATION_IN_PROGRESS, VERIFIED_LOCALLY, READY_TO_PUSH, PUSHED, DEPLOYED, DEPLOYMENT_BLOCKED, and IMPLEMENTATION_BLOCKED according to their defined meanings in the master execution plan.
