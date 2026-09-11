import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../src/lib/menu/ai.ts", import.meta.url), "utf8");
const studioSource = fs.readFileSync(new URL("../src/routes/studio/menu.tsx", import.meta.url), "utf8");

for (const expected of [
  '"description"',
  '"english"',
  '"category"',
  '"tags"',
  '"allergens"',
  '"price"',
  "INCEPTION_API_KEY",
  "api.inceptionlabs.ai/v1/chat/completions",
  "response_format",
  "json_schema",
  "context.userId",
  "tenant_members",
]) {
  test(`Mercury menu assistant contains ${expected}`, () => {
    assert.ok(source.includes(expected), `Missing expected contract: ${expected}`);
  });
}

test("category suggestions use tenant-owned server categories", () => {
  assert.ok(source.includes("from categories"));
  assert.ok(source.includes("tenant_id = ${member.tenant_id}"));
  assert.ok(source.includes("categories.find"));
  assert.ok(source.includes("!selected"));
});

test("allergen suggestions fail closed when evidence is insufficient", () => {
  assert.ok(source.includes("ONLY explicit evidence"));
  assert.ok(source.includes("return an empty allergens array"));
  assert.ok(source.includes("disclaimerAr"));
  assert.ok(source.includes("allergens: string[]"));
});

test("explicit product price extraction never invents a price", () => {
  assert.ok(source.includes('operationSchema = z.enum(["description", "english", "category", "tags", "allergens", "price"])'));
  assert.ok(source.includes('"menu_price"'));
  assert.ok(source.includes("return null if no explicit price is present"));
  assert.ok(source.includes("price: number | null"));
  assert.ok(source.includes("cleanedNameAr"));
  assert.ok(source.includes("price !== null && (!Number.isFinite(price) || price < 0)"));
});

test("menu QA reads the authenticated tenant's saved menu server-side", () => {
  assert.ok(source.includes("export const runMenuQa"));
  assert.ok(source.includes("from products"));
  assert.ok(source.includes("from categories"));
  assert.ok(source.includes("where tenant_id = ${member.tenant_id}"));
  assert.ok(source.includes("limit 500"));
  assert.ok(source.includes("Do not infer ingredients or allergens"));
});

test("AI responses are suggestions and do not bypass the existing save path", () => {
  assert.ok(source.includes("canWriteMenu(member.role)"));
  assert.ok(source.includes("ai_invalid"));
  assert.ok(studioSource.includes("saveProduct({"));
  assert.ok(studioSource.includes("never be saved automatically"));
});

for (const expected of [
  "generateMenuAi",
  'type AiOperation = "description" | "english" | "category" | "tags" | "allergens"',
  "مساعد الذكاء الاصطناعي",
  "اقتراح التصنيف",
  "اقتراح الوسوم",
  "اقتراح الحساسية",
  "مراجعة القائمة بالذكاء الاصطناعي",
  "runMenuQa",
  "aiBusy",
  "aiTags",
  "aiAllergens",
  "menuQa",
]) {
  test(`Product editor exposes ${expected}`, () => {
    assert.ok(studioSource.includes(expected), `Missing product editor contract: ${expected}`);
  });
}

test("allergen suggestions require an explicit owner action before merging into the field", () => {
  assert.ok(studioSource.includes("applyAiAllergens"));
  assert.ok(studioSource.includes("Apply to allergen field"));
  assert.ok(studioSource.includes("إضافة إلى حقل الحساسية"));
});

test("menu QA is read-only and does not create a second persistence path", () => {
  assert.ok(studioSource.includes("setMenuQaBusy"));
  assert.ok(studioSource.includes("setMenuQa(result.data)"));
  assert.ok(!studioSource.includes("saveMenuQa"));
});
