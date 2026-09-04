import { ArrowUpLeft, Check, Crown, Sparkles } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { MENU_THEMES } from "@/lib/theme";

export const Route = createFileRoute("/themes/")({ component: ThemesPage });

function ThemesPage() {
  const { lang } = useLang();
  return (
    <main className="min-h-dvh bg-paper px-5 py-10 text-ink sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 grid gap-4">
          <Link to="/" className="w-fit text-sm text-muted hover:text-ink">← {lang === "ar" ? "العودة للرئيسية" : "Back home"}</Link>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent"><Sparkles className="size-4" />Menu V3 Visual Themes</div>
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {lang === "ar" ? "خمس شخصيات. خمس تجارب مختلفة." : "Five personalities. Five different experiences."}
              </h1>
              <p className="max-w-2xl leading-7 text-ink-soft">
                {lang === "ar" ? "خمسة أنظمة تصميم كاملة تعمل على نفس بيانات المطعم. واحد مجاني وأربعة Premium صُممت لتبدو كأن مصمماً متخصصاً أعاد بناء المنيو من الصفر." : "Five complete design systems powered by the same restaurant data. One is free and four Premium designs are art-directed to feel like a custom restaurant redesign."}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-xs text-muted"><Check className="size-3.5 text-good" /> {lang === "ar" ? "Mobile-first · RTL · سريع" : "Mobile-first · RTL · Fast"}</span>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MENU_THEMES.map((theme, index) => {
            const premium = theme.tier === "premium";
            return (
              <article key={theme.key} className="group overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`menu-theme-preview ${theme.preview.className}`}>
                  <div className="preview-orb" />
                  <div className="flex items-center justify-between gap-3"><span>{String(index + 1).padStart(2, "0")}</span>{premium ? <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/15 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm"><Crown className="size-3" />Premium</span> : <span className="rounded-full bg-white/75 px-2 py-1 text-[10px] font-semibold text-ink">Free</span>}</div>
                  <strong>{lang === "ar" ? theme.name.ar : theme.name.en}</strong>
                </div>
                <div className="grid gap-3 p-5">
                  <div>
                    <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{lang === "ar" ? theme.name.ar : theme.name.en}</h2>{premium ? <Crown className="size-4 text-accent" /> : null}</div>
                    <p className="mt-1 text-xs font-medium text-accent">{lang === "ar" ? theme.promise.ar : theme.promise.en}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{lang === "ar" ? theme.description.ar : theme.description.en}</p>
                  </div>
                  <Link to="/themes/preview" search={{ theme: theme.key }} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-paper">
                    {lang === "ar" ? "تجربة التصميم" : "Preview design"}
                    <ArrowUpLeft className="size-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
