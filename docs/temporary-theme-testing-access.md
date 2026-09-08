# Temporary Public Theme Testing Access

## Purpose
Temporarily allow authenticated restaurant owners/admins to save any public/general Menu V3 theme for testing without changing the commercial entitlement model.

## Included themes
- `essential`
- `editorial`
- `noir`
- `heritage`
- `gallery`

**VERIFIED:** these are the complete five-theme public catalog in `src/lib/theme/registry.ts`.

## Excluded themes
- No private/admin-only theme exists in the current public theme registry.
- Authentication, authorization, tenant/branch isolation, billing/subscription records, and private/admin features are excluded from the override.

## How the override works
- **VERIFIED:** `saveTenantTheme` remains behind `authMiddleware` and only owner/admin tenant members can change a theme.
- **VERIFIED:** the override is server-side and reads only server environment variables; the client cannot submit or toggle it.
- Enable both variables in an approved non-production testing environment:
  - `MENU_THEME_TESTING_OVERRIDE=true`
  - `MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT=<future ISO-8601 timestamp>`
- **VERIFIED:** the override is hard-disabled whenever Vercel reports `VERCEL_ENV=production`.
- Both values are required outside production. A missing, invalid, or expired timestamp means the override is OFF.
- The override affects only premium-theme entitlement checking. Inactive subscription status remains enforced.

## Default behavior
- **VERIFIED:** with the override absent/false/expired, the existing `canUseTheme` entitlement behavior remains authoritative: Essential is free and premium themes require a qualifying plan.
- Theme preview routes remain available for visual inspection without granting commercial entitlement.

## Security controls
- Server-only environment state; no client-controlled bypass parameter.
- Existing authentication middleware is unchanged.
- Existing owner/admin membership check is unchanged.
- Existing tenant-scoped update remains unchanged.
- Existing subscription status check remains enforced.
- Theme keys are still normalized against the canonical registry.
- The override must have a future expiry; it cannot be enabled indefinitely through a single boolean.
- **VERIFIED:** production Vercel deployments cannot activate the override even if the two testing variables are accidentally present.
- When active for a premium save, the server logs the tenant, theme, expiry, and Vercel environment for operational evidence.

## Disable/revert
1. Set `MENU_THEME_TESTING_OVERRIDE=false`, or remove the variable.
2. Remove the expiry variable as well when the testing period ends.
3. Redeploy the approved non-production environment if its platform requires deployment for environment changes.
4. The expiry timestamp independently disables the override even if the boolean is accidentally left true.
5. Production remains protected by the `VERCEL_ENV=production` hard stop regardless of testing-variable state.

## Test results
- **VERIFIED:** unit tests cover default-off behavior, future expiry, expired override, production hard-disable, preview/local enablement, and normal entitlement behavior without override.
- **UNKNOWN:** live production environment variables cannot be inspected through the available deployment read tools; no claim is made that the testing variables are currently configured.

## Review / expiry reminder
The override remains temporary test infrastructure. Review its environment state before every release and disable it in non-production environments when testing ends. The production hard stop must remain in place; do not convert the override into permanent billing enforcement.
