import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/middleware.ts";
import { getSql, type Sql } from "../db.ts";
import { newId } from "../utils.ts";
import type { FnResult, Role } from "./types.ts";

export type SubscriptionInvoice = {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  ownerName: string;
  ownerEmail: string;
  planCode: string;
  planNameAr: string;
  planNameEn: string;
  amountSar: number;
  currency: "SAR";
  periodStart: string;
  periodEnd: string;
  status: "issued" | "void";
  issuedAt: string;
};

export type BillingSummary = {
  planCode: string;
  planNameAr: string;
  planNameEn: string;
  status: "trialing" | "active" | "past_due" | "cancelled" | "suspended";
  monthlyPriceSar: number;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  tenantName: string;
  ownerName: string;
  ownerEmail: string;
  invoices: SubscriptionInvoice[];
};

type Membership = { tenant_id: string; role: Role };

async function membershipOf(sql: Sql, userId: string): Promise<Membership | null> {
  const rows = await sql<Membership>`
    select tenant_id, role
    from tenant_members
    where user_id = ${userId} and is_active = true
    order by created_at
    limit 1
  `;
  return rows[0] ?? null;
}

function canManageBilling(role: Role) {
  return role === "owner" || role === "admin";
}

function mapInvoice(row: Record<string, unknown>): SubscriptionInvoice {
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
    periodStart: new Date(String(row.period_start)).toISOString(),
    periodEnd: new Date(String(row.period_end)).toISOString(),
    status: row.status === "void" ? "void" : "issued",
    issuedAt: new Date(String(row.issued_at)).toISOString(),
  };
}

async function loadBilling(sql: Sql, tenantId: string): Promise<BillingSummary | null> {
  const rows = await sql<Record<string, unknown>>`
    select
      t.name_ar as tenant_name,
      coalesce(u.name, '') as owner_name,
      coalesce(u.email, '') as owner_email,
      sp.code as plan_code,
      sp.name_ar as plan_name_ar,
      sp.name_en as plan_name_en,
      sp.monthly_price_sar,
      ts.status,
      ts.current_period_end,
      ts.trial_ends_at
    from tenants t
    join "user" u on u.id = t.owner_user_id
    join tenant_subscriptions ts on ts.tenant_id = t.id
    join subscription_plans sp on sp.id = ts.plan_id
    where t.id = ${tenantId}
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  const invoiceRows = await sql<Record<string, unknown>>`
    select
      i.id,
      i.invoice_number,
      i.tenant_id,
      t.name_ar as tenant_name,
      coalesce(u.name, '') as owner_name,
      coalesce(u.email, '') as owner_email,
      i.plan_code,
      i.plan_name_ar,
      i.plan_name_en,
      i.amount_sar,
      i.period_start,
      i.period_end,
      i.status,
      i.issued_at
    from subscription_invoices i
    join tenants t on t.id = i.tenant_id
    join "user" u on u.id = t.owner_user_id
    where i.tenant_id = ${tenantId}
    order by i.created_at desc
    limit 50
  `;
  return {
    planCode: String(row.plan_code),
    planNameAr: String(row.plan_name_ar),
    planNameEn: String(row.plan_name_en),
    status: String(row.status) as BillingSummary["status"],
    monthlyPriceSar: Number(row.monthly_price_sar ?? 0),
    currentPeriodEnd: row.current_period_end ? new Date(String(row.current_period_end)).toISOString() : null,
    trialEndsAt: row.trial_ends_at ? new Date(String(row.trial_ends_at)).toISOString() : null,
    tenantName: String(row.tenant_name ?? ""),
    ownerName: String(row.owner_name ?? ""),
    ownerEmail: String(row.owner_email ?? ""),
    invoices: invoiceRows.map(mapInvoice),
  };
}

export const getBillingSummary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<BillingSummary>> => {
    try {
      const sql = await getSql();
      const membership = await membershipOf(sql, context.userId);
      if (!membership || !canManageBilling(membership.role)) {
        return { ok: false, code: "forbidden", error: "لا تملك صلاحية إدارة الفوترة" };
      }
      const billing = await loadBilling(sql, membership.tenant_id);
      if (!billing) return { ok: false, code: "not_found", error: "بيانات الاشتراك غير موجودة" };
      return { ok: true, data: billing };
    } catch (error) {
      console.error("getBillingSummary failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل بيانات الفوترة" };
    }
  });

export const issueSubscriptionInvoice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ note: z.string().trim().max(300).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<SubscriptionInvoice>> => {
    try {
      const sql = await getSql();
      const membership = await membershipOf(sql, context.userId);
      if (!membership || !canManageBilling(membership.role)) {
        return { ok: false, code: "forbidden", error: "لا تملك صلاحية إصدار الفواتير" };
      }

      const subscriptionRows = await sql<Record<string, unknown>>`
        select
          t.name_ar as tenant_name,
          coalesce(u.name, '') as owner_name,
          coalesce(u.email, '') as owner_email,
          sp.code as plan_code,
          sp.name_ar as plan_name_ar,
          sp.name_en as plan_name_en,
          sp.monthly_price_sar,
          ts.status,
          ts.current_period_end
        from tenants t
        join "user" u on u.id = t.owner_user_id
        join tenant_subscriptions ts on ts.tenant_id = t.id
        join subscription_plans sp on sp.id = ts.plan_id
        where t.id = ${membership.tenant_id}
        limit 1
      `;
      const subscription = subscriptionRows[0];
      if (!subscription) return { ok: false, code: "not_found", error: "بيانات الاشتراك غير موجودة" };
      const status = String(subscription.status);
      const amountSar = Number(subscription.monthly_price_sar ?? 0);
      if (String(subscription.plan_code) === "free" || amountSar <= 0) {
        return { ok: false, code: "conflict", error: "لا تحتاج الخطة المجانية إلى فاتورة اشتراك" };
      }
      if (status !== "active" && status !== "past_due") {
        return { ok: false, code: "conflict", error: "لا يمكن إصدار فاتورة إلا لاشتراك نشط أو مستحق" };
      }

      const now = new Date();
      const periodEnd = subscription.current_period_end
        ? new Date(String(subscription.current_period_end))
        : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
      const periodStart = new Date(periodEnd);
      periodStart.setUTCMonth(periodStart.getUTCMonth() - 1);
      const invoiceNumber = `INV-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${newId().replaceAll("-", "").slice(0, 10).toUpperCase()}`;

      const rows = await sql<Record<string, unknown>>`
        insert into subscription_invoices (
          tenant_id, invoice_number, plan_code, plan_name_ar, plan_name_en,
          amount_sar, currency, period_start, period_end, status, issued_at, created_by_user_id
        ) values (
          ${membership.tenant_id}, ${invoiceNumber}, ${String(subscription.plan_code)},
          ${String(subscription.plan_name_ar)}, ${String(subscription.plan_name_en)},
          ${amountSar}, 'SAR', ${periodStart.toISOString()}, ${periodEnd.toISOString()},
          'issued', now(), ${context.userId}
        )
        returning id, invoice_number, tenant_id, plan_code, plan_name_ar, plan_name_en,
          amount_sar, period_start, period_end, status, issued_at
      `;
      const invoice = rows[0];
      if (!invoice) return { ok: false, code: "unavailable", error: "تعذر إنشاء الفاتورة" };
      if (data.note) console.info("PH-05 invoice note", { invoiceId: invoice.id, note: data.note });

      return {
        ok: true,
        data: mapInvoice({
          ...invoice,
          tenant_name: subscription.tenant_name,
          owner_name: subscription.owner_name,
          owner_email: subscription.owner_email,
        }),
      };
    } catch (error) {
      console.error("issueSubscriptionInvoice failed", error);
      return { ok: false, code: "unavailable", error: "تعذر إصدار الفاتورة" };
    }
  });

export function buildInvoiceWhatsAppMessage(invoice: SubscriptionInvoice, lang: "ar" | "en"): string {
  const period = `${formatInvoiceDate(invoice.periodStart, lang)} → ${formatInvoiceDate(invoice.periodEnd, lang)}`;
  if (lang === "ar") {
    return [
      "فاتورة اشتراك Menu V3",
      `رقم الفاتورة: ${invoice.invoiceNumber}`,
      `العميل: ${invoice.tenantName}`,
      `الخطة: ${invoice.planNameAr}`,
      `الفترة: ${period}`,
      `المبلغ: ${invoice.amountSar.toFixed(2)} ${invoice.currency}`,
      "الحالة: صادرة — لا تمثل هذه الرسالة إثبات دفع أو تحصيلاً إلكترونياً.",
    ].join("\n");
  }
  return [
    "Menu V3 Subscription Invoice",
    `Invoice: ${invoice.invoiceNumber}`,
    `Customer: ${invoice.tenantName}`,
    `Plan: ${invoice.planNameEn}`,
    `Period: ${period}`,
    `Amount: ${invoice.amountSar.toFixed(2)} ${invoice.currency}`,
    "Status: Issued — this message is not proof of payment or electronic collection.",
  ].join("\n");
}

export function buildInvoiceWhatsAppUrl(invoice: SubscriptionInvoice, lang: "ar" | "en"): string {
  return `https://wa.me/?text=${encodeURIComponent(buildInvoiceWhatsAppMessage(invoice, lang))}`;
}

function formatInvoiceDate(value: string, lang: "ar" | "en"): string {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", { dateStyle: "medium", timeZone: "Asia/Riyadh" }).format(new Date(value));
}
