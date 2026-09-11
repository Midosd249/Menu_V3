import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const source = fs.readFileSync("src/lib/menu/intelligence.ts", "utf8");
const route = fs.readFileSync("src/routes/studio/intelligence.tsx", "utf8");
const shell = fs.readFileSync("src/components/studio-shell.tsx", "utf8");
const overview = fs.readFileSync("src/routes/studio/index.tsx", "utf8");

test("Menu Intelligence is deterministic and data-bounded", () => {
  assert.match(source, /export function buildMenuIntelligence/);
  assert.match(source, /contentScore/);
  assert.match(source, /presentationScore/);
  assert.match(source, /operationsScore/);
  assert.match(source, /analyticsStatus/);
  assert.match(source, /issues/);
  assert.match(source, /Math\.round\(contentScore \* 0\.4 \+ presentationScore \* 0\.2 \+ operationsScore \* 0\.4\)/);
  assert.match(source, /OwnerAnalytics/);
});

test("Menu Intelligence does not invent conversion or revenue claims", () => {
  assert.doesNotMatch(source, /revenue|conversion rate|sales increased|guaranteed/i);
  assert.match(route, /not a sales or conversion claim/);
});

test("Menu Intelligence keeps actionable issues linked to existing Studio surfaces", () => {
  assert.match(source, /href: "\/studio\/menu"/);
  assert.match(source, /href: "\/studio\/settings"/);
  assert.match(source, /href: "\/studio\/branches"/);
  assert.match(route, /Open menu editor|فتح محرر القائمة/);
});

test("Studio exposes Menu Intelligence in desktop and mobile-safe navigation", () => {
  assert.match(shell, /\/studio\/intelligence/);
  assert.match(shell, /Menu Intelligence/);
  assert.match(shell, /ذكاء القائمة/);
  assert.match(shell, /MOBILE_PRIMARY/);
});

test("Studio overview links directly to Menu Intelligence", () => {
  assert.match(overview, /\/studio\/intelligence/);
  assert.match(overview, /اجعل قائمتك تتحسن باستمرار/);
});
