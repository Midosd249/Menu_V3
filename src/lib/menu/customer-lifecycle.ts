import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId, slugify } from "@/lib/utils";
import { getMyStudio } from "./owner";
import type { FnResult, StudioSnapshot } from "./types";

export const ACTIVATION_STATUSES = ["pending", "action_required", "approved", "activated", "rejected"] as const;
export type ActivationStatus = (typeof ACTIVATION_STATUSES)[number];
type BusinessType = "restaurant" | "cafe" | "bakery" | "dessert" | "food_truck" | "other";

const businessTypeSchema = z.enum(["restaurant", "cafe", "bakery", "dessert", "food_truck", "other"]);
const requestSchema = z.object({
  nameAr: z.string().trim().min(2).max(80),
  nameEn: z.string().trim().max(80).optional(),
  businessType: businessTypeSchema,
  descriptionAr: z.string().trim().max(160).optional(),
});

export type CustomerActivationRequest = {
  id: string;
  status: ActivationStatus;
  brandNameAr: string;
  brandNameEn: string;
  businessType: BusinessType;
  descriptionAr: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  decisionReason: string;
  requestedAt: string;
  updatedAt: string;
  tenantId: string | null;
  tenantSlug: string | null;
};

function mapRequest(row: Record<string, unknown>): CustomerActivationRequest {
  return {
    id: String(row.id),
    status: row.activation_status as ActivationStatus,
    brandNameAr: String(row.business_name ?? ""),
    brandNameEn: String(row.brand_name_en ?? ""),
    businessType: (String(row.business_type ?? "restaurant") as BusinessType),
    descriptionAr: String(row.details ?? ""),
    contactName: String(row.contact_name ?? ""),
    contactPhone: String(row.contact_phone ?? ""),
    contactEmail: String(row.contact_email ?? ""),
    decisionReason: String(row.decision_reason ?? ""),
    requestedAt: new Date(String(row.activation_requested_at ?? row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at ?? row.created_at)).toISOString(),
    tenantId: row.tenant_id ? String(row.tenant_id) : null,
    tenantSlug: row.tenant_slug ? String(row.tenant_slug) : null,
  };
}

async function account(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<{ name: string; email: string; phone: string | null }>`
    select "name", "email", "phoneNumber" as phone
    from "user"
    where "id" = ${userId}
    limit 1
  `;
  return rows[0] ?? null;
}

export const getMyActivationRequest = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<CustomerActivationRequest | null>> => {
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        select l.*, t.id as tenant_id, t.slug as tenant_slug
        from leads l
        left join tenants t on t.id = (
          select tm.tenant_id
          from tenant_members tm
          where tm.user_id = l.account_user_id and tm.is_active = true
          order by tm.created_at
          limit 1
        )
        where l.account_user_id = ${context.userId}
        limit 1
      `;
      return { ok: true, data: rows[0] ? mapRequest(rows[0]) : null };
    } catch (err) {
      console.error("getMyActivationRequest failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل حالة طلب التفعيل" };
    }
  });

export const submitActivationRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requestSchema)
  .handler(async ({ context, data }): Promise<FnResult<CustomerActivationRequest>> => {
    try {
      const sql = await getSql();
      const currentAccount = await account(sql, context.userId);
      if (!currentAccount) return { ok: false, code: "not_found", error: "تعذر العثور على الحساب" };
      const phone = currentAccount.phone?.trim() ?? "";
      if (!/^\+9665\d{8}$/.test(phone)) {
        return { ok: false, code: "invalid", error: "أكمل رقم الجوال السعودي قبل إرسال طلب التفعيل" };
      }

      const existingMember = await sql`
        select tenant_id from tenant_members
        where user_id = ${context.userId} and is_active = true
        order by created_at
        limit 1
      `;
      if (existingMember[0]) return { ok: false, code: "conflict", error: "هذا الحساب مرتبط بمساحة عمل بالفعل" };

      const existing = await sql<Record<string, unknown>>`
        select * from leads
        where account_user_id = ${context.userId}
        limit 1
      `;
      if (existing[0]) {
        const currentStatus = String(existing[0].activation_status);
        if (currentStatus === "activated") return { ok: false, code: "conflict", error: "تم تفعيل مساحة هذا الحساب بالفعل" };
        if (currentStatus === "approved") return { ok: true, data: mapRequest(existing[0]) };

        const rows = await sql<Record<string, unknown>>`
          update leads
          set business_name = ${data.nameAr},
              brand_name_en = ${data.nameEn ?? ""},
              business_type = ${data.businessType},
              details = ${data.descriptionAr ?? ""},
              contact_name = ${currentAccount.name ?? ""},
              contact_phone = ${phone},
              contact_email = ${currentAccount.email.trim().toLowerCase()},
              activation_status = 'pending',
              activation_requested_at = now(),
              decision_at = null,
              decision_by = null,
              decision_reason = '',
              status = 'new',
              source = 'self-serve-registration',
              updated_at = now()
          where id = ${String(existing[0].id)}
          returning *
        `;
        if (!rows[0]) return { ok: false, code: "unavailable", error: "تعذر تحديث طلب التفعيل" };
        return { ok: true, data: mapRequest(rows[0]) };
      }

      const id = newId();
      const rows = await sql<Record<string, unknown>>`
        insert into leads (
          id, business_name, brand_name_en, business_type, city,
          contact_name, contact_phone, contact_email, details,
          status, source, account_user_id, activation_status, activation_requested_at
        ) values (
          ${id}, ${data.nameAr}, ${data.nameEn ?? ""}, ${data.businessType}, null,
          ${currentAccount.name ?? ""}, ${phone}, ${currentAccount.email.trim().toLowerCase()}, ${data.descriptionAr ?? ""},
          'new', 'self-serve-registration', ${context.userId}, 'pending', now()
        )
        returning *
      `;
      return { ok: true, data: mapRequest(rows[0]) };
    } catch (err) {
      console.error("submitActivationRequest failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إرسال طلب التفعيل" };
    }
  });

export const activateApprovedWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<{ tenantId: string; slug: string }>> => {
    try {
      const sql = await getSql();
      const rows = await sql<{ id: string; business_name: string; activation_status: ActivationStatus; tenant_id: string | null }>`
        select l.id, l.business_name, l.activation_status,
          (select tm.tenant_id from tenant_members tm where tm.user_id = l.account_user_id and tm.is_active = true order by tm.created_at limit 1) as tenant_id
        from leads l
        where l.account_user_id = ${context.userId}
        limit 1
      `;
      const request = rows[0];
      if (!request) return { ok: false, code: "not_found", error: "لا يوجد طلب تفعيل" };
      if (request.activation_status === "activated" && request.tenant_id) {
        const tenant = await sql<{ slug: string }>`select slug from tenants where id = ${request.tenant_id} limit 1`;
        if (tenant[0]) return { ok: true, data: { tenantId: request.tenant_id, slug: tenant[0].slug } };
      }
      if (request.activation_status !== "approved") {
        return { ok: false, code: "forbidden", error: "يجب اعتماد طلب التفعيل أولاً" };
      }

      const tenantId = newId();
      const branchId = newId();
      const slugBase = slugify(request.business_name) || `brand-${Date.now().toString(36)}`;
      const slug = `${slugBase}-${request.id.slice(-6).toLowerCase()}`.slice(0, 63);
      const result = await sql<{ tenant_id: string; slug: string }>`
        select * from menu_v3.activate_customer_workspace(
          ${request.id}, ${context.userId}, ${tenantId}, ${branchId}, ${slug}
        )
      `;
      const activated = result[0];
      if (!activated) return { ok: false, code: "unavailable", error: "تعذر تفعيل مساحة العمل" };
      return { ok: true, data: { tenantId: activated.tenant_id, slug: activated.slug } };
    } catch (err) {
      console.error("activateApprovedWorkspace failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تفعيل مساحة العمل" };
    }
  });

export async function loadMyStudioAfterActivation(): Promise<FnResult<StudioSnapshot>> {
  return getMyStudio();
}
