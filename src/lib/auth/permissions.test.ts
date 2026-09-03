import test from "node:test";
import assert from "node:assert/strict";
import {
  canManageTeam,
  canWriteMenu,
  canWriteSettings,
  hasPermission,
} from "./permissions";
import { roleCanAccessAssignedBranch } from "./authorization.server";

const roles = ["owner", "admin", "editor"] as const;

test("permission matrix keeps owner as the full-access tenant role", () => {
  assert.equal(canWriteMenu("owner"), true);
  assert.equal(canWriteSettings("owner"), true);
  assert.equal(canManageTeam("owner"), true);
});

test("admin can manage settings and menu but not team membership", () => {
  assert.equal(canWriteMenu("admin"), true);
  assert.equal(canWriteSettings("admin"), true);
  assert.equal(canManageTeam("admin"), false);
});

test("editor is restricted to menu content", () => {
  assert.equal(canWriteMenu("editor"), true);
  assert.equal(canWriteSettings("editor"), false);
  assert.equal(canManageTeam("editor"), false);
});

test("every defined role has an explicit decision for every permission", () => {
  const permissions = [
    "menu.read",
    "menu.write",
    "settings.read",
    "settings.write",
    "team.read",
    "team.write",
    "orders.read",
    "orders.write",
  ] as const;

  for (const role of roles) {
    for (const permission of permissions) {
      assert.equal(typeof hasPermission(role, permission), "boolean");
    }
  }
});

test("branch scope is fail-closed for an unassigned editor", () => {
  assert.equal(roleCanAccessAssignedBranch("editor", false), false);
  assert.equal(roleCanAccessAssignedBranch("editor", true), true);
});

test("owner and admin have tenant-wide branch access", () => {
  assert.equal(roleCanAccessAssignedBranch("owner", false), true);
  assert.equal(roleCanAccessAssignedBranch("admin", false), true);
});
