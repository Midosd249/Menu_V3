import test from "node:test";
import assert from "node:assert/strict";
import { isPlatformAdminConfigured } from "./platform-admin.server.ts";

test("platform admin environment fallback matches normalized user IDs and emails", () => {
  const originalIds = process.env.PLATFORM_ADMIN_USER_IDS;
  const originalEmails = process.env.PLATFORM_ADMIN_EMAILS;
  process.env.PLATFORM_ADMIN_USER_IDS = " Admin-User-1,ADMIN-USER-2 ";
  process.env.PLATFORM_ADMIN_EMAILS = " Owner@Example.com ";

  try {
    assert.equal(isPlatformAdminConfigured("admin-user-1", null), true);
    assert.equal(isPlatformAdminConfigured("ADMIN-USER-2", "other@example.com"), true);
    assert.equal(isPlatformAdminConfigured("other-user", "OWNER@example.com"), true);
    assert.equal(isPlatformAdminConfigured("other-user", "other@example.com"), false);
  } finally {
    if (originalIds === undefined) delete process.env.PLATFORM_ADMIN_USER_IDS;
    else process.env.PLATFORM_ADMIN_USER_IDS = originalIds;
    if (originalEmails === undefined) delete process.env.PLATFORM_ADMIN_EMAILS;
    else process.env.PLATFORM_ADMIN_EMAILS = originalEmails;
  }
});
