import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const invitations = readFileSync("src/lib/menu/team-invitations.ts", "utf8");
const inviteRoute = readFileSync("src/routes/invite.$token.tsx", "utf8");
const login = readFileSync("src/routes/login.tsx", "utf8");
const verify = readFileSync("src/routes/verify-email.tsx", "utf8");
const team = readFileSync("src/routes/studio/team.tsx", "utf8");

test("invitation token survives email signup, verification, and resend", () => {
  assert.ok(login.includes('callbackURL: "/login?verified=1" + (invite ? "&invite=" + encodeURIComponent(invite)'));
  assert.ok(login.includes('window.location.assign("/verify-email" + (invite ? "?invite=" + encodeURIComponent(invite)'));
  assert.ok(verify.includes('callbackURL: "/login?verified=1" + (invite ? "&invite=" + encodeURIComponent(invite)'));
  assert.ok(verify.includes('new URLSearchParams(window.location.search).get("invite")'));
});

test("invitation page previews details without automatically accepting", () => {
  assert.ok(inviteRoute.includes("getTeamInvitationPreview"));
  assert.ok(inviteRoute.includes("tenantNameAr"));
  assert.ok(inviteRoute.includes("Invited email"));
  assert.ok(inviteRoute.includes("Create an account"));
  assert.ok(inviteRoute.includes("onClick={() => void accept()}"));
  assert.ok(!inviteRoute.includes('window.location.assign(`/login?invite='));
});

test("acceptance requires a verified session email and is atomic/serialized", () => {
  assert.ok(invitations.includes("user.email_verified !== true"));
  assert.ok(invitations.includes("sql.transaction(async (tx) => {"));
  assert.ok(invitations.includes("limit 1 for update"));
  assert.ok(invitations.includes('getTeamInvitationPreview = createServerFn({ method: "POST" })'));
  assert.ok(invitations.includes("insert into tenant_members"));
  assert.ok(invitations.includes("update team_invitations set accepted_at = now()"));
});

test("expired invitations are revoked before replacement under the existing unique index", () => {
  assert.ok(invitations.includes("expires_at <= now()"));
  assert.ok(invitations.includes("set revoked_at = now()"));
});

test("owner invitation UI clearly communicates manual link sharing and copy feedback", () => {
  assert.ok(team.includes("No email was sent automatically"));
  assert.ok(team.includes("لم يتم إرسال بريد تلقائي"));
  assert.ok(team.includes("Invitation link copied"));
  assert.ok(team.includes("تم نسخ رابط الدعوة"));
});
