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
