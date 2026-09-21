# Menu V3 — Release-Only Vercel Workflow

## Purpose
This document defines the permanent release and deployment policy for Menu V3. Vercel is a release platform, not the normal development or design-iteration environment. The objective is to keep visual work fast and local, keep `main` stable and deployable, reduce unnecessary deployments/build usage, and preserve a clear distinction between implementation evidence and production deployment evidence.

## Local development and visual QA workflow
The default workflow is:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Local work is the normal environment for:
- CSS and theme refinement.
- Typography, spacing, card layout, hierarchy, and composition.
- Arabic RTL, English LTR, and mixed-direction behavior.
- Responsive behavior and ordinary animations.
- Browser-based visual inspection and interaction checks.
- Realistic-data, empty/loading/error, accessibility, and performance checks that can be reproduced locally.

**Exact rule: visual CSS/theme iteration must not require Vercel deployment.**

When a local workflow is available, use a milestone/release branch and local commits as safe checkpoints. A local checkpoint does not imply that it should be pushed immediately.

## GitHub Actions quality-gate workflow
Before merging a release batch to `main`, run the repository's applicable quality gates. The gate must cover, as applicable:
- Unit, integration, and E2E tests.
- Typecheck and lint.
- Production build.
- Browser/template QA and visual regression evidence.
- Accessibility.
- Mobile/responsive behavior.
- Arabic RTL, English LTR, and mixed-direction content.
- Public menus and critical customer flows.
- Security, authentication/authorization, tenant/branch isolation, and input validation.
- SEO and supported external actions.
- Database/migration safety where the task touches persistence.
- Final diff review.
- Continuity-file consistency.
- A known rollback point for release-risk changes.

GitHub Actions success is quality evidence only. **CI success does not prove that Vercel production is deployed or healthy.** Production state must be confirmed from direct Vercel evidence.

## Branch and release-batch policy
- `main` must remain stable and deployable.
- Use dedicated milestone/release branches when a local workflow is available.
- Keep local commits focused and reversible; they are safe checkpoints.
- Do not push every small implementation change merely to obtain visual feedback.
- A release is a coherent, verified batch, not a sequence of unrelated visual pushes.
- Merge to `main` only after the applicable local and GitHub quality gates pass and the final diff is reviewed.
- Production deployment is performed once for the coherent merged release batch unless a documented platform or operational reason requires otherwise.

## Preview Deployment exception policy
Vercel Preview Deployments are exceptions only. They are permitted when local verification cannot prove deployment-specific behavior, including:
- Production-like environment variable behavior.
- Third-party integrations that cannot be reproduced locally.
- Domain, routing, edge, or platform-specific behavior.
- Deployment-specific runtime behavior.
- Sharing a stable candidate with an external reviewer when local access is insufficient.
- Significant release risk that requires production-like infrastructure to verify.

Before using a Preview Deployment, record:
1. Why local verification is insufficient.
2. The exact behavior being tested.
3. The branch and commit under test.
4. Explicit success criteria.

Preview Deployments are **not** for ordinary CSS, typography, spacing, theme, RTL, responsive, or small visual changes.

## Production release policy
A production deployment may happen only after the complete release batch has passed its applicable verification gates and has been merged to `main`.

Rules:
1. Use one intentional Vercel production deployment for the coherent release batch.
2. Do not trigger repeated deployments for visual iteration.
3. Do not retry `Redeploy` or failed builds randomly.
4. A retry requires a documented reason and a changed condition or confirmed transient platform issue.
5. Keep implementation status separate from deployment status.
6. Never claim `DEPLOYED` without direct Vercel evidence showing the intended production deployment/commit.
7. After deployment, perform real-device production QA and record the result.

## Vercel quota/rate/build-block handling
Before any future deployment-related decision, inspect the actual Vercel **Usage/Billing** page and determine which resource is limited or blocked.

If Vercel is quota-limited, rate-limited, paused, unavailable, or blocked by a build/platform condition:
- Do not retry randomly.
- Record `DEPLOYMENT_BLOCKED`.
- Record the exact blocker and available evidence.
- Do not claim that Production equals `main`.
- Preserve verified work as `VERIFIED_LOCALLY` or `READY_TO_PUSH` when justified.
- Continue local work only when it does not depend on the blocked deployment.

Do not treat a preview, an old deployment, or a successful CI run as proof that the current `main` is serving production.

## Status definitions
| Status | Meaning |
| --- | --- |
| `IMPLEMENTATION_IN_PROGRESS` | Implementation work is active and not yet locally verified. |
| `VERIFIED_LOCALLY` | Applicable local verification has passed; the work is not yet released. |
| `READY_TO_PUSH` | The verified release batch is ready for controlled push/merge. |
| `PUSHED` | The release batch exists on the intended remote branch; this is not deployment evidence. |
| `DEPLOYED` | Direct Vercel evidence confirms the intended production deployment. |
| `DEPLOYMENT_BLOCKED` | Vercel deployment is blocked by quota, rate limit, pause, build, availability, or platform conditions. |
| `IMPLEMENTATION_BLOCKED` | Implementation is blocked by a hard technical, permission, dependency, or environment constraint. |
| `DONE` | The task is complete with explicit evidence and continuity records; no unresolved blocker or unknown is hidden. |

## Rollback process
If production is broken after a release:
1. Confirm the failure with direct production evidence.
2. Use Vercel **Instant Rollback** only when an eligible previous production-serving healthy deployment exists.
3. Record the rollback target and the reason.
4. Do not delete or invalidate the rollback target.
5. Treat rollback as containment, not the final fix.
6. Fix the issue through the normal local verification → quality gates → coherent release batch → `main` → production workflow.

Not every Preview Deployment is an eligible rollback target. Do not assume rollback eligibility without platform evidence.

Urgent production outages, critical security/privacy issues, and data-loss fixes are the only release-process exception. The exception must be narrowly scoped, documented, verified, and followed by a return to the normal release workflow.

## Manual Vercel Dashboard checks
Before making any deployment-related decision, inspect the Vercel Dashboard directly and record, as applicable:
- Current production deployment and its commit SHA.
- Deployment state (`READY`, failed, paused, etc.).
- Branch and commit associated with the deployment.
- Usage/Billing limits and the specific resource involved.
- Any rate-limit, build, account, or platform message.
- Whether Deployment Protection or environment-specific behavior affects the evidence.
- Whether the intended release commit is actually the production-serving deployment.

Do not infer production state from GitHub Actions, a Preview URL, a deployment URL, HTTP 200 alone, or an old production deployment.

## Release evidence record
For every production release, continuity records should capture:
- Main/release commit SHA.
- Release commit message.
- Relevant GitHub Actions quality run and result.
- Vercel production deployment ID and status.
- Vercel deployment commit SHA.
- Whether the Vercel production commit matches the intended `main` release.
- Real-device production QA result.
- Any remaining `UNKNOWN` or `BLOCKED` evidence.
- Rollback target, if rollback was used.

This record keeps implementation, CI, deployment, and runtime evidence distinct and auditable.
