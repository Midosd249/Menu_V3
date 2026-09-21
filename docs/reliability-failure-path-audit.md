# W12-03 — Reliability and Failure-Path Audit

## Status
- CLOSED / VERIFIED
- Quality Gate: `34015320658`
- Scope: public-menu and critical failure-path hardening only.

## Objective
Inspect and harden timeout, upstream failure, malformed/partial result handling, cache miss, retry, navigation interruption, and dependency degradation without changing the successful-path architecture.

## Verified decisions
- Public menu retries are bounded to two attempts.
- Only transient/unavailable failures and timeouts are retried; `not_found` and invalid results terminate immediately.
- Retry delay is deterministic and bounded: 350 ms after the first failed attempt.
- Timeout is bounded at 10 seconds per attempt.
- Terminal failure messages are localized for Arabic and English.
- Existing session cache remains optional and tenant/branch keyed by the existing public-menu cache key.
- No cross-tenant cache mechanism was introduced.
- No Supabase schema, authentication, authorization, theme, routing, or successful-path data contract was changed.
- Error handling remains explicit; the UI exposes a retry action instead of an unbounded automatic loop.
- The underlying request promise is not used to mutate UI state after the timeout race loses; only the bounded wrapper result updates the component state.

## Regression coverage
`scripts/quality-workflow.test.mjs` protects:
- bounded retry limit;
- retry loop shape and delay;
- immediate termination for terminal `not_found` / invalid responses;
- Arabic and English terminal failure copy.

The default test suite and full Quality Gate are the release evidence.

## Verification
Quality Gate `34015320658` passed:
- Install
- Route generation
- Typecheck
- Tests
- Lint
- Production build
- Playwright Chromium
- all-theme Browser Template QA
- performance baseline upload
- preview shutdown

## Remaining limitation
Production RUM is not available, so real-user retry frequency, timeout frequency, and failure recovery rates cannot be quantified from the repository alone.
