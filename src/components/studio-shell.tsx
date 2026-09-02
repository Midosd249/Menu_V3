import { useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  QrCode,
  Settings,
  LayoutDashboard,
  Palette,
  Upload,
  UtensilsCrossed,
  SlidersHorizontal,
  ExternalLink,
  Ellipsis,
} from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { useStudio } from "@/lib/menu/studio";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/studio", icon: LayoutDashboard, label: copy.nav.overview, exact: true },
  { to: "/studio/menu", icon: UtensilsCrossed, label: copy.nav.menu },
  { to: "/studio/options", icon: SlidersHorizontal, label: { ar: "خيارات الأصناف", en: "Item options" } },
  { to: "/studio/branches", icon: Building2, label: copy.nav.branches },
  { to: "/studio/brand", icon: Palette, label: copy.nav.brand },
  { to: "/studio/design", icon: Palette, label: { ar: "التصميم", en: "Design" } },
  { to: "/studio/qr", icon: QrCode, label: copy.nav.qr },
  { to: "/studio/analytics", icon: BarChart3, label: copy.nav.analytics },
  { to: "/studio/import", icon: Upload, label: copy.nav.import },
  { to: "/studio/settings", icon: Settings, label: copy.nav.settings },
] as const;

const MOBILE_PRIMARY = ["/studio", "/studio/menu", "/studio/design"] as const;

export function StudioShell() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tenant = snapshot.tenant;
  const [moreOpen, setMoreOpen] = useState(false);
  const publicHref = `/m/${tenant.slug}${snapshot.branches[0] ? `/${snapshot.branches[0].slug}` : ""}`;

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-e border-line lg:flex lg:flex-col">
        <div className="grid gap-1 px-5 py-6">
          <p className="font-display text-lg font-semibold">{t(copy.brand, lang)}</p>
          <p className="truncate text-sm text-muted">{lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}</p>
        </div>
        <nav className="grid gap-1 px-3 pb-6">
          {NAV.map((item) => {
            const active = "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return <Link key={item.to} to={item.to} className={cn("flex h-11 items-center gap-2 rounded-md px-3 text-sm", active ? "bg-ink text-paper" : "text-ink-soft hover:bg-sand")}><Icon className="size-4" />{t(item.label, lang)}</Link>;
          })}
        </nav>
        <div className="mt-auto grid gap-3 border-t border-line p-4">
          <Link to="/studio/preview" className="inline-flex items-center gap-2 text-sm text-ink-soft"><ExternalLink className="size-4" />{t(copy.nav.preview, lang)}</Link>
          {tenant.isPublished ? <a href={publicHref} className="inline-flex items-center gap-2 text-sm text-ink-soft"><ExternalLink className="size-4" />{t(copy.studio.openMenu, lang)}</a> : null}
          <UserButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 lg:px-8">
          <div className="min-w-0"><p className="truncate text-sm font-medium">{lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}</p><p className="text-xs text-muted">{tenant.isPublished ? t(copy.state.published, lang) : t(copy.state.draft, lang)}</p></div>
          <div className="flex items-center gap-2"><LangToggle /><div className="lg:hidden"><UserButton /></div></div>
        </header>
        <div className="flex-1 px-4 py-6 pb-28 lg:px-8"><Outlet /></div>
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 gap-1 border-t border-line bg-paper px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
          {NAV.filter((item) => (MOBILE_PRIMARY as readonly string[]).includes(item.to)).map((item) => {
            const active = "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return <Link key={item.to} to={item.to} className={cn("grid h-12 place-items-center rounded-md text-xs", active ? "bg-ink text-paper" : "text-muted")}><Icon className="size-4" />{t(item.label, lang)}</Link>;
          })}
          <button type="button" onClick={() => setMoreOpen(true)} className={cn("grid h-12 place-items-center rounded-md text-xs", moreOpen || NAV.some((item) => !(MOBILE_PRIMARY as readonly string[]).includes(item.to) && ("exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to))) ? "bg-ink text-paper" : "text-muted")}><Ellipsis className="size-4" />{t(copy.nav.more, lang)}</button>
        </nav>
      </div>

      {moreOpen ? <div className="fixed inset-0 z-40 lg:hidden">
        <button type="button" className="absolute inset-0 bg-ink/40" aria-label={t(copy.studio.cancel, lang)} onClick={() => setMoreOpen(false)} />
        <div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="mb-3 text-sm font-medium">{t(copy.nav.more, lang)}</p>
          <div className="grid grid-cols-3 gap-2">
            {NAV.filter((item) => !(MOBILE_PRIMARY as readonly string[]).includes(item.to)).map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.to);
              return <Link key={item.to} to={item.to} onClick={() => setMoreOpen(false)} className={cn("grid h-20 place-items-center gap-1 rounded-lg border border-line text-xs", active ? "bg-ink text-paper" : "bg-paper text-ink-soft")}><Icon className="size-4" />{t(item.label, lang)}</Link>;
            })}
            <Link to="/studio/preview" onClick={() => setMoreOpen(false)} className="grid h-20 place-items-center gap-1 rounded-lg border border-line text-xs text-ink-soft"><ExternalLink className="size-4" />{t(copy.nav.preview, lang)}</Link>
          </div>
        </div>
      </div> : null}
    </div>
  );
}
