import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const login = readFileSync("src/routes/login.tsx", "utf8");
const contract = readFileSync("src/lib/auth/customer-registration-contract.ts", "utf8");
const registration = readFileSync("src/lib/auth/customer-registration.ts", "utf8");
const authServer = readFileSync("src/lib/auth/server.ts", "utf8");
const studio = readFileSync("src/lib/menu/studio.tsx", "utf8");
const owner = readFileSync("src/lib/menu/owner.ts", "utf8");


test("registration exposes account fields; brand setup stays in onboarding", () => {
  for (const field of [
    'name="name"',
    'name="phone"',
    'name="identity"',
    'name="password"',
    'name="confirmPassword"',
  ]) assert.ok(login.includes(field), `missing registration field: ${field}`);
  assert.match(contract, /fullName: z\.string\(\)\.trim\(\)\.min\(2\)\.max\(100\)/);
  assert.match(contract, /phone: z\.string\(\)\.trim\(\)\.min\(8\)\.max\(30\)/);
  assert.match(contract, /email: z\.string\(\)\.trim\(\)\.email\(\)\.max\(320\)/);
  assert.match(contract, /password: z\.string\(\)\.min\(8\)\.max\(128\)/);
  assert.match(contract, /confirmPassword: z\.string\(\)\.min\(8\)\.max\(128\)/);
});

test("required-field validation is enforced before signup", () => {
  assert.match(login, /required minLength=\{2\} maxLength=\{100\}/);
  assert.doesNotMatch(login, /name="brandName"/);
  assert.match(login, /name="phone"[^>]*required/);
  assert.match(login, /name="identity"[^>]*required/);
  assert.match(login, /name="password"[^>]*required/);
  assert.match(login, /name="confirmPassword"[^>]*required/);
  assert.match(login, /customerRegistrationSchema\.safeParse/);
  assert.match(registration, /customerRegistrationSchema\.safeParse\(data\)/);
});

test("password confirmation mismatch is validated on both client and server", () => {
  assert.match(contract, /data\.password === data\.confirmPassword/);
  assert.match(registration, /customerRegistrationSchema\.safeParse\(data\)/);
  assert.match(login, /Passwords do not match/);
  assert.match(login, /كلمتا المرور غير متطابقتين/);
});

test("Saudi phone remains normalized and invalid-phone rejection stays server-side", () => {
  assert.match(registration, /normalizePhoneDigits\(data\.phone, "SA"\)/);
  assert.match(registration, /digits\.startsWith\("9665"\)/);
  assert.match(registration, /const phone = `\+\$\{digits\}`/);
  assert.match(registration, /phoneNumberVerified.*false/);
  assert.match(login, /Enter a valid Saudi phone number/);
  assert.match(login, /أدخل رقم جوال سعودي صحيح/);
});

test("duplicate phone errors do not disclose account ownership", () => {
  assert.match(registration, /where "phoneNumber" = \$\{phone\} and "id" <> \$\{context\.userId\}/);
  assert.match(registration, /code: "unavailable", error: GENERIC_REGISTRATION_ERROR\.ar/);
  assert.doesNotMatch(registration, /رقم الجوال مرتبط بحساب آخر/);
  assert.doesNotMatch(registration, /select "id" from "user" where "phoneNumber" = \$\{phone\} limit 1/);
});

test("signup enters email verification before onboarding", () => {
  const signupBlock = login.match(/const result = await authClient\.signUp\.email\([\s\S]*?await navigate\(\{ to: "\/verify-email"[^;]*\}\)/);
  assert.ok(signupBlock, "signup should route through verification before onboarding");
  assert.match(signupBlock[0], /if \(result\.error\) throw new Error\(GENERIC_REGISTRATION_ERROR\[lang\]\)/);
  assert.match(signupBlock[0], /authClient\.sendVerificationEmail/);
  assert.match(signupBlock[0], /savePendingRegistration\(email, phone\)/);
  assert.match(signupBlock[0], /await navigate\(\{ to: "\/verify-email", replace: true \}\)/);
  assert.doesNotMatch(signupBlock[0], /authClient\.signIn\.email\(\{ email, password \}\)/);
  assert.match(contract, /We couldn't create the account/);
  assert.match(contract, /تعذر إنشاء الحساب/);
});

test("production authentication requires an explicit Better Auth secret", () => {
  assert.match(authServer, /if \(runningOnVercel && env\("VITE_AUTH_ENABLED"\) !== "false"\) \{/);
  assert.match(authServer, /BETTER_AUTH_SECRET is required for production authentication/);
});

test("registration preserves Better Auth and keeps mode=signup as navigation state", () => {
  assert.match(login, /authClient\.signUp\.email/);
  assert.match(login, /get\("mode"\) === "signup"/);
  assert.doesNotMatch(login, /mode=signup[\s\S]*(?:tenant|membership|branch|role|entitlement)/);
  assert.match(authServer, /betterAuth\(/);
  assert.match(authServer, /emailAndPassword:/);
});

test("successful registration preserves phone state until verified login; workspace handoff remains deferred", () => {
  assert.match(login, /validateCustomerRegistrationContract/);
  assert.match(login, /authClient\.signUp\.email/);
  assert.match(login, /savePendingRegistration\(email, phone\)/);
  assert.match(login, /authClient\.sendVerificationEmail/);
  assert.match(login, /await navigate\(\{ to: "\/verify-email", replace: true \}\)/);
  assert.match(login, /saveCustomerRegistrationPhone/);
  assert.match(login, /await navigate\(\{ to: "\/studio", replace: true \}\)/);
  assert.doesNotMatch(login, /createRestaurant\(/);
  assert.doesNotMatch(login, /createSelfServeWorkspace/);
  assert.doesNotMatch(login, /activateCustomerWorkspace/);
});

test("registration does not introduce historical self-serve grants or workspace creation", () => {
  assert.doesNotMatch(login, /self_serve_registration_grants/);
  assert.doesNotMatch(registration, /self_serve_registration_grants/);
  assert.doesNotMatch(registration, /create_self_serve_workspace/);
  assert.doesNotMatch(login, /tenantId|branchId|membershipId|role:/);
  assert.match(owner, /createRestaurant/);
});

test("existing authenticated-user behavior remains protected by Studio membership", () => {
  assert.match(login, /if \(user\) return <Navigate to="\/studio" \/>/);
  assert.match(login, /if \(user && invite\) return <Navigate to="\/invite\/\$token"/);
  assert.match(studio, /state\.status === "empty"/);
  assert.match(studio, /Navigate to=.*onboarding/);
});

test("Arabic RTL and English LTR registration rendering remain explicit", () => {
  assert.match(login, /dir=\{lang === "ar" \? "rtl" : "ltr"\}/);
  assert.doesNotMatch(login, /اسم البراند أو المطعم/);
  assert.doesNotMatch(login, /Brand \/ restaurant name/);
  assert.match(login, /رقم الجوال السعودي/);
  assert.match(login, /Saudi phone number/);
});
