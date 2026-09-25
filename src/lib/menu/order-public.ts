import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import type { FnResult } from "./types";
import { ANONYMOUS_SESSION_COOKIE, resolveAnonymousSession } from "./session.server";
import type { OrderReceiptData } from "./order-receipt";

const slugSchema = z.string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*$/);
const selectedSchema = z.object({
  variantId: z.string().max(80).nullable().optional(),
  modifierOptionIds: z.array(z.string().max(80)).max(40).default([]),
  note: z.string().trim().max(500).optional().or(z.literal("")),
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
type PreparedSelectedOption = { type: "variant" | "modifier" | "note"; id: string; groupId?: string; nameAr: string; nameEn: string; priceDelta: number };

type PreparedItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productNameAr: string;
  productNameEn: string;
  selectedOptions: PreparedSelectedOption[];
};

const fail = (error: string): FnResult<never> => ({ ok: false, code: "invalid", error });
const normalizePhone = (phone: string) => phone.replace(/[^0-9+]/g, "");

const stableDigest = (value: string) => {
  let left = 2166136261;
  let right = 2654435761;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    left = Math.imul(left ^ code, 16777619);
    right = Math.imul(right ^ (code + index), 2246822519);
  }
  return `${(left >>> 0).toString(16).padStart(8, "0")}${(right >>> 0).toString(16).padStart(8, "0")}`;
};

const orderRateKey = (tenantId: string, branchId: string, phone: string) =>
  stableDigest(`${tenantId}:${branchId}:${normalizePhone(phone)}`);

const orderFingerprint = (data: z.infer<typeof submitOrderSchema>, tenantId: string, branchId: string) =>
  stableDigest(JSON.stringify({
    tenantId,
    branchId,
    slug: data.slug,
    source: data.source,
    customerName: data.customerName,
    customerPhone: normalizePhone(data.customerPhone),
    customerEmail: data.customerEmail || "",
    notes: data.notes || "",
    items: data.items,
  }));

export const getPublicOrderReceipt = createServerFn({ method: "GET" })
  .validator(z.object({ orderId: z.string().min(1).max(100) }))
  .handler(async ({ data }): Promise<FnResult<OrderReceiptData>> => {
    try {
      const cookie = getCookie(ANONYMOUS_SESSION_COOKIE)?.trim() ?? "";
      if (!/^[0-9a-f]{64}$/i.test(cookie)) return { ok: false, code: "forbidden", error: "الإيصال غير متاح لهذا الطلب" };
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        select o.id, o.order_number, o.created_at, o.currency, o.customer_name, o.subtotal, o.total,
          t.name_ar as restaurant_name_ar, t.name_en as restaurant_name_en, t.logo_url as restaurant_logo_url,
          t.vat_registration_number, b.name_ar as branch_name_ar, b.name_en as branch_name_en,
          coalesce((select jsonb_agg(jsonb_build_object(
            'id', oi.id, 'name_ar', oi.product_name_ar, 'name_en', oi.product_name_en,
            'quantity', oi.quantity, 'unit_price', oi.unit_price, 'line_total', oi.line_total,
            'selected_options', oi.selected_options
          ) order by oi.created_at) from order_items oi where oi.order_id = o.id), '[]'::jsonb) as items
        from orders o
        join tenants t on t.id = o.tenant_id
        left join branches b on b.id = o.branch_id
        join anonymous_sessions s on s.id = o.anonymous_session_id and s.tenant_id = o.tenant_id
        where o.id = ${data.orderId}
          and o.anonymous_session_id = ${cookie}
          and s.revoked_at is null
          and s.expires_at > now()
        limit 1
      `;
      const row = rows[0];
      if (!row) return { ok: false, code: "forbidden", error: "الإيصال غير متاح لهذا الطلب" };
      const rawItems = Array.isArray(row.items) ? row.items : [];
      return { ok: true, data: {
        orderId: String(row.id), orderNumber: Number(row.order_number ?? 0),
        restaurantNameAr: String(row.restaurant_name_ar ?? ""), restaurantNameEn: String(row.restaurant_name_en ?? ""), restaurantLogoUrl: String(row.restaurant_logo_url ?? ""),
        branchNameAr: String(row.branch_name_ar ?? ""), branchNameEn: String(row.branch_name_en ?? ""), createdAt: new Date(String(row.created_at)).toISOString(),
        currency: String(row.currency ?? "SAR"), customerName: String(row.customer_name ?? ""),
        items: rawItems.map((item) => {
          const source = item as Record<string, unknown>;
          const selected = Array.isArray(source.selected_options) ? source.selected_options : [];
          const note = selected.find((option) => option && typeof option === "object" && (option as Record<string, unknown>).type === "note") as Record<string, unknown> | undefined;
          return { id: String(source.id ?? ""), nameAr: String(source.name_ar ?? ""), nameEn: String(source.name_en ?? ""), quantity: Number(source.quantity ?? 0), unitPrice: Number(source.unit_price ?? 0), lineTotal: Number(source.line_total ?? 0), note: note ? String(note.nameAr ?? note.nameEn ?? "") : undefined };
        }),
        subtotal: Number(row.subtotal ?? 0), total: Number(row.total ?? 0), vatRegistrationNumber: String(row.vat_registration_number ?? ""),
      } };
    } catch (error) {
      console.error("getPublicOrderReceipt failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل الإيصال" };
    }
  });

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

      const anonymousSession = await resolveAnonymousSession(sql, String(tenant.id));
      const anonymousSessionId = anonymousSession.fromValidCookie ? anonymousSession.id : null;

      const clientToken = orderRateKey(String(tenant.id), String(branchId), data.customerPhone);
      const rateWindow = new Date(Math.floor(Date.now() / 600000) * 600000);
      const rateRows = await sql<{ request_count: number }>`
        insert into public_order_rate_limits (tenant_id, branch_id, client_token, window_start, request_count)
        values (${tenant.id}, ${branchId}, ${clientToken}, ${rateWindow}, 1)
        on conflict (tenant_id, branch_id, client_token, window_start)
        do update set request_count = public_order_rate_limits.request_count + 1, updated_at = now()
        returning request_count
      `;
      if (Number(rateRows[0]?.request_count ?? 0) > 6) {
        return { ok: false, code: "unavailable", error: "تم تجاوز عدد الطلبات المسموح به مؤقتاً. حاول مرة أخرى بعد قليل." };
      }

      const idempotencyKey = orderFingerprint(data, String(tenant.id), String(branchId));
      const existing = await sql<{ order_id: string | null; order_number: number | null; total: number | null; currency: string | null; created_at: string }>`
        select order_id, order_number, total, currency, created_at
        from public_order_idempotency
        where tenant_id = ${tenant.id} and branch_id = ${branchId} and client_token = ${clientToken} and idempotency_key = ${idempotencyKey}
        limit 1
      `;
      if (existing[0]) {
        const ageMs = Date.now() - new Date(existing[0].created_at).getTime();
        if (ageMs < 10 * 60 * 1000 && existing[0].order_id) {
          return { ok: true, data: { orderId: String(existing[0].order_id), orderNumber: Number(existing[0].order_number), total: Number(existing[0].total), currency: existing[0].currency || tenant.currency || "SAR" } };
        }
        if (ageMs < 10 * 60 * 1000) {
          return { ok: false, code: "unavailable", error: "يتم تجهيز طلبك بالفعل. حاول مرة أخرى بعد لحظات." };
        }
        await sql`
          delete from public_order_idempotency
          where tenant_id = ${tenant.id} and branch_id = ${branchId} and client_token = ${clientToken} and idempotency_key = ${idempotencyKey}
        `;
      }

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
        const note = item.selected.note?.trim().slice(0, 500) ?? "";
        if (note) selectedOptions.push({ type: "note", id: "item-note", nameAr: note, nameEn: note, priceDelta: 0 });

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
        id: item.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        line_total: item.lineTotal,
        product_name_ar: item.productNameAr,
        product_name_en: item.productNameEn,
        selected_options: item.selectedOptions,
      })));

      const reservation = await sql<{ client_token: string }>`
        insert into public_order_idempotency (tenant_id, branch_id, client_token, idempotency_key)
        values (${tenant.id}, ${branchId}, ${clientToken}, ${idempotencyKey})
        on conflict (tenant_id, branch_id, client_token, idempotency_key) do nothing
        returning client_token
      `;
      if (!reservation[0]) return { ok: false, code: "unavailable", error: "يتم تجهيز طلبك بالفعل. حاول مرة أخرى بعد لحظات." };

      const created = await sql<{ id: string; order_number: number }>`
        with new_order as (
          insert into orders (id, tenant_id, branch_id, anonymous_session_id, status, source, customer_name, customer_phone, customer_email, notes, currency, subtotal, total)
          values (${orderId}, ${tenant.id}, ${branchId}, ${anonymousSessionId}, 'new', ${data.source}, ${data.customerName}, ${data.customerPhone}, ${data.customerEmail || ""}, ${data.notes ?? null}, ${tenant.currency || "SAR"}, ${subtotal}, ${subtotal})
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
      await sql`
        update public_order_idempotency
        set order_id = ${order.id}, order_number = ${order.order_number}, total = ${subtotal}, currency = ${tenant.currency || "SAR"}
        where tenant_id = ${tenant.id} and branch_id = ${branchId} and client_token = ${clientToken} and idempotency_key = ${idempotencyKey}
      `;
      return { ok: true, data: { orderId: String(order.id), orderNumber: Number(order.order_number), total: subtotal, currency: tenant.currency || "SAR" } };
    } catch (err) {
      console.error("submitPublicOrder failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إرسال الطلب حالياً. حاول مرة أخرى." };
    }
  });
