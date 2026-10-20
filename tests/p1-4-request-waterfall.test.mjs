import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ANALYTICS = await readFile("src/routes/studio/analytics.tsx", "utf8");
const REPORTS = await readFile("src/routes/studio/reports.tsx", "utf8");
const STUDIO_GATE = await readFile("src/lib/menu/studio.tsx", "utf8");

test("Studio analytics and reports reuse the existing StudioGate snapshot", () => {
  assert.match(STUDIO_GATE, /let result = await getMyStudio\(\{ data: \{ tenantId: selectedTenantId \} \}\);/);
  assert.match(STUDIO_GATE, /if \(!result\.ok && selectedTenantId && result\.code === "forbidden"\)/);
  assert.match(STUDIO_GATE, /result = await getMyStudio\(\{ data: \{\} \}\);/);
  assert.match(ANALYTICS, /import \{ useStudio \} from "@\/lib\/menu\/studio";/);
  assert.match(REPORTS, /import \{ useStudio \} from "@\/lib\/menu\/studio";/);

  assert.doesNotMatch(ANALYTICS, /getMyStudio/);
  assert.doesNotMatch(REPORTS, /getMyStudio/);
});
