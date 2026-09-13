import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const migration = fs.readFileSync("migrations/20260913030000_r9_guest_relationships.sql", "utf8");
const domain = fs.readFileSync("src/lib/menu/guest-relationships.ts", "utf8");
const page = fs.readFileSync("src/routes/studio/guests.tsx", "utf8");

test("R9 relationship data stays isolated and owner-controlled", () => {
  assert.match(migration, /set search_path to menu_v3, public/i);
  assert.match(migration, /alter table guest_loyalty_accounts enable row level security/i);
  assert.match(migration, /alter table guest_feedback enable row level security/i);
  assert.match(domain, /authMiddleware/);
  assert.match(domain, /getMembership/);
  assert.match(domain, /canAccessBranch/);
  assert.match(domain, /\[\"owner\", \"admin\"\]/);
  assert.match(page, /R9/);
  assert.match(page, /Guest CRM/);
  assert.match(page, /Loyalty/);
  assert.match(page, /Campaigns/);
  assert.match(page, /Feedback/);
  assert.match(page, /Retention/);
});
