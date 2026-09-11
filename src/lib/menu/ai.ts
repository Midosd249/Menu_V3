import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Role } from "./types";

const operationSchema = z.enum(["description", "english", "category", "tags"]);

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

type AiResult =
  | { operation: "description"; descriptionAr: string }
  | { operation: "english"; nameEn: string; descriptionEn: string }
  | { operation: "category"; categoryId: string | null; categoryNameAr: string; categoryNameEn: string }
  | { operation: "tags"; tags: string[] };

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
  return `Suggest up to 8 concise menu tags for this product. Use tags that are directly supported by the product name or existing descriptions. Do not invent ingredients, dietary claims, allergens, cooking methods, or certifications. Avoid duplicates. ${common}`;
}

export const generateMenuAi = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(inputSchema)
  .handler(async ({ context, data }): Promise<{ ok: true; data: AiResult } | { ok: false; code: string; error: string }> => {
    const apiKey = process.env.INCEPTION_API_KEY?.trim();
    if (!apiKey) return { ok: false, code: "ai_not_configured", error: "مساعد الذكاء الاصطناعي غير مهيأ حالياً" };

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
            { role: "user", content: buildPrompt(data, serverCategories) },
          ],
          temperature: 0.3,
          max_tokens: 700,
          reasoning_effort: "low",
          response_format: { type: "json_schema", json_schema: schemaFor(data.operation) },
        }),
        signal: AbortSignal.timeout(20_000),
      });

      if (!response.ok) {
        console.error("generateMenuAi upstream error", response.status);
        return { ok: false, code: "ai_unavailable", error: "تعذر الوصول إلى مساعد الذكاء الاصطناعي" };
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) return { ok: false, code: "ai_invalid", error: "تعذر قراءة نتيجة مساعد الذكاء الاصطناعي" };

      const parsed = JSON.parse(content) as Record<string, unknown>;
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

      return { ok: false, code: "ai_invalid", error: "نتيجة مساعد الذكاء الاصطناعي غير صالحة" };
    } catch (err) {
      console.error("generateMenuAi failed", err);
      return { ok: false, code: "ai_unavailable", error: "تعذر تشغيل مساعد الذكاء الاصطناعي" };
    }
  });
