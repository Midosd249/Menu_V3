import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

/**
 * Repairs a tenant created before its owner membership was persisted.
 * Ownership is derived from the server-side tenants.owner_user_id field;
 * no client-supplied tenant or role is accepted.
 */
export const ensureOwnerMembership = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ ok: true; data: { repaired: boolean } } | { ok: false; error: string }> => {
    try {
      const sql = await getSql();
      const tenants = await sql<{ id: string }>`
        select id from tenants
        where owner_user_id = ${context.userId}
        order by created_at
        limit 1
      `;
      const tenant = tenants[0];
      if (!tenant) return { ok: true, data: { repaired: false } };

      const memberships = await sql<{ is_active: boolean }>`
        select is_active from tenant_members
        where tenant_id = ${tenant.id} and user_id = ${context.userId}
        limit 1
      `;

      if (memberships[0]) {
        await sql`
          update tenant_members
          set role = 'owner', access_role = 'tenant_owner', is_active = true, updated_at = now()
          where tenant_id = ${tenant.id} and user_id = ${context.userId}
        `;
      } else {
        await sql`
          insert into tenant_members (tenant_id, user_id, role, access_role, is_active)
          values (${tenant.id}, ${context.userId}, 'owner', 'tenant_owner', true)
          on conflict (tenant_id, user_id) do update
          set role = 'owner', access_role = 'tenant_owner', is_active = true, updated_at = now()
        `;
      }

      return { ok: true, data: { repaired: true } };
    } catch (err) {
      console.error("ensureOwnerMembership failed", err);
      return { ok: false, error: "تعذر استعادة مساحة المنشأة" };
    }
  });
