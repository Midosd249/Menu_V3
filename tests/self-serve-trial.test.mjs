import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const migration = read("migrations/20260927070000_self_serve_trial.sql");
const subscriptions = read("src/lib/menu/subscriptions.ts");
const commercial = read("src/lib/menu/commercial.ts");
const studioShell = read("src/components/studio-shell.tsx");
const billingWhatsApp = read("src/lib/menu/billing-whatsapp.ts");
const whatsappShare = read("src/lib/menu/ai-whatsapp.ts");
const platformSubscriptions = read("src/lib/menu/platform-subscriptions.ts");

test("new tenant provisioning grants Pro 14-day trial at the database boundary", () => {
  assert.match(migration, /INSERT INTO menu_v3\.tenant_subscriptions/);
  assert.match(migration, /p\.code = 'pro'/);
  assert.match(migration, /'trialing'/);
  assert.match(migration, /now\(\) \+ interval '14 days'/);
  assert.doesNotMatch(migration, /p\.code = 'free'/);
});

test("paid-plan trial trigger remains UPDATE-only and cannot double-trigger on initial insert", () => {
  assert.match(migration, /CREATE TRIGGER trg_ph06_paid_plan_trial/);
  assert.match(migration, /BEFORE UPDATE OF plan_id ON menu_v3\.tenant_subscriptions/);
  assert.doesNotMatch(migration, /BEFORE INSERT.*trg_ph06_paid_plan_trial/s);
});

test("expired trial lazy enforcement reverts only untouched trialing subscriptions", () => {
  assert.match(subscriptions, /status = 'trialing'/);
  assert.match(subscriptions, /trial_ends_at <= now\(\)/);
  assert.match(subscriptions, /set plan_id =/);
  assert.match(subscriptions, /status = 'active'/);
  assert.match(subscriptions, /trial_ends_at = NULL/);
  assert.match(subscriptions, /action in \('trial_extended', 'trial_ended', 'plan_changed'\)/);
  assert.match(subscriptions, /created_at/);
});

test("subscription reads expose whether this request performed an automatic expiry reversion", () => {
  assert.match(subscriptions, /trialExpired/);
  assert.match(commercial, /trialExpired/);
});

test("Studio trial banner shows remaining days and reversion contact CTA", () => {
  assert.match(studioShell, /trialExpired/);
  assert.match(studioShell, /trialing/);
  assert.match(studioShell, /trialEndsAt/);
  assert.match(studioShell, /buildWhatsAppShareUrl/);
  assert.match(studioShell, /Continue on a paid plan|الاستمرار على خطة مدفوعة/);
});

test("billing WhatsApp click-to-chat pattern is reused rather than introducing a new recipient service", () => {
  assert.match(whatsappShare, /buildWhatsAppShareUrl/);
  assert.match(billingWhatsApp, /https:\/\/wa\.me\/\?text=/);
});

test("Platform Admin trial controls remain unchanged and still reject Free trials", () => {
  assert.match(platformSubscriptions, /before\.planCode === "free"/);
  assert.match(platformSubscriptions, /action: data\.action === "extend" \? "trial_extended" : "trial_ended"/);
  assert.match(platformSubscriptions, /update tenant_subscriptions set status = 'trialing', trial_ends_at/);
});
