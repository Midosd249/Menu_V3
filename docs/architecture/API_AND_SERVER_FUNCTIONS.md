# API Routes and Server Functions

**Status:** F1 route/source inventory — 2026-11-02  
**Baseline SHA:** `e5d7c89a73718f35e7accbae7933af36c366bbc1`

## HTTP route handlers
| Route | Methods / behavior | Source |
|---|---|---|
| `/api/auth/$` | GET/POST delegated to Better Auth | `src/routes/api/auth/$.ts` |
| `/api/media/tenant/$tenantId/$kind` | GET retrieves published tenant logo/cover data; validates kind and image data URL | `src/routes/api/media/tenant/$tenantId/$kind.ts` |
| Public menu | SSR loader for `/m/$slug` and `/m/$slug/$branch` | `src/routes/m.$slug.tsx`, `m.$slug.$branch.tsx` |

## Server-function domains
The codebase uses TanStack Start `createServerFn` in domain modules. Verified examples:
- Public menu reads and attribution: `src/lib/menu/public.ts`.
- Public QR token context: `src/lib/menu/table-qr-public.ts`.
- Public order and receipt: `src/lib/menu/order-public.ts`.
- Table management: `src/lib/menu/table-qr-management.ts`.
- Self-service workspace eligibility/setup: `src/lib/menu/self-serve-provisioning.ts`.
- Owner workspace operations: `src/lib/menu/owner.ts`.
- Team invitations: `src/lib/menu/team-invitations.ts`.
- Platform operations: `src/lib/menu/platform.ts`.

## Input and output boundaries
- Zod validates route search params and server-function input schemas.
- Public order accepts product identifiers, quantities, selections, customer contact fields, notes and optional QR token; it does not accept client-authoritative prices.
- Order receipt lookup requires a valid anonymous-session cookie and binds the requested order to that session.
- QR context resolution checks tenant slug and optional branch slug against the server-resolved token context.
- Authenticated table-management handlers use `authMiddleware` and `authorizeMutation`.

## Completeness statement
This is a domain and route inventory, not a mechanically exhaustive list of every exported server function. A generated AST inventory and call-site authorization coverage map remain **UNKNOWN**. Do not infer route protection from UI visibility.
