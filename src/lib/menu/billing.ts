import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/middleware.ts";
import { getSql, type Sql } from "../db.ts";
import type { SubscriptionInvoice } from "./billing-whatsapp.ts";
import type { FnResult, Role } from "./types.ts";

export type { SubscriptionInvoice } from "./billing-whatsapp.ts";

export type BillingInterval = "monthly" | "annual";

export type BillingSummary = {
  planCode: string;
  planNameAr: string;
  planNameEn: string;
  status: "trialing" | "active" | "past_due" | "cancelled" | "suspended";
  monthlyPriceSar: number;
  annualPriceSar: number;
  billingInterval: BillingInterval;
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
    billingInterval: row.billing_interval === "annual" ? "annual" : "monthly",
    periodStart: new Date(String(row.period_start)).toISOString(),
    periodEnd: new Date(String(row.period_end)).toISOString(),
    status: row.status === "void" ? "void" : "issued",
    issuedAt: new Date(String(row.issued_at)).toISOString(),
    notes: row.notes ? String(row.notes) : "",
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
      sp.annual_price_sar,
      ts.billing_interval,
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
      i.billing_interval,
      i.period_start,
      i.period_end,
      i.status,
      i.issued_at,
      i.notes
    from subscription_invoices i
    join tenants t on t.id = i.tenant_id
    join "user" u on u.id = t.owner_user_id
    where i.tenant_id = ${tenantId}
      and i.created_by_user_id is not null
      and menu_v3.is_platform_admin(i.created_by_user_id) = true
    order by i.created_at desc
    limit 50
  `;
  return {
    planCode: String(row.plan_code),
    planNameAr: String(row.plan_name_ar),
    planNameEn: String(row.plan_name_en),
    status: String(row.status) as BillingSummary["status"],
    monthlyPriceSar: Number(row.monthly_price_sar ?? 0),
    annualPriceSar: Number(row.annual_price_sar ?? 0),
    billingInterval: row.billing_interval === "annual" ? "annual" : "monthly",
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
