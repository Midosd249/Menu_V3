import test from "node:test";
import assert from "node:assert/strict";
import {
  AuthorizationError,
  requirePermissionForRole,
  roleCanAccessAssignedBranch,
} from "./authorization.server.ts";
import { hasPermission } from "./permissions.ts";

test("authorization boundary allows owner and admin settings writes", () => {
  assert.doesNotThrow(() => requirePermissionForRole("owner", "settings.write"));
  assert.doesNotThrow(() => requirePermissionForRole("admin", "settings.write"));
});

test("authorization boundary denies editor settings and team writes", () => {
  assert.throws(() => requirePermissionForRole("editor", "settings.write"), /Forbidden: settings\\.write/);
  assert.throws(() => requirePermissionForRole("editor", "team.write"), /Forbidden: team\\.write/);
});

test("authorization boundary uses a stable forbidden error", () => {
  assert.throws(
    () => requirePermissionForRole("editor", "orders.write"),
    (error: unknown) => error instanceof AuthorizationError && error.code === "forbidden",
  );
});

test("owner and admin retain tenant-wide branch access", () => {
  assert.equal(roleCanAccessAssignedBranch("owner", false), true);
  assert.equal(roleCanAccessAssignedBranch("admin", false), true);
});

test("editor branch access is fail-closed without explicit assignment", () => {
  assert.equal(roleCanAccessAssignedBranch("editor", false), false);
  assert.equal(roleCanAccessAssignedBranch("editor", true), true);
});

test("Level 4 permission matrix remains least-privilege", () => {
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

  const expected = {
    owner: new Set(permissions),
    admin: new Set([
      "menu.read",
      "menu.write",
      "settings.read",
      "settings.write",
      "orders.read",
      "orders.write",
    ]),
    editor: new Set(["menu.read", "menu.write"]),
  } as const;

  for (const role of ["owner", "admin", "editor"] as const) {
    for (const permission of permissions) {
      assert.equal(
        hasPermission(role, permission),
        expected[role].has(permission),
        `${role} permission ${permission} drifted`,
      );
    }
  }
});

test("editor cannot inherit elevated permissions", () => {
  for (const permission of ["settings.write", "team.write", "orders.write"] as const) {
    assert.equal(hasPermission("editor", permission), false);
  }
});