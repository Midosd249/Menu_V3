import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Role } from "./types";

const operationSchema = z.enum(["description", "english", "category", "tags", "allergens"]);

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
  | { operation: "allergens"; allergens: string[]; disclaimerAr: string; disclaimerEn: string };

function canWriteMenu(role: Role) {
  return role === "owner" || role === "admin" || role === "editor";
}

async function getMember(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<Member>`
    select tenant_id, role from tenant_members
    where user_id = ${userId} and is_active = true
    order by created_at
    limit 1
  `;
  return rows[0] ?? null;
}

function schemaFor(operation: z.infer<typeof operationSchema>) {
  if (operation === "description") {
    return {
      name: "menu_description",
      strict: true,
      schema: {
        type: "object",
        properties: { descriptionAr: { type: "string", minLength: 1, maxLength: 600 } },
        required: ["descriptionAr"],
        additionalProperties: false,
      },
    };
  }
  if (operation === "english") {
    return {
      name: "menu_english",
      strict: true,
      schema: {
        type: "object",
        properties: {
          nameEn: { type: "string", minLength: 1, maxLength: 120 },
          descriptionEn: { type: "string", minLength: 1, maxLength: 600 },
        },
        required: ["nameEn", "descriptionEn"],
        additionalProperties: false,
      },
    };
  }
  if (operation === "category") {
    return {
      name: "menu_category",
      strict: true,
      schema: {
        type: "object",
        properties: {
          categoryId: { type: ["string", "null"] },
          categoryNameAr: { type: "string", maxLength: 80 },
          categoryNameEn: { type: "string", maxLength: 80 },
        },
        required: ["categoryId", "categoryNameAr", "categoryNameEn"],
        additionalProperties: false,
      },
    };
  }
  if (operation === "tags") {
    return {
      name: "menu_tags",
      strict: true,
      schema: {
        type: "object",
        properties: { tags: { type: "array", items: { type: "string", minLength: 1, maxLength: 40 }, maxItems: 8 } },
        required: ["tags"],
        additionalProperties: false,
      },
    };
  }
  return {
    name: "menu_allergens",
    strict: true,
    schema: {
      type: "object",
      properties: {
        allergens: { type: "array", items: { type: "string", minLength: 1, maxLength: 40 }, maxItems: 12 },
        disclaimerAr: { type: "string", minLength: 1, maxLength: 240 },
        disclaimerEn: { type: "string", minLength: 1, maxLength: 240 },
      },
      required: ["allergens", "disclaimerAr", "disclaimerEn"],
      additionalProperties: false,
    },
  };
}

function buildPrompt(data: z.infer<typeof inputSchema>, categoryOptions: CategoryOption[]) {
  const categories = categoryOptions
    .map((category) => `${category.id} | ${category.nameAr} | ${category.nameEn}`)
    .join("\n");

  const common = `\nProduct Arabic name: ${data.nameAr}\nExisting English name: ${data.nameEn ?? ""}\nArabic description: ${data.descriptionAr ?? ""}\nEnglish description: ${data.descriptionEn ?? ""}\n`;

  if (data.operation === "description") {
    return `Write a concise, appetizing Arabic menu description for the product below. Use natural Saudi Arabic menu language in Modern Standard Arabic, not slang. Do not invent ingredients, allergens, health claims, origin, cooking method, portion size, or prices. Return only the requested structured field. ${common}`;
  }
  if (data.operation === "english") {
    return `Create a faithful English menu name and description for the product below. Preserve the meaning of the Arabic content. Do not invent ingredients, allergens, health claims, origin, cooking method, portion size, or prices. Use polished restaurant English. Return only the requested structured fields. ${common}`;
  }
  if (data.operation === "category") {
    return `Choose the best matching category for this product from the supplied existing categories only. Never invent a category. If none is a reasonable match, return null. ${common}\nExisting categories:\n${categories}`;
  }
  if (data.operation === "tags") {
    return `Suggest up to 8 concise menu tags for this product. Use tags that are directly supported by the product name or existing descriptions. Do not invent ingredients, dietary claims, allergens, cooking methods, or certifications. Avoid duplicates. ${common}`;
  }
  return `Suggest potential food allergens for this product using ONLY explicit evidence in the product name and existing Arabic/English descriptions. Do not infer hidden ingredients from cuisine type, common recipes, restaurant knowledge, or assumptions. Do not treat absence of an allergen mention as proof that it is absent. If there is not enough explicit evidence, return an empty allergens array. Use concise common allergen names in Arabic. The result is a safety-oriented suggestion for owner review, not a guarantee of allergen absence or presence. ${common}`;
}

async function callMercury(prompt: string, responseFormat: ReturnType<typeof schemaFor>) {
  const apiKey = process.env.INCEPTION_API_KEY?.trim();
  if (!apiKey) return { ok: false as const, code: "ai_not_configured", error: "مساعد الذكاء الاصطناعي غير مهيأ حالياً" };

  const response = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.INCEPTION_MODEL?.trim() || "mercury-2.5",
      messages: [
        {
          role: "system",
          content:
            "You are a careful restaurant menu content assistant. Never invent facts. The restaurant owner remains the final approver. Respond only in the requested structured format.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 700,
      reasoning_effort: "low",
      response_format: { type: "json_schema", json_schema: responseFormat },
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    console.error("generateMenuAi upstream error", response.status);
    return { ok: false as const, code: "ai_unavailable", error: "تعذر الوصول إلى مساعد الذكاء الاصطناعي" };
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return { ok: false as const, code: "ai_invalid", error: "تعذر قراءة نتيجة مساعد الذكاء الاصطناعي" };

  return { ok: true as const, parsed: JSON.parse(content) as Record<string, unknown> };
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

      const categoryRows = await sql<{ id: string; name_ar: string; name_en: string }>`
        select id, name_ar, name_en
        from categories
        where tenant_id = ${member.tenant_id} and is_active = true
        order by sort_order, created_at
        limit 100
      `;
      const serverCategories: CategoryOption[] = categoryRows.map((category) => ({
        id: category.id,
        nameAr: category.name_ar,
        nameEn: category.name_en,
      }));

      const result = await callMercury(buildPrompt(data, serverCategories), schemaFor(data.operation));
      if (!result.ok) return result;
      const parsed = result.parsed;

      if (data.operation === "description" && typeof parsed.descriptionAr === "string") {
        return { ok: true, data: { operation: "description", descriptionAr: parsed.descriptionAr.trim() } };
      }
      if (data.operation === "english" && typeof parsed.nameEn === "string" && typeof parsed.descriptionEn === "string") {
        return {
          ok: true,
          data: { operation: "english", nameEn: parsed.nameEn.trim(), descriptionEn: parsed.descriptionEn.trim() },
        };
      }
      if (
        data.operation === "category" &&
        (typeof parsed.categoryId === "string" || parsed.categoryId === null) &&
        typeof parsed.categoryNameAr === "string" &&
        typeof parsed.categoryNameEn === "string"
      ) {
        const selected = serverCategories.find((category) => category.id === parsed.categoryId);
        if (parsed.categoryId !== null && !selected) {
          return { ok: false, code: "ai_invalid", error: "أعاد مساعد الذكاء الاصطناعي تصنيفاً غير صالح" };
        }
        return {
          ok: true,
          data: {
            operation: "category",
            categoryId: parsed.categoryId,
            categoryNameAr: selected?.nameAr ?? "",
            categoryNameEn: selected?.nameEn ?? "",
          },
        };
      }
      if (data.operation === "tags" && Array.isArray(parsed.tags) && parsed.tags.every((tag) => typeof tag === "string")) {
        return { ok: true, data: { operation: "tags", tags: [...new Set(parsed.tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 8) } };
      }
      if (
        data.operation === "allergens" &&
        Array.isArray(parsed.allergens) &&
        parsed.allergens.every((allergen) => typeof allergen === "string") &&
        typeof parsed.disclaimerAr === "string" &&
        typeof parsed.disclaimerEn === "string"
      ) {
        return {
          ok: true,
          data: {
            operation: "allergens",
            allergens: [...new Set(parsed.allergens.map((allergen) => allergen.trim()).filter(Boolean))].slice(0, 12),
            disclaimerAr: parsed.disclaimerAr.trim(),
            disclaimerEn: parsed.disclaimerEn.trim(),
          },
        };
      }

      return { ok: false, code: "ai_invalid", error: "نتيجة مساعد الذكاء الاصطناعي غير صالحة" };
    } catch (err) {
      console.error("generateMenuAi failed", err);
      return { ok: false, code: "ai_unavailable", error: "تعذر تشغيل مساعد الذكاء الاصطناعي" };
    }
  });

const menuQaSchema = {
  name: "menu_quality_audit",
  strict: true,
  schema: {
    type: "object",
    properties: {
      score: { type: "integer", minimum: 0, maximum: 100 },
      summaryAr: { type: "string", minLength: 1, maxLength: 500 },
      summaryEn: { type: "string", minLength: 1, maxLength: 500 },
      issues: {
        type: "array",
        maxItems: 30,
        items: {
          type: "object",
          properties: {
            key: { type: "string", minLength: 1, maxLength: 80 },
            severity: { type: "string", enum: ["high", "medium", "low"] },
            titleAr: { type: "string", minLength: 1, maxLength: 160 },
            titleEn: { type: "string", minLength: 1, maxLength: 160 },
            detailsAr: { type: "string", minLength: 1, maxLength: 500 },
            detailsEn: { type: "string", minLength: 1, maxLength: 500 },
            productNameAr: { type: "string", maxLength: 120 },
            recommendationAr: { type: "string", minLength: 1, maxLength: 300 },
            recommendationEn: { type: "string", minLength: 1, maxLength: 300 },
          },
          required: ["key", "severity", "titleAr", "titleEn", "detailsAr", "detailsEn", "productNameAr", "recommendationAr", "recommendationEn"],
          additionalProperties: false,
        },
      },
    },
    required: ["score", "summaryAr", "summaryEn", "issues"],
    additionalProperties: false,
  },
} as const;

function compactQaText(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function buildMenuQaPrompt(
  categories: Array<{ id: string; nameAr: string; nameEn: string }>,
  products: Array<{
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    categoryId: string | null;
    price: number;
    allergens: string;
    tags: string[];
    isAvailable: boolean;
  }>,
) {
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const catalog = products
    .map((product, index) => {
      const category = product.categoryId ? categoryById.get(product.categoryId) : undefined;
      return [
        `#${index + 1}`,
        `AR=${compactQaText(product.nameAr, 100)}`,
        `EN=${compactQaText(product.nameEn, 100)}`,
        `CAT=${compactQaText(category?.nameAr, 70)}`,
        `DESC_AR=${compactQaText(product.descriptionAr, 240)}`,
        `DESC_EN=${compactQaText(product.descriptionEn, 240)}`,
        `PRICE=${product.price}`,
        `ALLERGENS=${compactQaText(product.allergens, 180)}`,
        `TAGS=${compactQaText(product.tags.join(", "), 160)}`,
        `AVAILABLE=${product.isAvailable ? "yes" : "no"}`,
      ].join(" | ");
    })
    .join("\n");

  const categoryList = categories.map((category) => `${category.nameAr} / ${category.nameEn}`).join(" | ");
  return `Perform a practical restaurant menu quality audit for the owner's review. Analyze every supplied product, not a sample. Do not invent facts. Do not infer ingredients or allergens. This is a content/data quality audit, not a food-safety certification.\n\nCheck for: missing Arabic/English names, missing or weak descriptions, Arabic/English meaning mismatches, duplicate or near-duplicate products, products with no category, category/content mismatch when clearly supported, inconsistent naming, suspiciously repetitive copy, missing allergen information where the existing product content explicitly indicates an ingredient but the allergen field is empty, and tags that appear unsupported. Also consider availability, price presence, and overall menu consistency. Do not mark an allergen as present unless the menu content explicitly supports it. If evidence is insufficient, describe it as missing information rather than a fact.\n\nScore meaning: 90-100 excellent, 75-89 good with minor cleanup, 60-74 needs attention, below 60 significant quality work. Prioritize high-impact issues and group repeated patterns when appropriate. Use Arabic-first concise recommendations and provide English equivalents.\n\nCategories (${categories.length}): ${categoryList}\nProducts (${products.length}):\n${catalog}`;
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
        sql<{ id: string; name_ar: string; name_en: string }>`
          select id, name_ar, name_en
          from categories
          where tenant_id = ${member.tenant_id} and is_active = true
          order by sort_order, created_at
          limit 100
        `,
        sql<{
          name_ar: string;
          name_en: string;
          description_ar: string;
          description_en: string;
          category_id: string | null;
          price: number;
          allergens: string;
          tags: string[] | null;
          is_available: boolean;
        }>`
          select name_ar, name_en, description_ar, description_en, category_id, price, allergens, tags, is_available
          from products
          where tenant_id = ${member.tenant_id}
          order by sort_order, created_at
          limit 500
        `,
      ]);

      const categories = categoryRows.map((category) => ({ id: category.id, nameAr: category.name_ar, nameEn: category.name_en }));
      const products = productRows.map((product) => ({
        nameAr: product.name_ar,
        nameEn: product.name_en,
        descriptionAr: product.description_ar,
        descriptionEn: product.description_en,
        categoryId: product.category_id,
        price: Number(product.price),
        allergens: product.allergens ?? "",
        tags: Array.isArray(product.tags) ? product.tags : [],
        isAvailable: Boolean(product.is_available),
      }));

      if (products.length === 0) {
        return {
          ok: true,
          data: {
            score: 0,
            summaryAr: "لا توجد أصناف محفوظة بعد لمراجعتها.",
            summaryEn: "There are no saved products to audit yet.",
            issues: [],
            analyzedProducts: 0,
          },
        };
      }

      const result = await callMercury(
        buildMenuQaPrompt(categories, products),
        menuQaSchema,
      );
      if (!result.ok) return result;
      const parsed = result.parsed;
      if (
        typeof parsed.score !== "number" ||
        typeof parsed.summaryAr !== "string" ||
        typeof parsed.summaryEn !== "string" ||
        !Array.isArray(parsed.issues)
      ) {
        return { ok: false, code: "ai_invalid", error: "نتيجة مراجعة القائمة غير صالحة" };
      }

      const issues: MenuQaIssue[] = [];
      for (const issue of parsed.issues) {
        if (!issue || typeof issue !== "object") continue;
        const candidate = issue as Record<string, unknown>;
        if (
          typeof candidate.key !== "string" ||
          !["high", "medium", "low"].includes(String(candidate.severity)) ||
          typeof candidate.titleAr !== "string" ||
          typeof candidate.titleEn !== "string" ||
          typeof candidate.detailsAr !== "string" ||
          typeof candidate.detailsEn !== "string" ||
          typeof candidate.productNameAr !== "string" ||
          typeof candidate.recommendationAr !== "string" ||
          typeof candidate.recommendationEn !== "string"
        ) continue;
        issues.push({
          key: compactQaText(candidate.key, 80),
          severity: candidate.severity as MenuQaIssue["severity"],
          titleAr: compactQaText(candidate.titleAr, 160),
          titleEn: compactQaText(candidate.titleEn, 160),
          detailsAr: compactQaText(candidate.detailsAr, 500),
          detailsEn: compactQaText(candidate.detailsEn, 500),
          productNameAr: compactQaText(candidate.productNameAr, 120),
          recommendationAr: compactQaText(candidate.recommendationAr, 300),
          recommendationEn: compactQaText(candidate.recommendationEn, 300),
        });
      }

      return {
        ok: true,
        data: {
          score: Math.max(0, Math.min(100, Math.round(parsed.score))),
          summaryAr: compactQaText(parsed.summaryAr, 500),
          summaryEn: compactQaText(parsed.summaryEn, 500),
          issues: issues.slice(0, 30),
          analyzedProducts: products.length,
        },
      };
    } catch (err) {
      console.error("runMenuQa failed", err);
      return { ok: false, code: "ai_unavailable", error: "تعذر تشغيل مراجعة القائمة" };
    }
  });
