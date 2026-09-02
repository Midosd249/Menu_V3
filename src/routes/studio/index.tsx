import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { ErrorState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { getOwnerAnalytics } from "@/lib/menu/owner";
import { useStudio } from "@/lib/menu/studio";
import type { OwnerAnalytics } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/")({ component: Overview });

function Overview() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const { tenant, products, categories, branches, health } = snapshot;
  const [analytics, setAnalytics] = useState<
    { status: "loading" } | { status: "error"; message: string } | { status: "ok"; data: OwnerAnalytics }
  >({ status: "loading" });

  useEffect(() => {
    getOwnerAnalytics({ data: { days: 7 } })
      .then((result) => {
        if (!result.ok) setAnalytics({ status: "error", message: result.error });
        else setAnalytics({ status: "ok", data: result.data });
      })
      .catch((err: unknown) =>
        setAnalytics({ status: "error", message: err instanceof Error ? err.message : "تعذر التحميل" }),
      );
  }, []);

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t(copy.studio.greeting, lang)}</h1>
        <p className="text-sm text-muted">{lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t(copy.studio.health, lang)} value={`${health.score}`} suffix="%" />
        <Stat
          label={t(copy.analytics.visits, lang)}
          value={analytics.status === "ok" ? String(analytics.data.visits) : analytics.status === "error" ? "—" : "…"}
        />
        <Stat label={t(copy.studio.products, lang)} value={String(products.length)} />
        <Stat label={t(copy.studio.branches, lang)} value={String(branches.length)} />
      </section>

      <section className="grid gap-3 rounded-xl border border-line p-5">
        <h2 className="font-medium">{t(copy.studio.needsAttention, lang)}</h2>
        {health.attention.length === 0 ? (
          <p className="text-sm text-good">{t(copy.studio.allClear, lang)}</p>
        ) : (
          <ul className="grid gap-2">
            {health.attention.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.href}
                  className="flex items-start gap-3 rounded-md bg-sand/60 px-3 py-3 text-sm"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />
                  <span>{lang === "ar" ? item.titleAr : item.titleEn}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {analytics.status === "error" ? (
        <ErrorState message={analytics.message} />
      ) : analytics.status === "ok" && analytics.data.visits === 0 && analytics.data.productViews === 0 ? (
        <p className="rounded-xl border border-line px-4 py-6 text-sm text-muted">{t(copy.state.noDataYet, lang)}</p>
      ) : analytics.status === "ok" ? (
        <section className="grid gap-2 rounded-xl border border-line p-5">
          <h2 className="font-medium">{t(copy.analytics.title, lang)}</h2>
          <p className="text-sm text-muted">
            {analytics.data.uniqueSessions} {t(copy.analytics.sessions, lang)} · {analytics.data.productViews}{" "}
            {t(copy.analytics.views, lang)}
          </p>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/studio/menu">{t(copy.studio.addProduct, lang)}</Link>
        </Button>
        <Button asChild variant="outline">
          <a href={`/m/${tenant.slug}`}>{t(copy.studio.openMenu, lang)}</a>
        </Button>
      </div>
      <p className="text-xs text-muted">
        {categories.length} {t(copy.studio.categories, lang)}
      </p>
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl tabular">
        {value}
        {suffix ? <span className="text-base">{suffix}</span> : null}
      </p>
    </div>
  );
}
