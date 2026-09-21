import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FnResult, Product, Role } from "./types";
import { mapProduct } from "./map";

const input = z.object({
  productId: z.string().min(1),
  tags: z.array(z.string().trim().min(1).max(40)).max(30),
  dietaryLabels: z.array(z.string().trim().min(1).max(60)).max(20),
});

type Member = { tenant_id: string; role: Role };

function canWrite(role: Role) {
  return role === "owner" || role === "admin" || role === "editor";
}

async function getMember(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<Member>`select tenant_id, role from tenant_members where user_id = ${userId} order by created_at limit 1`;
  return rows[0] ?? null;
}

export const saveProductMetadata = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(input)
  .handler(async ({ context, data }): Promise<FnResult<Product>> => {
    try {
      const sql = await getSql();
      const member = await getMember(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWrite(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const product = await sql<{ id: string }>`select id from products where id = ${data.productId} and tenant_id = ${member.tenant_id} limit 1`;
      if (!product[0]) return { ok: false, code: "not_found", error: "الصنف غير موجود" };
      const tags = [...new Set(data.tags.map((v) => v.trim()).filter(Boolean))];
      const dietary = [...new Set(data.dietaryLabels.map((v) => v.trim()).filter(Boolean))];
      const rows = await sql`update products set tags = ${tags}, dietary_labels = ${dietary}, updated_at = now() where id = ${data.productId} and tenant_id = ${member.tenant_id} returning *`;
      return rows[0] ? { ok: true, data: mapProduct(rows[0] as Record<string, unknown>) } : { ok: false, code: "unavailable", error: "تعذر تأكيد حفظ بيانات الصنف" };
    } catch (err) {
      console.error("saveProductMetadata failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ بيانات الصنف" };
    }
  });
