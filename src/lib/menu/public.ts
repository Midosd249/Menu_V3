import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import { mapBranch, mapCategory, mapHour, mapProduct, mapPublicTenant } from "./map";
import { DEMO_MENU } from "./demo";
import { ACTIVE_EXPERIMENT, getExperimentVariant } from "./experiment";
import { resolveAnonymousSession } from "./session.server";
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
  const ensure = (id: string): ProductOptions => {
    if (!out[id]) out[id] = { variants: [], groups: [], options: [] };
    return out[id];
  };
  for (const row of variants) {
    const id = String(row.product_id);
    ensure(id).variants.push(mapVariant(row as Record<string, unknown>));
  }
  for (const row of groups) {
    const id = String(row.product_id);
    ensure(id).groups.push(mapGroup(row as Record<string, unknown>));
  }
  for (const row of options) {
    const id = String(row.product_id);
    ensure(id).options.push(mapOption(row as Record<string, unknown>));
  }
  return out;
}

async function loadPublicMenu(tenantSlug: string, branchSlug?: string | null): Promise<FnResult<PublicMenu>> {
  if (tenantSlug === DEMO_MENU.tenant.slug && !branchSlug) {
    const cacheKey = `${tenantSlug}:default:demo`;
    const cached = menuCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return { ok: true, data: cached.menu };
    menuCache.set(cacheKey, { menu: DEMO_MENU, expiresAt: Date.now() + MENU_CACHE_TTL_MS });
    return { ok: true, data: DEMO_MENU };
  }

  try {
    const sql = await getSql();
    const revisionRows = await sql<{ public_content_version: string | number }>`
      select public_content_version
      from tenants
      where slug = ${tenantSlug} and is_active = true and is_published = true
      limit 1
    `;
    const revision = String(revisionRows[0]?.public_content_version ?? "0");
    const cacheKey = `${tenantSlug}:${branchSlug ?? "default"}:${revision}`;
    const cached = menuCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return { ok: true, data: cached.menu };

    const rows = await sql<PublicMenuRow>`
      select
        jsonb_build_object(
          'id', t.id,
          'owner_user_id', t.owner_user_id,
          'slug', t.slug,
          'name_ar', t.name_ar,
          'name_en', t.name_en,
          'tagline_ar', t.tagline_ar,
          'tagline_en', t.tagline_en,
          'logo_url', t.logo_url,
          'cover_url', t.cover_url,
          'instagram_url', t.instagram_url,
          'website_url', t.website_url,
          'snapchat_url', t.snapchat_url,
          'facebook_url', t.facebook_url,
          'tiktok_url', t.tiktok_url,
          'whatsapp', t.whatsapp,
          'whatsapp_template', t.whatsapp_template,
          'primary_color', t.primary_color,
          'accent_color', t.accent_color,
          'theme_key', t.theme_key,
          'currency', t.currency,
          'city', t.city,
          'country', t.country,
          'is_published', t.is_published,
          'is_active', t.is_active,
          'updated_at', t.updated_at
        ) as tenant,
        jsonb_build_object(
          'id', b.id,
          'tenant_id', b.tenant_id,
          'slug', b.slug,
          'name_ar', b.name_ar,
          'name_en', b.name_en,
          'address_ar', b.address_ar,
          'address_en', b.address_en,
          'maps_url', b.maps_url,
          'phone', b.phone,
          'is_active', b.is_active
        ) as branch,
        coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', b2.id,
            'tenant_id', b2.tenant_id,
            'slug', b2.slug,
            'name_ar', b2.name_ar,
            'name_en', b2.name_en,
            'address_ar', b2.address_ar,
            'address_en', b2.address_en,
            'maps_url', b2.maps_url,
            'phone', b2.phone,
            'is_active', b2.is_active
          ) order by b2.created_at)
          from branches b2
          where b2.tenant_id = t.id and b2.is_active = true
        ), '[]'::jsonb) as branches,
        coalesce((
          select jsonb_agg(jsonb_build_object(
            'branch_id', h.branch_id,
            'weekday', h.weekday,
            'opens_at', h.opens_at,
            'closes_at', h.closes_at,
            'is_closed', h.is_closed
          ) order by h.weekday)
          from branch_hours h where h.branch_id = b.id
        ), '[]'::jsonb) as hours,
        coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', c.id,
            'tenant_id', c.tenant_id,
            'sort_order', c.sort_order,
            'name_ar', c.name_ar,
            'name_en', c.name_en,
            'is_active', c.is_active
          ) order by c.sort_order, c.created_at)
          from categories c where c.tenant_id = t.id and c.is_active = true
        ), '[]'::jsonb) as categories,
        coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', p.id,
            'tenant_id', p.tenant_id,
            'category_id', p.category_id,
            'sort_order', p.sort_order,
            'name_ar', p.name_ar,
            'name_en', p.name_en,
            'description_ar', p.description_ar,
            'description_en', p.description_en,
            'price', p.price,
            'currency', p.currency,
            'image_url', p.image_url,
            'calories', p.calories,
            'sodium_mg', p.sodium_mg,
            'caffeine_mg', p.caffeine_mg,
            'caffeine_basis', p.caffeine_basis,
            'is_available', p.is_available,
            'is_featured', p.is_featured,
            'allergens', p.allergens,
            'tags', p.tags,
            'dietary_labels', p.dietary_labels
          ) order by p.sort_order, p.created_at)
          from products p where p.tenant_id = t.id
        ), '[]'::jsonb) as products
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
    const tenant = mapPublicTenant(row.tenant);
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
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "private, no-store");
    const result = await loadPublicMenu(data.slug, data.branch);
    if (!result.ok) return result;

    const sql = await getSql();
    const session = await resolveAnonymousSession(sql, result.data.tenant.id);
    const experimentVariant = result.data.tenant.whatsapp?.trim()
      ? getExperimentVariant(session.id)
      : "control" as const;

    return {
      ok: true,
      data: { ...result.data, experimentVariant },
    };
  });

export const recordPublicEvent = createServerFn({ method: "POST" })
  .validator(z.object({
    slug: slugSchema,
    branchSlug: z.string().max(63).optional(),
    productId: z.string().max(80).optional(),
    categoryId: z.string().max(80).optional(),
    eventType: z.enum(["visit", "product_view", "qr_scan", "whatsapp", "search", "category_view", "add_to_cart"]),
    lang: z.enum(["ar", "en"]).optional(),
  }))
  .handler(async ({ data }): Promise<FnResult<{ recorded: boolean }>> => {
    try {
      const sql = await getSql();
      const tenants = await sql<{ id: string; whatsapp: string | null }>`
        select id, whatsapp from tenants
        where slug = ${data.slug} and is_active = true and is_published = true
        limit 1
      `;
      const tenantId = tenants[0]?.id;
      if (!tenantId) return { ok: false, code: "not_found", error: "المنيو غير موجود" };

      let branchId: string | null = null;
      if (data.branchSlug) {
        const branches = await sql<{ id: string }>`
          select id from branches
          where tenant_id = ${tenantId} and slug = ${data.branchSlug} and is_active = true
          limit 1
        `;
        branchId = branches[0]?.id ?? null;
      }

      const isProductEvent = data.eventType === "product_view" || data.eventType === "add_to_cart";
      const isCategoryEvent = data.eventType === "category_view";

      if (isProductEvent) {
        if (!data.productId || data.categoryId) return { ok: false, code: "invalid", error: "بيانات الصنف غير صالحة" };
        const p = await sql`select id from products where id = ${data.productId} and tenant_id = ${tenantId} limit 1`;
        if (!p[0]) return { ok: false, code: "invalid", error: "صنف غير صالح" };
      } else if (isCategoryEvent) {
        if (!data.categoryId || data.productId) return { ok: false, code: "invalid", error: "بيانات التصنيف غير صالحة" };
        const category = await sql`select id from categories where id = ${data.categoryId} and tenant_id = ${tenantId} and is_active = true limit 1`;
        if (!category[0]) return { ok: false, code: "invalid", error: "تصنيف غير صالح" };
      } else if (data.productId || data.categoryId) {
        return { ok: false, code: "invalid", error: "بيانات الحدث غير صالحة" };
      }

      const session = await resolveAnonymousSession(sql, String(tenantId));

      if (data.eventType === "visit" || data.eventType === "qr_scan" || data.eventType === "search") {
        const recent = await sql`
          select id from menu_events
          where tenant_id = ${tenantId}
            and session_id = ${session.id}
            and event_type = ${data.eventType}
            and created_at > now() - interval '30 minutes'
          limit 1
        `;
        if (recent[0]) return { ok: true, data: { recorded: false } };
      }

      const experimentKey = tenants[0]?.whatsapp?.trim() ? ACTIVE_EXPERIMENT : null;
      const experimentVariant = experimentKey ? getExperimentVariant(session.id) : null;
      const eventType: EventType = data.eventType;
      await sql`
        insert into menu_events (
          id, tenant_id, branch_id, product_id, category_id, event_type, lang,
          session_id, experiment_key, experiment_variant
        )
        values (
          ${newId()}, ${tenantId}, ${branchId}, ${data.productId ?? null}, ${data.categoryId ?? null},
          ${eventType}, ${data.lang ?? null}, ${session.id}, ${experimentKey}, ${experimentVariant}
        )
      `;
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
