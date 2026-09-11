import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export type OrderNotificationSummary = {
  newCount: number;
  latestNewOrder: {
    id: string;
    orderNumber: number;
    customerName: string;
    restaurantName: string;
    branchName: string;
    total: number;
    currency: string;
    createdAt: string;
  } | null;
};

export const getOrderNotificationSummary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(100) }))
  .handler(async ({ context, data }): Promise<FnResult<OrderNotificationSummary>> => {
    try {
      const sql = await getSql();
      const accessRows = await sql<{ id: string }>`
        select t.id
        from tenants t
        where t.id = ${data.tenantId}
          and (
            t.owner_user_id = ${context.userId}
            or exists (
              select 1 from tenant_members tm
              where tm.tenant_id = t.id
                and tm.user_id = ${context.userId}
                and tm.is_active = true
                and tm.role in ('owner', 'admin')
            )
          )
        limit 1
      `;
      if (!accessRows[0]) return { ok: false, code: "forbidden", error: "لا تملك صلاحية هذا النشاط" };

      const rows = await sql<Record<string, unknown>>`
        select
          count(*) filter (where o.status = 'new')::int as new_count,
          (
            select jsonb_build_object(
              'id', latest.id,
              'orderNumber', latest.order_number,
              'customerName', coalesce(latest.customer_name, ''),
              'restaurantName', coalesce(t.name_ar, ''),
              'branchName', coalesce(b.name_ar, 'كل الفروع'),
              'total', latest.total,
              'currency', latest.currency,
              'createdAt', latest.created_at
            )
            from orders latest
            join tenants t on t.id = latest.tenant_id
            left join branches b on b.id = latest.branch_id
            where latest.tenant_id = ${data.tenantId}
              and latest.status = 'new'
              and latest.archived_at is null
            order by latest.created_at desc
            limit 1
          ) as latest_new_order
        from orders o
        where o.tenant_id = ${data.tenantId}
          and o.status = 'new'
          and o.archived_at is null
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
                restaurantName: String(latest.restaurantName ?? ""),
                branchName: String(latest.branchName ?? "كل الفروع"),
                total: Number(latest.total ?? 0),
                currency: String(latest.currency ?? "SAR"),
                createdAt: new Date(String(latest.createdAt)).toISOString(),
              }
            : null,
        },
      };
    } catch (error) {
      console.error("getOrderNotificationSummary failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل نشاط الطلبات" };
    }
  });
