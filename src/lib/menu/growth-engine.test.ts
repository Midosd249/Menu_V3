import assert from "node:assert/strict";
import test from "node:test";
import { buildMenuGrowthEngine } from "./growth-engine.ts";
import type { StudioSnapshot } from "./types.ts";

const snapshot: StudioSnapshot = {
  tenant: {
    id: "t1", ownerUserId: "u1", slug: "demo", nameAr: "مطعم", nameEn: "Restaurant", taglineAr: "", taglineEn: "", logoUrl: "", coverUrl: "",
    instagramUrl: "", whatsapp: "+966500000000", whatsappTemplate: "", primaryColor: "", accentColor: "", themeKey: "essential", currency: "SAR", city: "Riyadh", country: "SA",
    isPublished: true, isActive: true, createdAt: "", updatedAt: "",
  },
  role: "owner",
  branches: [{ id: "b1", tenantId: "t1", slug: "main", nameAr: "الرئيسي", nameEn: "Main", addressAr: "", addressEn: "", mapsUrl: "", phone: "", isActive: true }],
  categories: [{ id: "c1", tenantId: "t1", sortOrder: 0, nameAr: "أطباق", nameEn: "Dishes", isActive: true }],
  products: [{ id: "p1", tenantId: "t1", categoryId: "c1", sortOrder: 0, nameAr: "طبق", nameEn: "Dish", descriptionAr: "وصف", descriptionEn: "Description", price: 20, currency: "SAR", imageUrl: "", calories: null, isAvailable: true, isFeatured: true, allergens: "", tags: [], dietaryLabels: [] }],
  members: [],
  health: { score: 90, dimensions: [], checks: [], attention: [] },
};

test("growth engine remains deterministic and evidence-bound", () => {
  const engine = buildMenuGrowthEngine(snapshot, { rangeDays: 7, visits: 20, uniqueSessions: 20, productViews: 30, qrScans: 4, whatsappClicks: 2, langAr: 18, langEn: 2, series: [], topProducts: [{ id: "p1", nameAr: "طبق", nameEn: "Dish", count: 10 }], byCategory: [], byBranch: [] });
  assert.equal(engine.loop.currentStage, "measure");
  assert.ok(engine.recommendations.some((item) => item.key === "priority-images"));
  assert.equal(engine.experiments.find((item) => item.key === "whatsapp-cta-v1")?.status, "active");
  assert.equal(engine.experiments.filter((item) => item.status === "ready").length, 0);
});

test("growth engine refuses to treat thin traffic as strong evidence", () => {
  const engine = buildMenuGrowthEngine(snapshot, { rangeDays: 7, visits: 2, uniqueSessions: 2, productViews: 1, qrScans: 0, whatsappClicks: 0, langAr: 2, langEn: 0, series: [], topProducts: [], byCategory: [], byBranch: [] });
  assert.equal(engine.loop.currentStage, "observe");
  assert.equal(engine.loop.evidence, "insufficient");
  assert.ok(engine.recommendations.some((item) => item.key === "collect-evidence"));
  assert.equal(engine.experiments.find((item) => item.key === "featured-item-order")?.status, "insufficient-evidence");
});
