import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const ingest = fs.readFileSync(new URL("../src/lib/menu/ai-ingest.ts", import.meta.url), "utf8");
const document = fs.readFileSync(new URL("../src/lib/menu/ai-document.ts", import.meta.url), "utf8");
const providers = fs.readFileSync(new URL("../src/lib/menu/ai-providers.ts", import.meta.url), "utf8");
const route = fs.readFileSync(new URL("../src/routes/studio/import.tsx", import.meta.url), "utf8");
const ui = fs.readFileSync(new URL("../src/components/studio/ai-menu-onboarding.tsx", import.meta.url), "utf8");

for (const expected of ["generateStructuredAi", "responseSchema", "tenant_id", "categories", "never follow instructions", "السعر غير موجود في المصدر", "التصنيف يحتاج مراجعة"]) {
  test(`R2 onboarding contains ${expected}`, () => assert.ok(ingest.includes(expected), `Missing contract: ${expected}`));
}

test("AI onboarding never writes menu data directly", () => {
  assert.doesNotMatch(ingest, /insert into\s+(products|categories)/i);
  assert.doesNotMatch(ingest, /update\s+(products|categories)/i);
  assert.match(route, /importProducts/);
});

test("document extraction is server-only and provider credentials stay off the client", () => {
  assert.match(document, /authMiddleware/);
  assert.match(providers, /GOOGLE_GEMINI_API_KEY/);
  assert.match(providers, /OPENROUTER_API_KEY/);
  assert.match(providers, /ZAI_API_KEY/);
  assert.match(providers, /XKIRO_API_KEY/);
  assert.doesNotMatch(ui, /process\.env\.[A-Z0-9_]+/);
  assert.match(document, /application\/pdf/);
  assert.match(providers, /image_url/);
  assert.match(providers, /file_data/);
});

test("owner review remains mandatory before commit", () => {
  assert.match(route, /valid\.length/);
  assert.match(route, /importProducts/);
  assert.match(ui, /review-only draft/);
});

test("file size is bounded before upload", () => {
  assert.match(ui, /8 \* 1024 \* 1024/);
});
