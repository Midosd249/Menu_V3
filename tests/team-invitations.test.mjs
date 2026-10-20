import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const invitations = readFileSync("src/lib/menu/team-invitations.ts", "utf8");
const inviteRoute = readFileSync("src/routes/invite.$token.tsx", "utf8");
const login = readFileSync("src/routes/login.tsx", "utf8");
const verify = readFileSync("src/routes/verify-email.tsx", "utf8");
const team = readFileSync("src/routes/studio/team.tsx", "utf8");
const studio = readFileSync("src/lib/menu/studio.tsx", "utf8");
const owner = readFileSync("src/lib/menu/owner.ts", "utf8");

test("invitation context survives verification redirects and browser navigation", () => {
  assert.ok(login.includes('callbackURL: invite ? "/invite/" + encodeURIComponent(invite) : "/login?verified=1"'));
  assert.ok(login.includes("getPendingInvitationToken()"));
  assert.ok(login.includes('window.location.assign("/verify-email" + (invite ? "?invite=" + encodeURIComponent(invite)'));
  assert.ok(verify.includes('callbackURL: invite ? "/invite/" + encodeURIComponent(invite) : "/login?verified=1"'));
  assert.ok(verify.includes("getPendingInvitationToken()"));
  const context = readFileSync("src/lib/auth/invitation-context.ts", "utf8");
  assert.ok(context.includes('localStorage.setItem(PENDING_INVITATION_KEY, value)'));
  assert.ok(context.includes("getItem(PENDING_INVITATION_KEY)"));
  assert.ok(inviteRoute.includes("persistPendingInvitationToken(token)"));
  assert.ok(inviteRoute.includes("clearPendingInvitationToken(token)"));
});

test("onboarding cannot create a separate workspace while an invitation is pending", () => {
  const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
  assert.ok(onboarding.includes("getPendingInvitationToken()"));
  assert.ok(onboarding.includes("window.location.replace"));
});

test("invitation page previews details without automatically accepting", () => {
  assert.ok(inviteRoute.includes("getTeamInvitationPreview"));
  assert.ok(inviteRoute.includes("tenantNameAr"));
  assert.ok(inviteRoute.includes("Invited email"));
  assert.ok(inviteRoute.includes("Create an account"));
  assert.ok(inviteRoute.includes("Invitation steps"));
  assert.ok(inviteRoute.includes("return to this same invitation link"));
  assert.ok(inviteRoute.includes("onClick={() => void accept()}"));
  assert.ok(!inviteRoute.includes('window.location.assign(`/login?invite='));
});

test("acceptance requires a verified session email and is atomic/serialized", () => {
  assert.ok(invitations.includes("user.email_verified !== true"));
  assert.ok(invitations.includes('select email, "emailVerified" as email_verified from "user"'));
  assert.ok(invitations.includes("sql.transaction(async (tx) => {"));
  assert.ok(invitations.includes("limit 1 for update"));
  assert.ok(invitations.includes('getTeamInvitationPreview = createServerFn({ method: "POST" })'));
  assert.ok(invitations.includes("insert into tenant_members"));
  assert.ok(invitations.includes("update team_invitations set accepted_at = now()"));
});

test("accepted invitation selects the invited tenant only after server-side membership validation", () => {
  assert.ok(inviteRoute.includes('sessionStorage.setItem("menuun.active-tenant-id", result.data.tenantId)'));
  assert.ok(studio.includes('getMyStudio({ data: { tenantId: selectedTenantId } })'));
  assert.ok(owner.includes('membershipOf(sql, context.userId, data.tenantId)'));
  assert.ok(owner.includes('if (data.tenantId && !member)'));
});

test("expired invitations are revoked before replacement under the existing unique index", () => {
  assert.ok(invitations.includes("expires_at <= now()"));
  assert.ok(invitations.includes("set revoked_at = now()"));
});

test("owner invitation UI clearly communicates manual link sharing and copy feedback", () => {
  assert.ok(team.includes("No email was sent automatically"));
  assert.ok(team.includes("لم يتم إرسال بريد تلقائي"));
  assert.ok(team.includes("/invite/${encodeURIComponent(result.data.token)}"));
  assert.ok(team.includes("role: inviteRole"));
  assert.ok(team.includes("Invitation link copied"));
  assert.ok(team.includes("تم نسخ رابط الدعوة"));
});
