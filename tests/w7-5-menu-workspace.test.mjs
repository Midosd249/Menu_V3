import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const route = fs.readFileSync("src/routes/studio/menu.tsx", "utf8");
const page = fs.readFileSync("src/components/studio-menu-workspace-page.tsx", "utf8");
const workspace = fs.readFileSync("src/components/studio-menu-workspace.tsx", "utf8");

 test("Menu route mounts the focused workspace without changing its URL", () => {
  assert.match(route, /createFileRoute\("\/studio\/menu"\)/);
  assert.match(route, /StudioMenuWorkspacePage/);
  assert.doesNotMatch(route, /createFileRoute\("\/studio\/menu\/[^\"]+"\)/);
});

test("Menu Workspace uses existing menu sources and business actions", () => {
  assert.match(page, /useStudio\(\)/);
  assert.match(page, /saveProduct/);
  assert.match(page, /saveCategory/);
  assert.match(page, /toggleProduct/);
  assert.match(page, /deleteProduct/);
  assert.match(page, /deleteCategory/);
  assert.match(page, /generateMenuAi/);
  assert.match(page, /runMenuQa/);
  assert.match(workspace, /snapshot\.products\.length/);
  assert.match(workspace, /snapshot\.categories\.length/);
  assert.match(workspace, /product\.isAvailable/);
  assert.doesNotMatch(workspace, /healthScore|completenessPercentage|fake|sampleRevenue/i);
});

test("Menu Workspace exposes only verified real menu destinations", () => {
  for (const path of ["/studio/options", "/studio/import", "/studio/preview", "/studio/qr"]) {
    assert.match(workspace, new RegExp(path.replaceAll("/", "\\/")));
  }
  for (const path of ["/studio/loyalty", "/studio/campaigns", "/studio/feedback", "/studio/retention", "/studio/reports"]) {
    assert.doesNotMatch(workspace, new RegExp(path.replaceAll("/", "\\/")));
  }
});

test("Menu Workspace has honest empty/error/permission boundaries and accessibility structure", () => {
  assert.match(workspace, /No matching items|لا توجد أصناف مطابقة/);
  assert.match(workspace, /Start with your menu structure|ابدأ ببناء هيكل القائمة/);
  assert.match(workspace, /aria-label/);
  assert.match(workspace, /aria-pressed/);
  assert.match(workspace, /scope=\"col\"/);
  assert.match(page, /flash\.run/);
  assert.match(page, /result\.ok/);
});
