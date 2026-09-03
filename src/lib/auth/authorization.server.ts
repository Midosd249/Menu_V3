import type { Sql } from "../db.ts";
import { hasPermission, type Permission } from "./permissions.ts";
import { accessRoleToRole, type AccessRole, type Role } from "../menu/types.ts";

export type Membership = {
  tenantId: string;
  userId: string;
  role: Role;
  branchScope: string[] | null;
};

export type AuthorizationContext = Membership & { branchId: string | null };

export class AuthorizationError extends Error {
  readonly code: "unauthorized" | "forbidden" | "not_found";
  constructor(code: "unauthorized" | "forbidden" | "not_found", message = "ليس لديك صلاحية لتنفيذ هذا الإجراء") {
    super(message);
    this.name = "AuthorizationError";
    this.code = code;
  }
}

export async function getMembership(sql: Sql, userId: string, tenantId?: string): Promise<Membership | null> {
  const rows = tenantId
    ? await sql<{ tenant_id: string; user_id: string; access_role: AccessRole; branch_scope: string[] | null }>`
        select tenant_id, user_id, access_role, branch_scope
        from tenant_members
        where tenant_id = ${tenantId} and user_id = ${userId} and is_active = true
        limit 1
      `
    : await sql<{ tenant_id: string; user_id: string; access_role: AccessRole; branch_scope: string[] | null }>`
        select tenant_id, user_id, access_role, branch_scope
        from tenant_members
        where user_id = ${userId} and is_active = true
        order by created_at, tenant_id
        limit 1
      `;

  const row = rows[0];
  return row
    ? {
        tenantId: String(row.tenant_id),
        userId: String(row.user_id),
        role: accessRoleToRole(row.access_role),
        branchScope: Array.isArray(row.branch_scope) ? row.branch_scope.map(String) : null,
      }
    : null;
}

export async function requireMembership(userId: string, tenantId?: string): Promise<Membership> {
  const { getSql } = await import("../db.ts");
  const membership = await getMembership(await getSql(), userId, tenantId);
  if (!membership) throw new AuthorizationError("forbidden");
  return membership;
}

export function requirePermissionForRole(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) throw new AuthorizationError("forbidden", `Forbidden: ${permission}`);
}

export function roleCanAccessAssignedBranch(role: Role, isExplicitlyAssigned: boolean): boolean {
  return role === "owner" || role === "admin" || isExplicitlyAssigned;
}

export async function canAccessBranch(sql: Sql, membership: Membership, branchId: string): Promise<boolean> {
  if (membership.role === "owner" || membership.role === "admin") return true;
  if (membership.branchScope?.includes(branchId)) return true;

  const rows = await sql<{ id: string }>`
    select b.id
    from branches b
    where b.tenant_id = ${membership.tenantId}
      and b.id = ${branchId}
      and exists (
        select 1 from member_branch_access mba
        where mba.tenant_id = b.tenant_id
          and mba.user_id = ${membership.userId}
          and mba.branch_id = b.id
      )
    limit 1
  `;
  return Boolean(rows[0]);
}

export async function requireBranchAccess(membership: Membership, branchId: string): Promise<AuthorizationContext> {
  const { getSql } = await import("../db.ts");
  if (!(await canAccessBranch(await getSql(), membership, branchId))) throw new AuthorizationError("forbidden");
  return { ...membership, branchId };
}

export async function authorizeMutation(userId: string, permission: Permission, options?: { tenantId?: string; branchId?: string }): Promise<AuthorizationContext> {
  const membership = await requireMembership(userId, options?.tenantId);
  requirePermissionForRole(membership.role, permission);
  if (options?.branchId) return requireBranchAccess(membership, options.branchId);
  return { ...membership, branchId: null };
}

export async function requireTenantResource(
  sql: Sql,
  table: "tenants" | "branches" | "categories" | "products" | "orders",
  resourceId: string,
  tenantId: string,
): Promise<void> {
  const rows = await sql.query<{ id: string }>(`select id from ${table} where id = $1 and tenant_id = $2 limit 1`, [resourceId, tenantId]);
  if (!rows[0]) throw new AuthorizationError("not_found", "العنصر المطلوب غير موجود");
}
