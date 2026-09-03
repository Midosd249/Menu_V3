import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin.server";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type AdminLead = {
  id: string;
  businessName: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  details: string;
  status: LeadStatus;
  notes: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminDashboard = {
  total: number;
  newCount: number;
  contactedCount: number;
  qualifiedCount: number;
  convertedCount: number;
  lostCount: number;
  leads: AdminLead[];
};

const searchSchema = z.string().trim().max(120).optional();

async function assertAdmin(userId: string): Promise<FnResult<true>> {
  try {
    await requirePlatformAdmin(userId);
    return { ok: true, data: true };
  } catch (err) {
    if (err instanceof Error && err.message === "PLATFORM_ADMIN_REQUIRED") {
      return { ok: false, code: "forbidden", error: "هذه الصفحة مخصصة لإدارة المنصة" };
    }
    console.error("platform admin check failed", err);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات الإدارة" };
  }
}

function mapLead(row: Record<string, unknown>): AdminLead {
  return {
    id: String(row.id),
    businessName: String(row.business_name ?? ""),
    city: String(row.city ?? ""),
    contactName: String(row.contact_name ?? ""),
    contactPhone: String(row.contact_phone ?? ""),
    contactEmail: String(row.contact_email ?? ""),
    details: String(row.details ?? ""),
    status: row.status as LeadStatus,
    notes: String(row.notes ?? ""),
    source: String(row.source ?? "website"),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at ?? row.created_at)).toISOString(),
  };
}

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      status: z.enum(LEAD_STATUSES).optional(),
      q: searchSchema,
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<AdminDashboard>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;

    try {
      const sql = await getSql();
      const q = data.q ? `%${data.q.toLowerCase()}%` : null;
      const rows = await sql<{
        total: number;
        new_count: number;
        contacted_count: number;
        qualified_count: number;
        converted_count: number;
        lost_count: number;
        leads: unknown;
      }>`
        with filtered as (
          select * from leads
          where (${data.status ?? null}::text is null or status = ${data.status ?? null})
            and (
              ${q}::text is null
              or lower(business_name) like ${q}
              or lower(coalesce(city, '')) like ${q}
              or lower(contact_name) like ${q}
              or contact_phone like ${q}
              or lower(coalesce(contact_email, '')) like ${q}
            )
        )
        select
          (select count(*)::int from leads) as total,
          (select count(*)::int from leads where status = 'new') as new_count,
          (select count(*)::int from leads where status = 'contacted') as contacted_count,
          (select count(*)::int from leads where status = 'qualified') as qualified_count,
          (select count(*)::int from leads where status = 'converted') as converted_count,
          (select count(*)::int from leads where status = 'lost') as lost_count,
          coalesce((
            select jsonb_agg(to_jsonb(x) order by x.created_at desc)
            from (select * from filtered order by created_at desc limit 100) x
          ), '[]'::jsonb) as leads
      `;

      const row = rows[0];
      const leads = Array.isArray(row?.leads) ? row.leads.map((lead) => mapLead(lead as Record<string, unknown>)) : [];
      return {
        ok: true,
        data: {
          total: Number(row?.total ?? 0),
          newCount: Number(row?.new_count ?? 0),
          contactedCount: Number(row?.contacted_count ?? 0),
          qualifiedCount: Number(row?.qualified_count ?? 0),
          convertedCount: Number(row?.converted_count ?? 0),
          lostCount: Number(row?.lost_count ?? 0),
          leads,
        },
      };
    } catch (err) {
      console.error("getAdminDashboard failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل لوحة الإدارة" };
    }
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().min(1).max(100),
      status: z.enum(LEAD_STATUSES),
      notes: z.string().trim().max(3000).optional(),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<AdminLead>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;

    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        update leads
        set status = ${data.status}, notes = ${data.notes ?? ""}, updated_at = now()
        where id = ${data.id}
        returning *
      `;
      if (!rows[0]) return { ok: false, code: "not_found", error: "الطلب غير موجود" };
      return { ok: true, data: mapLead(rows[0]) };
    } catch (err) {
      console.error("updateLead failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ الطلب" };
    }
  });

export const getPlatformAdminAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<{ isAdmin: boolean }>> => {
    const permission = await assertAdmin(context.userId);
    return permission.ok ? { ok: true, data: { isAdmin: true } } : { ok: true, data: { isAdmin: false } };
  });
