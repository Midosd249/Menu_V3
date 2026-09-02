import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import type { FnResult } from "./types";

const slugSchema = z.string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*$/);
const selectedSchema = z.object({
  variantId: z.string().max(80).nullable().optional(),
  modifierOptionIds: z.array(z.string().max(80)).max(40).default([]),
});
const itemSchema = z.object({ productId: z.string().max(80), quantity: z.number().int().min(1).max(20), selected: selectedSchema });
const submitOrderSchema = z.object({
  slug: slugSchema,
  branchSlug: z.string().min(1).max(63).optional(),
  source: z.enum(["web", "qr"]).default("web"),
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(8).max(30),
  customerEmail: z.string().trim().email().max(160).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional(),
  items: z.array(itemSchema).min(1).max(50),
});

type ProductRow = { id: string; tenant_id: string; name_ar: string; name_en: string; price: number; currency: string; is_available: boolean };
type VariantRow = { id: string; product_id: string; name_ar: string; name_en: string; price: number; is_available: boolean };
type GroupRow = { id: string; product_id: string; name_ar: string; name_en: string; min_select: number; max_select: number; is_required: boolean };
type OptionRow = { id: string; group_id: string; name_ar: string; name_en: string; price_delta: number; is_available: boolean };

type PreparedItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productNameAr: string;
  productNameEn: string;
  selectedOptions: Array<{ type: "variant" | "modifier"; id: string; groupId?: string; nameAr: string; nameEn: string; priceDelta: number }>;
};

const fail = (error: string): FnResult<never> => ({ ok: false, code: "invalid", error });

export const submitPublicOrder = createServerFn({ method: "POST" })
  .validator(submitOrderSchema)
  .handler(async ({ data }): Promise<FnResult<{ orderId: string; orderNumber: number; total: number; currency: string }>> => {
    try {
      const sql = await getSql();
      const tenantRows = await sql<{ id: string; currency: string }>`
        select id, currency from tenants
        where slug = ${data.slug} and is_active = true and is_published = true limit 1
      `;
      const tenant = tenantRows[0];
      if (!tenant) return { ok: false, code: "not_found", error: "المنيو غير موجود" };

      const branchRows = await sql<{ id: string }>`
        select id from branches
        where tenant_id = ${tenant.id} and is_active = true
          and (${data.branchSlug ?? null}::text is null or slug = ${data.branchSlug ?? null})
        order by created_at limit 1
      `;
      const branchId = branchRows[0]?.id;
      if (!branchId) return { ok: false, code: "not_found", error: "الفرع غير متاح" };

      const productIds = [...new Set(data.items.map((item) => item.productId))];
      const products = await sql<ProductRow>`
        select id, tenant_id, name_ar, name_en, price, currency, is_available
        from products where tenant_id = ${tenant.id} and id = any(${productIds})
      `;
      if (products.length !== productIds.length) return fail("يوجد صنف غير صالح في الطلب");
      if (products.some((p) => !p.is_available)) return fail("أحد الأصناف غير متاح حالياً");
      const productById = new Map(products.map((p) => [String(p.id), p]));

      const [variants, groups] = await Promise.all([
        sql<VariantRow>`
          select id, product_id, name_ar, name_en, price, is_available
          from product_variants where tenant_id = ${tenant.id} and product_id = any(${productIds})
        `,
        sql<GroupRow>`
          select g.id, p.product_id, g.name_ar, g.name_en, g.min_select, g.max_select, g.is_required
          from modifier_groups g
          join product_modifier_groups p on p.modifier_group_id = g.id
          where g.tenant_id = ${tenant.id} and p.product_id = any(${productIds}) and g.is_active = true
        `,
      ]);
      const variantById = new Map(variants.map((v) => [String(v.id), v]));
      const variantsByProduct = new Map<string, VariantRow[]>();
      for (const v of variants) {
        const list = variantsByProduct.get(String(v.product_id)) ?? [];
        list.push(v); variantsByProduct.set(String(v.product_id), list);
      }
      const groupsByProduct = new Map<string, GroupRow[]>();
      for (const g of groups) {
        const list = groupsByProduct.get(String(g.product_id)) ?? [];
        list.push(g); groupsByProduct.set(String(g.product_id), list);
      }

      const variantIds = [...new Set(data.items.map((item) => item.selected.variantId).filter((id): id is string => Boolean(id)))];
      const modifierOptionIds = [...new Set(data.items.flatMap((item) => item.selected.modifierOptionIds))];
      const options = modifierOptionIds.length
        ? await sql<OptionRow>`
            select o.id, o.group_id, o.name_ar, o.name_en, o.price_delta, o.is_available
            from modifier_options o
            where o.tenant_id = ${tenant.id} and o.id = any(${modifierOptionIds})
          `
        : [];
      const optionById = new Map(options.map((o) => [String(o.id), o]));
      if (variantIds.some((id) => !variantById.has(id)) || options.length !== modifierOptionIds.length) return fail("أحد خيارات الطلب غير صالح");
      if (options.some((o) => !o.is_available) || variantIds.some((id) => !variantById.get(id)?.is_available)) return fail("أحد خيارات الطلب غير متاح");

      const prepared: PreparedItem[] = [];
      for (const item of data.items) {
        const product = productById.get(item.productId)!;
        const productVariants = variantsByProduct.get(item.productId) ?? [];
        const variant = item.selected.variantId ? variantById.get(item.selected.variantId) : undefined;
        if (productVariants.length > 0 && !variant) return fail("يجب اختيار الحجم للصنف");
        if (variant && String(variant.product_id) !== item.productId) return fail("الحجم المحدد لا يطابق الصنف");

        const optionRows = item.selected.modifierOptionIds.map((id) => optionById.get(id)).filter((o): o is OptionRow => Boolean(o));
        if (new Set(optionRows.map((o) => String(o.id))).size !== optionRows.length) return fail("لا يمكن تكرار الإضافة نفسها");
        const productGroups = groupsByProduct.get(item.productId) ?? [];
        const productGroupIds = new Set(productGroups.map((g) => String(g.id)));
        if (optionRows.some((o) => !productGroupIds.has(String(o.group_id)))) return fail("الإضافة لا تنتمي إلى الصنف");

        for (const group of productGroups) {
          const count = optionRows.filter((o) => String(o.group_id) === String(group.id)).length;
          if (count < Number(group.min_select) || count > Number(group.max_select)) return fail(`خيارات المجموعة «${group.name_ar}» غير مكتملة`);
          if (group.is_required && count < 1) return fail(`يجب اختيار إضافة من «${group.name_ar}»`);
        }

        const selectedOptions: PreparedItem["selectedOptions"] = [];
        if (variant) selectedOptions.push({ type: "variant", id: String(variant.id), nameAr: variant.name_ar, nameEn: variant.name_en, priceDelta: Number(variant.price) - Number(product.price) });
        for (const option of optionRows) selectedOptions.push({ type: "modifier", id: String(option.id), groupId: String(option.group_id), nameAr: option.name_ar, nameEn: option.name_en, priceDelta: Number(option.price_delta) });

        const unitPrice = Number(variant?.price ?? product.price) + optionRows.reduce((sum, option) => sum + Number(option.price_delta), 0);
        prepared.push({
          id: newId(), productId: String(product.id), quantity: item.quantity, unitPrice, lineTotal: unitPrice * item.quantity,
          productNameAr: product.name_ar, productNameEn: product.name_en, selectedOptions,
        });
      }

      const subtotal = prepared.reduce((sum, item) => sum + item.lineTotal, 0);
      const orderId = newId();
      const eventId = newId();
      const itemsJson = JSON.stringify(prepared.map((item) => ({
        id: item.id, productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, lineTotal: item.lineTotal,
        productNameAr: item.productNameAr, productNameEn: item.productNameEn, selectedOptions: item.selectedOptions,
      })));

      const created = await sql<{ id: string; order_number: number }>`
        with new_order as (
          insert into orders (id, tenant_id, branch_id, status, source, customer_name, customer_phone, customer_email, notes, currency, subtotal, total)
          values (${orderId}, ${tenant.id}, ${branchId}, 'new', ${data.source}, ${data.customerName}, ${data.customerPhone}, ${data.customerEmail || null}, ${data.notes ?? null}, ${tenant.currency || "SAR"}, ${subtotal}, ${subtotal})
          returning id, order_number
        ),
        inserted_items as (
          insert into order_items (id, order_id, product_id, product_name_ar, product_name_en, quantity, unit_price, line_total, selected_options)
          select item.id, new_order.id, item.product_id, item.product_name_ar, item.product_name_en, item.quantity, item.unit_price, item.line_total, item.selected_options
          from new_order cross join lateral jsonb_to_recordset(${itemsJson}::jsonb) as item(
            id text, product_id text, quantity integer, unit_price numeric, line_total numeric,
            product_name_ar text, product_name_en text, selected_options jsonb
          ) returning order_id
        ),
        inserted_event as (
          insert into order_status_events (id, order_id, from_status, to_status)
          select ${eventId}, id, null, 'new' from new_order returning order_id
        )
        select id, order_number from new_order
      `;

      const order = created[0];
      if (!order) return { ok: false, code: "unavailable", error: "تعذر إنشاء الطلب" };
      return { ok: true, data: { orderId: String(order.id), orderNumber: Number(order.order_number), total: subtotal, currency: tenant.currency || "SAR" } };
    } catch (err) {
      console.error("submitPublicOrder failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إرسال الطلب حالياً. حاول مرة أخرى." };
    }
  });
