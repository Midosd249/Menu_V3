import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Noir QR rendering uses the configured restaurant cover", async () => {
  const template = await readFile("src/components/templates/fine-dining-hospitality.tsx", "utf8");
  const styles = await readFile("src/theme-noir-hardening.css", "utf8");
  assert.match(template, /MenuMedia src=\{tenant\.coverUrl\}/);
  assert.match(template, /className="noir-template-hero-image"/);
  assert.doesNotMatch(template, /className="noir-template-featured"/);
  assert.doesNotMatch(styles, /noir-template-menu > \.menu-public-shell > main > section:has\(> #featured-heading\)[\s\S]*display:\s*none !important/);
  assert.match(styles, /noir-template-menu > \.menu-public-shell section:has\(> #featured-heading\)[\s\S]*display:\s*block !important/);
});

test("Taste QR rendering exposes the configured restaurant logo in the hero", async () => {
  const template = await readFile("src/components/templates/taste.tsx", "utf8");
  const styles = await readFile("src/theme-qr-final-fixes.css", "utf8");
  assert.match(template, /tenant\.logoUrl/);
  assert.match(template, /className="taste-hero-logo"/);
  assert.match(styles, /taste-hero-logo[\s\S]*object-fit:\s*contain/);
});

test("QR print opens from the click path before async QR generation and supports batch sheets", async () => {
  const source = await readFile("src/routes/studio/qr.tsx", "utf8");

  assert.match(source, /function printQr\(url: string, restaurant: string, branch: string\) \{\s*const w = window\.open\("", "menu-v3-qr-print"\);[\s\S]*const QR = await import\("qrcode"\)/);
  assert.match(source, /function printQrBatch\(url: string, restaurant: string, branch: string, copies: number\) \{[\s\S]*const w = window\.open\("", "menu-v3-qr-batch-print"\);[\s\S]*const QR = await import\("qrcode"\)/);
  assert.match(source, /DEFAULT_BATCH_COPIES = 8/);
  assert.match(source, /MAX_BATCH_COPIES = 40/);
  assert.match(source, /for \(let offset = 0; offset < safeCopies; offset \+= 8\)/);
  assert.match(source, /grid-template-columns:repeat\(2,minmax\(0,1fr\)/);
  assert.match(source, /grid-template-rows:repeat\(4,minmax\(0,1fr\)/);
});

test("Decorative theme header labels removed from Noir and Editorial", async () => {
  const noir = await readFile("src/theme-noir.css", "utf8");
  const noirHardening = await readFile("src/theme-noir-hardening.css", "utf8");
  const noirRefinements = await readFile("src/theme-refinements.css", "utf8");
  const editorialRefinements = await readFile("src/theme-refinements-v2.css", "utf8");

  for (const source of [noir, noirHardening, noirRefinements, editorialRefinements]) {
    assert.doesNotMatch(source, /NOIR \/ 03/);
    assert.doesNotMatch(source, /N \/ 03/);
    assert.doesNotMatch(source, /ISSUE \/ 03/);
  }
});


test("SIGNAL TABLE owns stable mobile information geometry and removes numbering", async () => {
  const styles = await readFile("src/theme-signal-table.css", "utf8");
  const template = await readFile("src/components/templates/signal-table.tsx", "utf8");
  assert.match(styles, /signal-card-copy[\\s\\S]*grid-template-columns:/);
  assert.match(styles, /signal-card-title[\\s\\S]*text-wrap:\s*balance/);
  assert.match(styles, /signal-product-name[\\s\\S]*unicode-bidi:\s*plaintext/);
  assert.match(styles, /signal-product-card[\\s\\S]*min-inline-size:\s*0/);
  assert.doesNotMatch(template, /signal-(card-index|product-number)|VOL\\.\\s*03/);
});
