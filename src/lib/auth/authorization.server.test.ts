import { describe, expect, it } from "vitest";
import {
  AuthorizationError,
  requirePermissionForRole,
  roleCanAccessAssignedBranch,
} from "./authorization.server";

describe("authorization boundary", () => {
  it("allows owner and admin settings writes", () => {
    expect(() => requirePermissionForRole("owner", "settings.write")).not.toThrow();
    expect(() => requirePermissionForRole("admin", "settings.write")).not.toThrow();
  });

  it("denies editor settings and team writes", () => {
    expect(() => requirePermissionForRole("editor", "settings.write")).toThrowError(
      /Forbidden: settings\.write/,
    );
    expect(() => requirePermissionForRole("editor", "team.write")).toThrowError(
      /Forbidden: team\.write/,
    );
  });

  it("uses a stable forbidden error for denied mutations", () => {
    try {
      requirePermissionForRole("editor", "orders.write");
      throw new Error("expected authorization to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AuthorizationError);
      expect((error as AuthorizationError).code).toBe("forbidden");
    }
  });

  it("grants owner/admin tenant-wide branch access", () => {
    expect(roleCanAccessAssignedBranch("owner", false)).toBe(true);
    expect(roleCanAccessAssignedBranch("admin", false)).toBe(true);
  });

  it("requires explicit assignment for editors", () => {
    expect(roleCanAccessAssignedBranch("editor", false)).toBe(false);
    expect(roleCanAccessAssignedBranch("editor", true)).toBe(true);
  });
});
