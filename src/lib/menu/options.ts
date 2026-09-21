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

function mapVariant(row: Record<string, unknown>): ProductVariant {
  return {
    id: String(row.id), tenantId: String(row.tenant_id), productId: String(row.product_id),
    nameAr: String(row.name_ar), nameEn: String(row.name_en ?? ""), price: Number(row.price),
    sortOrder: Number(row.sort_order), isAvailable: Boolean(row.is_available),
  };
}
function mapGroup(row: Record<string, unknown>): ModifierGroup {
  return {
    id: String(row.id), tenantId: String(row.tenant_id), nameAr: String(row.name_ar), nameEn: String(row.name_en ?? ""),
    minSelect: Number(row.min_select), maxSelect: Number(row.max_select), sortOrder: Number(row.sort_order),
    isRequired: Boolean(row.is_required), isActive: Boolean(row.is_active),
  };
}
function mapOption(row: Record<string, unknown>): ModifierOption {
  return {
    id: String(row.id), tenantId: String(row.tenant_id), groupId: String(row.group_id),
    nameAr: String(row.name_ar), nameEn: String(row.name_en ?? ""), priceDelta: Number(row.price_delta),
    sortOrder: Number(row.sort_order), isAvailable: Boolean(row.is_available),
  };
}

async function assertProduct(sql: Awaited<ReturnType<typeof getSql>>, userId: string, productId: string) {
  const member = await memberFor(sql, userId);
  if (!member) return { error: { ok: false as const, code: "not_found" as const, error: "لا يوجد مطعم" } };
  const rows = await sql<{ id: string }>`select id from products where id = ${productId} and tenant_id = ${member.tenant_id} limit 1`;
  if (!rows[0]) return { error: { ok: false as const, code: "not_found" as const, error: "الصنف غير موجود" } };
  return { member };
}

export const listProductOptions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ productId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ variants: ProductVariant[]; groups: ModifierGroup[]; options: ModifierOption[] }>> => {
    try {
      const sql = await getSql();
      const checked = await assertProduct(sql, context.userId, data.productId);
      if (checked.error) return checked.error;
      const tenantId = checked.member.tenant_id;
      const [variants, groups, options] = await Promise.all([
        sql`select * from product_variants where product_id = ${data.productId} and tenant_id = ${tenantId} order by sort_order, created_at`,
        sql`select g.* from modifier_groups g join product_modifier_groups p on p.modifier_group_id = g.id where p.product_id = ${data.productId} and g.tenant_id = ${tenantId} order by p.sort_order, g.sort_order, g.created_at`,
        sql`select o.* from modifier_options o join product_modifier_groups p on p.modifier_group_id = o.group_id where p.product_id = ${data.productId} and o.tenant_id = ${tenantId} order by o.group_id, o.sort_order, o.created_at`,
      ]);
      return { ok: true, data: { variants: variants.map((r) => mapVariant(r as Record<string, unknown>)), groups: groups.map((r) => mapGroup(r as Record<string, unknown>)), options: options.map((r) => mapOption(r as Record<string, unknown>)) } };
    } catch (err) {
      console.error("listProductOptions failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل خيارات الصنف" };
    }
  });

const variantInput = z.object({
  id: z.string().optional(), productId: z.string().min(1), nameAr: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().max(120).optional(), price: z.number().min(0).max(100000),
  sortOrder: z.number().int().min(0).optional(), isAvailable: z.boolean().optional(),
});

export const saveProductVariant = createServerFn({ method: "POST" })
  .middleware([authMiddleware]).validator(variantInput)
  .handler(async ({ context, data }): Promise<FnResult<ProductVariant>> => {
    try {
      const sql = await getSql();
      const checked = await assertProduct(sql, context.userId, data.productId);
      if (checked.error) return checked.error;
      if (!canWrite(checked.member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const id = data.id ?? newId();
      await sql`
        insert into product_variants (id, tenant_id, product_id, name_ar, name_en, price, sort_order, is_available)
        values (${id}, ${checked.member.tenant_id}, ${data.productId}, ${data.nameAr}, ${data.nameEn ?? ""}, ${data.price}, ${data.sortOrder ?? 0}, ${data.isAvailable ?? true})
        on conflict (id) do update set name_ar = excluded.name_ar, name_en = excluded.name_en, price = excluded.price, sort_order = excluded.sort_order, is_available = excluded.is_available, updated_at = now()
      `;
      const rows = await sql`select * from product_variants where id = ${id} and tenant_id = ${checked.member.tenant_id} limit 1`;
      return rows[0] ? { ok: true, data: mapVariant(rows[0] as Record<string, unknown>) } : { ok: false, code: "unavailable", error: "تعذر تأكيد الحفظ" };
    } catch (err) {
      console.error("saveProductVariant failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ الحجم" };
    }
  });

export const deleteProductVariant = createServerFn({ method: "POST" })
  .middleware([authMiddleware]).validator(z.object({ id: z.string().min(1), productId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ deleted: true }>> => {
    try {
      const sql = await getSql();
      const checked = await assertProduct(sql, context.userId, data.productId);
      if (checked.error) return checked.error;
      if (!canWrite(checked.member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      await sql`delete from product_variants where id = ${data.id} and product_id = ${data.productId} and tenant_id = ${checked.member.tenant_id}`;
      return { ok: true, data: { deleted: true } };
    } catch (err) {
      console.error("deleteProductVariant failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حذف الحجم" };
    }
  });

const groupInput = z.object({
  id: z.string().optional(), nameAr: z.string().trim().min(1).max(120), nameEn: z.string().trim().max(120).optional(),
  minSelect: z.number().int().min(0).max(50), maxSelect: z.number().int().min(0).max(50),
  sortOrder: z.number().int().min(0).optional(), isRequired: z.boolean().optional(), isActive: z.boolean().optional(),
});

export const saveModifierGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware]).validator(groupInput)
  .handler(async ({ context, data }): Promise<FnResult<ModifierGroup>> => {
    try {
      if (data.maxSelect < data.minSelect) return { ok: false, code: "invalid", error: "الحد الأقصى يجب أن يكون أكبر من أو يساوي الحد الأدنى" };
      const sql = await getSql();
      const member = await memberFor(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWrite(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const id = data.id ?? newId();
      await sql`
        insert into modifier_groups (id, tenant_id, name_ar, name_en, min_select, max_select, sort_order, is_required, is_active)
        values (${id}, ${member.tenant_id}, ${data.nameAr}, ${data.nameEn ?? ""}, ${data.minSelect}, ${data.maxSelect}, ${data.sortOrder ?? 0}, ${data.isRequired ?? false}, ${data.isActive ?? true})
        on conflict (id) do update set name_ar = excluded.name_ar, name_en = excluded.name_en, min_select = excluded.min_select, max_select = excluded.max_select, sort_order = excluded.sort_order, is_required = excluded.is_required, is_active = excluded.is_active, updated_at = now()
      `;
      const rows = await sql`select * from modifier_groups where id = ${id} and tenant_id = ${member.tenant_id} limit 1`;
      return rows[0] ? { ok: true, data: mapGroup(rows[0] as Record<string, unknown>) } : { ok: false, code: "unavailable", error: "تعذر تأكيد الحفظ" };
    } catch (err) {
      console.error("saveModifierGroup failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ مجموعة الخيارات" };
    }
  });

export const attachModifierGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware]).validator(z.object({ productId: z.string().min(1), groupId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ attached: true }>> => {
    try {
      const sql = await getSql();
      const checked = await assertProduct(sql, context.userId, data.productId);
      if (checked.error) return checked.error;
      if (!canWrite(checked.member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const group = await sql`select id from modifier_groups where id = ${data.groupId} and tenant_id = ${checked.member.tenant_id} limit 1`;
      if (!group[0]) return { ok: false, code: "invalid", error: "مجموعة خيارات غير صالحة" };
      await sql`insert into product_modifier_groups (product_id, modifier_group_id, sort_order) values (${data.productId}, ${data.groupId}, 0) on conflict do nothing`;
      return { ok: true, data: { attached: true } };
    } catch (err) {
      console.error("attachModifierGroup failed", err);
      return { ok: false, code: "unavailable", error: "تعذر ربط مجموعة الخيارات" };
    }
  });

export const detachModifierGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware]).validator(z.object({ productId: z.string().min(1), groupId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ detached: true }>> => {
    try {
      const sql = await getSql();
      const checked = await assertProduct(sql, context.userId, data.productId);
      if (checked.error) return checked.error;
      if (!canWrite(checked.member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      await sql`delete from product_modifier_groups where product_id = ${data.productId} and modifier_group_id = ${data.groupId}`;
      return { ok: true, data: { detached: true } };
    } catch (err) {
      console.error("detachModifierGroup failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إلغاء ربط المجموعة" };
    }
  });

const optionInput = z.object({
  id: z.string().optional(), groupId: z.string().min(1), nameAr: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().max(120).optional(), priceDelta: z.number().min(-100000).max(100000),
  sortOrder: z.number().int().min(0).optional(), isAvailable: z.boolean().optional(),
});

export const saveModifierOption = createServerFn({ method: "POST" })
  .middleware([authMiddleware]).validator(optionInput)
  .handler(async ({ context, data }): Promise<FnResult<ModifierOption>> => {
    try {
      const sql = await getSql();
      const member = await memberFor(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWrite(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const group = await sql`select id from modifier_groups where id = ${data.groupId} and tenant_id = ${member.tenant_id} limit 1`;
      if (!group[0]) return { ok: false, code: "invalid", error: "مجموعة خيارات غير صالحة" };
      const id = data.id ?? newId();
      await sql`
        insert into modifier_options (id, tenant_id, group_id, name_ar, name_en, price_delta, sort_order, is_available)
        values (${id}, ${member.tenant_id}, ${data.groupId}, ${data.nameAr}, ${data.nameEn ?? ""}, ${data.priceDelta}, ${data.sortOrder ?? 0}, ${data.isAvailable ?? true})
        on conflict (id) do update set name_ar = excluded.name_ar, name_en = excluded.name_en, price_delta = excluded.price_delta, sort_order = excluded.sort_order, is_available = excluded.is_available, updated_at = now()
      `;
      const rows = await sql`select * from modifier_options where id = ${id} and tenant_id = ${member.tenant_id} limit 1`;
      return rows[0] ? { ok: true, data: mapOption(rows[0] as Record<string, unknown>) } : { ok: false, code: "unavailable", error: "تعذر تأكيد الحفظ" };
    } catch (err) {
      console.error("saveModifierOption failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ الإضافة" };
    }
  });

export const deleteModifierOption = createServerFn({ method: "POST" })
  .middleware([authMiddleware]).validator(z.object({ id: z.string().min(1), groupId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ deleted: true }>> => {
    try {
      const sql = await getSql();
      const member = await memberFor(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWrite(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      await sql`delete from modifier_options where id = ${data.id} and group_id = ${data.groupId} and tenant_id = ${member.tenant_id}`;
      return { ok: true, data: { deleted: true } };
    } catch (err) {
      console.error("deleteModifierOption failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حذف الإضافة" };
    }
  });
