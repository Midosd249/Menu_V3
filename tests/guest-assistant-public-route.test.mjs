import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("published menu loader renders the guest assistant outside theme previews", async () => {
  const route = await readFile("src/routes/m.$slug.tsx", "utf8");
  const branchRoute = await readFile("src/routes/m.$slug.$branch.tsx", "utf8");

  assert.match(route, /import \{ GuestMenuAssistant \} from "@\/components\/guest-menu-assistant"/);
  assert.match(route, /\{!previewTheme && <GuestMenuAssistant menu=\{themedMenu\} \/>\}/);
  assert.match(branchRoute, /<MenuLoader /);
  assert.doesNotMatch(route, /previewTheme\s*\?\s*<GuestMenuAssistant/);
});
