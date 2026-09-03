import { getSql, type Sql } from "../db";
import { hasPermission, type Permission } from "./permissions.ts";
import type { Role } from "../menu/types.ts";

export type Membership = {
  tenantId: string;
  userId: string;
  role: Role;
};

export type AuthorizationContext = Membership & {
  branchId: string | null;
};

export class AuthorizationError extends Error {
  readonly code: "unauthorized" | "forbidden" | "not_found";

  constructor(
    code: "unauthorized" | "forbidden" | "not_found",
    message = "ليس لديك صلاحية لتنفيذ هذا الإجراء",
  ) {
    super(message);
    this.name = "AuthorizationError";
    this.code = code;
  }
}

/**
 * Resolve membership from the verified server-side user id.
 * Never accept a caller-provided role or tenant id as the source of authority.
 */
export async function getMembership(
  sql: Sql,
  userId: string,
  tenantId?: string,
): Promise<Membership | null> {
  const rows = tenantId
    ? await sql<{ tenant_id: string; user_id: string; role: Role }>`
        select tenant_id, user_id, role
        from tenant_members
        where tenant_id = ${tenantId} and user_id = ${userId}
        limit 1
      `
    : await sql<{ tenant_id: string; user_id: string; role: Role }>`
        select tenant_id, user_id, role
        from tenant_members
        where user_id = ${userId}
        order by created_at, tenant_id
        limit 1
      `;

  const row = rows[0];
  return row
    ? { tenantId: String(row.tenant_id), userId: String(row.user_id), role: row.role }
    : null;
}

export async function requireMembership(
  userId: string,
  tenantId?: string,
): Promise<Membership> {
  const sql = await getSql();
  const membership = await getMembership(sql, userId, tenantId);
  if (!membership) throw new AuthorizationError("forbidden");
  return membership;
}

export function requirePermissionForRole(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new AuthorizationError("forbidden", `Forbidden: ${permission}`);
  }
}

/** Pure policy used by both tests and the DB-backed branch check. */
export function roleCanAccessAssignedBranch(role: Role, isExplicitlyAssigned: boolean): boolean {
  return role === "owner" || role === "admin" || isExplicitlyAssigned;
}

/**
 * Branch scope is derived from database membership. Owner/admin are tenant-wide;
 * editors require an explicit member_branch_access row.
 */
export async function canAccessBranch(
  sql: Sql,
  membership: Membership,
  branchId: string,
): Promise<boolean> {
  const rows = await sql<{ id: string }>`
    select b.id
    from branches b
    where b.tenant_id = ${membership.tenantId}
      and b.id = ${branchId}
      and (
        ${membership.role} in ('owner', 'admin')
        or exists (
          select 1
          from member_branch_access mba
          where mba.tenant_id = b.tenant_id
            and mba.user_id = ${membership.userId}
            and mba.branch_id = b.id
        )
      )
    limit 1
  `;
  return Boolean(rows[0]);
}

export async function requireBranchAccess(
  membership: Membership,
  branchId: string,
): Promise<AuthorizationContext> {
  const sql = await getSql();
  if (!(await canAccessBranch(sql, membership, branchId))) {
    throw new AuthorizationError("forbidden");
  }
  return { ...membership, branchId };
}

/**
 * Single server-side authorization boundary for mutations.
 * The caller supplies only the verified user id; role/tenant/branch authority
 * is resolved from trusted database state.
 */
export async function authorizeMutation(
  userId: string,
  permission: Permission,
  options?: { tenantId?: string; branchId?: string },
): Promise<AuthorizationContext> {
  const membership = await requireMembership(userId, options?.tenantId);
  requirePermissionForRole(membership.role, permission);

  if (options?.branchId) {
    return requireBranchAccess(membership, options.branchId);
  }

  return { ...membership, branchId: null };
}

/** Verify that a resource belongs to the caller's tenant before a mutation. */
export async function requireTenantResource(
  sql: Sql,
  table: "tenants" | "branches" | "categories" | "products" | "orders",
  resourceId: string,
  tenantId: string,
): Promise<void> {
  const rows = await sql.query<{ id: string }>(
    `select id from ${table} where id = $1 and tenant_id = $2 limit 1`,
    [resourceId, tenantId],
  );
  if (!rows[0]) {
    throw new AuthorizationError("not_found", "العنصر المطلوب غير موجود");
  }
}
