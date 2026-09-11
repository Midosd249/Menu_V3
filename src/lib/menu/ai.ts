import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { generateStructuredAi } from "./ai-core";
import type { Role } from "./types";

const operationSchema = z.enum(["description", "english", "category", "tags", "allergens", "price"]);
const inputSchema = z.object({
  operation: operationSchema,
  nameAr: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().max(120).optional(),
  descriptionAr: z.string().trim().max(600).optional(),
  descriptionEn: z.string().trim().max(600).optional(),
  categoryId: z.string().trim().min(1).nullable().optional(),
  categoryOptions: z.array(z.object({ id: z.string().min(1), nameAr: z.string().max(80), nameEn: z.string().max(80) })).max(100),
});

type Member = { tenant_id: string; role: Role };
type CategoryOption = { id: string; nameAr: string; nameEn: string };
type JsonSchema = Record<string, unknown>;

export type MenuQaIssue = {
  key: string;
  severity: "high" | "medium" | "low";
  titleAr: string;
  titleEn: string;
  detailsAr: string;
  detailsEn: string;
  productNameAr: string;
  recommendationAr: string;
  recommendationEn: string;
};
export type MenuQaResult = {
  score: number;
  summaryAr: string;
  summaryEn: string;
  issues: MenuQaIssue[];
  analyzedProducts: number;
};

type AiResult =
  | { operation: "description"; descriptionAr: string }
  | { operation: "english"; nameEn: string; descriptionEn: string }
  | { operation: "category"; categoryId: string | null; categoryNameAr: string; categoryNameEn: string }
  | { operation: "tags"; tags: string[] }
  | { operation: "allergens"; allergens: string[]; disclaimerAr: string; disclaimerEn: string }
  | { operation: "price"; price: number | null; cleanedNameAr: string };

function canWriteMenu(role: Role) {
  return role === "owner" || role === "admin" || role === "editor";
}
async function getMember(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<Member>`select tenant_id, role from tenant_members where user_id = ${userId} and is_active = true order by created_at limit 1`;
  return rows[0] ?? null;
}
function jsonSchema(name: string, properties: Record<string, unknown>, required: string[]): JsonSchema {
  return { name, strict: true, schema: { type: "object", properties, required, additionalProperties: false } };
}
function schemaFor(operation: z.infer<typeof operationSchema>): JsonSchema {
  if (operation === "description") return jsonSchema("menu_description", { descriptionAr: { type: "string", minLength: 1, maxLength: 600 } }, ["descriptionAr"]);
  if (operation === "english") return jsonSchema("menu_english", {
    nameEn: { type: "string", minLength: 1, maxLength: 120 },
    descriptionEn: { type: "string", minLength: 1, maxLength: 600 },
  }, ["nameEn", "descriptionEn"]);
  if (operation === "category") return jsonSchema("menu_category", {
    categoryId: { type: ["string", "null"] },
    categoryNameAr: { type: "string", maxLength: 80 },
    categoryNameEn: { type: "string", maxLength: 80 },
  }, ["categoryId", "categoryNameAr", "categoryNameEn"]);
  if (operation === "tags") return jsonSchema("menu_tags", {
    tags: { type: "array", items: { type: "string", minLength: 1, maxLength: 40 }, maxItems: 8 },
  }, ["tags"]);
  if (operation === "price") return jsonSchema("menu_price", {
    price: { type: ["number", "null"], minimum: 0 },
    cleanedNameAr: { type: "string", minLength: 1, maxLength: 120 },
  }, ["price", "cleanedNameAr"]);
  return jsonSchema("menu_allergens", {
    allergens: { type: "array", items: { type: "string", minLength: 1, maxLength: 40 }, maxItems: 12 },
    disclaimerAr: { type: "string", minLength: 1, maxLength: 240 },
    disclaimerEn: { type: "string", minLength: 1, maxLength: 240 },
  }, ["allergens", "disclaimerAr", "disclaimerEn"]);
}
function runtimeSchemaFor(operation: z.infer<typeof operationSchema>) {
  if (operation === "description") return z.object({ descriptionAr: z.string().trim().min(1).max(600) });
  if (operation === "english") return z.object({ nameEn: z.string().trim().min(1).max(120), descriptionEn: z.string().trim().min(1).max(600) });
  if (operation === "category") return z.object({ categoryId: z.string().min(1).nullable(), categoryNameAr: z.string().max(80), categoryNameEn: z.string().max(80) });
  if (operation === "tags") return z.object({ tags: z.array(z.string().trim().min(1).max(40)).max(8) });
  if (operation === "price") return z.object({ price: z.number().finite().min(0).nullable(), cleanedNameAr: z.string().trim().min(1).max(120) });
  return z.object({ allergens: z.array(z.string().trim().min(1).max(40)).max(12), disclaimerAr: z.string().trim().min(1).max(240), disclaimerEn: z.string().trim().min(1).max(240) });
}
function buildPrompt(data: z.infer<typeof inputSchema>, categories: CategoryOption[]) {
  const common = `Product Arabic name: ${data.nameAr}\nExisting English name: ${data.nameEn ?? ""}\nArabic description: ${data.descriptionAr ?? ""}\nEnglish description: ${data.descriptionEn ?? ""}`;
  if (data.operation === "description") return `Write a concise appetizing Arabic menu description in natural Modern Standard Arabic. Do not invent ingredients, allergens, health claims, origin, cooking method, portion size, or prices. ${common}`;
  if (data.operation === "english") return `Create a faithful polished English menu name and description. Preserve the Arabic meaning and do not invent ingredients, allergens, health claims, origin, cooking method, portion size, or prices. ${common}`;
  if (data.operation === "category") return `Choose the best matching existing category only. Never invent a category; return null if none is reasonable. ${common}\nCategories:\n${categories.map((c) => `${c.id} | ${c.nameAr} | ${c.nameEn}`).join("\n")}`;
  if (data.operation === "tags") return `Suggest up to 8 concise tags directly supported by the product name or descriptions. Do not invent ingredients, dietary claims, allergens, cooking methods, or certifications. Avoid duplicates. ${common}`;
  if (data.operation === "price") return `Extract a product price from the Arabic product name field when a numeric price is explicitly present, such as "كبسة دجاج 20" or "كبسة دجاج - 20 ريال". The number must be interpreted as the price only when it is clearly presented as a price. Do not invent or estimate a price. Return null if no explicit price is present. Also return the cleaned Arabic product name with the explicit price marker removed. Do not change any other words. ${common}`;
  return `Suggest potential food allergens using ONLY explicit evidence in the product name and existing Arabic/English descriptions. Do not infer hidden ingredients from cuisine type, common recipes, restaurant knowledge, or assumptions. Absence of a mention is not proof of absence. If evidence is insufficient, return an empty allergens array. Use common Arabic allergen names. This is for owner review, not a food-safety guarantee. ${common}`;
}

export const generateMenuAi = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(inputSchema)
  .handler(async ({ context, data }): Promise<{ ok: true; data: AiResult } | { ok: false; code: string; error: string }> => {
    try {
      const sql = await getSql();
      const member = await getMember(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد حساب مطعم نشط" };
      if (!canWriteMenu(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية استخدام مساعد القائمة" };
      const rows = await sql<{ id: string; name_ar: string; name_en: string }>`select id, name_ar, name_en from categories where tenant_id = ${member.tenant_id} and is_active = true order by sort_order, created_at limit 100`;
      const categories = rows.map((c) => ({ id: c.id, nameAr: c.name_ar, nameEn: c.name_en }));
      const result = await generateStructuredAi({
        sql,
        tenantId: member.tenant_id,
        userId: context.userId,
        operation: `menu.${data.operation}`,
        prompt: buildPrompt(data, categories),
        responseFormat: schemaFor(data.operation),
        responseSchema: runtimeSchemaFor(data.operation),
        maxTokens: 700,
        temperature: 0.3,
        systemPrompt: "You are a careful restaurant menu content assistant. Never invent facts. The restaurant owner is the final approver. Respond only in the requested structured format.",
      });
      if (!result.ok) return result;
      const p = result.data as AiResult;
      if (data.operation === "description") return { ok: true, data: { operation: "description", descriptionAr: p.descriptionAr } };
      if (data.operation === "english") return { ok: true, data: { operation: "english", nameEn: p.nameEn, descriptionEn: p.descriptionEn } };
      if (data.operation === "category") {
        const selected = categories.find((c) => c.id === p.categoryId);
        if (p.categoryId !== null && !selected) return { ok: false, code: "ai_invalid", error: "أعاد مساعد الذكاء الاصطناعي تصنيفاً غير صالح" };
        return { ok: true, data: { operation: "category", categoryId: p.categoryId, categoryNameAr: selected?.nameAr ?? "", categoryNameEn: selected?.nameEn ?? "" } };
      }
      if (data.operation === "tags") return { ok: true, data: { operation: "tags", tags: [...new Set<string>(p.tags)].slice(0, 8) } };
      if (data.operation === "price") return { ok: true, data: { operation: "price", price: p.price, cleanedNameAr: p.cleanedNameAr } };
      return { ok: true, data: { operation: "allergens", allergens: [...new Set<string>(p.allergens)].slice(0, 12), disclaimerAr: p.disclaimerAr, disclaimerEn: p.disclaimerEn } };
    } catch (err) {
      console.error("generateMenuAi failed", err);
      return { ok: false, code: "ai_unavailable", error: "تعذر تشغيل مساعد الذكاء الاصطناعي" };
    }
  });

const menuQaSchema: JsonSchema = jsonSchema("menu_quality_audit", {
  score: { type: "integer", minimum: 0, maximum: 100 },
  summaryAr: { type: "string", minLength: 1, maxLength: 500 },
  summaryEn: { type: "string", minLength: 1, maxLength: 500 },
  issues: {
    type: "array", maxItems: 30,
    items: {
      type: "object",
      properties: {
        key: { type: "string", minLength: 1, maxLength: 80 },
        severity: { type: "string", enum: ["high", "medium", "low"] },
        titleAr: { type: "string", minLength: 1, maxLength: 160 }, titleEn: { type: "string", minLength: 1, maxLength: 160 },
        detailsAr: { type: "string", minLength: 1, maxLength: 500 }, detailsEn: { type: "string", minLength: 1, maxLength: 500 },
        productNameAr: { type: "string", maxLength: 120 },
        recommendationAr: { type: "string", minLength: 1, maxLength: 300 }, recommendationEn: { type: "string", minLength: 1, maxLength: 300 },
      },
      required: ["key", "severity", "titleAr", "titleEn", "detailsAr", "detailsEn", "productNameAr", "recommendationAr", "recommendationEn"],
      additionalProperties: false,
    },
  },
}, ["score", "summaryAr", "summaryEn", "issues"]);

const menuQaRuntimeSchema = z.object({
  score: z.number().int().min(0).max(100),
  summaryAr: z.string().trim().min(1).max(500),
  summaryEn: z.string().trim().min(1).max(500),
  issues: z.array(z.object({
    key: z.string().trim().min(1).max(80),
    severity: z.enum(["high", "medium", "low"]),
    titleAr: z.string().trim().min(1).max(160),
    titleEn: z.string().trim().min(1).max(160),
    detailsAr: z.string().trim().min(1).max(500),
    detailsEn: z.string().trim().min(1).max(500),
    productNameAr: z.string().max(120),
    recommendationAr: z.string().trim().min(1).max(300),
    recommendationEn: z.string().trim().min(1).max(300),
  })).max(30),
});

function compact(value: unknown, max: number) { return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max); }
function buildMenuQaPrompt(categories: Array<{ id: string; nameAr: string; nameEn: string }>, products: Array<{ nameAr: string; nameEn: string; descriptionAr: string; descriptionEn: string; categoryId: string | null; price: number; allergens: string; tags: string[]; isAvailable: boolean }>) {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const catalog = products.map((p, i) => {
    const c = p.categoryId ? byId.get(p.categoryId) : undefined;
    return [`#${i + 1}`, `AR=${compact(p.nameAr, 100)}`, `EN=${compact(p.nameEn, 100)}`, `CAT=${compact(c?.nameAr, 70)}`, `DESC_AR=${compact(p.descriptionAr, 220)}`, `DESC_EN=${compact(p.descriptionEn, 220)}`, `PRICE=${p.price}`, `ALLERGENS=${compact(p.allergens, 160)}`, `TAGS=${compact(p.tags.join(", "), 140)}`, `AVAILABLE=${p.isAvailable ? "yes" : "no"}`].join(" | ");
  }).join("\n");
  return `Audit the saved restaurant menu for the owner's review. Analyze every supplied product. Do not invent facts, infer ingredients, or treat this as food-safety certification. Check missing Arabic/English names, missing/weak descriptions, translation mismatches, duplicates, missing categories, clear category mismatch, inconsistent naming, repetitive copy, missing allergen information only when the menu text explicitly supports an ingredient, unsupported tags, availability/price anomalies, and overall consistency. If evidence is insufficient, report missing information rather than a fact. Score: 90-100 excellent, 75-89 good, 60-74 needs attention, below 60 significant work. Prioritize high-impact issues and group repeated patterns. Arabic-first recommendations plus English equivalents.\n\nCategories (${categories.length}): ${categories.map((c) => `${c.nameAr} / ${c.nameEn}`).join(" | ")}\nProducts (${products.length}):\n${catalog}`;
}

export const runMenuQa = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ ok: true; data: MenuQaResult } | { ok: false; code: string; error: string }> => {
    try {
      const sql = await getSql();
      const member = await getMember(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد حساب مطعم نشط" };
      if (!canWriteMenu(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية مراجعة القائمة" };
      const [categoryRows, productRows] = await Promise.all([
        sql<{ id: string; name_ar: string; name_en: string }>`select id, name_ar, name_en from categories where tenant_id = ${member.tenant_id} and is_active = true order by sort_order, created_at limit 100`,
        sql<{ name_ar: string; name_en: string; description_ar: string; description_en: string; category_id: string | null; price: number; allergens: string; tags: string[] | null; is_available: boolean }>`select name_ar, name_en, description_ar, description_en, category_id, price, allergens, tags, is_available from products where tenant_id = ${member.tenant_id} order by sort_order, created_at limit 500`,
      ]);
      const categories = categoryRows.map((c) => ({ id: c.id, nameAr: c.name_ar, nameEn: c.name_en }));
      const products = productRows.map((p) => ({ nameAr: p.name_ar, nameEn: p.name_en, descriptionAr: p.description_ar, descriptionEn: p.description_en, categoryId: p.category_id, price: Number(p.price), allergens: p.allergens ?? "", tags: Array.isArray(p.tags) ? p.tags : [], isAvailable: Boolean(p.is_available) }));
      if (!products.length) return { ok: true, data: { score: 0, summaryAr: "لا توجد أصناف محفوظة بعد لمراجعتها.", summaryEn: "There are no saved products to audit yet.", issues: [], analyzedProducts: 0 } };
      const result = await generateStructuredAi({
        sql,
        tenantId: member.tenant_id,
        userId: context.userId,
        operation: "menu.qa",
        prompt: buildMenuQaPrompt(categories, products),
        responseFormat: menuQaSchema,
        responseSchema: menuQaRuntimeSchema,
        maxTokens: 1_400,
        temperature: 0.2,
        systemPrompt: "You are a careful restaurant menu QA assistant. Use only supplied saved menu data. Never invent facts, infer ingredients, or treat the result as food-safety or legal certification. Return only the requested structured format.",
      });
      if (!result.ok) return result;
      const p = result.data;
      const issues: MenuQaIssue[] = p.issues.map((i: any) => ({
        key: compact(i.key, 80),
        severity: i.severity,
        titleAr: compact(i.titleAr, 160),
        titleEn: compact(i.titleEn, 160),
        detailsAr: compact(i.detailsAr, 500),
        detailsEn: compact(i.detailsEn, 500),
        productNameAr: compact(i.productNameAr, 120),
        recommendationAr: compact(i.recommendationAr, 300),
        recommendationEn: compact(i.recommendationEn, 300),
      }));
      return { ok: true, data: { score: p.score, summaryAr: compact(p.summaryAr, 500), summaryEn: compact(p.summaryEn, 500), issues, analyzedProducts: products.length } };
    } catch (err) {
      console.error("runMenuQa failed", err);
      return { ok: false, code: "ai_unavailable", error: "تعذر تشغيل مراجعة القائمة" };
    }
  });
