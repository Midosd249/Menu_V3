import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const shell = await readFile("src/components/studio-shell.tsx", "utf8");
const designSystem = await readFile("src/components/internal-design-system.tsx", "utf8");

const requiredPrimaryRoutes = [
  "/studio",
  "/studio/menu",
  "/studio/orders",
  "/studio/growth",
  "/studio/guests",
  "/studio/settings",
];

const requiredMobileRoutes = [
  "/studio",
  "/studio/menu",
  "/studio/orders",
  "/studio/growth",
];

const forbiddenDeadLinks = [
  "/studio/loyalty",
  "/studio/campaigns",
  "/studio/feedback",
  "/studio/retention",
  "/studio/subscription",
  "/studio/advanced",
];

test("W7.3 shell uses the W7.2 navigation primitives", () => {
  assert.match(shell, /WorkspaceNavigation/);
  assert.match(shell, /MobileBottomNav/);
  assert.match(designSystem, /export function WorkspaceNavigation/);
  assert.match(designSystem, /export function MobileBottomNav/);
});

test("W7.3 primary workspaces are real generated Studio routes", () => {
  for (const route of requiredPrimaryRoutes) assert.match(shell, new RegExp(route.replaceAll("/", "\\/")));
  assert.match(shell, /aria-current/);
});

test("W7.3 mobile primary navigation is exactly Home, Menu, Orders, Growth, More", () => {
  for (const route of requiredMobileRoutes) assert.match(shell, new RegExp(route.replaceAll("/", "\\/")));
  assert.match(shell, /id: "more"/);
  assert.match(shell, /setMoreOpen\(true\)/);
});

test("W7.3 does not invent standalone child routes", () => {
  for (const route of forbiddenDeadLinks) assert.doesNotMatch(shell, new RegExp(route.replaceAll("/", "\\/")));
});

test("W7.3 keeps Platform Admin outside Studio workspace navigation", () => {
  assert.match(shell, /to="\/admin"/);
  assert.match(shell, /Platform Admin/);
});

test("W7.3 keeps navigation permission gates", () => {
  assert.match(shell, /canManageTeam/);
  assert.match(shell, /canWriteSettings/);
  assert.match(shell, /permission: "settings.write"/);
  assert.match(shell, /permission: "team.write"/);
});

test("W7.3 remains shell-only", () => {
  assert.doesNotMatch(shell, /supabase/i);
  assert.doesNotMatch(shell, /createFileRoute/);
  assert.doesNotMatch(shell, /migrations\//i);
});
