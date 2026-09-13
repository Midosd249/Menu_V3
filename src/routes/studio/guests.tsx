import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/studio/guests")({ component: GuestsPage });

function GuestsPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 pb-8">
      <header className="rounded-3xl border border-line bg-ink p-6 text-paper md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-paper/70">R9 · Guest relationships</p>
        <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">Guest CRM & Retention</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-paper/70">Evidence-first guest relationship intelligence built on real restaurant orders. Owner-controlled, tenant-scoped, and non-autonomous.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-line bg-paper p-6"><h2 className="font-display text-2xl font-semibold">CRM</h2><p className="mt-2 text-sm leading-6 text-muted">Guest profiles, repeat behavior, recency, and observed value are available through the server-side R9 relationship layer.</p></article>
        <article className="rounded-2xl border border-line bg-paper p-6"><h2 className="font-display text-2xl font-semibold">Loyalty</h2><p className="mt-2 text-sm leading-6 text-muted">The loyalty ledger is ready for owner-approved rewards without autonomous awarding or messaging.</p></article>
        <article className="rounded-2xl border border-line bg-paper p-6"><h2 className="font-display text-2xl font-semibold">Campaigns</h2><p className="mt-2 text-sm leading-6 text-muted">Campaign data is prepared for drafts and approval. Outbound delivery remains explicitly manual.</p></article>
        <article className="rounded-2xl border border-line bg-paper p-6"><h2 className="font-display text-2xl font-semibold">Feedback & Retention</h2><p className="mt-2 text-sm leading-6 text-muted">Feedback and retention signals stay evidence-based and branch-scoped.</p></article>
      </section>
      <div><Link to="/studio/growth" className="text-sm font-semibold text-accent">Back to Growth Intelligence</Link></div>
    </main>
  );
}
