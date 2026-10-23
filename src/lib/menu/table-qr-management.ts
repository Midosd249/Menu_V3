import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { authorizeMutation } from "@/lib/auth/authorization.server";
import { getSql } from "@/lib/db";
import { createRestaurantTableWithToken, rotateTableQrToken } from "./table-qr";
import type { FnResult } from "./types";

const scope = z.object({ tenantId: z.string().min(1).max(100), branchId: z.string().min(1).max(100) });
const createInput = scope.extend({ label: z.string().trim().min(1).max(80) });
const rotateInput = scope.extend({ tableId: z.string().min(1).max(100) });

async function authorizedBranch(userId: string, tenantId: string, branchId: string, permission: "settings.read" | "settings.write") {
  await authorizeMutation(userId, permission, { tenantId, branchId });
  const sql = await getSql();
  const rows = await sql<{ id: string }>`select id from branches where id = ${branchId} and tenant_id = ${tenantId} and is_active = true limit 1`;
  if (!rows[0]) throw new Error("Branch not found or inactive");
  return sql;
}

export const listRestaurantTables = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(scope)
  .handler(async ({ context, data }): Promise<FnResult<{ tables: Array<{ id: string; label: string; isActive: boolean; hasActiveToken: boolean }> }>> => {
    try {
      const sql = await authorizedBranch(context.userId, data.tenantId, data.branchId, "settings.read");
      const rows = await sql<{ id: string; label: string; is_active: boolean; has_active_token: boolean }>`
        select rt.id, rt.label, rt.is_active,
          exists (select 1 from table_qr_tokens q where q.table_id = rt.id and q.tenant_id = rt.tenant_id
            and q.branch_id = rt.branch_id and q.revoked_at is null and (q.expires_at is null or q.expires_at > now())) as has_active_token
        from restaurant_tables rt where rt.tenant_id = ${data.tenantId} and rt.branch_id = ${data.branchId}
        order by rt.sort_order, rt.label
      `;
      return { ok: true, data: { tables: rows.map((row) => ({ id: String(row.id), label: String(row.label), isActive: Boolean(row.is_active), hasActiveToken: Boolean(row.has_active_token) })) } };
    } catch (error) {
      console.error("listRestaurantTables failed", error);
      return { ok: false, code: "forbidden", error: "تعذر تحميل الطاولات أو لا تملك صلاحية الوصول." };
    }
  });

export const createRestaurantTable = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(createInput)
  .handler(async ({ context, data }): Promise<FnResult<{ tableId: string; plainToken: string }>> => {
    try {
      const sql = await authorizedBranch(context.userId, data.tenantId, data.branchId, "settings.write");
      return await createRestaurantTableWithToken(sql, { tenantId: data.tenantId, branchId: data.branchId, label: data.label, createdBy: context.userId });
    } catch (error) {
      console.error("createRestaurantTable failed", error);
      return { ok: false, code: "forbidden", error: "تعذر إنشاء الطاولة أو لا تملك صلاحية الوصول." };
    }
  });

export const rotateRestaurantTableQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(rotateInput)
  .handler(async ({ context, data }): Promise<FnResult<{ plainToken: string }>> => {
    try {
      const sql = await authorizedBranch(context.userId, data.tenantId, data.branchId, "settings.write");
      const rows = await sql<{ id: string }>`select id from restaurant_tables where id = ${data.tableId}
        and tenant_id = ${data.tenantId} and branch_id = ${data.branchId} and is_active = true limit 1`;
      if (!rows[0]) return { ok: false, code: "not_found", error: "الطاولة غير موجودة في هذا الفرع." };
      return await rotateTableQrToken(sql, { tableId: data.tableId, tenantId: data.tenantId, createdBy: context.userId });
    } catch (error) {
      console.error("rotateRestaurantTableQr failed", error);
      return { ok: false, code: "forbidden", error: "تعذر تحديث رمز QR أو لا تملك صلاحية الوصول." };
    }
  });
