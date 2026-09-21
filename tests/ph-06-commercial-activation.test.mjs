import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const migration = read("migrations/20260917170000_ph06_commercial_activation.sql");
const catalog = read("src/lib/menu/commercial-catalog.ts");
const pricing = read("src/routes/pricing.tsx");
const paymentBoundary = read("src/lib/menu/payment-boundary.ts");
const billing = read("src/lib/menu/billing.ts");
const billingWhatsApp = read("src/lib/menu/billing-whatsapp.ts");

test("PH-06 canonical monthly and annual prices are present", () => {
  assert.match(migration, /'starter'.*490/s);
  assert.match(migration, /'pro'.*1490/s);
  assert.match(migration, /WHEN 'starter' THEN 49/);
  assert.match(migration, /WHEN 'pro' THEN 149/);
  assert.match(catalog, /monthlyPriceSar: 49/);
  assert.match(catalog, /annualPriceSar: 490/);
  assert.match(catalog, /monthlyPriceSar: 149/);
  assert.match(catalog, /annualPriceSar: 1490/);
});

test("PH-06 Free has no trial and Pro product entitlement is unlimited", () => {
  assert.match(migration, /WHERE p\.code = 'free' AND p\.is_active = true/);
  assert.match(migration, /INSERT INTO menu_v3\.tenant_subscriptions.*'active', NULL, 'monthly'/s);
  assert.match(migration, /sp\.code = 'pro'/);
  assert.match(migration, /TG_TABLE_NAME = 'products' AND EXISTS/);
  assert.match(catalog, /code: "pro".*Number\.MAX_SAFE_INTEGER/);
});

test("PH-06 paid selection starts a 14-day trial and Free is normalized to active", () => {
  assert.match(migration, /old_code = 'free' AND new_code <> 'free'/);
  assert.match(migration, /NEW\.status := 'trialing'/);
  assert.match(migration, /NEW\.trial_ends_at := now\(\) \+ interval '14 days'/);
  assert.match(migration, /new_code = 'free'/);
  assert.match(migration, /NEW\.status := 'active'/);
});

test("PH-06 pricing UX exposes annual billing without a fake checkout", () => {
  assert.match(pricing, /Annual — 2 months free/);
  assert.match(pricing, /getCommercialPrice/);
  assert.match(pricing, /Online payment is not enabled yet/);
});

test("PH-06 payment boundary derives amount from the catalog and has no provider integration", () => {
  assert.match(paymentBoundary, /getCommercialPrice/);
  assert.match(paymentBoundary, /Client-supplied amount/);
  assert.doesNotMatch(paymentBoundary, /stripe|moyasar|tap|paytabs|hyperpay/i);
});

test("PH-06 invoices snapshot billing interval and preserve old invoice amounts", () => {
  assert.match(migration, /ADD COLUMN IF NOT EXISTS billing_interval TEXT NOT NULL DEFAULT 'monthly'/);
  assert.match(migration, /Existing invoices are historical monthly snapshots/);
  assert.match(billing, /const billingInterval: BillingInterval/);
  assert.match(billing, /billing_interval/);
  assert.match(billingWhatsApp, /Billing: \$\{interval\}/);
});
