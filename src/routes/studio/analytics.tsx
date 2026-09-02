import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { getOwnerAnalytics } from "@/lib/menu/owner";
import type { OwnerAnalytics } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const { lang } = useLang();
  const [days, setDays] = useState<7 | 30>(7);
  const [state, setState] = useState<
    { status: "loading" } | { status: "error"; message: string } | { status: "ok"; data: OwnerAnalytics }
  >({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    getOwnerAnalytics({ data: { days } })
      .then((result) => {
        if (!result.ok) setState({ status: "error", message: result.error });
        else setState({ status: "ok", data: result.data });
      })
      .catch((err: unknown) =>
        setState({ status: "error", message: err instanceof Error ? err.message : t(copy.state.error, lang) }),
      );
  }, [days, lang]);

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">{t(copy.analytics.title, lang)}</h1>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant={days === 7 ? "solid" : "outline"} onClick={() => setDays(7)}>
            {t(copy.analytics.days7, lang)}
          </Button>
          <Button type="button" size="sm" variant={days === 30 ? "solid" : "outline"} onClick={() => setDays(30)}>
            {t(copy.analytics.days30, lang)}
          </Button>
        </div>
      </div>
      {state.status === "loading" ? <LoadingState /> : null}
      {state.status === "error" ? <ErrorState message={state.message} /> : null}
      {state.status === "ok" && state.data.visits === 0 && state.data.productViews === 0 && state.data.qrScans === 0 ? (
        <p className="rounded-xl border border-line px-4 py-10 text-center text-sm text-muted">{t(copy.state.noDataYet, lang)}</p>
      ) : null}
      {state.status === "ok" && (state.data.visits > 0 || state.data.productViews > 0 || state.data.qrScans > 0) ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={t(copy.analytics.visits, lang)} value={state.data.visits} />
            <Stat label={t(copy.analytics.sessions, lang)} value={state.data.uniqueSessions} />
            <Stat label={t(copy.analytics.views, lang)} value={state.data.productViews} />
            <Stat label={t(copy.analytics.qr, lang)} value={state.data.qrScans} />
          </section>
          <section className="grid gap-3 rounded-xl border border-line p-5 sm:grid-cols-2">
            <Stat label={t(copy.analytics.wa, lang)} value={state.data.whatsappClicks} />
            <div>
              <p className="text-xs text-muted">{t(copy.analytics.language, lang)}</p>
              <p className="mt-1 text-sm">
                عربي {state.data.langAr} · EN {state.data.langEn}
              </p>
            </div>
          </section>
          {state.data.series.length ? (
            <section className="rounded-xl border border-line p-5">
              <h2 className="mb-3 font-medium">{t(copy.analytics.visits, lang)}</h2>
              <SimpleBars
                points={state.data.series.map((p) => ({ label: p.day.slice(5), value: p.visits + p.views }))}
              />
            </section>
          ) : null}
          <Rank title={t(copy.analytics.topItems, lang)} rows={state.data.topProducts} lang={lang} />
          <Rank title={t(copy.analytics.byCategory, lang)} rows={state.data.byCategory} lang={lang} />
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl tabular">{value}</p>
    </div>
  );
}

function Rank({
  title,
  rows,
  lang,
}: {
  title: string;
  rows: Array<{ id: string; nameAr: string; nameEn: string; count: number }>;
  lang: "ar" | "en";
}) {
  if (!rows.length) return null;
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <section className="grid gap-3 rounded-xl border border-line p-5">
      <h2 className="font-medium">{title}</h2>
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r.id} className="grid gap-1">
            <div className="flex justify-between text-sm">
              <span>{lang === "ar" ? r.nameAr : r.nameEn || r.nameAr}</span>
              <span className="tabular text-muted">{r.count}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-sand">
              <div className="h-full bg-accent" style={{ width: `${(r.count / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SimpleBars({ points }: { points: Array<{ label: string; value: number }> }) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <div className="flex h-32 items-end gap-1">
      {points.map((p) => (
        <div key={p.label} className="grid min-w-0 flex-1 justify-items-center gap-1">
          <div className="w-full rounded-t-sm bg-accent" style={{ height: `${(p.value / max) * 100}%` }} />
          <span className="text-xs text-muted">{p.label}</span>
        </div>
      ))}
    </div>
  );
}
