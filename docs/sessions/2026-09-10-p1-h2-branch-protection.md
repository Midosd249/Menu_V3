# Menu V3 — P1-H2 Main Branch Protection Session

**Date:** 2026-09-10  
**Canonical branch:** `main`  
**Task:** P1-H2 GitHub `main` branch protection / required status checks

## Request classification
- Repository governance and release-safety task.
- Single atomic task: inspect and enable the minimum required protection for `main`, then directly verify it.

## Workflows selected
- Principal Engineer / Continuity.
- Repository governance and release safety.
- CI quality-gate verification.
- Manus continuity protection.

## Evidence
- Current `main` branch inspection.
- GitHub repository metadata.
- GitHub rulesets collection.
- Current GitHub Actions quality workflow/check name.
- Existing `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`.

## Manus continuity protection
- VERIFIED: no application implementation, theme, authentication, authorization, database, order, or customer-action work was modified for this task.
- VERIFIED: this task is repository governance only and therefore cannot conflict with Manus UI/application changes.
- RULE: future application work must continue to use current Git evidence and the durable Manus engineering lessons before reopening completed work.

## Direct findings
- VERIFIED: repository default branch is `main`.
- VERIFIED: repository metadata reports admin permission for the connected owner context.
- VERIFIED: `main` currently reports `protected: false`.
- VERIFIED: required status checks are currently off and the branch has no configured protection checks.
- VERIFIED: repository rulesets collection is empty (`[]`).
- VERIFIED: the relevant GitHub Actions quality check is named `quality`.
- BLOCKED: the installed GitHub connector cannot perform the administration-level branch-protection write. Its branch-protection read endpoint returned HTTP 403 because the managed GitHub App connection does not expose the required administration access.

## Required protection configuration
When owner access through the GitHub web UI is used, configure the minimum release-safe policy for `main`:

1. Protect `main`.
2. Require a pull request before merging.
3. Require the `quality` status check to pass before merging.
4. Require branches to be up to date before merging when GitHub presents that option.
5. Do not require an invented reviewer count or CODEOWNERS rule; none is established by the current project evidence.
6. Do not enable force-pushes to `main`.
7. Do not allow branch deletion for `main`.
8. Keep the existing merge/release workflow otherwise unchanged.

## Why this is blocked
This is an external GitHub repository-setting operation, not a repository-file change. The available connector is read-only for the required administration endpoint, so creating a fake ruleset file or changing application code would not configure actual GitHub branch protection and would be misleading.

## Verification plan after owner action
- Re-read `main` branch protection/ruleset state directly.
- Confirm protection is enabled.
- Confirm `quality` is a required check.
- Confirm no force-push/delete policy weakens `main`.
- Record the verified rules in this session and the continuity files.

## Final status
- P1-H2: `IMPLEMENTATION_BLOCKED` pending the single owner-side GitHub settings action.
- No repository source code was changed.
- No deployment was triggered.
- No Vercel action was performed.

## Exact owner action required
Open the repository's GitHub settings for `Midosd249/Menu_V3`, go to **Settings → Branches** (or **Rules → Rulesets** if GitHub presents the newer ruleset UI), create protection for `main`, and require the existing `quality` check before merging. Do not enable force pushes or branch deletion.

After that action, the next engineering action is to directly re-read and verify the protection state. No application task should be started before that verification.
