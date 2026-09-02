import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShieldCheck, Trash2, Users } from "lucide-react";
import { Flash, LoadingState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { getTeamMembers, removeTeamMember, updateTeamMemberRole } from "@/lib/menu/team";
import type { Role } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/team")({ component: TeamPage });

const ROLE_LABELS: Record<Role, { ar: string; en: string }> = {
  owner: { ar: "مالك", en: "Owner" },
  admin: { ar: "مدير", en: "Admin" },
  editor: { ar: "محرر", en: "Editor" },
};

function TeamPage() {
  const { lang } = useLang();
  const [members, setMembers] = useState<Array<{ userId: string; name: string; email: string; role: Role; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await getTeamMembers();
    if (result.ok) setMembers(result.data.members);
    else setError(result.error);
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
      setOk(true);
    } else setError(result.error);
    setBusyId("");
  }

  if (loading) return <LoadingState />;

  return (
    <main className="mx-auto max-w-4xl space-y-6">
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
                {lang === "ar" ? "إدارة وصول فريق نشاطك من مكان واحد." : "Manage your business team access in one place."}
              </p>
            </div>
          </div>
        </div>
      </header>

      <Flash error={error} ok={ok ? (lang === "ar" ? "تم تحديث الفريق" : "Team updated") : ""} />

      <section className="overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="grid grid-cols-[1fr_150px_90px] gap-3 border-b border-line px-4 py-3 text-xs font-medium text-muted sm:grid-cols-[1fr_170px_120px]">
          <span>{lang === "ar" ? "العضو" : "Member"}</span>
          <span>{lang === "ar" ? "الدور" : "Role"}</span>
          <span>{lang === "ar" ? "إجراء" : "Action"}</span>
        </div>

        {members.map((member) => {
          const busy = busyId === member.userId;
          return (
            <div key={member.userId} className="grid grid-cols-[1fr_150px_90px] items-center gap-3 border-b border-line px-4 py-4 last:border-0 sm:grid-cols-[1fr_170px_120px]">
              <div className="min-w-0">
                <p className="truncate font-medium">{member.name}</p>
                <p className="truncate text-xs text-muted">{member.email}</p>
              </div>
              <div className="flex min-w-0 items-center gap-2">
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
              <div className="flex justify-end">
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
          ? "إدارة الفريق محصورة بمالك النشاط، ولا يمكن إزالة آخر مالك أو خفض صلاحية مالك النشاط الحالي."
          : "Team management is owner-only. The last owner cannot be removed or demoted from the current owner session."}
      </aside>
    </main>
  );
}
