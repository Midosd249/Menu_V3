import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("W7.10 shared internal responsive primitives remain mobile-safe", async () => {
  const source = await readFile("src/components/internal-design-system.tsx", "utf8");
  assert.match(source, /WorkspaceHeader[\s\S]*?flex-col/);
  assert.match(source, /WorkspaceHeader[\s\S]*?sm:flex-row/);
  assert.match(source, /WorkspaceHeader[\s\S]*?flex-wrap/);
  assert.match(source, /FilterBar[\s\S]*?flex-wrap/);
  assert.match(source, /MobileBottomNav[\s\S]*?pb-\[env\(safe-area-inset-bottom\)\]/);
  assert.match(source, /DataTable[\s\S]*?overflow-x-auto/);
});
