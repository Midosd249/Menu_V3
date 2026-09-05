# Menu V3

Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS for restaurants and cafes.

## Stack

- React 19 + TypeScript
- TanStack Start / Router
- Vite + Tailwind CSS
- Better Auth
- PostgreSQL / PGLite-ready data layer
- Supabase production integration
- Vercel deployment
- Node 24 in CI

## Repository structure

- `src/` — application routes, components, domain logic, authentication, SEO, themes, and shared types.
- `migrations/` — database schema migrations. Treat these as production history; do not delete or reorder them casually.
- `scripts/` — build, migration, preview, QA, performance, and repository utility scripts.
- `server/` — Vercel/Nitro server middleware and runtime integrations.
- `public/` — public runtime assets.
- `tests/` — cross-cutting regression tests.
- `docs/` — maintained documentation and archived historical records.
- `.github/workflows/` — CI quality gates.
- `.grok/` — repository-local agent/tooling workspace used by existing workflows and development tooling; do not remove without evidence.

## Getting started

### Requirements

Use Node 24, matching the repository CI configuration.

### Install

```bash
npm install --no-audit --no-fund
```

### Development

```bash
npm run dev
```

The development server is configured for `0.0.0.0:8080`.

### Verification

```bash
npm run typecheck
npm test
npm run test:platform
npm run lint
npm run build
npm run check:auth
```

`npm run build` also runs the repository migration runner. Do not run production migrations against an unintended database.

### Environment

Environment files are intentionally not committed. `.env` and `.env.*` are ignored. Platform-admin configuration uses `PLATFORM_ADMIN_EMAILS` and/or `PLATFORM_ADMIN_USER_IDS` in the deployment environment; see `docs/deployment/ADMIN_SETUP.md`.

The complete environment contract is not currently centralized in a committed example file and is therefore partially UNKNOWN. Do not invent missing variables; inspect the relevant source/configuration before adding them.

## Deployment

Vercel is the deployment target. `vercel.json` currently specifies the deployment region, while the Vite configuration selects the Vercel Nitro preset for production builds.

Deployment health must be verified from Vercel evidence separately from GitHub CI. A passing CI run does not by itself prove that production is deployed or healthy.

## Security and data boundaries

Authentication and authorization are server-side. Tenant and branch isolation must not depend on client-supplied identity or scope. Database migrations are durable production history. Never commit credentials, tokens, private keys, or `.env` files.

## Documentation

- `AGENTS.md` — repository operating contract for agents and developers.
- `PROJECT_STATE.md` — current verified project state and session continuity.
- `PLAN.md` — active product roadmap and exact next task.
- `TASKS.md` — task queue and closure evidence.
- `SESSION_PROTOCOL.md` — session execution protocol.
- `docs/visual-functional-audit.md` — permanent visual and functional audit evidence contract.
- `docs/design-research-log.md` — permanent research evidence log.
- `docs/template-review-checklist.md` — mandatory template/public-menu quality gate.
- `docs/template-brief-template.md` — reusable template/presentation brief.
- `docs/repository-organization-audit.md` — repository organization audit and target structure.
- `docs/archive/` — historical plans, status reports, and completion records.
- `docs/development/MASTER_CONTEXT_MENU_V3.md` — historical/current architectural context retained for continuity.
- `docs/product/DESIGN_SYSTEM.md` — product design-system reference.
- `docs/deployment/ADMIN_SETUP.md` — platform-admin deployment setup.

## Current product state

The five-theme visual system is complete, with Essential and Editorial refined and Noir implementation refinement complete; Heritage and Gallery remain protected. The current continuity gate includes verified reconciliation of the homepage `nafas` demo with the production `menu_v3.tenants` record `demo-nafas`: the tenant is owned by `midosd2.mm@gmail.com`, is published and active, and the public loader now reads the published database tenant instead of returning the stale static `DEMO_MENU` for `nafas`. Final deployment/browser reflection evidence remains UNKNOWN until the source-of-truth fix is released and tested. Repository organization and the permanent visual/functional quality system remain separate maintenance initiatives and do not reopen completed product milestones.
