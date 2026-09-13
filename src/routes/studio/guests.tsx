import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState, ErrorState } from "@/components/state-panel";
import { getGuestRelationshipOverview, type GuestRelationshipOverview } from "@/lib/menu/guest-relationships";

export const Route = createFileRoute("/studio/guests")({ component: GuestsPage });

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: GuestRelationshipOverview };

function GuestsPage() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  async function load(refresh = false) {
    if (refresh) setRefreshing(true); else setState({ status: "loading" });
    const result = await getGuestRelationshipOverview({ data: {} });
    setState(result.ok ? { status: "ready", data: result.data } : { status: "error", message: result.error });
    setRefreshing(false);
  }
  useEffect(() => { void load(); }, []);
  if (state.status === "loading") return <div className="mx-auto max-w-6xl"><LoadingState /></div>;
  if (state.status === "error") return <div className="mx-auto max-w-6xl"><ErrorState message={state.message} /></div>;
  const d = state.data;
  return <div className="mx-auto grid max-w-6xl gap-6 pb-8">
    <header className="rounded-3xl border border-line bg-ink p-6 text-paper md:p-8"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-paper/70">R9 · Guest relationships</p><h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Guest CRM & Retention</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-paper/70">Evidence-first guest relationship intelligence from real order data. Owner-controlled and non-autonomous.</p></div><Button type="button" variant="outline" onClick={() => void load(true)} disabled={refreshing} className="border-paper/20 bg-paper/10 text-paper hover:bg-paper/15 hover:text-paper"><RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} />Refresh</Button></div></header>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Guests", d.profiles], ["Repeat", d.repeatGuests], ["Active 30d", d.activeGuests30d], ["Lapsed 60d+", d.lapsedGuests60d]].map(([label, value]) => <article key={String(label)} className="rounded-2xl border border-line bg-paper p-5"><p className="text-sm text-muted">{label}</p><p className="mt-2 font-display text-3xl font-semibold">{Number(value).toLocaleString()}</p></article>)}</section>
    <section className="grid gap-4 md:grid-cols-2"><Card title="Loyalty" text={`${d.loyaltyMembers} members · ${d.loyaltyPoints} points`} /><Card title="Feedback / Reviews" text={`${d.feedbackCount} feedback records${d.averageRating == null ? "" : ` · ${d.averageRating.toFixed(1)}/5 average`}`} /><Card title="Campaigns" text={`${d.campaignDrafts} campaign drafts · outbound remains manual`} /><Card title="Evidence" text={d.evidence === "verified" ? "Verified evidence threshold reached." : "Insufficient evidence for strong retention interpretation yet."} /></section>
    <section className="rounded-2xl border border-line bg-paper p-5 text-sm text-muted">Average observed order value: <strong>{d.averageOrderValue.toFixed(2)} SAR</strong>. Retention signals are derived from tenant-scoped server data; no automatic message, reward, pricing change, or guest mutation is performed.</section>
  </div>;
}
function Card({ title, text }: { title: string; text: string }) { return <article className="rounded-2xl border border-line bg-paper p-6"><h2 className="font-display text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{text}</p></article>; }
