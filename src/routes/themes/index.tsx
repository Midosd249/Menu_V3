import { ArrowUpLeft, Check, Sparkles } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { MENU_THEMES } from "@/lib/theme";

export const Route = createFileRoute("/themes/")({ component: ThemesPage });

function ThemesPage() {
  const { lang } = useLang();
  return (
    <main className="min-h-dvh bg-paper px-5 py-10 text-ink sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 grid gap-5">
          <Link to="/" className="w-fit text-sm text-muted hover:text-ink">← {lang === "ar" ? "العودة للرئيسية" : "Back home"}</Link>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent"><Sparkles className="size-4" />Menu V3 Visual Themes</div>
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{lang === "ar" ? "اختر شخصية المنيو، لا مجرد لون." : "Choose a menu personality, not just a color."}</h1>
              <p className="max-w-2xl leading-7 text-ink-soft">{lang === "ar" ? "خمسة أنظمة تصميم تستخدم نفس بيانات المطعم، لكن تختلف في الإيقاع، الكثافة، الصور، الحضور البصري وطريقة تقديم الأصناف. جميع الثيمات الحالية متاحة دون بوابة اصطناعية." : "Five design systems use the same restaurant data while differing in rhythm, density, imagery, visual presence, and product presentation. All current themes remain available without an artificial gate."}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-xs text-muted"><Check className="size-3.5 text-good" />{lang === "ar" ? "Mobile-first · RTL · سريع" : "Mobile-first · RTL · Fast"}</span>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MENU_THEMES.map((theme, index) => (
            <article key={theme.key} className="group overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className={`menu-theme-preview ${theme.preview.className}`}>
                <div className="preview-orb" />
                <div className="flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[.18em] opacity-70">{String(index + 1).padStart(2, "0")} · {theme.key}</span><span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-ink">{lang === "ar" ? "متاح" : "Available"}</span></div>
                <strong>{lang === "ar" ? theme.name.ar : theme.name.en}</strong>
              </div>
              <div className="grid gap-4 p-5">
                <div><h2 className="font-semibold">{lang === "ar" ? theme.name.ar : theme.name.en}</h2><p className="mt-1 text-xs font-medium text-accent">{lang === "ar" ? theme.promise.ar : theme.promise.en}</p><p className="mt-2 text-sm leading-6 text-muted">{lang === "ar" ? theme.description.ar : theme.description.en}</p></div>
                <div className="grid grid-cols-2 gap-2 text-xs"><span className="rounded-xl bg-sand px-3 py-2"><b className="block text-ink">{lang === "ar" ? "تقديم الأصناف" : "Product style"}</b>{theme.layout.productCard}</span><span className="rounded-xl bg-sand px-3 py-2"><b className="block text-ink">{lang === "ar" ? "الصور" : "Imagery"}</b>{theme.capabilities.imageFirst ? (lang === "ar" ? "صور أولاً" : "Image-led") : (lang === "ar" ? "مساندة" : "Supporting")}</span></div>
                <div className="flex gap-2"><Link to="/themes/preview" search={{ theme: theme.key }} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-sm font-medium">{lang === "ar" ? "معاينة" : "Preview"}<ArrowUpLeft className="size-4" /></Link><Link to="/" className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-ink text-sm font-medium text-paper">{lang === "ar" ? "اختيار من الرئيسية" : "Choose from home"}</Link></div>
              </div>
            </article>
          ))}
        </section>

        <aside className="mt-8 rounded-2xl border border-line bg-sand/45 p-5 text-sm leading-7 text-ink-soft"><strong className="text-ink">{lang === "ar" ? "ملاحظة" : "Note"}</strong><p>{lang === "ar" ? "التصميم يغيّر تجربة العرض فقط؛ بيانات المطعم، الفروع، الصلاحيات، التحليلات ونظام النشر تبقى ضمن بنية Menu V3 الحالية." : "Themes change presentation only; restaurant data, branches, permissions, analytics, and publishing remain within the existing Menu V3 architecture."}</p></aside>
      </div>
    </main>
  );
}
