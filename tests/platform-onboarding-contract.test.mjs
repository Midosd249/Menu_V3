import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const admin = readFileSync("src/routes/admin/onboarding.tsx", "utf8");
const server = readFileSync("src/lib/menu/platform-onboarding.ts", "utf8");
const migration = readFileSync("migrations/20260909230000_lead_onboarding.sql", "utf8");
const publicOnboarding = readFileSync("src/routes/onboarding/$token.tsx", "utf8");
const rootAdmin = readFileSync("src/routes/admin.tsx", "utf8");
const studio = readFileSync("src/lib/menu/studio.tsx", "utf8");
const adminAccess = readFileSync("src/lib/menu/admin.ts", "utf8");
const publicHome = readFileSync("src/routes/index.tsx", "utf8");


test("platform onboarding workspace exposes the owner workflow", () => {
  assert.match(rootAdmin, /اعتماد العملاء الجدد/);
  assert.match(admin, /اعتماد وإنشاء رابط التسجيل|Approve & create registration link/);
  assert.match(admin, /اتصال/);
  assert.match(admin, /WhatsApp/);
  assert.match(admin, /نسخ رابط التسجيل/);
  assert.match(admin, /updateLead/);
  assert.match(admin, /getAdminDashboard/);
});

test("platform owner approval entry point opens the working controls inside the existing admin center", () => {
  assert.match(rootAdmin, /التواصل واعتماد الطلبات/);
  assert.match(rootAdmin, /onClick=\{\(\) => setTab\("leads"\)\}/);
  assert.match(rootAdmin, /onApproval=\{\(\) => setTab\("leads"\)\}/);
  assert.doesNotMatch(rootAdmin, /href="\/admin\/onboarding"/);
  assert.match(rootAdmin, /approveLead/);
  assert.match(rootAdmin, /اعتماد وإنشاء رابط التسجيل/);
  assert.match(rootAdmin, /رفض الطلب/);
  assert.match(rootAdmin, /تم التواصل/);
  assert.match(rootAdmin, /حفظ الملاحظات/);
  assert.match(rootAdmin, /تفاصيل الطلب/);
});

test("platform admin lead approval renders the returned registration URL with copy and open actions", () => {
  assert.match(rootAdmin, /const \[registrationUrl, setRegistrationUrl\] = useState\(""\)/);
  assert.match(rootAdmin, /setRegistrationUrl\(result\.data\.registrationUrl\)/);
  assert.match(rootAdmin, /window\.location\.origin\}\$\{registrationUrl\}/);
  assert.match(rootAdmin, /نسخ الرابط/);
  assert.match(rootAdmin, /فتح الرابط/);
  assert.match(rootAdmin, /الرابط صالح لمدة 7 أيام ويُستخدم مرة واحدة/);
});

test("lead onboarding is server-authorized and token based", () => {
  assert.match(server, /requirePlatformAdmin/);
  assert.match(server, /createHash\("sha256"\)/);
  assert.match(server, /randomBytes\(32\)/);
  assert.match(server, /expires_at/);
  assert.match(server, /activateLeadOnboarding/);
  assert.match(server, /registrationUrl/);
  assert.match(server, /\/onboarding\/\$\{token\}/);
});

test("lead onboarding schema keeps the token secret and preserves the lead tenant link", () => {
  assert.match(migration, /token_hash text not null unique/);
  assert.match(migration, /lead_id text not null references leads/);
  assert.match(migration, /tenant_id text references tenants/);
  assert.match(migration, /revoked_at timestamptz/);
});

test("customer onboarding creates a restaurant workspace and menu URL", () => {
  assert.match(publicOnboarding, /authClient\.signUp\.email/);
  assert.match(publicOnboarding, /activateLeadOnboarding/);
  assert.match(publicOnboarding, /فتح الاستوديو/);
  assert.match(publicOnboarding, /QR للمنيو/);
});

test("platform owners leave studio for the dedicated admin workspace", () => {
  assert.match(adminAccess, /getPlatformAdminAccess/);
  assert.match(studio, /getPlatformAdminAccess/);
  assert.match(studio, /state\.isPlatformAdmin/);
  assert.match(studio, /Navigate to=.*admin/);
  assert.match(studio, /Navigate to=.*onboarding/);
});

test("public lead form keeps the form reference across the async submit", () => {
  assert.match(publicHome, /const formElement = event\.currentTarget/);
  assert.match(publicHome, /new FormData\(formElement\)/);
  assert.match(publicHome, /formElement\.reset\(\)/);
  assert.doesNotMatch(publicHome, /setStatus\("success"\); event\.currentTarget\.reset\(\)/);
});

test("approval center exposes an explicit rejection action backed by the existing lead status model", () => {
  assert.match(admin, /reject: "رفض الطلب"/);
  assert.match(admin, /onClick=\{\(\) => void save\("lost"\)\}/);
  assert.match(adminAccess, /LEAD_STATUSES = \["new", "contacted", "qualified", "converted", "lost"\]/);
  assert.match(adminAccess, /status: z\.enum\(LEAD_STATUSES\)/);
  assert.match(adminAccess, /update leads/);
});
