import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const vite = fs.readFileSync("vite.config.ts", "utf8");

test("TanStack Start enables route code splitting through its native router integration", () => {
  assert.match(vite, /tanstackStart\(\{[\s\S]*router:\s*\{[\s\S]*autoCodeSplitting:\s*true/);
  assert.doesNotMatch(vite, /tanstackRouter\(/);
});

test("P1.3 does not opt into loader splitting", () => {
  assert.doesNotMatch(vite, /codeSplittingOptions\s*:\s*\{[\s\S]*defaultBehavior\s*:[\s\S]*\[\s*["']loader["']/);
  assert.doesNotMatch(vite, /splitBehavior[\s\S]*["']loader["']/);
});
