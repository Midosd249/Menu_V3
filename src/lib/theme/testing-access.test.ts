import assert from "node:assert/strict";
import test from "node:test";
import { canUseThemeWithTestingOverride, isThemeTestingOverrideEnabled } from "./testing-access.ts";

const future = "2099-01-01T00:00:00.000Z";
const past = "2000-01-01T00:00:00.000Z";

const baseEnv = {
  MENU_THEME_TESTING_OVERRIDE: "true",
  MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT: future,
};

test("theme testing override is off by default and requires a future expiry", () => {
  assert.equal(isThemeTestingOverrideEnabled({}, Date.parse("2026-09-05T00:00:00Z")), false);
  assert.equal(isThemeTestingOverrideEnabled({ MENU_THEME_TESTING_OVERRIDE: "true" }, Date.parse("2026-09-05T00:00:00Z")), false);
  assert.equal(isThemeTestingOverrideEnabled({ ...baseEnv, MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT: past }, Date.parse("2026-09-05T00:00:00Z")), false);
});

test("free theme catalog remains usable with or without the temporary override", () => {
  const now = Date.parse("2026-09-05T00:00:00Z");
  assert.equal(canUseThemeWithTestingOverride("editorial", "free", baseEnv, now), true);
  assert.equal(canUseThemeWithTestingOverride("editorial", "free", {}, now), true);
  assert.equal(canUseThemeWithTestingOverride("essential", "free", {}, now), true);
  assert.equal(canUseThemeWithTestingOverride("gallery", null, {}, now), true);
});

test("expired override does not change the free-theme result", () => {
  const now = Date.parse("2026-09-05T00:00:00Z");
  assert.equal(canUseThemeWithTestingOverride("gallery", "free", { ...baseEnv, MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT: past }, now), true);
});
