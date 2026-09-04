import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import { mapBranch, mapCategory, mapHour, mapProduct, mapTenant } from "./map";
import { DEMO_MENU } from "./demo";
import type { EventType, FnResult, ModifierGroup, ModifierOption, ProductOptions, ProductVariant, PublicMenu } from "./types";

const slugSchema = z.string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*$/);

type PublicMenuRow = {
  tenant: Record<string, unknown>;
  branch: Record<string, unknown>;
  branches: Record<string, unknown>[];
  hours: Record<string, unknown>[];
  categories: Record<string, unknown>[];
  products: Record<string, unknown>[];
};

const menuCache = new Map<string, { menu: PublicMenu; expiresAt: number }>();
const MENU_CACHE_TTL_MS = 15_000;

export function invalidatePublicMenuCache(tenantSlug: string): void {
  const prefix = `${tenantSlug}:`;
  for (const key of menuCache.keys()) if (key.startsWith(prefix)) menuCache.delete(key);
}

function mapVariant(row: Record<string, unknown>): ProductVariant {
  return {
    id: String(row.id), tenantId: String(row.tenant_id), productId: String(row.product_id),
    nameAr: String(row.name_ar), nameEn: String(row.name_en ?? ""), price: Number(row.price),
    sortOrder: Number(row.sort_order), isAvailable: Boolean(row.is_available),
  };
}
function mapGroup(row: Record<string, unknown>): ModifierGroup {
  return {
    id: String(row.id), tenantId: String(row.tenant_id), nameAr: String(row.name_ar), nameEn: String(row.name_en ?? ""),
    minSelect: Number(row.min_select), maxSelect: Number(row.max_select), sortOrder: Number(row.sort_order),
    isRequired: Boolean(row.is_required), isActive: Boolean(row.is_active),
  };
}
function mapOption(row: Record<string, unknown>): ModifierOption {
  return {
    id: String(row.id), tenantId: String(row.tenant_id), groupId: String(row.group_id), nameAr: String(row.name_ar),
    nameEn: String(row.name_en ?? ""), priceDelta: Number(row.price_delta), sortOrder: Number(row.sort_order), isAvailable: Boolean(row.is_available),
  };
}

async function loadPublicOptions(sql: Awaited<ReturnType<typeof getSql>>, tenantId: string, productIds: string[]) {
  const out: Record<string, ProductOptions> = {};
  if (!productIds.length) return out;
  const [variants, groups, options] = await Promise.all([
    sql`select * from product_variants where tenant_id = ${tenantId} and product_id = any(${productIds}) and is_available = true order by product_id, sort_order, created_at`,
    sql`select g.*, p.product_id, p.sort_order as link_sort_order
        from modifier_groups g
        join product_modifier_groups p on p.modifier_group_id = g.id
        where g.tenant_id = ${tenantId} and p.product_id = any(${productIds}) and g.is_active = true
        order by p.product_id, p.sort_order, g.sort_order, g.created_at`,
    sql`select o.*, p.product_id
        from modifier_options o
        join product_modifier_groups p on p.modifier_group_id = o.group_id
        where o.tenant_id = ${tenantId} and p.product_id = any(${productIds}) and o.is_available = true
        order by p.product_id, o.group_id, o.sort_order, o.created_at`,
  ]);
  for (const id of productIds) out[id] = { variants: [], groups: [], options: [] };
  for (const row of variants) {
    const id = String(row.product_id);
    if (out[id]) out[id].variants.push(mapVariant(row as Record<string, unknown>));
  }
  for (const row of groups) {
    const id = String(row.product_id);
    if (out[id]) out[id].groups.push(mapGroup(row as Record<string, unknown>));
  }
  for (const row of options) {
    const id = String(row.product_id);
    if (out[id]) out[id].options.push(mapOption(row as Record<string, unknown>));
  }
  return out;
}

async function loadPublicMenu(tenantSlug: string, branchSlug?: string | null): Promise<FnResult<PublicMenu>> {
  const cacheKey = `${tenantSlug}:${branchSlug ?? "default"}`;
  const cached = menuCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return { ok: true, data: cached.menu };

  if (tenantSlug === DEMO_MENU.tenant.slug && !branchSlug) {
    menuCache.set(cacheKey, { menu: DEMO_MENU, expiresAt: Date.now() + MENU_CACHE_TTL_MS });
    return { ok: true, data: DEMO_MENU };
  }

  try {
    const sql = await getSql();
    const rows = await sql<PublicMenuRow>`
      select
        to_jsonb(t) as tenant,
        to_jsonb(b) as branch,
        coalesce((select jsonb_agg(to_jsonb(b2) order by b2.created_at) from branches b2 where b2.tenant_id = t.id and b2.is_active = true), '[]'::jsonb) as branches,
        coalesce((select jsonb_agg(to_jsonb(h) order by h.weekday) from branch_hours h where h.branch_id = b.id), '[]'::jsonb) as hours,
        coalesce((select jsonb_agg(to_jsonb(c) order by c.sort_order, c.created_at) from categories c where c.tenant_id = t.id and c.is_active = true), '[]'::jsonb) as categories,
        coalesce((select jsonb_agg(to_jsonb(p) order by p.sort_order, p.created_at) from products p where p.tenant_id = t.id), '[]'::jsonb) as products
      from tenants t
      join lateral (
        select b0.* from branches b0
        where b0.tenant_id = t.id and b0.is_active = true
          and (${branchSlug ?? null}::text is null or b0.slug = ${branchSlug ?? null})
        order by b0.created_at limit 1
      ) b on true
      where t.slug = ${tenantSlug} and t.is_active = true and t.is_published = true
      limit 1
    `;
    const row = rows[0];
    if (!row) return { ok: false, code: "not_found", error: "المنيو غير موجود" };
    const tenant = mapTenant(row.tenant);
    const products = (row.products ?? []).map(mapProduct);
    const menu: PublicMenu = {
      tenant,
      branch: mapBranch(row.branch),
      branches: (row.branches ?? []).map(mapBranch),
      hours: (row.hours ?? []).map(mapHour),
      categories: (row.categories ?? []).map(mapCategory),
      products,
      productOptions: await loadPublicOptions(sql, tenant.id, products.map((p) => p.id)),
    };
    menuCache.set(cacheKey, { menu, expiresAt: Date.now() + MENU_CACHE_TTL_MS });
    return { ok: true, data: menu };
  } catch (err) {
    console.error("loadPublicMenu failed", err);
    return { ok: false, code: "unavailable", error: "تعذر تحميل المنيو حالياً" };
  }
}

export const getPublicMenu = createServerFn({ method: "GET" })
  .validator(z.object({ slug: slugSchema, branch: z.string().max(63).optional() }))
  .handler(async ({ data }) => loadPublicMenu(data.slug, data.branch));

export const recordPublicEvent = createServerFn({ method: "POST" })
  .validator(z.object({
    slug: slugSchema,
    branchSlug: z.string().max(63).optional(),
    productId: z.string().max(80).optional(),
    eventType: z.enum(["visit", "product_view", "qr_scan", "whatsapp"]),
    lang: z.enum(["ar", "en"]).optional(),
    sessionId: z.string().min(8).max(80),
  }))
  .handler(async ({ data }): Promise<FnResult<{ recorded: boolean }>> => {
    try {
      const sql = await getSql();
      const tenants = await sql`select id from tenants where slug = ${data.slug} and is_active = true and is_published = true limit 1`;
      const tenantId = tenants[0]?.id as string | undefined;
      if (!tenantId) return { ok: false, code: "not_found", error: "المنيو غير موجود" };
      let branchId: string | null = null;
      if (data.branchSlug) {
        const b = await sql`select id from branches where tenant_id = ${tenantId} and slug = ${data.branchSlug} and is_active = true limit 1`;
        branchId = (b[0]?.id as string) ?? null;
      }
      if (data.eventType === "product_view") {
        if (!data.productId) return { ok: false, code: "invalid", error: "صنف غير صالح" };
        const p = await sql`select id from products where id = ${data.productId} and tenant_id = ${tenantId} limit 1`;
        if (!p[0]) return { ok: false, code: "invalid", error: "صنف غير صالح" };
      }
      if (data.eventType === "visit" || data.eventType === "qr_scan") {
        const recent = await sql`select id from menu_events where tenant_id = ${tenantId} and session_id = ${data.sessionId} and event_type = ${data.eventType} and created_at > now() - interval '30 minutes' limit 1`;
        if (recent[0]) return { ok: true, data: { recorded: false } };
      }
      const eventType: EventType = data.eventType;
      await sql`insert into menu_events (id, tenant_id, branch_id, product_id, event_type, lang, session_id) values (${newId()}, ${tenantId}, ${branchId}, ${data.productId ?? null}, ${eventType}, ${data.lang ?? null}, ${data.sessionId})`;
      return { ok: true, data: { recorded: true } };
    } catch (err) {
      console.error("recordPublicEvent failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تسجيل الحدث" };
    }
  });

export const submitLead = createServerFn({ method: "POST" })
  .validator(z.object({
    businessName: z.string().trim().min(2).max(120),
    city: z.string().trim().max(80).optional(),
    contactName: z.string().trim().min(2).max(80),
    contactPhone: z.string().trim().min(8).max(30),
    contactEmail: z.string().trim().email().optional().or(z.literal("")),
    details: z.string().trim().max(1000).optional(),
  }))
  .handler(async ({ data }): Promise<FnResult<{ id: string }>> => {
    try {
      const sql = await getSql();
      const id = newId();
      await sql`insert into leads (id, business_name, city, contact_name, contact_phone, contact_email, details) values (${id}, ${data.businessName}, ${data.city ?? null}, ${data.contactName}, ${data.contactPhone}, ${data.contactEmail || null}, ${data.details ?? null})`;
      return { ok: true, data: { id } };
    } catch (err) {
      console.error("submitLead failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إرسال الطلب حالياً" };
    }
  });
