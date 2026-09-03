import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import type { FnResult } from "./types";

export const ORDER_STATUSES = ["new", "confirmed", "preparing", "ready", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type SelectedOrderOption = { type: "variant" | "modifier"; id: string; groupId?: string; nameAr: string; nameEn: string; priceDelta: number };
export type OrderItemDetail = { id: string; productId: string; productNameAr: string; productNameEn: string; quantity: number; unitPrice: number; lineTotal: number; selectedOptions: SelectedOrderOption[] };
export type AdminOrder = { id: string; orderNumber: number; tenantId: string; restaurantName: string; branchName: string; status: OrderStatus; source: string; customerName: string; customerPhone: string; customerEmail: string; notes: string; currency: string; subtotal: number; total: number; itemCount: number; items: OrderItemDetail[]; createdAt: string; updatedAt: string };
export type OrdersDashboard = { total: number; newCount: number; activeCount: number; completedCount: number; cancelledCount: number; orders: AdminOrder[] };

async function getClientTenantIds(userId: string): Promise<string[]> {
  const sql = await getSql();
  const rows = await sql<{ id: string }>`
    select t.id
    from tenants t
    where t.owner_user_id = ${userId}
       or exists (
         select 1 from tenant_members tm
         where tm.tenant_id = t.id and tm.user_id = ${userId}
           and tm.role in ('owner', 'admin')
       )
  `;
  return rows.map((row) => String(row.id));
}

async function assertOrderAccess(userId: string, orderId: string): Promise<FnResult<true>> {
  try {
    const sql = await getSql();
    const rows = await sql<{ id: string }>`
      select o.id
      from orders o
      where o.id = ${orderId}
        and (
          o.tenant_id in (select t.id from tenants t where t.owner_user_id = ${userId})
          or exists (select 1 from tenant_members tm where tm.tenant_id = o.tenant_id and tm.user_id = ${userId} and tm.role in ('owner','admin'))
        )
      limit 1
    `;
    return rows[0] ? { ok: true, data: true } : { ok: false, code: "forbidden", error: "لا تملك صلاحية هذا الطلب" };
  } catch (error) {
    console.error("order access check failed", error);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحية الطلب" };
  }
}

function mapItem(row: Record<string, unknown>): OrderItemDetail {
  const rawOptions = Array.isArray(row.selected_options) ? row.selected_options : [];
  return { id: String(row.id), productId: String(row.product_id ?? ""), productNameAr: String(row.product_name_ar ?? ""), productNameEn: String(row.product_name_en ?? ""), quantity: Number(row.quantity ?? 0), unitPrice: Number(row.unit_price ?? 0), lineTotal: Number(row.line_total ?? 0), selectedOptions: rawOptions.flatMap((item): SelectedOrderOption[] => { if (!item || typeof item !== "object") return []; const option = item as Record<string, unknown>; const type = option.type === "variant" ? "variant" : option.type === "modifier" ? "modifier" : null; if (!type || typeof option.id !== "string") return []; return [{ type, id: option.id, ...(typeof option.groupId === "string" ? { groupId: option.groupId } : {}), nameAr: String(option.nameAr ?? ""), nameEn: String(option.nameEn ?? ""), priceDelta: Number(option.priceDelta ?? 0) }]; }) };
}

function mapOrder(row: Record<string, unknown>): AdminOrder {
  const rawItems = Array.isArray(row.items) ? row.items : [];
  return { id: String(row.id), orderNumber: Number(row.order_number ?? 0), tenantId: String(row.tenant_id), restaurantName: String(row.restaurant_name ?? ""), branchName: String(row.branch_name ?? ""), status: row.status as OrderStatus, source: String(row.source ?? "web"), customerName: String(row.customer_name ?? ""), customerPhone: String(row.customer_phone ?? ""), customerEmail: String(row.customer_email ?? ""), notes: String(row.notes ?? ""), currency: String(row.currency ?? "SAR"), subtotal: Number(row.subtotal ?? 0), total: Number(row.total ?? 0), itemCount: Number(row.item_count ?? rawItems.length), items: rawItems.map((item) => mapItem(item as Record<string, unknown>)), createdAt: new Date(String(row.created_at)).toISOString(), updatedAt: new Date(String(row.updated_at ?? row.created_at)).toISOString() };
}

export const getOrdersDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ status: z.enum(ORDER_STATUSES).optional(), q: z.string().trim().max(120).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<OrdersDashboard>> => {
    try {
      const sql = await getSql();
      const tenantIds = await getClientTenantIds(context.userId);
      if (!tenantIds.length) return { ok: true, data: { total: 0, newCount: 0, activeCount: 0, completedCount: 0, cancelledCount: 0, orders: [] } };
      const q = data.q ? `%${data.q.toLowerCase()}%` : null;
      const rows = await sql<Record<string, unknown>>`
        with scope as (select unnest(${tenantIds}::text[]) as tenant_id),
        filtered as (
          select o.*, t.name_ar as restaurant_name, coalesce(b.name_ar, 'كل الفروع') as branch_name,
            (select count(*) from order_items oi where oi.order_id = o.id) as item_count,
            coalesce((select jsonb_agg(jsonb_build_object('id', oi.id, 'product_id', oi.product_id, 'product_name_ar', oi.product_name_ar, 'product_name_en', oi.product_name_en, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'line_total', oi.line_total, 'selected_options', oi.selected_options) order by oi.created_at) from order_items oi where oi.order_id = o.id), '[]'::jsonb) as items
          from orders o join scope s on s.tenant_id = o.tenant_id join tenants t on t.id = o.tenant_id left join branches b on b.id = o.branch_id
          where (${data.status ?? null}::text is null or o.status = ${data.status ?? null})
            and (${q}::text is null or lower(t.name_ar) like ${q} or lower(coalesce(t.name_en,'')) like ${q} or lower(coalesce(b.name_ar,'')) like ${q} or o.customer_phone like ${q} or lower(o.customer_name) like ${q})
        )
        select
          (select count(*)::int from orders o join scope s on s.tenant_id = o.tenant_id) as total,
          (select count(*)::int from orders o join scope s on s.tenant_id = o.tenant_id where o.status = 'new') as new_count,
          (select count(*)::int from orders o join scope s on s.tenant_id = o.tenant_id where o.status in ('confirmed','preparing','ready')) as active_count,
          (select count(*)::int from orders o join scope s on s.tenant_id = o.tenant_id where o.status = 'completed') as completed_count,
          (select count(*)::int from orders o join scope s on s.tenant_id = o.tenant_id where o.status = 'cancelled') as cancelled_count,
          coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (select * from filtered order by created_at desc limit 100) x), '[]'::jsonb) as orders
      `;
      const row = rows[0];
      const orders = Array.isArray(row?.orders) ? row.orders.map((o) => mapOrder(o as Record<string, unknown>)) : [];
      return { ok: true, data: { total: Number(row?.total ?? 0), newCount: Number(row?.new_count ?? 0), activeCount: Number(row?.active_count ?? 0), completedCount: Number(row?.completed_count ?? 0), cancelledCount: Number(row?.cancelled_count ?? 0), orders } };
    } catch (err) {
      console.error("getOrdersDashboard failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل الطلبات" };
    }
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1).max(100), status: z.enum(ORDER_STATUSES) }))
  .handler(async ({ context, data }): Promise<FnResult<AdminOrder>> => {
    const permission = await assertOrderAccess(context.userId, data.id);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const currentRows = await sql<{ status: OrderStatus }>`select status from orders where id = ${data.id} limit 1`;
      if (!currentRows[0]) return { ok: false, code: "not_found", error: "الطلب غير موجود" };
      const fromStatus = currentRows[0].status;
      const rows = await sql<Record<string, unknown>>`update orders set status = ${data.status}, updated_at = now() where id = ${data.id} returning *`;
      if (!rows[0]) return { ok: false, code: "not_found", error: "الطلب غير موجود" };
      if (fromStatus !== data.status) await sql`insert into order_status_events (id, order_id, from_status, to_status, actor_user_id) values (${newId()}, ${data.id}, ${fromStatus}, ${data.status}, ${context.userId})`;
      const detail = await sql<Record<string, unknown>>`
        select o.*, t.name_ar as restaurant_name, coalesce(b.name_ar, 'كل الفروع') as branch_name,
          (select count(*) from order_items oi where oi.order_id = o.id) as item_count,
          coalesce((select jsonb_agg(jsonb_build_object('id', oi.id, 'product_id', oi.product_id, 'product_name_ar', oi.product_name_ar, 'product_name_en', oi.product_name_en, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'line_total', oi.line_total, 'selected_options', oi.selected_options) order by oi.created_at) from order_items oi where oi.order_id = o.id), '[]'::jsonb) as items
        from orders o join tenants t on t.id = o.tenant_id left join branches b on b.id = o.branch_id
        where o.id = ${data.id} limit 1
      `;
      return detail[0] ? { ok: true, data: mapOrder(detail[0]) } : { ok: false, code: "not_found", error: "الطلب غير موجود" };
    } catch (err) {
      console.error("updateOrderStatus failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحديث حالة الطلب" };
    }
  });
