import test from "node:test";
import assert from "node:assert/strict";
import {
  AuthorizationError,
  requirePermissionForRole,
  roleCanAccessAssignedBranch,
} from "./authorization.server.ts";
import { hasPermission } from "./permissions.ts";
import { accessRoleToRole, roleToAccessRole } from "../menu/types.ts";

test("authorization boundary allows owner and admin settings writes", () => {
  assert.doesNotThrow(() => requirePermissionForRole("owner", "settings.write"));
  assert.doesNotThrow(() => requirePermissionForRole("admin", "settings.write"));
});

test("authorization boundary denies editor settings and team writes", () => {
  assert.throws(() => requirePermissionForRole("editor", "settings.write"), /Forbidden: settings\.write/);
  assert.throws(() => requirePermissionForRole("editor", "team.write"), /Forbidden: team\.write/);
});

test("authorization boundary uses a stable forbidden error", () => {
  assert.throws(
    () => requirePermissionForRole("editor", "orders.write"),
    (error: unknown) => error instanceof AuthorizationError && error.code === "forbidden",
  );
});

test("canonical durable roles map to the compatibility role contract", () => {
  assert.equal(accessRoleToRole("tenant_owner"), "owner");
  assert.equal(accessRoleToRole("branch_manager"), "admin");
  assert.equal(accessRoleToRole("editor"), "editor");
  assert.equal(accessRoleToRole("staff"), "staff");
  assert.equal(roleToAccessRole("owner"), "tenant_owner");
  assert.equal(roleToAccessRole("admin"), "branch_manager");
  assert.equal(roleToAccessRole("editor"), "editor");
  assert.equal(roleToAccessRole("staff"), "staff");
});

test("owner and admin retain tenant-wide branch access", () => {
  assert.equal(roleCanAccessAssignedBranch("owner", false), true);
  assert.equal(roleCanAccessAssignedBranch("admin", false), true);
});

test("editor and staff branch access are fail-closed without explicit assignment", () => {
  assert.equal(roleCanAccessAssignedBranch("editor", false), false);
  assert.equal(roleCanAccessAssignedBranch("editor", true), true);
  assert.equal(roleCanAccessAssignedBranch("staff", false), false);
  assert.equal(roleCanAccessAssignedBranch("staff", true), true);
});

test("Level 4 permission matrix remains least-privilege", () => {
  const permissions = [
    "menu.read", "menu.write", "settings.read", "settings.write",
    "team.read", "team.write", "orders.read", "orders.write",
  ] as const;
  const expected = {
    owner: new Set(permissions),
    admin: new Set(["menu.read", "menu.write", "settings.read", "settings.write", "orders.read", "orders.write"]),
    editor: new Set(["menu.read", "menu.write"]),
    staff: new Set(["menu.read"]),
  } as const;
  for (const role of ["owner", "admin", "editor", "staff"] as const) {
    for (const permission of permissions) {
      assert.equal(hasPermission(role, permission), expected[role].has(permission), `${role} permission ${permission} drifted`);
    }
  }
});

test("staff cannot inherit elevated permissions", () => {
  for (const permission of ["menu.write", "settings.write", "team.write", "orders.write"] as const) {
    assert.equal(hasPermission("staff", permission), false);
  }
});

test("editor cannot inherit elevated permissions", () => {
  for (const permission of ["settings.write", "team.write", "orders.write"] as const) {
    assert.equal(hasPermission("editor", permission), false);
  }
});
