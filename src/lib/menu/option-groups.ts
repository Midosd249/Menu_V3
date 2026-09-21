import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FnResult, ModifierGroup, Role } from "./types";

function canRead(role: Role) {
  return role === "owner" || role === "admin" || role === "editor";
}

export const listModifierGroups = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({}).optional())
  .handler(async ({ context }): Promise<FnResult<ModifierGroup[]>> => {
    try {
      const sql = await getSql();
      const members = await sql<{ tenant_id: string; role: Role }>`
        select tenant_id, role from tenant_members
        where user_id = ${context.userId}
        order by created_at
        limit 1
      `;
      const member = members[0];
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canRead(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const rows = await sql`
        select * from modifier_groups
        where tenant_id = ${member.tenant_id}
        order by sort_order, created_at
      `;
      return {
        ok: true,
        data: rows.map((r) => ({
          id: String(r.id),
          tenantId: String(r.tenant_id),
          nameAr: String(r.name_ar),
          nameEn: String(r.name_en ?? ""),
          minSelect: Number(r.min_select),
          maxSelect: Number(r.max_select),
          sortOrder: Number(r.sort_order),
          isRequired: Boolean(r.is_required),
          isActive: Boolean(r.is_active),
        })),
      };
    } catch (err) {
      console.error("listModifierGroups failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل مجموعات الخيارات" };
    }
  });
