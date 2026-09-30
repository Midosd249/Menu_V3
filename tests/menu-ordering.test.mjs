import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { indexOrder, moveByDirection } from "../src/lib/menu/reorder.ts";
import { orderPublicMenuContent } from "../src/lib/menu/public-order.ts";
import { calculateOffer, isOfferCurrentlyActive } from "../src/lib/menu/offers.ts";

test("branch menu ordering moves categories and products without changing unrelated rows", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.deepEqual(moveByDirection(items, "b", "up").map((item) => item.id), ["b", "a", "c"]);
  assert.deepEqual(moveByDirection(items, "b", "down").map((item) => item.id), ["a", "c", "b"]);
  assert.deepEqual(moveByDirection(items, "a", "up").map((item) => item.id), ["a", "b", "c"]);
  assert.deepEqual(indexOrder(items), [{ id: "a", sortOrder: 10 }, { id: "b", sortOrder: 20 }, { id: "c", sortOrder: 30 }]);
});

test("branch menu ordering is persisted and isolated by tenant and branch", async () => {
  const migration = await readFile("migrations/20260930010000_menu_branch_ordering.sql", "utf8");
  const owner = await readFile("src/lib/menu/owner.ts", "utf8");
  assert.match(migration, /primary key \(branch_id, category_id\)/);
  assert.match(migration, /primary key \(branch_id, product_id\)/);
  assert.match(migration, /menu order branch tenant mismatch/);
  assert.match(migration, /menu order resource tenant mismatch/);
  assert.match(owner, /branch_category_order/);
  assert.match(owner, /branch_product_order/);
  assert.match(owner, /branch_id = \$\{data\.branchId\}/);
  assert.match(owner, /tenant_id = \$\{member\.tenant_id\}/);
  assert.match(owner, /member_branch_access/);
});

test("public menu renders saved branch ordering instead of tenant creation order", async () => {
  const publicMenu = await readFile("src/lib/menu/public.ts", "utf8");
  assert.match(publicMenu, /branch_category_order/);
  assert.match(publicMenu, /branch_product_order/);
  assert.match(publicMenu, /coalesce\(bco\.sort_order, c\.sort_order\)/);
  assert.match(publicMenu, /coalesce\(bpo\.sort_order, p\.sort_order\)/);
  assert.match(publicMenu, /bco\.branch_id = b\.id/);
  assert.match(publicMenu, /bpo\.branch_id = b\.id/);
});

test("Studio exposes accessible up/down ordering controls and branch context", async () => {
  const page = await readFile("src/components/studio-menu-workspace-page.tsx", "utf8");
  const workspace = await readFile("src/components/studio-menu-workspace.tsx", "utf8");
  assert.match(page, /getMenuOrdering/);
  assert.match(page, /reorderMenu/);
  assert.match(page, /setBranchId/);
  assert.match(workspace, /ChevronUp/);
  assert.match(workspace, /ChevronDown/);
  assert.match(workspace, /aria-label=.*Move/);
});

test("Taste does not contain a hard-coded Chef's Choice badge", async () => {
  const source = await readFile("src/components/templates/taste.tsx", "utf8");
  assert.doesNotMatch(source, /Chef['’]s Choice/);
  assert.doesNotMatch(source, /اختيار الشيف/);
  assert.match(source, /product\.dietaryLabels/);
});


test("public route renders Studio-saved category and product order", async () => {
  const categories = [
    { id: "cat-b", tenantId: "t", sortOrder: 20, nameAr: "B", nameEn: "B", isActive: true },
    { id: "cat-a", tenantId: "t", sortOrder: 10, nameAr: "A", nameEn: "A", isActive: true },
  ];
  const products = [
    { id: "p2", tenantId: "t", categoryId: "cat-b", sortOrder: 10, nameAr: "2", nameEn: "2", descriptionAr: "", descriptionEn: "", price: 1, currency: "SAR", imageUrl: "", calories: null, isAvailable: true, isFeatured: false, allergens: "", tags: [], dietaryLabels: [] },
    { id: "p1", tenantId: "t", categoryId: "cat-a", sortOrder: 10, nameAr: "1", nameEn: "1", descriptionAr: "", descriptionEn: "", price: 1, currency: "SAR", imageUrl: "", calories: null, isAvailable: true, isFeatured: false, allergens: "", tags: [], dietaryLabels: [] },
  ];
  const ordered = orderPublicMenuContent(categories, products);
  assert.deepEqual(ordered.categories.map((item) => item.id), ["cat-a", "cat-b"]);
  assert.deepEqual(ordered.products.map((item) => item.id), ["p1", "p2"]);
  const route = await readFile("src/routes/m.$slug.tsx", "utf8");
  const branch = await readFile("src/routes/m.$slug.$branch.tsx", "utf8");
  assert.match(route, /getPublicMenu/);
  assert.match(branch, /getPublicMenu/);
  assert.match(route, /initialMenu=\{menuData\?\.menu\}/);
  assert.match(branch, /initialMenu=\{menuData\?\.menu\}/);
  assert.match(route, /staleTime: 0/);
});

test("item-internal ordering is tenant-scoped and public queries use saved sort order", async () => {
  const schema = await readFile("migrations/0008_menu_product_options.sql", "utf8");
  const options = await readFile("src/lib/menu/options.ts", "utf8");
  const publicMenu = await readFile("src/lib/menu/public.ts", "utf8");
  assert.match(schema, /product_variants[\s\S]*sort_order integer/);
  assert.match(schema, /modifier_options[\s\S]*sort_order integer/);
  assert.match(schema, /product_modifier_groups[\s\S]*sort_order integer/);
  assert.match(options, /reorderProductOption/);
  assert.match(publicMenu, /order by product_id, sort_order, created_at/);
  assert.match(publicMenu, /order by p\.product_id, p\.sort_order, g\.sort_order, g\.created_at/);
  assert.match(publicMenu, /order by p\.product_id, o\.group_id, o\.sort_order, o\.created_at/);
  const publicView = await readFile("src/components/public-menu.tsx", "utf8");
  assert.match(publicView, /const publicPricing =/);
  assert.match(publicView, /data-public-offer/);
  assert.match(publicView, /Buy 1 Get 1 Free/);
  assert.match(publicView, /offer=\{menu\.productOffers\?\.\[selected\.id\]\}/);
});

test("offers calculate server-side and preserve historical line snapshots", async () => {
  const offer = { id: "o", tenantId: "t", productId: "p", offerType: "percentage", value: 20, labelAr: "", labelEn: "", startsAt: null, endsAt: null, isActive: true };
  assert.equal(isOfferCurrentlyActive(offer, new Date("2026-09-30T00:00:00Z")), true);
  assert.equal(calculateOffer(100, 10, 2, offer).lineTotal, 180);
  assert.equal(calculateOffer(100, 10, 1, { ...offer, offerType: "fixed", value: 25 }).lineTotal, 85);
  assert.equal(calculateOffer(100, 10, 2, { ...offer, offerType: "sale_price", value: 70 }).lineTotal, 160);
  assert.equal(calculateOffer(100, 10, 2, { ...offer, offerType: "bogo", value: null }).lineTotal, 120);
  const order = await readFile("src/lib/menu/order-public.ts", "utf8");
  const migration = await readFile("migrations/20260930021000_order_offer_snapshot.sql", "utf8");
  assert.match(order, /originalUnitPrice/);
  assert.match(order, /discountAmount/);
  assert.match(order, /offerId/);
  assert.match(order, /product_offers/);
  assert.match(migration, /original_unit_price/);
  assert.match(migration, /discount_amount/);
  assert.match(migration, /offer_id/);
});

test("offers are tenant-isolated and outside product subscription limits", async () => {
  const migration = await readFile("migrations/20260930020000_product_offers.sql", "utf8");
  const offers = await readFile("src/lib/menu/offers-api.ts", "utf8");
  const plans = await readFile("migrations/20260903025817_subscription_plans.sql", "utf8");
  assert.match(migration, /tenant_id text not null/);
  assert.match(migration, /product_offer tenant mismatch/);
  assert.match(migration, /product_offers_one_active_idx/);
  const rlsMigration = await readFile("migrations/20260930023000_menu_ordering_offers_rls.sql", "utf8");
  assert.match(rlsMigration, /alter table menu_v3\.branch_category_order enable row level security/i);
  assert.match(rlsMigration, /alter table menu_v3\.branch_product_order enable row level security/i);
  assert.match(rlsMigration, /alter table menu_v3\.product_offers enable row level security/i);

  assert.match(offers, /tenant_id = \$\{member\.tenant_id\}/);
  assert.doesNotMatch(plans, /offer/i);
});


test("public route renders Studio-saved category and product order", async () => {
  const ordered = orderPublicMenuContent(
    [
      { id: "cat-b", tenantId: "t", sortOrder: 20, nameAr: "B", nameEn: "B", isActive: true },
      { id: "cat-a", tenantId: "t", sortOrder: 10, nameAr: "A", nameEn: "A", isActive: true },
    ],
    [
      { id: "p2", tenantId: "t", categoryId: "cat-b", sortOrder: 10, nameAr: "2", nameEn: "2", descriptionAr: "", descriptionEn: "", price: 1, currency: "SAR", imageUrl: "", calories: null, isAvailable: true, isFeatured: false, allergens: "", tags: [], dietaryLabels: [] },
      { id: "p1", tenantId: "t", categoryId: "cat-a", sortOrder: 10, nameAr: "1", nameEn: "1", descriptionAr: "", descriptionEn: "", price: 1, currency: "SAR", imageUrl: "", calories: null, isAvailable: true, isFeatured: false, allergens: "", tags: [], dietaryLabels: [] },
    ],
  );
  assert.deepEqual(ordered.categories.map((item) => item.id), ["cat-a", "cat-b"]);
  assert.deepEqual(ordered.products.map((item) => item.id), ["p1", "p2"]);
  const route = await readFile("src/routes/m.$slug.tsx", "utf8");
  const branch = await readFile("src/routes/m.$slug.$branch.tsx", "utf8");
  assert.match(route, /getPublicMenu/);
  assert.match(branch, /getPublicMenu/);
  assert.match(route, /initialMenu=\{menuData\?\.menu\}/);
  assert.match(branch, /initialMenu=\{menuData\?\.menu\}/);
  assert.match(route, /staleTime: 0/);
  assert.match(route, /Cache-Control/);
});

test("item-internal ordering is tenant-scoped and public queries use saved sort order", async () => {
  const schema = await readFile("migrations/0008_menu_product_options.sql", "utf8");
  const options = await readFile("src/lib/menu/options.ts", "utf8");
  const panel = await readFile("src/components/product-options-ordering-panel.tsx", "utf8");
  const publicMenu = await readFile("src/lib/menu/public.ts", "utf8");
  assert.match(schema, /product_variants[\s\S]*sort_order integer/);
  assert.match(schema, /modifier_options[\s\S]*sort_order integer/);
  assert.match(schema, /product_modifier_groups[\s\S]*sort_order integer/);
  assert.match(options, /reorderProductOption/);
  assert.match(panel, /Move up/);
  assert.match(panel, /Move down/);
  assert.match(publicMenu, /order by product_id, sort_order, created_at/);
  assert.match(publicMenu, /order by p\.product_id, p\.sort_order, g\.sort_order, g\.created_at/);
  assert.match(publicMenu, /order by p\.product_id, o\.group_id, o\.sort_order, o\.created_at/);
});

test("offers calculate server-side and preserve historical line snapshots", async () => {
  const offer = { id: "o", tenantId: "t", productId: "p", offerType: "percentage", value: 20, labelAr: "", labelEn: "", startsAt: null, endsAt: null, isActive: true };
  assert.equal(isOfferCurrentlyActive(offer, new Date("2026-09-30T00:00:00Z")), true);
  assert.equal(calculateOffer(100, 10, 2, offer).lineTotal, 180);
  assert.equal(calculateOffer(100, 10, 1, { ...offer, offerType: "fixed", value: 25 }).lineTotal, 85);
  assert.equal(calculateOffer(100, 10, 2, { ...offer, offerType: "sale_price", value: 70 }).lineTotal, 160);
  assert.equal(calculateOffer(100, 10, 2, { ...offer, offerType: "bogo", value: null }).lineTotal, 120);
  const order = await readFile("src/lib/menu/order-public.ts", "utf8");
  const migration = await readFile("migrations/20260930021000_order_offer_snapshot.sql", "utf8");
  const receipt = await readFile("src/lib/menu/order-public.ts", "utf8");
  assert.match(order, /originalUnitPrice/);
  assert.match(order, /discountAmount/);
  assert.match(order, /offerId/);
  assert.match(order, /product_offers/);
  assert.match(receipt, /original_unit_price/);
  assert.match(migration, /original_unit_price/);
  assert.match(migration, /discount_amount/);
  assert.match(migration, /offer_id/);
});

test("offer activation, expiry, tenant isolation, and product-limit boundaries are explicit", async () => {
  const migration = await readFile("migrations/20260930020000_product_offers.sql", "utf8");
  const trigger = await readFile("migrations/20260930022000_product_offer_revision_trigger.sql", "utf8");
  const offers = await readFile("src/lib/menu/offers-api.ts", "utf8");
  const panel = await readFile("src/components/product-offer-panel.tsx", "utf8");
  const plans = await readFile("migrations/20260903025817_subscription_plans.sql", "utf8");
  const base = { id: "o", tenantId: "t", productId: "p", offerType: "percentage", value: 10, labelAr: "", labelEn: "", isActive: true };
  assert.equal(isOfferCurrentlyActive({ ...base, startsAt: "2026-10-01T00:00:00Z", endsAt: null }, new Date("2026-09-30T00:00:00Z")), false);
  assert.equal(isOfferCurrentlyActive({ ...base, startsAt: null, endsAt: "2026-09-30T00:00:00Z" }, new Date("2026-09-30T00:00:00Z")), false);
  assert.match(migration, /product_offers_one_active_idx/);
  assert.match(migration, /product_offer tenant mismatch/);
  assert.match(trigger, /product_offers/);
  assert.match(offers, /tenant_id =/);
  assert.match(panel, /Asia\/Riyadh/);
  assert.doesNotMatch(plans, /offer/i);
});
