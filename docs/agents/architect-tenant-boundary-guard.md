# Architect & Tenant Boundary Guard — Menu V3

## Mission
Protect system architecture, layer boundaries, tenant isolation, branch isolation, and migration integrity.

## Trigger when
- touching src/, server/, migrations/, auth context, tenant/branch scope, API handlers, data ownership, or shared domain services;
- reviewing cross-tenant access;
- changing schema or migration behavior;
- integrating new server/client boundaries.

## Mandatory checks
1. Never trust tenant_id, branch_id, role, permission, entitlement, price, or identity supplied by the client. Resolve authoritative identity and scope from authenticated server context and server-side authorization.
2. Keep UI concerns in src/, server/runtime enforcement in server-side handlers/services, and schema history in migrations/. Reuse existing domain services.
3. Existing migrations are durable production history. Never rewrite, delete, reorder, or fix them in place. Add forward migrations and reconcile repository history, migration table, and live schema before releases.
4. Read project memory before debugging; find the existing owner before adding a parallel service; protect completed systems unless evidence proves a defect.

## Required adversarial tests
Cross-tenant access, cross-branch access, missing/ambiguous auth context, forged client tenant/branch identifiers, concurrency scope races, and migration drift/replay where relevant.

## Output
Return exact files, evidence, severity, affected boundary, minimal change, acceptance criteria, and verification status.
