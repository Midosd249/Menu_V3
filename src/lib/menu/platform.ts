import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export type PlatformTenant = {
  id: string;
  ownerUserId: string;
  ownerName: string;
  ownerEmail: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  city: string;
  country: string;
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  branchCount: number;
  productCount: number;
  orderCount: number;
  memberCount: number;
  planCode: string;
};

export type PlatformBranch = {
  id: string;
  tenantId: string;
  tenantName: string;
  nameAr: string;
  nameEn: string;
  city: string;
  phone: string;
  isActive: boolean;
};

export type PlatformMember = {
  tenantId: string;
  tenantName: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type PlatformProject = {
  id: string;
  tenantId: string;
  businessName: string;
  status: string;
  contactName: string;
  contactPhone: string;
  city: string;
  createdAt: string;
};

export type PlatformServiceRequest = {
  id: string;
  businessName: string;
  serviceType: string;
  city: string;
  contactName: string;
  contactPhone: string;
  status: string;
  createdAt: string;
};

export type PlatformActivity = {
  id: string;
  orderId: string;
  orderNumber: number;
  tenantName: string;
  fromStatus: string;
  toStatus: string;
  actorUserId: string;
  createdAt: string;
};

export type PlatformAnalytics = {
  visits: number;
  productViews: number;
  qrScans: number;
  whatsappClicks: number;
  orders: number;
  completedOrders: number;
};

export type PlatformDashboard = {
  tenants: PlatformTenant[];
  branches: PlatformBranch[];
  members: PlatformMember[];
  projects: PlatformProject[];
  serviceRequests: PlatformServiceRequest[];
  activity: PlatformActivity[];
  analytics: PlatformAnalytics;
  tenantCount: number;
  activeTenantCount: number;
  publishedTenantCount: number;
  branchCount: number;
  productCount: number;
  orderCount: number;
  openOrderCount: number;
  leadCount: number;
  newLeadCount: number;
  menuEventCount: number;
  activeSubscriptionCount: number;
  trialSubscriptionCount: number;
};

function csvEnv(key: string): string[] {
  return (process.env[key] ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
}

async function requirePlatformAdmin(userId: string) {
  const allowedIds = csvEnv("PLATFORM_ADMIN_USER_IDS");
  if (allowedIds.includes(userId.toLowerCase())) return;

  const sql = await getSql();
  const operator = await sql<{ user_id: string }>`select user_id from platform_operators where lower(user_id) = lower(${userId}) limit 1`;
  if (operator[0]) return;

  const users = await sql<{ email: string }>`select "email" as email from "user" where "id" = ${userId} limit 1`;
  const email = String(users[0]?.email ?? "").trim().toLowerCase();
  if (email && csvEnv("PLATFORM_ADMIN_EMAILS").includes(email)) return;
  throw new Error("PLATFORM_ADMIN_REQUIRED");
}

async function assertPlatformAdmin(userId: string): Promise<FnResult<true>> {
  try {
    await requirePlatformAdmin(userId);
    return { ok: true, data: true };
  } catch (error) {
    if (error instanceof Error && error.message === "PLATFORM_ADMIN_REQUIRED") {
      return { ok: false, code: "forbidden", error: "هذه الصفحة مخصصة لمالك المنصة" };
    }
    console.error("platform admin authorization failed", error);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات مالك المنصة" };
  }
}

function iso(value: unknown): string {
  const date = new Date(String(value ?? ""));
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function num(value: unknown): number {
  return Number(value ?? 0);
}

export const getPlatformDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<PlatformDashboard>> => {
    const permission = await assertPlatformAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const [tenants, branches, members, projects, serviceRequests, activity, counts, analytics] = await Promise.all([
        sql<Record<string, unknown>>`
          select t.id, t.owner_user_id, coalesce(u.name, '') as owner_name, coalesce(u.email, '') as owner_email,
            t.slug, t.name_ar, t.name_en, t.city, t.country, t.is_published, t.is_active, t.created_at,
            (select count(*)::int from branches b where b.tenant_id = t.id) as branch_count,
            (select count(*)::int from products p where p.tenant_id = t.id) as product_count,
            (select count(*)::int from orders o where o.tenant_id = t.id) as order_count,
            (select count(*)::int from tenant_members tm where tm.tenant_id = t.id) as member_count,
            coalesce((select sp.code from tenant_subscriptions ts join subscription_plans sp on sp.id = ts.plan_id where ts.tenant_id = t.id limit 1), 'free') as plan_code
          from tenants t left join "user" u on u.id = t.owner_user_id
          order by t.created_at desc limit 500
        `,
        sql<Record<string, unknown>>`
          select b.id, b.tenant_id, t.name_ar as tenant_name, b.name_ar, b.name_en,
            coalesce(t.city, '') as city, coalesce(b.phone, '') as phone, b.is_active
          from branches b join tenants t on t.id = b.tenant_id order by t.created_at desc, b.created_at desc limit 1000
        `,
        sql<Record<string, unknown>>`
          select tm.tenant_id, t.name_ar as tenant_name, tm.user_id, coalesce(u.name, '') as name,
            coalesce(u.email, '') as email, tm.role, tm.created_at
          from tenant_members tm join tenants t on t.id = tm.tenant_id
          left join "user" u on u.id = tm.user_id
          order by tm.created_at desc limit 1000
        `,
        sql<Record<string, unknown>>`
          select id, coalesce(tenant_id::text, '') as tenant_id, coalesce(name_ar, '') as business_name,
            status, coalesce(contact_name, '') as contact_name, coalesce(contact_phone, '') as contact_phone,
            coalesce(city, '') as city, created_at
          from public.website_projects order by created_at desc limit 100
        `,
        sql<Record<string, unknown>>`
          select id, business_name, coalesce(service_type, '') as service_type, coalesce(city, '') as city,
            contact_name, contact_phone, status, created_at
          from public.service_requests order by created_at desc limit 100
        `,
        sql<Record<string, unknown>>`
          select e.id, e.order_id, o.order_number, t.name_ar as tenant_name,
            coalesce(e.from_status, '') as from_status, e.to_status, coalesce(e.actor_user_id, '') as actor_user_id, e.created_at
          from order_status_events e join orders o on o.id = e.order_id join tenants t on t.id = o.tenant_id
          order by e.created_at desc limit 100
        `,
        sql<Record<string, number>>`
          select
            (select count(*)::int from tenants) as tenant_count,
            (select count(*)::int from tenants where is_active) as active_tenant_count,
            (select count(*)::int from tenants where is_published) as published_tenant_count,
            (select count(*)::int from branches) as branch_count,
            (select count(*)::int from products) as product_count,
            (select count(*)::int from orders) as order_count,
            (select count(*)::int from orders where status in ('new','confirmed','preparing','ready')) as open_order_count,
            (select count(*)::int from leads) as lead_count,
            (select count(*)::int from leads where status = 'new') as new_lead_count,
            (select count(*)::int from menu_events) as menu_event_count,
            (select count(*)::int from tenant_subscriptions where status = 'active') as active_subscription_count,
            (select count(*)::int from tenant_subscriptions where status = 'trialing') as trial_subscription_count
        `,
        sql<Record<string, number>>`
          select
            (select count(*)::int from menu_events where event_type = 'visit') as visits,
            (select count(*)::int from menu_events where event_type = 'product_view') as product_views,
            (select count(*)::int from menu_events where event_type = 'qr_scan') as qr_scans,
            (select count(*)::int from menu_events where event_type = 'whatsapp') as whatsapp_clicks,
            (select count(*)::int from orders) as orders,
            (select count(*)::int from orders where status = 'completed') as completed_orders
        `,
      ]);
      const c = counts[0] ?? {};
      const a = analytics[0] ?? {};
      return {
        ok: true,
        data: {
          tenants: tenants.map((t) => ({
            id: String(t.id), ownerUserId: String(t.owner_user_id), ownerName: String(t.owner_name ?? ''), ownerEmail: String(t.owner_email ?? ''),
            slug: String(t.slug), nameAr: String(t.name_ar ?? ''), nameEn: String(t.name_en ?? ''), city: String(t.city ?? ''), country: String(t.country ?? ''),
            isPublished: Boolean(t.is_published), isActive: Boolean(t.is_active), createdAt: iso(t.created_at), branchCount: num(t.branch_count),
            productCount: num(t.product_count), orderCount: num(t.order_count), memberCount: num(t.member_count), planCode: String(t.plan_code ?? 'free'),
          })),
          branches: branches.map((b) => ({ id: String(b.id), tenantId: String(b.tenant_id), tenantName: String(b.tenant_name ?? ''), nameAr: String(b.name_ar ?? ''), nameEn: String(b.name_en ?? ''), city: String(b.city ?? ''), phone: String(b.phone ?? ''), isActive: Boolean(b.is_active) })),
          members: members.map((m) => ({ tenantId: String(m.tenant_id), tenantName: String(m.tenant_name ?? ''), userId: String(m.user_id), name: String(m.name ?? ''), email: String(m.email ?? ''), role: String(m.role ?? ''), createdAt: iso(m.created_at) })),
          projects: projects.map((p) => ({ id: String(p.id), tenantId: String(p.tenant_id ?? ''), businessName: String(p.business_name ?? ''), status: String(p.status ?? ''), contactName: String(p.contact_name ?? ''), contactPhone: String(p.contact_phone ?? ''), city: String(p.city ?? ''), createdAt: iso(p.created_at) })),
          serviceRequests: serviceRequests.map((r) => ({ id: String(r.id), businessName: String(r.business_name ?? ''), serviceType: String(r.service_type ?? ''), city: String(r.city ?? ''), contactName: String(r.contact_name ?? ''), contactPhone: String(r.contact_phone ?? ''), status: String(r.status ?? ''), createdAt: iso(r.created_at) })),
          activity: activity.map((e) => ({ id: String(e.id), orderId: String(e.order_id), orderNumber: num(e.order_number), tenantName: String(e.tenant_name ?? ''), fromStatus: String(e.from_status ?? ''), toStatus: String(e.to_status ?? ''), actorUserId: String(e.actor_user_id ?? ''), createdAt: iso(e.created_at) })),
          analytics: { visits: num(a.visits), productViews: num(a.product_views), qrScans: num(a.qr_scans), whatsappClicks: num(a.whatsapp_clicks), orders: num(a.orders), completedOrders: num(a.completed_orders) },
          tenantCount: num(c.tenant_count), activeTenantCount: num(c.active_tenant_count), publishedTenantCount: num(c.published_tenant_count), branchCount: num(c.branch_count), productCount: num(c.product_count), orderCount: num(c.order_count), openOrderCount: num(c.open_order_count), leadCount: num(c.lead_count), newLeadCount: num(c.new_lead_count), menuEventCount: num(c.menu_event_count), activeSubscriptionCount: num(c.active_subscription_count), trialSubscriptionCount: num(c.trial_subscription_count),
        },
      };
    } catch (error) {
      console.error("getPlatformDashboard failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل بيانات منصة Menu V3" };
    }
  });

export const updatePlatformTenantStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(128), isActive: z.boolean() }))
  .handler(async ({ context, data }): Promise<FnResult<{ id: string; isActive: boolean }>> => {
    const permission = await assertPlatformAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const rows = await sql<{ id: string; is_active: boolean }>`update tenants set is_active = ${data.isActive}, updated_at = now() where id = ${data.tenantId} returning id, is_active`;
      if (!rows[0]) return { ok: false, code: "not_found", error: "المطعم غير موجود" };
      return { ok: true, data: { id: String(rows[0].id), isActive: Boolean(rows[0].is_active) } };
    } catch (error) {
      console.error("updatePlatformTenantStatus failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحديث حالة المطعم" };
    }
  });
