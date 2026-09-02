import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import type { FnResult, Role } from "./types";

const roleSchema = z.enum(["owner", "admin", "editor"]);

type TeamMember = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

async function ownerContext(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ tenant_id: string; role: Role }>`
    select tenant_id, role
    from tenant_members
    where user_id = ${userId}
    order by created_at
    limit 1
  `;
  const member = rows[0];
  if (!member || member.role !== "owner") return { sql, tenantId: null as string | null };
  return { sql, tenantId: member.tenant_id };
}

async function listMembers(sql: Sql, tenantId: string): Promise<TeamMember[]> {
  const rows = await sql<{
    user_id: string;
    name: string;
    email: string;
    role: Role;
    created_at: string;
  }>`
    select tm.user_id, u."name", u."email", tm.role, tm.created_at
    from tenant_members tm
    left join "user" u on u.id = tm.user_id
    where tm.tenant_id = ${tenantId}
    order by case when tm.role = 'owner' then 0 when tm.role = 'admin' then 1 else 2 end, tm.created_at
  `;
  return rows.map((row) => ({
    userId: String(row.user_id),
    name: row.name || "—",
    email: row.email || "—",
    role: row.role,
    createdAt: row.created_at,
  }));
}

export const getTeamMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<{ members: TeamMember[] }>> => {
    try {
      const { sql, tenantId } = await ownerContext(context.userId);
      if (!tenantId) return { ok: false, code: "forbidden", error: "إدارة الفريق متاحة لمالك النشاط فقط" };
      return { ok: true, data: { members: await listMembers(sql, tenantId) } };
    } catch (err) {
      console.error("getTeamMembers failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل أعضاء الفريق" };
    }
  });

export const updateTeamMemberRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1), role: roleSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ members: TeamMember[] }>> => {
    try {
      const { sql, tenantId } = await ownerContext(context.userId);
      if (!tenantId) return { ok: false, code: "forbidden", error: "إدارة الفريق متاحة لمالك النشاط فقط" };

      const target = await sql<{ role: Role }>`
        select role from tenant_members
        where tenant_id = ${tenantId} and user_id = ${data.userId}
        limit 1
      `;
      if (!target[0]) return { ok: false, code: "not_found", error: "عضو الفريق غير موجود" };

      if (target[0].role === "owner" && data.role !== "owner") {
        const owners = await sql<{ count: number }>`
          select count(*)::int as count from tenant_members
          where tenant_id = ${tenantId} and role = 'owner'
        `;
        if ((owners[0]?.count ?? 0) <= 1) {
          return { ok: false, code: "invalid", error: "لا يمكن إزالة آخر مالك للنشاط" };
        }
      }

      if (data.userId === context.userId && data.role !== "owner") {
        return { ok: false, code: "invalid", error: "لا يمكنك خفض صلاحية حساب المالك الحالي من هذه الجلسة" };
      }

      await sql`
        update tenant_members
        set role = ${data.role}
        where tenant_id = ${tenantId} and user_id = ${data.userId}
      `;

      return { ok: true, data: { members: await listMembers(sql, tenantId) } };
    } catch (err) {
      console.error("updateTeamMemberRole failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحديث صلاحية العضو" };
    }
  });

export const removeTeamMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ members: TeamMember[] }>> => {
    try {
      const { sql, tenantId } = await ownerContext(context.userId);
      if (!tenantId) return { ok: false, code: "forbidden", error: "إدارة الفريق متاحة لمالك النشاط فقط" };
      if (data.userId === context.userId) return { ok: false, code: "invalid", error: "لا يمكنك إزالة نفسك من النشاط" };

      const target = await sql<{ role: Role }>`
        select role from tenant_members
        where tenant_id = ${tenantId} and user_id = ${data.userId}
        limit 1
      `;
      if (!target[0]) return { ok: false, code: "not_found", error: "عضو الفريق غير موجود" };
      if (target[0].role === "owner") {
        const owners = await sql<{ count: number }>`
          select count(*)::int as count from tenant_members
          where tenant_id = ${tenantId} and role = 'owner'
        `;
        if ((owners[0]?.count ?? 0) <= 1) {
          return { ok: false, code: "invalid", error: "لا يمكن إزالة آخر مالك للنشاط" };
        }
      }

      await sql`
        delete from tenant_members
        where tenant_id = ${tenantId} and user_id = ${data.userId}
      `;

      return { ok: true, data: { members: await listMembers(sql, tenantId) } };
    } catch (err) {
      console.error("removeTeamMember failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إزالة عضو الفريق" };
    }
  });
