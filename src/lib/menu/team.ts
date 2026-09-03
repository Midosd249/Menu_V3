import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { authorizeMutation } from "@/lib/auth/authorization.server";
import type { FnResult, Role } from "./types";

const roleSchema = z.enum(["owner", "admin", "editor"]);

type TeamBranch = {
  id: string;
  nameAr: string;
  nameEn: string;
};

type TeamMember = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  branchIds: string[];
};

async function ownerContext(userId: string) {
  const sql = await getSql();
  const member = await authorizeMutation(userId, "team.write");
  if (member.role !== "owner") return { sql, tenantId: null as string | null };
  return { sql, tenantId: member.tenantId };
}

async function listBranches(sql: Sql, tenantId: string): Promise<TeamBranch[]> {
  const rows = await sql<{ id: string; name_ar: string; name_en: string }>`
    select id, name_ar, name_en
    from branches
    where tenant_id = ${tenantId}
    order by created_at, id
  `;
  return rows.map((row) => ({
    id: String(row.id),
    nameAr: row.name_ar || "—",
    nameEn: row.name_en || "—",
  }));
}

async function listMembers(sql: Sql, tenantId: string): Promise<TeamMember[]> {
  const rows = await sql<{
    user_id: string;
    name: string;
    email: string;
    role: Role;
    created_at: string;
    branch_ids: string[] | null;
  }>`
    select
      tm.user_id,
      u."name",
      u."email",
      tm.role,
      tm.created_at,
      coalesce(
        (
          select array_agg(mba.branch_id order by mba.branch_id)
          from member_branch_access mba
          where mba.tenant_id = tm.tenant_id and mba.user_id = tm.user_id
        ),
        '{}'::text[]
      ) as branch_ids
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
    branchIds: Array.isArray(row.branch_ids) ? row.branch_ids.map(String) : [],
  }));
}

async function teamSnapshot(sql: Sql, tenantId: string) {
  const [members, branches] = await Promise.all([
    listMembers(sql, tenantId),
    listBranches(sql, tenantId),
  ]);
  return { members, branches };
}

export const getTeamMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<{ members: TeamMember[]; branches: TeamBranch[] }>> => {
    try {
      const { sql, tenantId } = await ownerContext(context.userId);
      if (!tenantId) return { ok: false, code: "forbidden", error: "إدارة الفريق متاحة لمالك النشاط فقط" };
      return { ok: true, data: await teamSnapshot(sql, tenantId) };
    } catch (err) {
      console.error("getTeamMembers failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل أعضاء الفريق" };
    }
  });

export const updateTeamMemberRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1), role: roleSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ members: TeamMember[]; branches: TeamBranch[] }>> => {
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

      return { ok: true, data: await teamSnapshot(sql, tenantId) };
    } catch (err) {
      console.error("updateTeamMemberRole failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحديث صلاحية العضو" };
    }
  });

export const setTeamMemberBranches = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string().min(1),
      branchIds: z.array(z.string().min(1)).max(100),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<{ members: TeamMember[]; branches: TeamBranch[] }>> => {
    try {
      const { sql, tenantId } = await ownerContext(context.userId);
      if (!tenantId) return { ok: false, code: "forbidden", error: "إدارة الفريق متاحة لمالك النشاط فقط" };
      if (data.userId === context.userId) return { ok: false, code: "invalid", error: "لا تحتاج جلسة المالك إلى تخصيص فروع" };

      const target = await sql<{ role: Role }>`
        select role from tenant_members
        where tenant_id = ${tenantId} and user_id = ${data.userId}
        limit 1
      `;
      if (!target[0]) return { ok: false, code: "not_found", error: "عضو الفريق غير موجود" };
      if (target[0].role !== "editor") {
        return { ok: false, code: "invalid", error: "تخصيص الفروع مطلوب فقط للمحررين" };
      }

      const branchIds = [...new Set(data.branchIds)];
      if (branchIds.length) {
        const valid = await sql<{ id: string }>`
          select id
          from branches
          where tenant_id = ${tenantId} and id = any(${branchIds})
        `;
        if (valid.length !== branchIds.length) {
          return { ok: false, code: "invalid", error: "يوجد فرع غير صالح لهذا النشاط" };
        }
      }

      await sql`delete from member_branch_access where tenant_id = ${tenantId} and user_id = ${data.userId}`;
      for (const branchId of branchIds) {
        await sql`
          insert into member_branch_access (tenant_id, user_id, branch_id)
          values (${tenantId}, ${data.userId}, ${branchId})
        `;
      }

      return { ok: true, data: await teamSnapshot(sql, tenantId) };
    } catch (err) {
      console.error("setTeamMemberBranches failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحديث فروع العضو" };
    }
  });

export const removeTeamMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ members: TeamMember[]; branches: TeamBranch[] }>> => {
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

      await sql`delete from member_branch_access where tenant_id = ${tenantId} and user_id = ${data.userId}`;
      await sql`
        delete from tenant_members
        where tenant_id = ${tenantId} and user_id = ${data.userId}
      `;

      return { ok: true, data: await teamSnapshot(sql, tenantId) };
    } catch (err) {
      console.error("removeTeamMember failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إزالة عضو الفريق" };
    }
  });
