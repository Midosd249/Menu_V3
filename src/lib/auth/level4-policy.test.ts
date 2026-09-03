import test from "node:test";
import assert from "node:assert/strict";
import { hasPermission } from "./permissions.ts";
import { roleCanAccessAssignedBranch } from "./authorization.server.ts";
import type { Role } from "../menu/types.ts";

const roles: Role[] = ["owner", "admin", "editor"];

test("Level 4 permission matrix is least-privilege", () => {
  const expected: Record<Role, string[]> = {
    owner: [
      "menu.read",
      "menu.write",
      "settings.read",
      "settings.write",
      "team.read",
      "team.write",
      "orders.read",
      "orders.write",
    ],
    admin: [
      "menu.read",
      "menu.write",
      "settings.read",
      "settings.write",
      "orders.read",
      "orders.write",
    ],
    editor: ["menu.read", "menu.write"],
  };

  for (const role of roles) {
    for (const permission of [
      "menu.read",
      "menu.write",
      "settings.read",
      "settings.write",
      "team.read",
      "team.write",
      "orders.read",
      "orders.write",
    ] as const) {
      assert.equal(
        hasPermission(role, permission),
        expected[role].includes(permission),
        `${role} permission ${permission} drifted`,
      );
    }
  }
});

test("Level 4 branch policy is tenant-wide for owner/admin and assigned-only for editor", () => {
  assert.equal(roleCanAccessAssignedBranch("owner", false), true);
  assert.equal(roleCanAccessAssignedBranch("owner", true), true);
  assert.equal(roleCanAccessAssignedBranch("admin", false), true);
  assert.equal(roleCanAccessAssignedBranch("admin", true), true);
  assert.equal(roleCanAccessAssignedBranch("editor", false), false);
  assert.equal(roleCanAccessAssignedBranch("editor", true), true);
});

test("Level 4 editor cannot inherit elevated permissions", () => {
  for (const permission of ["settings.write", "team.write", "orders.write"] as const) {
    assert.equal(hasPermission("editor", permission), false);
  }
});
