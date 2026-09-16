import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("self-serve registration starts from the public CTA", async () => {
  const home = await read("src/routes/index.tsx");
  assert.match(home, /ابدأ مجانًا/);
  assert.match(home, /mode.*signup/);
});

test("registration captures the agreed account fields without SMS OTP", async () => {
  const login = await read("src/routes/login.tsx");
  assert.match(login, /Full name|الاسم الكامل/);
  assert.match(login, /Phone number|رقم الجوال/);
  assert.match(login, /Confirm password|تأكيد كلمة المرور/);
  assert.match(login, /saveCustomerRegistrationPhone/);
  assert.match(login, /SMS OTP is not used|لا نستخدم SMS OTP/);
});

test("self-serve brand setup is server-authorized and business type is persisted", async () => {
  const server = await read("src/lib/menu/self-serve-onboarding.ts");
  const migration = await read("migrations/20260916050000_self_serve_business_type.sql");
  assert.match(server, /authMiddleware/);
  assert.match(server, /businessType/);
  assert.match(server, /insert into tenants/);
  assert.match(migration, /business_type/);
  assert.match(migration, /tenants_business_type_ck/);
});
