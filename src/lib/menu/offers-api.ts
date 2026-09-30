import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import { riyadhLocalToIso } from "./offers";
import type { FnResult, ProductOffer, Role } from "./types";

const input = z.object({
  id: z.string().optional(), productId: z.string().min(1),
  offerType: z.enum(["percentage", "fixed", "sale_price", "bogo"]),
  value: z.number().min(0).max(100000).nullable().optional(),
  labelAr: z.string().trim().max(120).optional(), labelEn: z.string().trim().max(120).optional(),
  startsAt: z.string().optional().or(z.literal("")), endsAt: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});
type Member = { tenant_id: string; role: Role };
const canWrite = (role: Role) => role === "owner" || role === "admin" || role === "editor";

async function memberFor(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<Member>`select tenant_id, role from tenant_members where user_id = ${userId} and is_active = true order by created_at limit 1`;
  return rows[0] ?? null;
}
function mapOffer(row: Record<string, unknown>): ProductOffer {
  return {
    id: String(row.id), tenantId: String(row.tenant_id), productId: String(row.product_id),
    offerType: row.offer_type as ProductOffer["offerType"], value: row.value == null ? null : Number(row.value),
    labelAr: String(row.label_ar ?? ""), labelEn: String(row.label_en ?? ""),
    startsAt: row.starts_at ? new Date(String(row.starts_at)).toISOString() : null,
    endsAt: row.ends_at ? new Date(String(row.ends_at)).toISOString() : null, isActive: Boolean(row.is_active),
  };
}
export const getProductOffer = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(z.object({ productId: z.string().min(1) })).handler(async ({ context, data }): Promise<FnResult<ProductOffer | null>> => {
  try {
    const sql = await getSql(), member = await memberFor(sql, context.userId);
    if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
    const rows = await sql`select * from product_offers where tenant_id = ${member.tenant_id} and product_id = ${data.productId} order by created_at desc limit 1`;
    return { ok: true, data: rows[0] ? mapOffer(rows[0] as Record<string, unknown>) : null };
  } catch (error) { console.error("getProductOffer failed", error); return { ok: false, code: "unavailable", error: "تعذر تحميل العرض" }; }
});
export const saveProductOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(input).handler(async ({ context, data }): Promise<FnResult<ProductOffer>> => {
  try {
    const sql = await getSql(), member = await memberFor(sql, context.userId);
    if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
    if (!canWrite(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
    const product = await sql`select id from products where id = ${data.productId} and tenant_id = ${member.tenant_id} limit 1`;
    if (!product[0]) return { ok: false, code: "not_found", error: "الصنف غير موجود" };
    if (data.offerType !== "bogo" && data.value == null) return { ok: false, code: "invalid", error: "قيمة العرض مطلوبة" };
    if (data.offerType === "percentage" && Number(data.value) > 100) return { ok: false, code: "invalid", error: "النسبة يجب ألا تتجاوز 100%" };
    const id = data.id ?? newId();
    if (data.isActive) await sql`update product_offers set is_active = false, updated_at = now() where tenant_id = ${member.tenant_id} and product_id = ${data.productId} and id <> ${id} and is_active = true`;
    const startsAt = data.startsAt ? riyadhLocalToIso(data.startsAt) : null;
    const endsAt = data.endsAt ? riyadhLocalToIso(data.endsAt) : null;
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) return { ok: false, code: "invalid", error: "نهاية العرض يجب أن تكون بعد بدايته" };
    await sql`insert into product_offers (id, tenant_id, product_id, offer_type, value, label_ar, label_en, starts_at, ends_at, is_active)
      values (${id}, ${member.tenant_id}, ${data.productId}, ${data.offerType}, ${data.value ?? null}, ${data.labelAr ?? ""}, ${data.labelEn ?? ""}, ${startsAt}, ${endsAt}, ${data.isActive})
      on conflict (id) do update set offer_type = excluded.offer_type, value = excluded.value, label_ar = excluded.label_ar, label_en = excluded.label_en, starts_at = excluded.starts_at, ends_at = excluded.ends_at, is_active = excluded.is_active, updated_at = now()`;
    const rows = await sql`select * from product_offers where id = ${id} and tenant_id = ${member.tenant_id} limit 1`;
    return rows[0] ? { ok: true, data: mapOffer(rows[0] as Record<string, unknown>) } : { ok: false, code: "unavailable", error: "تعذر تأكيد حفظ العرض" };
  } catch (error) { console.error("saveProductOffer failed", error); return { ok: false, code: "unavailable", error: "تعذر حفظ العرض" }; }
});
export const deleteProductOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(z.object({ id: z.string().min(1), productId: z.string().min(1) })).handler(async ({ context, data }): Promise<FnResult<{ deleted: true }>> => {
  try {
    const sql = await getSql(), member = await memberFor(sql, context.userId);
    if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
    if (!canWrite(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
    await sql`delete from product_offers where id = ${data.id} and product_id = ${data.productId} and tenant_id = ${member.tenant_id}`;
    return { ok: true, data: { deleted: true } };
  } catch (error) { console.error("deleteProductOffer failed", error); return { ok: false, code: "unavailable", error: "تعذر حذف العرض" }; }
});
