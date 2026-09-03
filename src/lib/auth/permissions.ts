import type { Role } from "@/lib/menu/types";

export type Permission =
  | "menu.read"
  | "menu.write"
  | "settings.read"
  | "settings.write"
  | "team.read"
  | "team.write"
  | "orders.read"
  | "orders.write";

const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  owner: new Set([
    "menu.read",
    "menu.write",
    "settings.read",
    "settings.write",
    "team.read",
    "team.write",
    "orders.read",
    "orders.write",
  ]),
  admin: new Set([
    "menu.read",
    "menu.write",
    "settings.read",
    "settings.write",
    "orders.read",
    "orders.write",
  ]),
  editor: new Set(["menu.read", "menu.write"]),
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: ${permission}`);
  }
}

export function canWriteMenu(role: Role): boolean {
  return hasPermission(role, "menu.write");
}

export function canWriteSettings(role: Role): boolean {
  return hasPermission(role, "settings.write");
}

export function canManageTeam(role: Role): boolean {
  return hasPermission(role, "team.write");
}
