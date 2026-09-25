import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { AdminOrder } from "./orders";
import type { Tenant } from "./types";

export type OrderReceiptItem = {
  id: string;
  nameAr: string;
  nameEn: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  note?: string;
};

export type OrderReceiptData = {
  orderId: string;
  orderNumber: number;
  restaurantNameAr: string;
  restaurantNameEn: string;
  restaurantLogoUrl: string;
  branchNameAr: string;
  branchNameEn: string;
  createdAt: string;
  currency: string;
  customerName: string;
  items: OrderReceiptItem[];
  subtotal: number;
  total: number;
  vatRegistrationNumber: string;
};

export function buildOrderReceiptFromAdminOrder(order: AdminOrder, tenant: Tenant): OrderReceiptData {
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    restaurantNameAr: tenant.nameAr,
    restaurantNameEn: tenant.nameEn,
    restaurantLogoUrl: tenant.logoUrl,
    branchNameAr: order.branchName,
    branchNameEn: order.branchName,
    createdAt: order.createdAt,
    currency: order.currency,
    customerName: order.customerName,
    items: order.items.map((item) => ({
      id: item.id,
      nameAr: item.productNameAr,
      nameEn: item.productNameEn,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      note: item.selectedOptions.find((option) => option.type === "note")?.nameAr || undefined,
    })),
    subtotal: order.subtotal,
    total: order.total,
    vatRegistrationNumber: tenant.vatRegistrationNumber ?? "",
  };
}


export const getStaffOrderReceipt = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { orderId: string }) => data)
  .handler(async ({ context, data }): Promise<{ ok: true; data: OrderReceiptData } | { ok: false; code: string; error: string }> => {
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        select
          o.id, o.order_number, o.tenant_id, o.branch_id, o.created_at, o.currency, o.customer_name, o.subtotal, o.total,
          t.name_ar as restaurant_name_ar, t.name_en as restaurant_name_en, t.logo_url as restaurant_logo_url,
          t.vat_registration_number,
          coalesce(b.name_ar, 'كل الفروع') as branch_name_ar,
          coalesce(b.name_en, 'All branches') as branch_name_en
        from orders o
        join tenants t on t.id = o.tenant_id
        left join branches b on b.id = o.branch_id
        where o.id = ${data.orderId}
          and o.archived_at is null
          and (
            o.tenant_id in (select id from tenants where owner_user_id = ${context.userId})
            or exists (
              select 1 from tenant_members tm
              where tm.tenant_id = o.tenant_id and tm.user_id = ${context.userId}
                and tm.role in ('owner','admin') and tm.is_active = true
            )
            or (o.branch_id is not null and menu_v3.has_branch_access(${context.userId}, o.tenant_id, o.branch_id))
          )
        limit 1
      `;
      if (!rows[0]) return { ok: false, code: "forbidden", error: "لا تملك صلاحية طباعة هذا الإيصال" };
      const row = rows[0];
      const itemRows = await sql<Record<string, unknown>>`
        select id, product_name_ar, product_name_en, quantity, unit_price, line_total, selected_options
        from order_items where order_id = ${data.orderId} order by created_at
      `;
      const items: OrderReceiptItem[] = itemRows.map((item) => {
        const selected = Array.isArray(item.selected_options) ? item.selected_options : [];
        const note = selected.find((option) => option && typeof option === "object" && (option as Record<string, unknown>).type === "note") as Record<string, unknown> | undefined;
        return {
          id: String(item.id),
          nameAr: String(item.product_name_ar ?? ""),
          nameEn: String(item.product_name_en ?? ""),
          quantity: Number(item.quantity ?? 0),
          unitPrice: Number(item.unit_price ?? 0),
          lineTotal: Number(item.line_total ?? 0),
          note: typeof note?.nameAr === "string" ? note.nameAr : undefined,
        };
      });
      return {
        ok: true,
        data: {
          orderId: String(row.id),
          orderNumber: Number(row.order_number),
          restaurantNameAr: String(row.restaurant_name_ar ?? ""),
          restaurantNameEn: String(row.restaurant_name_en ?? ""),
          restaurantLogoUrl: String(row.restaurant_logo_url ?? ""),
          branchNameAr: String(row.branch_name_ar ?? ""),
          branchNameEn: String(row.branch_name_en ?? ""),
          createdAt: String(row.created_at),
          currency: String(row.currency ?? "SAR"),
          customerName: String(row.customer_name ?? ""),
          items,
          subtotal: Number(row.subtotal ?? 0),
          total: Number(row.total ?? 0),
          vatRegistrationNumber: String(row.vat_registration_number ?? ""),
        },
      };
    } catch (error) {
      console.error("staff order receipt failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تجهيز الإيصال" };
    }
  });
