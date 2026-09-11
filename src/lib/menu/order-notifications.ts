import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export type OrderNotificationSummary = {
  newCount: number;
  latestNewOrder: {
    id: string;
    orderNumber: number;
    customerName: string;
    total: number;
    currency: string;
    createdAt: string;
  } | null;
};

export const getOrderNotificationSummary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<OrderNotificationSummary>> => {
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        with accessible_tenants as (
          select t.id
          from tenants t
          where t.owner_user_id = ${context.userId}
             or exists (
               select 1 from tenant_members tm
               where tm.tenant_id = t.id
                 and tm.user_id = ${context.userId}
                 and tm.is_active = true
                 and tm.role in ('owner', 'admin')
             )
        )
        select
          count(*) filter (where o.status = 'new')::int as new_count,
          (
            select jsonb_build_object(
              'id', latest.id,
              'orderNumber', latest.order_number,
              'customerName', coalesce(latest.customer_name, ''),
              'total', latest.total,
              'currency', latest.currency,
              'createdAt', latest.created_at
            )
            from orders latest
            join accessible_tenants at on at.id = latest.tenant_id
            where latest.status = 'new' and latest.archived_at is null
            order by latest.created_at desc
            limit 1
          ) as latest_new_order
        from orders o
        join accessible_tenants at on at.id = o.tenant_id
        where o.status = 'new' and o.archived_at is null
      `;
      const row = rows[0];
      const latestRaw = row?.latest_new_order;
      const latest = latestRaw && typeof latestRaw === "object"
        ? latestRaw as Record<string, unknown>
        : null;
      return {
        ok: true,
        data: {
          newCount: Number(row?.new_count ?? 0),
          latestNewOrder: latest
            ? {
                id: String(latest.id ?? ""),
                orderNumber: Number(latest.orderNumber ?? 0),
                customerName: String(latest.customerName ?? ""),
                total: Number(latest.total ?? 0),
                currency: String(latest.currency ?? "SAR"),
                createdAt: new Date(String(latest.createdAt)).toISOString(),
              }
            : null,
        },
      };
    } catch (error) {
      console.error("getOrderNotificationSummary failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل تنبيهات الطلبات" };
    }
  });
