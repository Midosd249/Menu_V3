# W7.12 — Release Risk Register

Date: 2026-09-15
Status: VERIFIED — release-readiness package prepared; no merge/deployment performed.

| Risk | Status | Likelihood | Impact | Evidence | Owner | Mitigation | Release gate | Blocks |
|---|---|---|---|---|---|---|---|---|
| Physical Android/iOS QA not executed | OPEN | Medium | High | W7.10/W7.11 evidence explicitly leaves real-device QA pending | Human owner / release tester | Execute `docs/W7_12_REAL_DEVICE_QA.md` on approved devices and record evidence | Required before merge/deployment unless formally waived by authorized human | Merge + Production |
| No verified Production deployment evidence for this work | OPEN | Medium | High | Repository/PR evidence does not establish a current Production deployment state | Human owner / release operator | Use the release-only Vercel workflow only when authorized | Production release gate | Production |
| No authorized production release performed | CLOSED for W7.12 | N/A | N/A | No merge/deploy action occurred in this task | ATLAS | None; preserve current boundary | Human release authorization required | None now |
| 29 existing lint warnings | OPEN / NON-BLOCKING | Medium | Low–Medium | W7.11 lint: 0 errors, 29 warnings; triaged in `docs/W7_12_LINT_TRIAGE.md` | Human reviewer | Review hook-dependency warnings; defer safe cleanup until isolated work is authorized | Human review of warning triage | Human review; not automatically merge-blocking |
| CI-only fixture complexity | OPEN / CONTROLLED | Medium | Medium | Browser QA uses runner-local PostgreSQL/PGlite fixtures and temporary setup | Human reviewer / CI maintainer | Keep fixtures CI-only, temporary, and cleaned up; do not promote to production migrations | CI review | None if isolation is preserved |
| `member_branch_access` Team fixture note | OPEN / CONTROLLED | Low–Medium | Medium | Existing Team-path fixture compatibility note; it did not block W7.11 browser QA | Human reviewer / CI maintainer | Treat as fixture/schema-contract compatibility review, not production migration evidence | Human review if Team path is changed | None for current W7 scope |
| Bounded Playwright retry for transient Vite optimizer reload | OPEN / CONTROLLED | Medium | Low–Medium | W7.11 diagnosed transient `ERR_ABORTED` during `/studio/growth`; final bounded retry passed | Human reviewer / CI maintainer | Keep retry narrowly scoped to the observed transient error; preserve all assertions | CI review | None currently |
| PR #146 review complexity | OPEN | High | Medium | PR spans W7.2–W7.11 and multiple presentation/route/test areas | Human reviewer | Use `docs/W7_12_HUMAN_PR_REVIEW.md`, inspect grouped diffs and protected-area boundaries | Human code review | Human review |
| Real device/browser version variance | OPEN | Medium | Medium | Desktop/Chromium automation cannot cover all mobile browser engines and OS UI behavior | Human owner / release tester | Test current Android Chrome/Samsung Internet and iOS Safari where available | Device QA | Merge + Production unless waived |
| Production data/configuration unknowns | OPEN | Medium | High | Current Vercel Production environment/deployment state is not established by repository evidence | Human owner / release operator | Verify production configuration only during authorized release stage | Release-stage operational check | Production |

## Explicit Interpretations

- A Vercel rate-limit/quota condition is an operational release constraint, not a code defect.
- A CI-only fixture is not a production database migration.
- A bounded browser-test retry is not evidence of a runtime defect; W7.11 diagnostics classified the observed optimizer `ERR_ABORTED` as transient CI timing.
- Existing lint warnings are not automatically release blockers; they are triaged individually.
- Real-device QA remains incomplete until physical-device evidence exists.

## Protected Areas Review

No W7.12 change modifies:
- production database/schema;
- Supabase or RLS;
- authentication/authorization/permissions;
- tenant/branch isolation;
- subscriptions/entitlements;
- AI provider/business logic;
- orders business logic;
- public Menu business logic;
- Studio business logic;
- Admin business logic;
- route architecture;
- package manager/dependencies;
- Vercel configuration;
- merge or deployment.

## Release Gate Order

1. Human code review of Draft PR #146.
2. Resolve or formally accept any review findings.
3. Reconfirm current-head CI after any review-driven code change.
4. Execute real-device QA on approved non-Production target or approved release environment.
5. Human owner explicitly authorizes release/merge work.
6. Follow the existing release-only deployment workflow.
7. Perform post-deployment real-device QA and verify the deployed commit.

Current W7.12 state: **READY_FOR_HUMAN_REVIEW_WITH_RELEASE_GATES**.
