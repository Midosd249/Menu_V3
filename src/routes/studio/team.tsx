import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Copy, Loader2, ShieldCheck, Trash2, Users } from "lucide-react";
import { Flash, LoadingState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { getTeamMembers, removeTeamMember, setTeamMemberBranches, updateTeamMemberRole } from "@/lib/menu/team";
import { createTeamInvitation, listTeamInvitations, revokeTeamInvitation } from "@/lib/menu/team-invitations";
import type { Role } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/team")({ component: TeamPage });

const ROLE_LABELS: Record<Role, { ar: string; en: string }> = {
  owner: { ar: "مالك", en: "Owner" },
  admin: { ar: "مدير", en: "Admin" },
  editor: { ar: "محرر", en: "Editor" },
  staff: { ar: "موظف", en: "Staff" },
};

type TeamBranch = { id: string; nameAr: string; nameEn: string };
type TeamMember = { userId: string; name: string; email: string; role: Role; createdAt: string; branchIds: string[] };
type Invitation = { id: string; email: string; role: Role; expiresAt: string; createdAt: string };

function TeamPage() {
  const { lang } = useLang();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [branches, setBranches] = useState<TeamBranch[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor">("editor");
  const [inviteLink, setInviteLink] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [team, pending] = await Promise.all([getTeamMembers(), listTeamInvitations()]);
    if (team.ok) { setMembers(team.data.members); setBranches(team.data.branches); }
    else setError(team.error);
    if (pending.ok) setInvitations(pending.data.invitations);
    else if (team.ok) setError(pending.error);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function changeRole(userId: string, role: Role) {
    setBusyId(userId); setError(""); setOk(false);
    const result = await updateTeamMemberRole({ data: { userId, role } });
    if (result.ok) { setMembers(result.data.members); setBranches(result.data.branches); setOk(true); } else setError(result.error);
    setBusyId("");
  }

  async function changeBranches(userId: string, branchIds: string[]) {
    setBusyId(userId); setError(""); setOk(false);
    const result = await setTeamMemberBranches({ data: { userId, branchIds } });
    if (result.ok) { setMembers(result.data.members); setBranches(result.data.branches); setOk(true); } else setError(result.error);
    setBusyId("");
  }

  async function remove(userId: string) {
    const confirmed = window.confirm(lang === "ar" ? "إزالة هذا العضو من النشاط؟" : "Remove this member from the business?");
    if (!confirmed) return;
    setBusyId(userId); setError(""); setOk(false);
    const result = await removeTeamMember({ data: { userId } });
    if (result.ok) { setMembers(result.data.members); setBranches(result.data.branches); setOk(true); } else setError(result.error);
    setBusyId("");
  }

  async function invite() {
    if (!inviteEmail.trim()) return;
    setBusyId("invite"); setError(""); setOk(false); setInviteLink("");
    const result = await createTeamInvitation({ data: { email: inviteEmail, role: inviteRole } });
    if (result.ok) {
      const link = `${window.location.origin}/login?invite=${encodeURIComponent(result.data.token)}`;
      setInviteLink(link); setInviteEmail(""); setInvitations((current) => [result.data.invitation, ...current]); setOk(true);
    } else setError(result.error);
    setBusyId("");
  }

  async function revoke(invitationId: string) {
    setBusyId(invitationId); setError(""); setOk(false);
    const result = await revokeTeamInvitation({ data: { invitationId } });
    if (result.ok) { setInvitations((current) => current.filter((item) => item.id !== invitationId)); setOk(true); } else setError(result.error);
    setBusyId("");
  }

  async function copyLink() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setOk(true);
  }

  if (loading) return <LoadingState />;

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/studio" className="mb-3 inline-flex items-center gap-2 text-sm text-muted"><ArrowRight className="size-4" />{lang === "ar" ? "العودة إلى الاستوديو" : "Back to Studio"}</Link>
          <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-ink text-paper"><Users className="size-5" /></span><div><h1 className="font-display text-3xl font-semibold">{lang === "ar" ? "الفريق والصلاحيات" : "Team & permissions"}</h1><p className="mt-1 text-sm text-muted">{lang === "ar" ? "إدارة الأدوار والدعوات وتحديد فروع المحررين والموظفين." : "Manage roles, invitations and branch scope for editors and staff."}</p></div></div>
        </div>
      </header>

      <Flash error={error} ok={ok} />

      <section className="rounded-2xl border border-line bg-paper p-5 space-y-4">
        <div><h2 className="font-semibold">{lang === "ar" ? "دعوة عضو جديد" : "Invite a team member"}</h2><p className="mt-1 text-sm text-muted">{lang === "ar" ? "الدعوة صالحة لمدة 7 أيام ومقيدة بالبريد المدعو." : "Invitations expire after 7 days and are bound to the invited email."}</p></div>
        <div className="grid gap-3 sm:grid-cols-[1fr_150px_auto]">
          <Field label={lang === "ar" ? "البريد الإلكتروني" : "Email"}><Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="name@example.com" /></Field>
          <Field label={lang === "ar" ? "الدور" : "Role"}><select className="h-10 w-full rounded-md border border-line bg-paper px-2 text-sm" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as "admin" | "editor")}><option value="editor">{ROLE_LABELS.editor[lang]}</option><option value="admin">{ROLE_LABELS.admin[lang]}</option></select></Field>
          <div className="flex items-end"><Button type="button" disabled={busyId === "invite" || !inviteEmail.trim()} onClick={() => void invite()}>{busyId === "invite" ? <Loader2 className="size-4 animate-spin" /> : lang === "ar" ? "إنشاء الدعوة" : "Create invite"}</Button></div>
        </div>
        {inviteLink ? <div className="flex gap-2 rounded-xl border border-line bg-sand/30 p-3"><Input readOnly value={inviteLink} className="text-xs" /><Button type="button" variant="outline" size="icon" onClick={() => void copyLink()} aria-label={lang === "ar" ? "نسخ رابط الدعوة" : "Copy invitation link"}><Copy className="size-4" /></Button></div> : null}
        {invitations.length ? <div className="space-y-2"><p className="text-xs font-medium text-muted">{lang === "ar" ? "الدعوات النشطة" : "Active invitations"}</p>{invitations.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 text-sm"><span>{item.email}</span><span className="text-xs text-muted">{ROLE_LABELS[item.role][lang]}</span><Button type="button" variant="outline" size="sm" disabled={busyId === item.id} onClick={() => void revoke(item.id)}>{lang === "ar" ? "إلغاء" : "Revoke"}</Button></div>)}</div> : null}
      </section>

      <section className="overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="grid grid-cols-[minmax(180px,1fr)_120px_minmax(180px,1.2fr)_80px] gap-3 border-b border-line px-4 py-3 text-xs font-medium text-muted"><span>{lang === "ar" ? "العضو" : "Member"}</span><span>{lang === "ar" ? "الدور" : "Role"}</span><span>{lang === "ar" ? "الفروع" : "Branches"}</span><span>{lang === "ar" ? "إجراء" : "Action"}</span></div>
        {members.map((member) => {
          const busy = busyId === member.userId; const selected = new Set(member.branchIds);
          return <div key={member.userId} className="grid grid-cols-[minmax(180px,1fr)_120px_minmax(180px,1.2fr)_80px] items-start gap-3 border-b border-line px-4 py-4 last:border-0">
            <div className="min-w-0 pt-2"><p className="truncate font-medium">{member.name}</p><p className="truncate text-xs text-muted">{member.email}</p></div>
            <div className="flex min-w-0 items-center gap-2 pt-1">{member.role === "owner" ? <ShieldCheck className="size-4 shrink-0 text-accent" /> : null}<select className="h-10 min-w-0 w-full rounded-md border border-line bg-transparent px-2 text-sm outline-none" value={member.role} disabled={busy || member.role === "owner"} aria-label={lang === "ar" ? `دور ${member.name}` : `${member.name} role`} onChange={(event) => void changeRole(member.userId, event.target.value as Role)}>{(Object.keys(ROLE_LABELS) as Role[]).map((role) => <option key={role} value={role}>{ROLE_LABELS[role][lang]}</option>)}</select></div>
            <div className="min-w-0">{member.role === "editor" || member.role === "staff" ? <div className="space-y-2">{branches.length ? branches.map((branch) => <label key={branch.id} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={selected.has(branch.id)} disabled={busy} onChange={(event) => { const next = new Set(member.branchIds); if (event.target.checked) next.add(branch.id); else next.delete(branch.id); void changeBranches(member.userId, [...next]); }} /><span className="truncate">{lang === "ar" ? branch.nameAr : branch.nameEn}</span></label>) : <span className="text-xs text-muted">{lang === "ar" ? "لا توجد فروع" : "No branches"}</span>}<p className="text-[11px] text-muted">{lang === "ar" ? "الوصول مقيد بالفروع المحددة هنا." : "Access is limited to the branches selected here."}</p></div> : <span className="text-xs text-muted">{lang === "ar" ? "كل الفروع" : "All branches"}</span>}</div>
            <div className="flex justify-end pt-1">{member.role !== "owner" ? <Button type="button" variant="outline" size="icon" disabled={busy} onClick={() => void remove(member.userId)} aria-label={lang === "ar" ? `إزالة ${member.name}` : `Remove ${member.name}`}>{busy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}</Button> : <span className="text-xs text-muted">{lang === "ar" ? "المالك" : "Owner"}</span>}</div>
          </div>;
        })}
        {!members.length ? <div className="px-6 py-12 text-center text-sm text-muted">{lang === "ar" ? "لا يوجد أعضاء إضافيون حتى الآن." : "No additional team members yet."}</div> : null}
      </section>

      <aside className="rounded-xl border border-line bg-sand/40 p-4 text-sm leading-6 text-muted"><strong className="text-ink">{lang === "ar" ? "قاعدة أمان:" : "Security rule:"}</strong>{" "}{lang === "ar" ? "إدارة الفريق والدعوات محصورة بمالك النشاط. المدير والمالك يصلان إلى كل الفروع، بينما المحرر والموظف مقيدان صراحة بالفروع المحددة لهما." : "Team management and invitations are owner-only. Owners and admins have tenant-wide branch access; editors and staff are explicitly scoped to selected branches."}</aside>
    </main>
  );
}
