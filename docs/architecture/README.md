# Menuun Architecture Documentation

**Program:** F-Series  
**Owner:** Sole human product owner/developer  
**Evidence rule:** Code/configuration and current Git/runtime evidence outrank stale documentation and chat history.

## Purpose

This directory describes the architecture that is actually implemented in Menuun. It is not a target-state wish list. Every architecture claim must be labeled VERIFIED, INFERRED, PROPOSED, UNKNOWN, or BLOCKED.

## Current documents

- [System overview](./SYSTEM_OVERVIEW.md) — current verified product/system boundary, runtime facts, trust boundaries, and open architecture questions.
- [F-Series roadmap](../FINALIZATION_ROADMAP.md) — authoritative phase sequence and completion criteria.

## F1 architecture artifacts — committed on branch docs/f1-verified-architecture-baseline

Create or extend these only after inspecting the corresponding current code/configuration. Do not create duplicate documents if an equivalent maintained document already exists.

| Artifact | Intended content | Evidence required |
|---|---|---|
| `CONTEXT.md` | C4 system context, actors, external systems, trust boundary | Routes, integrations, auth and product evidence |
| `CONTAINERS.md` | Runtime/container view and deployment topology | Build config, package scripts, Vercel config and runtime evidence |
| `COMPONENTS.md` | Route/domain/server-function/component map | Current source tree and imports |
| `DATABASE.md` | Schemas, entities, relationships, functions, triggers, grants, RLS | Migration DDL, live read-only catalog, data-access code |
| `AUTH_AND_AUTHORIZATION.md` | Identity/session/permission model | Auth config, middleware, permission helpers, tests |
| `TENANT_AND_BRANCH_ISOLATION.md` | Tenant/branch resolution and isolation controls | Server functions, SQL, RLS/grants, adversarial tests |
| `API_AND_SERVER_FUNCTIONS.md` | Server entry points and contracts | Route/server-function source and tests |
| `DATA_FLOWS.md` | Critical request and mutation sequences | Source tracing and tests |
| `INTEGRATIONS.md` | External systems, credentials by name only, failure behavior | Runtime configuration and integration code |
| `DEPLOYMENT.md` | Build artifact, environment, Vercel and database release topology | Current CI/Vercel configuration and deployment evidence |
| `diagrams/` | C4 context/container/component, deployment, selected sequence diagrams | Cross-checked against the above |

## Diagram standards

- Prefer Mermaid text diagrams stored in Git.
- Every diagram must include its scope, date, evidence references, and unresolved assumptions.
- Distinguish existing production behavior from proposed target architecture.
- Never draw a direct client-to-database path unless source/configuration proves that path.
- Never represent a vendor integration as active merely because an environment variable name exists.
- Keep security and tenant trust boundaries visible.
- Update diagrams in the same task that materially changes the represented architecture.

## Architecture review checklist

1. Does the diagram match current source and configuration?
2. Are all actors and external dependencies verified?
3. Are trust boundaries and server-side authorization visible?
4. Are tenant and branch identifiers derived from trusted context?
5. Are database ownership and migration execution responsibilities clear?
6. Are deployment environments and side effects explicit?
7. Are unknowns visibly marked?
8. Does the document link to relevant ADRs, tests, and runbooks?

## Do not

- Infer the architecture from framework names alone.
- Assume a separate microservice, queue, cache, or worker exists without evidence.
- copy secrets, connection strings, customer data, or sensitive logs into diagrams.
- Treat RLS enabled as proof that every access path is safe; inspect policies, grants, and server access together.
- Treat a high-level diagram as a complete security review.

## F1 verified architecture artifacts (2026-11-02)

- [C4 System Context](./CONTEXT.md)
- [Container and Runtime Topology](./CONTAINERS.md)
- [Application Components](./COMPONENTS.md)
- [Database and Live Catalog](./DATABASE.md)
- [Authentication and Authorization](./AUTH_AND_AUTHORIZATION.md)
- [Tenant and Branch Isolation](./TENANT_AND_BRANCH_ISOLATION.md)
- [API and Server Functions](./API_AND_SERVER_FUNCTIONS.md)
- [Critical Data Flows](./DATA_FLOWS.md)
- [External Integrations](./INTEGRATIONS.md)
- [Deployment and Release Topology](./DEPLOYMENT.md)

### Mermaid diagrams
- [System context](./diagrams/system-context.mmd)
- [Container topology](./diagrams/container-topology.mmd)
- [Authenticated mutation](./diagrams/auth-mutation-sequence.mmd)
- [Public order](./diagrams/public-order-sequence.mmd)

All facts are bounded by each document's evidence date and SHA. Unknowns remain explicit; this index is not a security certification.