import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import type { FnResult, ModifierGroup, ModifierOption, ProductVariant, Role } from "./types";

function canWrite(role: Role) {
  return role === "owner" || role === "admin" || role === "editor";
}

type Member = { tenant_id: string; role: Role };

async function memberFor(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<Member>`
    select tenant_id, role from tenant_members
    where user_id = ${userId}
    order by created_at
    limit 1
  `;
  return rows[0] ?? null;
}

export const listProductOptions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ productId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ variants: ProductVariant[]; groups: ModifierGroup[]; options: ModifierOption[] }>> => {
    try {
      const sql = await getSql();
      const member = await memberFor(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      const product = await sql`select id from products where id = ${data.productId} and tenant_id = ${member.tenant_id} limit 1`;
      if (!product[0]) return { ok: false, code: "not_found", error: "الصنف غير موجود" };

      const [variants, groups, options] = await Promise.all([
        sql`select id, tenant_id, product_id, name_ar, name_en, price, sort_order, is_available from product_variants where product_id = ${data.productId} and tenant_id = ${member.tenant_id} order by sort_order, created_at`,
        sql`select g.* from modifier_groups g join product_modifier_groups p on p.modifier_group_id = g.id where p.product_id = ${data.productId} and g.tenant_id = ${member.tenant_id} order by p.sort_order, g.sort_order, g.created_at`,
        sql`select o.* from modifier_options o join product_modifier_groups p on p.modifier_group_id = o.group_id where p.product_id = ${data.productId} and o.tenant_id = ${member.tenant_id} order by o.group_id, o.sort_order, o.created_at`,
      ]);

      return {
        ok: true,
        data: {
          variants: variants.map((r) => ({ id: String(r.id), tenantId: String(r.tenant_id), productId: String(r.product_id), nameAr: String(r.name_ar), nameEn: String(r.name_en ?? ""), price: Number(r.price), sortOrder: Number(r.sort_order), isAvailable: Boolean(r.is_available) })),
          groups: groups.map((r) => ({ id: String(r.id), tenantId: String(r.tenant_id), nameAr: String(r.name_ar), nameEn: String(r.name_en ?? ""), minSelect: Number(r.min_select), maxSelect: Number(r.max_select), sortOrder: Number(r.sort_order), isRequired: Boolean(r.is_required), isActive: Boolean(r.is_active) })),
          options: options.map((r) => ({ id: String(r.id), tenantId: String(r.tenant_id), groupId: String(r.group_id), nameAr: String(r.name_ar), nameEn: String(r.name_en ?? ""), priceDelta: Number(r.price_delta), sortOrder: Number(r.sort_order), isAvailable: Boolean(r.is_available) })),
        },
      };
    } catch (err) {
      console.error("listProductOptions failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل خيارات الصنف" };
    }
  });

const variantInput = z.object({
  id: z.string().optional(),
  productId: z.string().min(1),
  nameAr: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().max(120).optional(),
  price: z.number().min(0).max(100000),
  sortOrder: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
});

export const saveProductVariant = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(variantInput)
  .handler(async ({ context, data }): Promise<FnResult<ProductVariant>> => {
    try {
      const sql = await getSql();
      const member = await memberFor(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWrite(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const product = await sql`select id from products where id = ${data.productId} and tenant_id = ${member.tenant_id} limit 1`;
      if (!product[0]) return { ok: false, code: "invalid", error: "الصنف غير صالح" };
      const id = data.id ?? newId();
      await sql`
        insert into product_variants (id, tenant_id, product_id, name_ar, name_en, price, sort_order, is_available)
        values (${id}, ${member.tenant_id}, ${data.productId}, ${data.nameAr}, ${data.nameEn ?? ""}, ${data.price}, ${data.sortOrder ?? 0}, ${data.isAvailable ?? true})
        on conflict (id) do update set name_ar = excluded.name_ar, name_en = excluded.name_en, price = excluded.price, sort_order = excluded.sort_order, is_available = excluded.is_available, updated_at = now()
      `;
      const rows = await sql`select * from product_variants where id = ${id} and tenant_id = ${member.tenant_id} limit 1`;
      const r = rows[0];
      return { ok: true, data: { id: String(r.id), tenantId: String(r.tenant_id), productId: String(r.product_id), nameAr: String(r.name_ar), nameEn: String(r.name_en ?? ""), price: Number(r.price), sortOrder: Number(r.sort_order), isAvailable: Boolean(r.is_available) } };
    } catch (err) {
      console.error("saveProductVariant failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ الحجم أو الخيار" };
    }
  });
