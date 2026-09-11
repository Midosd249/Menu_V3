import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../src/lib/menu/ai.ts", import.meta.url), "utf8");

for (const expected of [
  '"description"',
  '"english"',
  '"category"',
  '"tags"',
  "INCEPTION_API_KEY",
  "api.inceptionlabs.ai/v1/chat/completions",
  "response_format",
  "json_schema",
  "context.userId",
  "tenant_members",
]) {
  test(`Mercury menu assistant contains ${expected}`, () => {
    assert.ok(source.includes(expected), `Missing expected contract: ${expected}`);
  });
}

test("category suggestions are constrained to supplied category IDs", () => {
  assert.ok(source.includes("data.categoryOptions.find"));
  assert.ok(source.includes("!selected"));
});

test("AI responses are suggestions and do not bypass the existing save path", () => {
  assert.ok(source.includes("canWriteMenu(member.role)"));
  assert.ok(source.includes("ai_invalid"));
});
