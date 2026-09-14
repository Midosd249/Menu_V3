import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const componentPath = new URL("../src/components/internal-design-system.tsx", import.meta.url);
const source = readFileSync(componentPath, "utf8");

const expectedExports = [
  "InternalShell",
  "WorkspaceNavigation",
  "WorkspaceHeader",
  "PageHeader",
  "MobileBottomNav",
  "SectionHeader",
  "StatusBadge",
  "EmptyState",
  "LoadingState",
  "ErrorState",
  "PermissionDeniedState",
  "SearchField",
  "FilterBar",
  "DataTable",
  "MetricRow",
  "InsightCard",
  "ActionCard",
];

test("W7.2 internal design system exports the approved route-independent primitives", () => {
  for (const name of expectedExports) {
    assert.match(source, new RegExp(`export function ${name}\\b`), `${name} export is missing`);
  }

  assert.doesNotMatch(source, /@tanstack\\/react-router|createFileRoute/);
  assert.doesNotMatch(source, /supabase|tenant|subscription|order/i);
});

test("W7.2 internal navigation primitives remain data-driven and non-routing", () => {
  assert.match(source, /onSelect\\?: \(item: WorkspaceNavigationItem\) => void/);
  assert.match(source, /aria-current=\{item\.active \? "page" : undefined\}/);
  assert.match(source, /items\.slice\(0, 5\)/);
  assert.match(source, /border-e/);
  assert.match(source, /absolute start-3/);
});

test("W7.2 source does not edit or reference generated route registration", () => {
  assert.doesNotMatch(source, /routeTree\.gen|router\.tsx|routes\\/studio\\/growth|routes\\/studio\\/guests/);
});
