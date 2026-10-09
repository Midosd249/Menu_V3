import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const home = read("src/routes/index.tsx");
const button = read("src/components/ui/button.tsx");
const themes = read("src/routes/themes/index.tsx");
const preview = read("src/routes/themes/preview.tsx");
const catalog = read("src/lib/menu/commercial-catalog.ts");
const registry = read("src/lib/theme/registry.ts");
const root = read("src/routes/__root.tsx");
const appManifest = JSON.parse(read("public/manifest.webmanifest"));
const appIcon = read("public/menuun-app-icon.svg");

const expectedPlans = ["free", "starter", "pro"];
const expectedThemes = ["essential", "editorial", "noir", "heritage", "gallery"];

test("homepage uses the commercial feature tiers and never renders the Pro sentinel", () => {
  const home = read("src/routes/index.tsx");
  const catalog = read("src/lib/menu/commercial-catalog.ts");
  assert.match(home, /COMMERCIAL_PLAN_FEATURES/);
  assert.match(home, /أصناف غير محدودة/);
  assert.match(home, /plan\.code === "pro" \? \(lang === "ar" \? "أصناف غير محدودة"/);
  assert.match(catalog, /maxProducts: 20, maxTeamMembers: 2/);
  assert.match(catalog, /حتى 20 صنفًا وفرع واحد/);
  assert.match(catalog, /تحليلات أعمق وMenu Intelligence/);
  assert.match(catalog, /تحليلات موحدة عبر الفروع/);
});

test("homepage exposes canonical pricing and direct self-serve signup", () => {
  assert.match(home, /COMMERCIAL_PLANS\.map/);
  assert.match(home, /id="pricing"/);
  assert.match(home, /mode: "signup"/);
  assert.match(home, /ابدأ مجانًا|Start free/);
  assert.doesNotMatch(home, /submitLead\(|selectedPlan|referenceId/);
  for (const plan of expectedPlans) assert.match(catalog, new RegExp(`code: "${plan}"`));
  assert.match(catalog, /monthlyPriceSar: 0/);
  assert.match(catalog, /monthlyPriceSar: 49/);
  assert.match(catalog, /monthlyPriceSar: 149/);
  assert.match(catalog, /annualPriceSar: 490/);
  assert.match(catalog, /annualPriceSar: 1490/);
});

test("homepage keeps a stable login entrypoint for both anonymous and authenticated visitors", () => {
  assert.match(home, /<Button asChild size="sm">\s*<Link to="\/login">\s*\{lang === "ar" \? "دخول" : "Sign in"\}\s*<\/Link>\s*<\/Button>/);
  assert.doesNotMatch(home, /<SignedIn>|<SignedOut>/);
  assert.doesNotMatch(home, /<Link to="\/studio">\{lang === "ar" \? "الاستوديو" : "Studio"\}<\/Link>/);
});

test("homepage keeps multi-child signup CTAs compatible with the slotted Button contract", () => {
  assert.match(home, /<Button asChild size="lg">\s*\{signup\}\s*<ArrowUpLeft/);
  assert.match(home, /<Button asChild className="mt-7 w-full">\{signup\}<\/Button>/);
  assert.match(button, /import \{ Slot, Slottable \} from "@radix-ui\/react-slot";/);
  assert.match(button, /Children\.toArray\(children\)/);
  assert.match(button, /<Slottable>\{firstChild\}<\/Slottable>/);
});

test("homepage presents product proof instead of a generic feature-only hero", () => {
  assert.match(home, /id="journey"/);
  assert.match(home, /id="presence"/);
  assert.match(home, /id="control"/);
  assert.match(home, /Guest signals|إشارات الضيوف/);
  assert.match(home, /Arabic.*translation layer|العربية ليست طبقة ترجمة/);
  assert.match(home, /MENU_THEMES\.map/);
});

test("homepage exposes all protected themes without a premium gate", () => {
  assert.match(home, /MENU_THEMES\.map/);
  assert.match(themes, /MENU_THEMES\.map/);
  assert.match(themes, /without an artificial gate|دون بوابة اصطناعية/);
  for (const theme of expectedThemes) assert.match(registry, new RegExp(`key: "${theme}"`));
});

test("theme preview remains connected to the canonical public renderer", () => {
  assert.match(preview, /MenuThemeController/);
  assert.match(preview, /ThemeRenderer/);
  assert.match(preview, /getTheme/);
  assert.match(preview, /isThemeKey/);
  assert.doesNotMatch(preview, /theme-preview\.html/);
});

test("new-customer request flow is retired in favor of direct signup", () => {
  assert.doesNotMatch(home, /submitLead\(/);
  assert.doesNotMatch(home, /businessName|contactPhone|NEW CUSTOMER REQUEST|طلب عميل جديد/);
  assert.match(home, /mode: "signup"/);
});


test("shared marketing footer uses only real destinations and bilingual controls", () => {
  const footer = read("src/components/marketing-footer.tsx");
  assert.match(footer, /to="\/pricing"/);
  assert.match(footer, /to="\/login"/);
  assert.match(footer, /to="\/themes\/preview"/);
  assert.match(footer, /<LangToggle \/>/);
  assert.doesNotMatch(footer, /من نحن|About/);
  assert.match(footer, /تواصل معنا|Contact/);
  assert.ok(footer.includes("ahmed.mohamed@menuun.com"));
  assert.match(footer, /966549598318/);
  assert.match(footer, /to="\/terms"/);
  assert.match(footer, /to="\/privacy"/);
});


test("WhatsApp ordering is presented as a core capability in every commercial plan", () => {
  assert.match(catalog, /الطلب عبر واتساب من المنيو/);
  assert.match(catalog, /WhatsApp ordering from the menu/);
  assert.match(catalog, /COMMERCIAL_FEATURES[\s\S]*الطلب عبر واتساب/);
  assert.match(catalog, /COMMERCIAL_FEATURES[\s\S]*WhatsApp ordering/);
});


test("homepage exposes bilingual social metadata with the canonical 1200x630 share image", () => {
  assert.ok(home.includes("Menuun | منصة منيو رقمي للمطاعم والكافيهات"));
  assert.ok(home.includes("Menuun | Digital Menu Platform for Restaurants & Cafés"));
  assert.ok(home.includes('property: "og:title"'));
  assert.ok(home.includes('property: "og:description"'));
  assert.ok(home.includes('name: "twitter:card", content: "summary_large_image"'));
  assert.ok(home.includes('name: "twitter:title"'));
  assert.ok(home.includes('name: "twitter:description"'));
  assert.ok(home.includes("https://www.menuun.com/og.jpg"));
  assert.ok(home.includes('og:image:width", content: "1200"'));
  assert.ok(home.includes('og:image:height", content: "630"'));
  assert.ok(home.includes("useEffect(() => {"));
});

test("legal pages are bilingual, linked, and describe current data/payment practices honestly", () => {
  const terms = read("src/routes/terms.tsx");
  const privacy = read("src/routes/privacy.tsx");
  for (const route of [terms, privacy]) {
    assert.ok(route.includes("useLang"));
    assert.ok(route.includes("ahmed.mohamed@menuun.com"));
    assert.ok(route.includes("Last updated: 9 October 2026"));
    assert.ok(route.includes("آخر تحديث: 9 أكتوبر 2026"));
  }
  assert.ok(terms.includes('createFileRoute("/terms")'));
  assert.ok(terms.includes("Terms of Service"));
  assert.ok(terms.includes("شروط الاستخدام"));
  assert.ok(terms.includes("does not currently process payments directly"));
  assert.ok(terms.includes("لا تعالج Menuun المدفوعات مباشرةً"));
  assert.ok(privacy.includes('createFileRoute("/privacy")'));
  assert.ok(privacy.includes("Privacy Policy"));
  assert.ok(privacy.includes("سياسة الخصوصية"));
  assert.ok(privacy.includes("Supabase"));
  assert.ok(privacy.includes("local storage"));
  assert.ok(privacy.includes("Personal Data Protection Law (PDPL)"));
  assert.ok(privacy.includes("نظام حماية البيانات الشخصية السعودي"));
  assert.ok(privacy.includes("not a certification"));
  assert.ok(privacy.includes("لا يُعد شهادة امتثال"));
});


test("marketing footer has one ordered Brand → Links → Contact → Copyright structure", () => {
  const footer = read("src/components/marketing-footer.tsx");
  const brandIndex = footer.indexOf('<div className="max-w-sm">');
  const linksIndex = footer.indexOf('<nav aria-label={ar ? "روابط الموقع" : "Site links"}>');
  const contactIndex = footer.indexOf('{ar ? "تواصل معنا" : "Contact"}');
  const copyrightIndex = footer.indexOf('className="mt-10 flex flex-col gap-4 border-t border-line pt-5');

  assert.ok(brandIndex >= 0 && brandIndex < linksIndex, "Brand must precede Links");
  assert.ok(linksIndex < contactIndex, "Links must precede Contact");
  assert.ok(contactIndex < copyrightIndex, "Contact must precede Copyright");
  assert.doesNotMatch(footer, /من نحن|About/);
  assert.doesNotMatch(footer.slice(brandIndex, linksIndex), /mailto:|wa\.me|CONTACT_EMAIL|whatsappUrl/);
  assert.equal((footer.match(/href=\{\x60mailto:\$\{CONTACT_EMAIL\}\x60\}/g) ?? []).length, 1);
  assert.equal((footer.match(/href=\{whatsappUrl\}/g) ?? []).length, 1);

  const links = footer.slice(linksIndex, contactIndex);
  for (const destination of ['to="/pricing"', 'to="/themes/preview"', 'to="/login"', 'to="/terms"', 'to="/privacy"']) {
    assert.ok(links.includes(destination), `Footer Links section must include ${destination}`);
  }

  assert.match(footer, /<footer dir=\{ar \? "rtl" : "ltr"\}/);
  assert.match(footer, /شروط الاستخدام/);
  assert.match(footer, /Terms of Service/);
  assert.match(footer, /سياسة الخصوصية/);
  assert.match(footer, /Privacy Policy/);
});


test("application identity uses Menuun metadata, favicon, and web app manifest", () => {
  assert.match(root, /const APP_NAME = "Menuun"/);
  assert.match(root, /\{ title: APP_NAME \}/);
  assert.match(root, /href: "\/favicon\.svg"/);
  assert.match(root, /rel: "manifest", href: "\/manifest\.webmanifest"/);
  assert.equal(appManifest.name, "Menuun");
  assert.equal(appManifest.short_name, "Menuun");
  assert.equal(appManifest.start_url, "/");
  assert.equal(appManifest.display, "standalone");
  assert.equal(appManifest.icons.length, 1);
  assert.equal(appManifest.icons[0].src, "/menuun-app-icon.svg");
  assert.equal(appManifest.icons[0].type, "image/svg+xml");
  assert.equal(appManifest.icons[0].purpose, "any maskable");
  assert.match(appIcon, /<rect width="512" height="512" fill="#344331"\/>/);
  assert.match(appIcon, /<svg x="106" y="106" width="300" height="300"/);
  assert.match(appIcon, /fill="#FFF7ED"/);
});
