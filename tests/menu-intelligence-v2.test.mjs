import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const source = fs.readFileSync("src/lib/menu/intelligence.ts", "utf8");
const health = fs.readFileSync("src/lib/menu/health.ts", "utf8");
const types = fs.readFileSync("src/lib/menu/types.ts", "utf8");
const route = fs.readFileSync("src/routes/studio/intelligence.tsx", "utf8");
const shell = fs.readFileSync("src/components/studio-shell.tsx", "utf8");
const overview = fs.readFileSync("src/routes/studio/index.tsx", "utf8");

test("Menu Health defines an explainable deterministic contract", () => {
  assert.match(types, /HealthDimension/);
  for (const key of ["publishing", "content", "translation", "visual", "organization", "commercial", "availability"]) assert.ok(health.includes(`dim("${key}"`));
  assert.match(health, /Number\.isFinite\(p\.price\)/);
  assert.doesNotMatch(health, /price.*===.*0|price.*<=.*0/);
});

test("Menu Health treats optional presentation fields as quality signals", () => {
  assert.match(health, /imageUrl/);
  assert.match(health, /descriptionAr/);
  assert.match(health, /descriptionEn/);
  assert.match(health, /severity: "low"/);
});

test("Menu Intelligence consumes canonical health instead of a second score", () => {
  assert.match(source, /snapshot\.health/);
  assert.match(source, /scoreOf/);
  assert.match(source, /const score = health\.score/);
  assert.doesNotMatch(source, /contentScore \* 0\.4/);
  assert.doesNotMatch(source, /function percentage/);
});

test("Menu Intelligence does not invent conversion or revenue claims", () => {
  assert.doesNotMatch(source, /revenue|conversion rate|sales increased|guaranteed/i);
  assert.match(route, /not a sales or conversion claim/);
});

test("Studio navigation remains available", () => {
  assert.match(shell, /\/studio\/intelligence/);
  assert.match(shell, /Menu Intelligence/);
  assert.match(shell, /ذكاء القائمة/);
  assert.match(shell, /MOBILE_PRIMARY/);
  assert.match(overview, /\/studio\/intelligence/);
});
