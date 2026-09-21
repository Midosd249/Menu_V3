# W7.3 Browser QA

## Status

`VERIFIED` — W7.3 Studio Shell browser acceptance passed on current head before W7.4 implementation began.

## Root Cause

The first Studio browser attempt never reached the Studio Shell. Test-mode PGlite initialized `tenant_members` without `is_active`, while the authenticated Studio lookup queried `is_active = true`.

Repository evidence identified the mismatch between `migrations/0002_menu_v3.sql` and later role/schema compatibility handling in the PGlite fallback.

## Test-Only Correction

The CI workflow creates a temporary `migrations/99999999_w7_3_studio_fixture.sql` only inside the GitHub Actions runner. It:

- adds `tenant_members.is_active` only when missing;
- adds `orders.archived_at` only when missing because the real Studio order notification path requires it;
- seeds the existing `demo-nafas` tenant with `dev-user` as `owner`;
- runs the real application with `VITE_AUTH_ENABLED=false` through the existing auth middleware/test-mode contract;
- starts directly at `/studio` after the deterministic fixture is present;
- removes the temporary SQL file in the shell step `EXIT` trap.

No production migration was added and no production schema behavior was changed.

## CI Evidence

- W7.3 accepted browser run: `34905256209`
- PR: `#146`
- PR merge-base: `9995848b747bdb238e45b7ed6fe6b551c6779fcc`
- Current branch head used by the accepted run: `a7bab73a2f5729429293a85fac3fb58e70873098`
- GitHub Actions merge ref checked out: `4597f5d974c72a944f5746f218315735ecd72a0b`

The job completed successfully. The browser step reported:

```text
[studio-browser] serving http://127.0.0.1:8082/studio
Running 1 test using 1 worker
1 passed (10.2s)
```

The same run passed route generation, generated route freshness, typecheck, all 266 repository tests, lint, production build, Playwright runtime, Chromium, all-theme browser QA, performance audit, Studio Shell browser QA, diagnostics upload, and cleanup.

## Browser Matrix

The accepted W7.3 browser test verified:

- Desktop `1280×800` — Home/Overview, Menu, Orders, Growth, Customers, Settings, active state, navigation exclusions, focus.
- Mobile `390×844` — Home, Menu, Orders, Growth, More, More sheet, Escape close, RTL/LTR, overflow.
- Mobile `430×932` — overflow/responsive smoke.
- Tablet `768×1024` — overflow/responsive smoke.
- Arabic RTL and supported English LTR.
- `aria-current` active semantics and keyboard focus.
- Reports excluded from Studio navigation while the real reports route remains available to the existing analytics/report workflow.
- Non-existent standalone Loyalty/Campaigns/Feedback/Retention destinations were not exposed as dead links.
- Platform Admin `/admin` remained outside Studio navigation.

## Security Boundary

`VERIFIED`: no database migration, Supabase configuration, RLS policy, auth middleware, permission contract, subscription/entitlement logic, AI provider logic, orders business logic, public menu, Platform Admin, dependency, merge, or deployment change was used to make W7.3 pass.

The fixture exists only for CI's isolated PGlite browser environment and is not committed to `migrations/`.

## Remaining Limitation

`UNKNOWN/PENDING`: physical real-device QA for Studio Shell remains a release-stage check. CI browser evidence proves the specified Chromium viewport matrix, not every physical Android/iOS device.
