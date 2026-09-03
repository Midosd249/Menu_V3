import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOW = readFileSync(join(ROOT, ".github/workflows/quality.yml"), "utf8");

test("Browser template QA isolates the preview from runner process cleanup", () => {
  const qaStep = WORKFLOW.match(/- name: Browser template QA\n        run: \|\n([\s\S]*?)(?=\n      - name: Stop built preview)/)?.[1] ?? "";

  assert.match(qaStep, /setsid env -u RUNNER_TRACKING_ID npx vite preview/);
  assert.match(qaStep, /npm run qa:template http:\/\/127\.0\.0\.1:8081\/themes\/preview\?theme=editorial/);
});
