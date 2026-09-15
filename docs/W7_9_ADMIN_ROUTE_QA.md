# W7.9 Platform Admin Route QA

## Status
`VERIFIED / FINAL` — 2026-09-15.

## Final CI evidence
- Final current-head route/test correction commit: `db9e2f6a816d6e1d10fc7e37bfaad4c7004a40f0`.
- Final quality run: `34925141809` / run 1638 — PASS.
- All configured workflow stages completed successfully.

## Browser QA coverage
| Area | Evidence | Result |
|---|---|---|
| `/admin` Overview | authorized CI browser state | PASS |
| `/admin/restaurants` | direct route + refresh | PASS |
| `/admin/clients` | direct route + refresh | PASS |
| `/admin/branches` | direct route + refresh | PASS |
| `/admin/orders` | direct route + refresh | PASS |
| `/admin/subscriptions` | direct route + refresh | PASS |
| `/admin/service-requests` | direct route + refresh | PASS |
| `/admin/leads` | direct route + refresh | PASS |
| `/admin/projects` | direct route + refresh | PASS |
| `/admin/analytics` | direct route + refresh | PASS |
| `/admin/activity` | direct route + refresh | PASS |
| `/admin/system` | direct route + refresh | PASS |
| Legacy `/admin?tab=...` | known mappings + preserved query | PASS |
| Unknown legacy tab | safe `/admin` fallback | PASS |
| Back/forward | `/admin` ↔ `/admin/analytics` | PASS |
| Authorization | real Platform Admin fixture | PASS |
| Desktop 1280×800 | grouped nav, active state, focus, overflow | PASS |
| Mobile 390×844 | responsive geometry, no horizontal overflow | PASS |
| Other required viewports | 430×932, 768×1024 | PASS |
| RTL/LTR structure | browser suite | PASS |
| Studio regressions | Shell/Home/Menu/Growth/Customers | PASS |
| Public menu regression | all-theme browser QA | PASS |
| Performance | existing workflow audit | PASS |

## Regression history
The first blocker was an `AUTH_DISABLED_FIXTURE_GAP`: the auth-disabled Admin browser environment lacked the required `menu_v3.is_platform_admin` schema/context. The workflow was corrected with an isolated PostgreSQL service, compatible existing migrations, required Supabase-compatible roles, and `dev-user` seeded into `menu_v3.platform_admins`. This is CI-only and does not alter production schema or migration files.

After that correction, the only failure was a browser-test serialization expectation. The application intentionally serialized the unrelated query parameter as `keep=%221%22`; therefore `URLSearchParams.get("keep")` returns `"1"`. The test assertion was corrected to that actual supported serialization contract. No production route code was changed.

## Accessibility / responsive checks
- Route-based active navigation exposes exactly one `aria-current="page"` item in the desktop Admin navigation.
- Keyboard focus remains reachable.
- Required mobile geometry passes without horizontal page overflow.
- The browser suite avoids desktop-only navigation assertions on mobile.
- Direct route refresh and browser history preserve workspace URLs.

## Security / data integrity
- Existing `requirePlatformAdmin` / `assertPlatformAdmin` boundaries remain intact.
- Direct child routes do not introduce an authorization bypass.
- No test backdoor, secret, production fixture, schema change, fake operator data, fabricated metrics, charts, health scores, security events, or recommendations were added.
- Physical real-device QA remains a release-stage check and is not claimed here.

## Final verdict
`DONE / VERIFIED`

W7.10 is not started.
