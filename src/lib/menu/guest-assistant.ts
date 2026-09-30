import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { generateStructuredAi } from "./ai-core";
import { resolveAnonymousSession } from "./session.server";
import { getActiveOfferProductIds } from "./offers";
import { buildGuestAssistantCatalog, type GuestCatalogProduct } from "./guest-assistant-catalog";
import type { FnResult, ProductOffer } from "./types";

const inputSchema = z.object({
  slug: z.string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*$/),
  branchSlug: z.string().max(63).optional(),
  lang: z.enum(["ar", "en"]).default("ar"),
  question: z.string().trim().min(2).max(500),
});

const responseFormat = {
  name: "guest_menu_answer",
  strict: true,
  schema: {
    type: "object",
    properties: {
      answerAr: { type: "string", minLength: 1, maxLength: 700 },
      answerEn: { type: "string", minLength: 1, maxLength: 700 },
      productIds: { type: "array", items: { type: "string", minLength: 1, maxLength: 80 }, maxItems: 5 },
    },
    required: ["answerAr", "answerEn", "productIds"],
    additionalProperties: false,
  },
};

const responseSchema = z.object({
  answerAr: z.string().trim().min(1).max(700),
  answerEn: z.string().trim().min(1).max(700),
  productIds: z.array(z.string().trim().min(1).max(80)).max(5),
});

type MenuProductRow = {
  tenant_id: string;
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  currency: string;
  allergens: string;
  dietary_labels: string[] | null;
  category_id: string | null;
  category_ar: string;
  category_en: string;
  is_available: boolean;
};

type MenuOfferRow = {
  id: string;
  tenant_id: string;
  product_id: string;
  offer_type: ProductOffer["offerType"];
  value: number | null;
  label_ar: string;
  label_en: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
};

type MenuProduct = GuestCatalogProduct;

function clean(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

async function loadGuestCatalog(slug: string, branchSlug?: string) {
  const sql = await getSql();
  const rows = await sql<MenuProductRow>`
    select
      t.id as tenant_id,
      p.id, p.name_ar, p.name_en, p.description_ar, p.description_en, p.price, p.currency,
      p.allergens, p.dietary_labels, p.category_id, p.is_available,
      coalesce(c.name_ar, '') as category_ar,
      coalesce(c.name_en, '') as category_en
    from tenants t
    join lateral (
      select b0.* from branches b0
      where b0.tenant_id = t.id and b0.is_active = true
        and (${branchSlug ?? null}::text is null or b0.slug = ${branchSlug ?? null})
      order by b0.created_at limit 1
    ) b on true
    join products p on p.tenant_id = t.id and p.is_available = true
    left join categories c on c.id = p.category_id and c.tenant_id = t.id and c.is_active = true
    where t.slug = ${slug} and t.is_active = true and t.is_published = true
    order by p.sort_order, p.created_at
    limit 250
  `;
  const products: MenuProduct[] = rows.map((row) => ({
    id: String(row.id),
    nameAr: String(row.name_ar),
    nameEn: String(row.name_en ?? ""),
    descriptionAr: String(row.description_ar ?? ""),
    descriptionEn: String(row.description_en ?? ""),
    price: Number(row.price),
    currency: String(row.currency ?? "SAR"),
    allergens: String(row.allergens ?? ""),
    dietaryLabels: Array.isArray(row.dietary_labels) ? row.dietary_labels.map(String) : [],
    categoryAr: String(row.category_ar ?? ""),
    categoryEn: String(row.category_en ?? ""),
    isAvailable: Boolean(row.is_available),
  }));
  const productIds = products.map((product) => product.id);
  const offerRows = productIds.length
    ? await sql<MenuOfferRow>`
        select id, tenant_id, product_id, offer_type, value, label_ar, label_en, starts_at, ends_at, is_active
        from product_offers
        where tenant_id = ${rows[0]?.tenant_id ?? null} and product_id = any(${productIds}) and is_active = true
      `
    : [];
  const offers: Record<string, ProductOffer> = {};
  for (const offer of offerRows) {
    offers[String(offer.product_id)] = {
      id: String(offer.id), tenantId: String(offer.tenant_id), productId: String(offer.product_id),
      offerType: offer.offer_type, value: offer.value == null ? null : Number(offer.value),
      labelAr: String(offer.label_ar ?? ""), labelEn: String(offer.label_en ?? ""),
      startsAt: offer.starts_at ? new Date(offer.starts_at).toISOString() : null,
      endsAt: offer.ends_at ? new Date(offer.ends_at).toISOString() : null, isActive: Boolean(offer.is_active),
    };
  }
  const activeOfferProductIds = getActiveOfferProductIds(productIds, offers);
  const activeOffers: Record<string, ProductOffer> = {};
  for (const productId of activeOfferProductIds) activeOffers[productId] = offers[productId];
  return { sql, tenantId: rows[0]?.tenant_id ?? null, products, offers: activeOffers };
}

import { fallbackGuestAnswer } from "./guest-assistant-fallback";

function buildCatalog(products: MenuProduct[]) {
  return products.map((p, index) => [
    `#${index + 1}`,
    `ID=${clean(p.id, 80)}`,
    `AR=${clean(p.nameAr, 120)}`,
    `EN=${clean(p.nameEn, 120)}`,
    `CAT_AR=${clean(p.categoryAr, 80)}`,
    `CAT_EN=${clean(p.categoryEn, 80)}`,
    `DESC_AR=${clean(p.descriptionAr, 240)}`,
    `DESC_EN=${clean(p.descriptionEn, 240)}`,
    `PRICE=${p.price} ${clean(p.currency, 12)}`,
    `ALLERGENS=${clean(p.allergens, 180) || "غير مذكورة"}`,
    `DIETARY=${clean(p.dietaryLabels.join(", "), 120) || "غير مذكورة"}`,
  ].join(" | ")).join("\n");
}

export const askGuestMenuAssistant = createServerFn({ method: "POST" })
  .validator(inputSchema)
  .handler(async ({ data }): Promise<FnResult<{ answerAr: string; answerEn: string; productIds: string[] }>> => {
    try {
      const { sql, tenantId, products, offers } = await loadGuestCatalog(data.slug, data.branchSlug);
      if (!tenantId || !products.length) return { ok: false, code: "not_found", error: "لا توجد أصناف متاحة حالياً" };

      const anonymousSession = await resolveAnonymousSession(sql, tenantId);
      const allowedIds = new Set(products.map((p) => p.id));
      const catalog = buildGuestAssistantCatalog(products, offers).slice(0, 32_000);
      const result = await generateStructuredAi({
        sql,
        tenantId,
        userId: `guest-session:${anonymousSession.id}`,
        operation: "guest.menu_assistant",
        rateLimitIp: getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
        prompt: [
          `Guest question (${data.lang}): ${data.question}`,
          "Answer using ONLY the available menu catalog below.",
          "If the catalog does not contain enough evidence, say clearly that the information is not available in the menu.",
          "Never invent ingredients, allergens, dietary properties, availability, prices, promotions, preparation methods, opening hours, delivery details, or policies.",
          "Do not claim that an allergen is absent merely because it is not listed. If allergens are not listed, say they are not specified in the menu.",
          "Recommend or mention products only when their exact IDs are present in the catalog.",
          "Return concise, useful answers. Keep Arabic natural and customer-friendly; keep English faithful.",
          `CATALOG:\n${catalog}`,
        ].join("\n\n"),
        responseFormat,
        responseSchema,
        maxTokens: 500,
        temperature: 0.2,
        systemPrompt: "You are a grounded restaurant menu assistant. The supplied published menu is the only source of truth. You are read-only. Never guess. Never execute transactions. Never claim facts that are not explicitly present in the supplied catalog. The restaurant owner and database remain authoritative.",
      });
      if (!result.ok) {
        const fallback = fallbackGuestAnswer(data.question, products);
        return { ok: true, data: fallback };
      }

      const productIds = result.data.productIds.filter((id) => allowedIds.has(id));
      return { ok: true, data: { answerAr: result.data.answerAr, answerEn: result.data.answerEn, productIds } };
    } catch (error) {
      console.error("askGuestMenuAssistant failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تشغيل مساعد القائمة حالياً" };
    }
  });
