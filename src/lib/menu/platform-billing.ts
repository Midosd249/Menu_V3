import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin.server";
import { getSql } from "@/lib/db";
import { buildInvoiceWhatsAppMessage, buildInvoiceWhatsAppUrl, type SubscriptionInvoice } from "./billing-whatsapp";
import type { FnResult } from "./types";

export type PlatformInvoice = SubscriptionInvoice & {
  createdByUserId: string;
  createdByName: string;
};

const invoiceInputSchema = z.object({
  tenantId: z.string().min(1).max(128),
  planCode: z.string().trim().min(1).max(64),
  amountSar: z.number().finite().min(0).max(1_000_000),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().trim().max(1000).optional(),
});

async function assertAdmin(userId: string): Promise<FnResult<true>> {
  try {
    await requirePlatformAdmin(userId);
    return { ok: true, data: true };
  } catch (error) {
    if (error instanceof Error && error.message === "PLATFORM_ADMIN_REQUIRED") {
      return { ok: false, code: "forbidden", error: "هذه العملية مخصصة لمالك المنصة" };
    }
    console.error("platform invoice authorization failed", error);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات مالك المنصة" };
  }
}

function mapInvoice(row: Record<string, unknown>): PlatformInvoice {
  return {
    id: String(row.id),
    invoiceNumber: String(row.invoice_number),
    tenantId: String(row.tenant_id),
    tenantName: String(row.tenant_name ?? ""),
    ownerName: String(row.owner_name ?? ""),
    ownerEmail: String(row.owner_email ?? ""),
    planCode: String(row.plan_code),
    planNameAr: String(row.plan_name_ar),
    planNameEn: String(row.plan_name_en),
    amountSar: Number(row.amount_sar ?? 0),
    currency: "SAR",
    billingInterval: row.billing_interval === "annual" ? "annual" : "monthly",
    periodStart: new Date(String(row.period_start)).toISOString(),
    periodEnd: new Date(String(row.period_end)).toISOString(),
    status: row.status === "void" ? "void" : "issued",
    issuedAt: new Date(String(row.issued_at)).toISOString(),
    notes: row.notes ? String(row.notes) : "",
    createdByUserId: String(row.created_by_user_id),
    createdByName: String(row.created_by_name ?? ""),
  };
}

async function loadInvoices(sql: Awaited<ReturnType<typeof getSql>>, tenantId: string): Promise<PlatformInvoice[]> {
  const rows = await sql<Record<string, unknown>>`
    select
      i.id,
      i.invoice_number,
      i.tenant_id,
      coalesce(t.name_ar, t.name_en, '') as tenant_name,
      coalesce(u.name, '') as owner_name,
      coalesce(u.email, '') as owner_email,
      i.plan_code,
      i.plan_name_ar,
      i.plan_name_en,
      i.amount_sar,
      i.billing_interval,
      i.period_start,
      i.period_end,
      i.status,
      i.issued_at,
      i.notes,
      i.created_by_user_id,
      coalesce(issuer.name, '') as created_by_name
    from subscription_invoices i
    join tenants t on t.id = i.tenant_id
    join "user" u on u.id = t.owner_user_id
    join "user" issuer on issuer.id = i.created_by_user_id
    where i.tenant_id = ${tenantId}
      and menu_v3.is_platform_admin(i.created_by_user_id) = true
    order by i.created_at desc
    limit 100
  `;
  return rows.map(mapInvoice);
}

export const getPlatformInvoices = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(128) }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformInvoice[]>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      return { ok: true, data: await loadInvoices(sql, data.tenantId) };
    } catch (error) {
      console.error("getPlatformInvoices failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل فواتير العميل" };
    }
  });

export const issuePlatformInvoice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(invoiceInputSchema)
  .handler(async ({ context, data }): Promise<FnResult<PlatformInvoice>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const start = new Date(`${data.periodStart}T00:00:00+03:00`);
      const end = new Date(`${data.periodEnd}T00:00:00+03:00`);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end.getTime() <= start.getTime()) {
        return { ok: false, code: "invalid", error: "يجب أن تكون نهاية الفترة بعد بدايتها" };
      }

      const sql = await getSql();
      const tenantRows = await sql<Record<string, unknown>>`
        select
          t.id as tenant_id,
          coalesce(t.name_ar, t.name_en, '') as tenant_name,
          coalesce(u.name, '') as owner_name,
          coalesce(u.email, '') as owner_email,
          (select coalesce(name, '') from "user" where id = ${context.userId}) as created_by_name
        from tenants t
        join "user" u on u.id = t.owner_user_id
        where t.id = ${data.tenantId}
        limit 1
      `;
      const tenant = tenantRows[0];
      if (!tenant) return { ok: false, code: "not_found", error: "العميل غير موجود" };

      const planRows = await sql<Record<string, unknown>>`
        select code, name_ar, name_en
        from subscription_plans
        where code = ${data.planCode} and is_active = true
        limit 1
      `;
      const plan = planRows[0];
      if (!plan) return { ok: false, code: "invalid", error: "الخطة غير متاحة" };

      const sequenceRows = await sql<{ value: number }>`
        select nextval('menu_v3.subscription_invoice_number_seq') as value
      `;
      const sequence = Number(sequenceRows[0]?.value);
      if (!Number.isSafeInteger(sequence) || sequence <= 0) {
        return { ok: false, code: "unavailable", error: "تعذر إنشاء رقم الفاتورة" };
      }

      const now = new Date();
      const invoiceNumber = `INV-${now.toISOString().slice(0, 7).replace("-", "")}-${String(sequence).padStart(6, "0")}`;
      const rows = await sql<Record<string, unknown>>`
        insert into subscription_invoices (
          tenant_id, invoice_number, plan_code, plan_name_ar, plan_name_en,
          amount_sar, currency, billing_interval, period_start, period_end,
          status, issued_at, created_by_user_id, notes
        ) values (
          ${data.tenantId}, ${invoiceNumber}, ${String(plan.code)}, ${String(plan.name_ar)}, ${String(plan.name_en)},
          ${data.amountSar}, 'SAR',
          case when ${data.planCode} = 'free' then 'monthly'
               when exists (select 1 from tenant_subscriptions ts where ts.tenant_id = ${data.tenantId} and ts.billing_interval = 'annual')
                 then 'annual' else 'monthly' end,
          ${start.toISOString()}, ${end.toISOString()}, 'issued', now(), ${context.userId}, ${data.notes || null}
        )
        returning id, invoice_number, tenant_id, plan_code, plan_name_ar, plan_name_en,
          amount_sar, currency, billing_interval, period_start, period_end, status, issued_at,
          created_by_user_id, notes
      `;
      const invoice = rows[0];
      if (!invoice) return { ok: false, code: "unavailable", error: "تعذر إصدار الفاتورة" };
      return {
        ok: true,
        data: mapInvoice({
          ...invoice,
          tenant_name: tenant.tenant_name,
          owner_name: tenant.owner_name,
          owner_email: tenant.owner_email,
          created_by_name: tenant.created_by_name,
        }),
      };
    } catch (error) {
      console.error("issuePlatformInvoice failed", error);
      return { ok: false, code: "unavailable", error: "تعذر إصدار الفاتورة" };
    }
  });

export { buildInvoiceWhatsAppMessage, buildInvoiceWhatsAppUrl };
