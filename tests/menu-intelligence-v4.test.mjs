import assert from "node:assert/strict";
import test from "node:test";

const source = await import("../src/lib/menu/saudi-readiness.ts");

const baseProduct = (overrides = {}) => ({
  id: "p1", tenantId: "t1", categoryId: "c1", sortOrder: 1,
  nameAr: "كبسة دجاج", nameEn: "Chicken Kabsa",
  descriptionAr: "أرز بسمتي مع الدجاج", descriptionEn: "Basmati rice with chicken",
  price: 35, currency: "SAR", imageUrl: "/kabsa.jpg", calories: 650,
  isAvailable: true, isFeatured: false, allergens: "milk", tags: [], dietaryLabels: [],
  ...overrides,
});

const snapshot = (products) => ({
  tenant: { id: "t1" }, role: "owner", branches: [], categories: [], products,
  members: [], health: { score: 100, checks: [], attention: [] },
});

test("returns full readiness for supported fields when product data is complete", () => {
  const result = source.buildSaudiMenuReadiness(snapshot([baseProduct()]));
  assert.equal(result.score, 100);
  assert.equal(result.counts.caloriesReady, 1);
  assert.equal(result.counts.allergensDeclared, 1);
  assert.equal(result.counts.arabicReady, 1);
  assert.equal(result.counts.englishReady, 1);
  assert.equal(result.status, "ready");
  assert.ok(result.issues.some((issue) => issue.key === "nutrition-capability" && issue.status === "not_supported"));
});

test("flags missing supported menu information without inventing compliance", () => {
  const result = source.buildSaudiMenuReadiness(snapshot([baseProduct({ calories: null, allergens: "", descriptionEn: "" })]));
  assert.equal(result.score, 25);
  assert.equal(result.status, "needs_attention");
  assert.ok(result.issues.some((issue) => issue.key === "calories-coverage"));
  assert.ok(result.issues.some((issue) => issue.key === "allergen-coverage"));
  assert.ok(result.issues.some((issue) => issue.key === "english-content"));
  assert.ok(result.issues.every((issue) => !/compliant|certified|guaranteed/i.test(`${issue.titleEn} ${issue.detailEn}`)));
});

test("does not claim support for fields that are absent from the Product contract", () => {
  const result = source.buildSaudiMenuReadiness(snapshot([baseProduct()]));
  const issue = result.issues.find((item) => item.key === "nutrition-capability");
  assert.equal(issue?.status, "not_supported");
  assert.match(issue?.detailEn ?? "", /caffeine|salt|physical-activity/i);
});
