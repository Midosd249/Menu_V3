import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { canAccessBranch, getMembership } from "@/lib/auth/authorization.server";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export type RetentionOverview = {
  totalOrders: number;
  repeatOrderRate: number;
  active30dOrders: number;
  lapsed60dOrders: number;
  averageOrderValue: number;
  evidence: "verified" | "insufficient";
};

export const getRetentionOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ branchId: z.string().max(80).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<RetentionOverview>> => {
    try {
      const sql = await getSql();
      const membership = await getMembership(sql, context.userId);
      if (!membership || !["owner", "admin", "manager"].includes(membership.role)) {
        return { ok: false, code: "forbidden", error: "ليست لديك صلاحية عرض تحليلات الاحتفاظ" };
      }

      const branchId = data.branchId ?? null;
      if (branchId) {
        if (!(await canAccessBranch(sql, membership, branchId))) {
          return { ok: false, code: "forbidden", error: "ليست لديك صلاحية عرض هذا الفرع" };
        }
      } else if (membership.role === "manager") {
        const branchScope = membership.branchScope ?? [];
        if (branchScope.length === 0) {
          return { ok: false, code: "forbidden", error: "يجب تحديد فرع مصرح به لعرض تحليلات الاحتفاظ" };
        }
      }

      const rows = await sql<{
        total_orders: number;
        repeat_orders: number;
        active_orders: number;
        lapsed_orders: number;
        total_value: number;
      }>`
        with scoped as (
          select id, customer_phone, created_at, total
          from orders
          where tenant_id = ${membership.tenantId}
            and status <> 'cancelled'
            and (
              ${branchId}::text is not null and branch_id = ${branchId}::text
              or ${branchId}::text is null and (
                ${membership.role}::text in ('owner', 'admin')
                or branch_id = any(${membership.branchScope ?? []}::text[])
              )
            )
            and coalesce(customer_phone, '') <> ''
        ), repeaters as (
          select customer_phone from scoped group by customer_phone having count(*) > 1
        )
        select
          count(*)::int as total_orders,
          count(*) filter (where customer_phone in (select customer_phone from repeaters))::int as repeat_orders,
          count(*) filter (where created_at >= now() - interval '30 days')::int as active_orders,
          count(*) filter (where created_at < now() - interval '60 days')::int as lapsed_orders,
          coalesce(sum(total), 0)::numeric as total_value
        from scoped
      `;
      const row = rows[0];
      const totalOrders = Number(row?.total_orders ?? 0);
      const totalValue = Number(row?.total_value ?? 0);
      return {
        ok: true,
        data: {
          totalOrders,
          repeatOrderRate: totalOrders ? Number(row?.repeat_orders ?? 0) / totalOrders : 0,
          active30dOrders: Number(row?.active_orders ?? 0),
          lapsed60dOrders: Number(row?.lapsed_orders ?? 0),
          averageOrderValue: totalOrders ? totalValue / totalOrders : 0,
          evidence: totalOrders >= 20 ? "verified" : "insufficient",
        },
      };
    } catch (error) {
      console.error("getRetentionOverview failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل تحليلات الاحتفاظ" };
    }
  });
