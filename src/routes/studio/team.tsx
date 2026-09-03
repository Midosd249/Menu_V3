import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShieldCheck, Trash2, Users } from "lucide-react";
import { Flash, LoadingState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { getTeamMembers, removeTeamMember, setTeamMemberBranches, updateTeamMemberRole } from "@/lib/menu/team";
import type { Role } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/team")({ component: TeamPage });

const ROLE_LABELS: Record<Role, { ar: string; en: string }> = {
  owner: { ar: "مالك", en: "Owner" },
  admin: { ar: "مدير", en: "Admin" },
  editor: { ar: "محرر", en: "Editor" },
};

type TeamBranch = { id: string; nameAr: string; nameEn: string };
type TeamMember = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  branchIds: string[];
};

function TeamPage() {
  const { lang } = useLang();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [branches, setBranches] = useState<TeamBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await getTeamMembers();
    if (result.ok) {
      setMembers(result.data.members);
      setBranches(result.data.branches);
    } else setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeRole(userId: string, role: Role) {
    setBusyId(userId);
    setError("");
    setOk(false);
    const result = await updateTeamMemberRole({ data: { userId, role } });
    if (result.ok) {
      setMembers(result.data.members);
      setBranches(result.data.branches);
      setOk(true);
    } else setError(result.error);
    setBusyId("");
  }

  async function changeBranches(userId: string, branchIds: string[]) {
    setBusyId(userId);
    setError("");
    setOk(false);
    const result = await setTeamMemberBranches({ data: { userId, branchIds } });
    if (result.ok) {
      setMembers(result.data.members);
      setBranches(result.data.branches);
      setOk(true);
    } else setError(result.error);
    setBusyId("");
  }

  async function remove(userId: string) {
    const confirmed = window.confirm(
      lang === "ar" ? "إزالة هذا العضو من النشاط؟" : "Remove this member from the business?",
    );
    if (!confirmed) return;
    setBusyId(userId);
    setError("");
    setOk(false);
    const result = await removeTeamMember({ data: { userId } });
    if (result.ok) {
      setMembers(result.data.members);
      setBranches(result.data.branches);
      setOk(true);
    } else setError(result.error);
    setBusyId("");
  }

  if (loading) return <LoadingState />;

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/studio" className="mb-3 inline-flex items-center gap-2 text-sm text-muted">
            <ArrowRight className="size-4" />
            {lang === "ar" ? "العودة إلى الاستوديو" : "Back to Studio"}
          </Link>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-ink text-paper">
              <Users className="size-5" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-semibold">{lang === "ar" ? "الفريق والصلاحيات" : "Team & permissions"}</h1>
              <p className="mt-1 text-sm text-muted">
                {lang === "ar" ? "إدارة أدوار الفريق وتحديد فروع المحررين بدقة." : "Manage team roles and scope editors to specific branches."}
              </p>
            </div>
          </div>
        </div>
      </header>

      <Flash error={error} ok={ok} />

      <section className="overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="grid grid-cols-[minmax(180px,1fr)_120px_minmax(180px,1.2fr)_80px] gap-3 border-b border-line px-4 py-3 text-xs font-medium text-muted">
          <span>{lang === "ar" ? "العضو" : "Member"}</span>
          <span>{lang === "ar" ? "الدور" : "Role"}</span>
          <span>{lang === "ar" ? "الفروع" : "Branches"}</span>
          <span>{lang === "ar" ? "إجراء" : "Action"}</span>
        </div>

        {members.map((member) => {
          const busy = busyId === member.userId;
          const selected = new Set(member.branchIds);
          return (
            <div key={member.userId} className="grid grid-cols-[minmax(180px,1fr)_120px_minmax(180px,1.2fr)_80px] items-start gap-3 border-b border-line px-4 py-4 last:border-0">
              <div className="min-w-0 pt-2">
                <p className="truncate font-medium">{member.name}</p>
                <p className="truncate text-xs text-muted">{member.email}</p>
              </div>
              <div className="flex min-w-0 items-center gap-2 pt-1">
                {member.role === "owner" ? <ShieldCheck className="size-4 shrink-0 text-accent" /> : null}
                <select
                  className="h-10 min-w-0 w-full rounded-md border border-line bg-transparent px-2 text-sm outline-none"
                  value={member.role}
                  disabled={busy || member.role === "owner"}
                  aria-label={lang === "ar" ? `دور ${member.name}` : `${member.name} role`}
                  onChange={(event) => void changeRole(member.userId, event.target.value as Role)}
                >
                  {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
                    <option key={role} value={role}>{ROLE_LABELS[role][lang]}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                {member.role === "editor" ? (
                  <div className="space-y-2">
                    {branches.length ? branches.map((branch) => (
                      <label key={branch.id} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selected.has(branch.id)}
                          disabled={busy}
                          onChange={(event) => {
                            const next = new Set(member.branchIds);
                            if (event.target.checked) next.add(branch.id);
                            else next.delete(branch.id);
                            void changeBranches(member.userId, [...next]);
                          }}
                        />
                        <span className="truncate">{lang === "ar" ? branch.nameAr : branch.nameEn}</span>
                      </label>
                    )) : <span className="text-xs text-muted">{lang === "ar" ? "لا توجد فروع" : "No branches"}</span>}
                    <p className="text-[11px] text-muted">{lang === "ar" ? "المحرر لا يصل إلا للفروع المحددة هنا." : "Editors only access the branches selected here."}</p>
                  </div>
                ) : (
                  <span className="text-xs text-muted">{lang === "ar" ? "كل الفروع" : "All branches"}</span>
                )}
              </div>
              <div className="flex justify-end pt-1">
                {member.role !== "owner" ? (
                  <Button type="button" variant="outline" size="icon" disabled={busy} onClick={() => void remove(member.userId)} aria-label={lang === "ar" ? `إزالة ${member.name}` : `Remove ${member.name}`}>
                    {busy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </Button>
                ) : <span className="text-xs text-muted">{lang === "ar" ? "المالك" : "Owner"}</span>}
              </div>
            </div>
          );
        })}

        {!members.length ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            {lang === "ar" ? "لا يوجد أعضاء إضافيون حتى الآن." : "No additional team members yet."}
          </div>
        ) : null}
      </section>

      <aside className="rounded-xl border border-line bg-sand/40 p-4 text-sm leading-6 text-muted">
        <strong className="text-ink">{lang === "ar" ? "قاعدة أمان:" : "Security rule:"}</strong>{" "}
        {lang === "ar"
          ? "إدارة الفريق محصورة بمالك النشاط. المدير والمالك يصلان إلى كل الفروع، بينما المحرر مقيد صراحة بالفروع المحددة له."
          : "Team management is owner-only. Owners and admins have tenant-wide branch access; editors are explicitly scoped to selected branches."}
      </aside>
    </main>
  );
}
