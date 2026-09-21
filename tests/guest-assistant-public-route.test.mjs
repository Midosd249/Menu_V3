import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("public menu loader always renders the guest assistant", async () => {
  const route = await readFile("src/routes/m.$slug.tsx", "utf8");
  const branchRoute = await readFile("src/routes/m.$slug.$branch.tsx", "utf8");

  assert.match(route, /import \{ GuestMenuAssistant \} from "@\/components\/guest-menu-assistant"/);
  assert.match(route, /<GuestMenuAssistant menu=\{themedMenu\} \/>/);
  assert.match(branchRoute, /<MenuLoader /);
  assert.doesNotMatch(route, /!previewTheme\s*&&\s*<GuestMenuAssistant/);
  assert.doesNotMatch(route, /previewTheme\s*\?\s*<GuestMenuAssistant/);
});

test("guest assistant launcher remains above the public menu action dock", async () => {
  const source = await readFile("src/components/guest-menu-assistant.tsx", "utf8");

  assert.match(source, /data-public-menu-assistant-launcher="true"/);
  assert.match(source, /bottom-\[calc\(7rem\+env\(safe-area-inset-bottom\)\)\]/);
  assert.match(source, /start-4 z-\[45\]/);
  assert.match(source, /aria-label=\{lang === "ar" \? "اسأل عن القائمة" : "Ask about the menu"\}/);
});
