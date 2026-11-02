# External Integrations and Credential Boundaries

**Status:** Source inventory — 2026-11-02  
**Baseline SHA:** `e5d7c89a73718f35e7accbae7933af36c366bbc1`

## Integration inventory
| Integration family | Evidence in source | Runtime activation |
|---|---|---|
| Supabase PostgreSQL | `pg` Pool connection via DB adapter and migration runner | VERIFIED project exists and is ACTIVE_HEALTHY; app's selected DB URL value is not exposed |
| Better Auth | Server-side auth handler and session middleware | Configured from server environment; exact current provider readiness not re-probed here |
| Google OAuth | Client ID/secret environment names in auth server | UNKNOWN whether both are currently configured in Production |
| Email | `src/lib/auth/email.ts` and provider adapter | Exact active transport/provider UNKNOWN |
| AI providers | Registry, capability router and server-only credential descriptors | Runtime eligibility/configuration must be evaluated by server; environment variable names do not prove successful API calls |
| Vercel | `vercel.json` region and deployment workflow | Hosting integration VERIFIED; current production deployment status not queried in F1 |
| PGlite | Local/test database fallback | Selected when no supported PostgreSQL URL exists |

## AI credential names in source
`INCEPTION_API_KEY` through `INCEPTION_API_KEY_6`, `GOOGLE_GEMINI_API_KEY`, `ZAI_API_KEY`, `OPENROUTER_API_KEY`, `XKIRO_API_KEY`, `TYPESAFE_API_KEY` variants, and other provider keys are referenced by server-side descriptors/registry. Do not publish values or copy them into documentation.

## Credential safety
- Keep credentials server-only.
- Never inspect or print secret values in repository reports.
- Environment-variable names are not proof of provider activation or successful connectivity.
- Review Vercel sensitive-variable classification in a separate owner-approved security task; no environment changes in F1.

## Failure behavior
Provider fallback/eligibility is implemented in application modules, but exact provider availability, quotas, latency and current credentials are **UNKNOWN** without authorized live provider health checks. Do not claim integration health based only on code presence.
