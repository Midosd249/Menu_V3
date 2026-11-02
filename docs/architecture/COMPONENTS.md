# Application Component Map — Menuun

**Status:** F1 source-traced map — 2026-11-02  
**Baseline SHA:** `e5d7c89a73718f35e7accbae7933af36c366bbc1`

## Composition
| Component boundary | Responsibilities | Primary source locations |
|---|---|---|
| Route/UI layer | Root shell, public menu, authentication pages, onboarding, Studio, Owner, Admin, pricing/legal pages | `src/routes/**` |
| Theme/presentation | Theme registry, lazy theme templates, public action links, RTL/LTR rendering | `src/components/**`, `src/lib/theme/**`, `src/lib/lang/**` |
| Authentication | Better Auth configuration, API handlers, session verification, identity gates, cookies | `src/lib/auth/server.ts`, `verify.server.ts`, `src/routes/api/auth/$.ts` |
| Authorization | Membership lookup, permission checks, branch access, tenant-resource checks, platform-admin guard | `authorization.server.ts`, `permissions.ts`, `platform-admin.server.ts` |
| Data adapter | PostgreSQL/PGlite selection, query interface, transaction handling, DB readiness | `src/lib/db.ts` |
| Menu domain | Tenant/branch/menu snapshots, products, categories, hours, options, offers, ordering | `src/lib/menu/public.ts`, `owner.ts`, `options.ts`, `offers.ts` |
| Order domain | Public order submission, validation, authoritative pricing, idempotency/rate controls, receipts, lifecycle | `src/lib/menu/order-public.ts`, `order-lifecycle.ts`, `order-receipt.ts` |
| Table QR domain | Token creation/rotation, token hashing/resolution, branch/table association | `table-qr.ts`, `table-qr-primitives.ts`, `table-qr-management.ts`, `table-qr-public.ts` |
| Commercial domain | Subscription plans, entitlements, invoices, limits, platform controls | `subscriptions.ts`, `subscription-limits.ts`, `platform-subscriptions.ts`, `platform-billing.ts` |
| Team domain | Invitations, roles, branch assignment and member lifecycle | `team-invitations.ts`, `team.ts`, `authorization.server.ts` |
| Growth/intelligence | Events, experiments, guest intelligence, relationships, upsell and analytics | `src/lib/menu/{public-menu-events,experiment,intelligence,guest-relationships,upsell}.ts` |
| AI domain | Capability definitions, provider registry, credentials descriptor, eligibility and routing | `ai-capabilities.ts`, `ai-provider-registry.ts`, `ai-provider-credentials.server.ts`, `ai-capability-router.ts` |
| External API routes | Better Auth catch-all and tenant media retrieval | `src/routes/api/**` |

## Route inventory (selected verified routes)
- Public: `/m/$slug`, `/m/$slug/$branch`.
- Authentication: `/login`, `/forgot-password`, `/reset-password`, `/verify-email`, `/invite/$token`, `/api/auth/$`.
- Onboarding: `/onboarding`, `/onboarding/$token`, `/admin/onboarding`.
- Workspaces: `/studio` and `/studio/*`, `/owner`, `/admin` and `/admin/*`.
- Platform/public marketing: `/`, `/pricing`, `/privacy`, `/terms`, `/themes`, `/themes/preview`.
- Media: `/api/media/tenant/$tenantId/$kind`.

This is a route index, not an exhaustive enumeration of every nested file route or generated route manifest.

## Architectural rules
- Domain mutations and privileged data reads execute server-side.
- UI components are not an authorization boundary.
- Authentication middleware supplies verified `context.userId`; domain authorization resolves tenant membership and permissions separately.
- The DB adapter is shared by domain modules; no separate database microservice is evidenced.
- AI credentials are described in server-only modules; do not expose them to browser bundles.

## Evidence and limitations
Source tree at baseline SHA plus the listed modules. Full component-level import graph and exhaustive server-function inventory are **UNKNOWN** and should be generated from a local AST/build manifest in a future bounded task rather than guessed from filenames.
