import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const panel = await readFile("src/components/studio/menu-import-panel.tsx", "utf8");
const aiImport = await readFile("src/components/studio/ai-menu-onboarding.tsx", "utf8");
const shell = await readFile("src/components/studio-shell.tsx", "utf8");
const importRoute = await readFile("src/routes/studio/import.tsx", "utf8");

assert.match(panel, /BLOCKING_ISSUES/);
assert.match(panel, /حفظ الجاهز وتخطي الباقي/);
assert.match(panel, /Review notes do not block saving/);
assert.match(panel, /MenuImportPanel/);
assert.match(aiImport, /await requestDraft\(\)/);
assert.match(aiImport, /await extractMenuDocument/);
assert.doesNotMatch(aiImport, /OPENAI_API_KEY/);
assert.doesNotMatch(aiImport, /Mercury/);
assert.match(shell, /pathname === "\/studio\/menu"/);
assert.match(shell, /MenuImportPanel/);
assert.match(shell, /fixed inset-x-3 top-16/);
assert.match(shell, /sm:start-0/);
assert.doesNotMatch(shell, /absolute end-0 top-12/);
assert.match(importRoute, /MenuImportPanel/);

console.log("Studio import and mobile notification regression contracts passed.");
