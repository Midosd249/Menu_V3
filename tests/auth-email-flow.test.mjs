import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const server = readFileSync("src/lib/auth/server.ts", "utf8");
const email = readFileSync("src/lib/auth/email.ts", "utf8");
const login = readFileSync("src/routes/login.tsx", "utf8");
const verify = readFileSync("src/routes/verify-email.tsx", "utf8");
const forgot = readFileSync("src/routes/forgot-password.tsx", "utf8");
const reset = readFileSync("src/routes/reset-password.tsx", "utf8");
const settings = readFileSync("src/routes/studio/settings.tsx", "utf8");

test("Menuun auth email delivery is server-only and uses Resend", () => {
  assert.match(email, /RESEND_API_KEY/);
  assert.match(email, /api\.resend\.com\/emails/);
  assert.match(email, /noreply@mail\.menuun\.com/);
  assert.doesNotMatch(login, /RESEND_API_KEY/);
  assert.doesNotMatch(verify, /RESEND_API_KEY/);
});

test("email/password auth requires verification and has recovery", () => {
  assert.match(server, /requireEmailVerification: true/);
  assert.match(server, /sendResetPassword:/);
  assert.match(server, /resetPasswordTokenExpiresIn: 3600/);
  assert.match(server, /revokeSessionsOnPasswordReset: true/);
  assert.match(server, /sendVerificationEmail:/);
  assert.match(server, /sendOnSignUp: false/);
  assert.match(server, /sendOnSignIn: true/);
  assert.match(login, /sendVerificationEmail/);
  assert.match(login, /\/forgot-password/);
  assert.match(verify, /sendVerificationEmail/);
  assert.match(forgot, /requestPasswordReset/);
  assert.match(reset, /resetPassword/);
});

test("restaurant-linked accounts cannot use the self-service hard-delete path", () => {
  assert.match(server, /deleteUser: \{/);
  assert.match(server, /tenant_members where user_id = \$1/);
  assert.match(server, /tenants where owner_user_id = \$1/);
  assert.match(server, /Restaurant-linked accounts cannot be permanently deleted/);
  assert.match(settings, /authClient\.deleteUser/);
  assert.match(settings, /confirmation email/i);
});
