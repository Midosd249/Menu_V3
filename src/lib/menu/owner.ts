  sql: Sql,
  userId: string,
  tenantId?: string,
): Promise<MemberRow | null> {
  if (tenantId) {
    const rows = await sql<MemberRow>`
      select tenant_id, user_id, role from tenant_members
      where user_id = ${userId} and tenant_id = ${tenantId} and is_active = true
      limit 1
    `;
    return rows[0] ?? null;
  }
  const rows = await sql<MemberRow>`
    select tenant_id, user_id, role from tenant_members
    where user_id = ${userId} and is_active = true
    order by case when role = 'owner' then 0 else 1 end, created_at, tenant_id
    limit 1
  `;
  return rows[0] ?? null;
}

function canWriteMenu(role: Role) {
  return role === "owner" || role === "admin" || role === "editor";
}
function canWriteSettings(role: Role) {
  return role === "owner" || role === "admin";
}

async function loadSnapshot(sql: Sql, tenantId: string, role: Role): Promise<StudioSnapshot> {
  const [tenantRows, branchRows, catRows, prodRows, memberRows] = await Promise.all([
    sql`select * from tenants where id = ${tenantId} limit 1`,
    sql`select * from branches where tenant_id = ${tenantId} order by created_at`,
    sql`select * from categories where tenant_id = ${tenantId} order by sort_order, created_at`,
    sql`select * from products where tenant_id = ${tenantId} order by sort_order, created_at`,
    sql`select user_id, role from tenant_members where tenant_id = ${tenantId} and is_active = true`,
  ]);
  const tenant = mapTenant(tenantRows[0] as Record<string, unknown>);
  const branches = branchRows.map((r) => mapBranch(r as Record<string, unknown>));
  const cats = catRows.map((r) => mapCategory(r as Record<string, unknown>));
  const products = prodRows.map((r) => mapProduct(r as Record<string, unknown>));
  return {
    tenant,
    role,
    branches,
    categories: cats,
    products,
    members: memberRows.map((r) => ({ userId: String(r.user_id), role: accessRoleToRole(String(r.role) as AccessRole) })),
    health: buildMenuHealth(tenant, branches, cats, products),
  };
}
