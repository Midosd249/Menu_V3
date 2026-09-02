import { ArrowUpLeft, Check } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { MENU_THEMES } from "@/lib/theme";

export const Route = createFileRoute("/themes")({ component: ThemesPage });

const descriptions: Record<string, { ar: string; en: string }> = {
  editorial: { ar: "فخم وهادئ للمطاعم التي تريد هوية تحريرية راقية.", en: "Refined editorial presentation for premium hospitality." },
  "dark-dining": { ar: "تجربة داكنة سينمائية للمطاعم الراقية والعشاء.", en: "Cinematic dark presentation for fine dining." },
  coffee: { ar: "مصمم للمقاهي: سريع، بصري، ومناسب للاختيار السريع.", en: "Fast, visual and compact for specialty coffee." },
  heritage: { ar: "دفء عربي بلمسة تراثية بدون زخرفة زائدة.", en: "Warm Arabic heritage without visual clutter." },
  "fast-casual": { ar: "واضح وسريع للبرجر والبيتزا والمطاعم السريعة.", en: "Clear, energetic and fast for casual concepts." },
  gallery: { ar: "الأطباق هي الأبطال؛ صور كبيرة وشبكة بصرية.", en: "Food-first gallery layout with large visual cards." },
  immersive: { ar: "منيو غامر يبدأ بصورة كبيرة وقصة بصرية.", en: "Immersive, image-led experience with a cinematic entry." },
  minimal: { ar: "نظيف جداً للعلامات التي تريد التركيز على المحتوى.", en: "Quiet, minimal and content-first." },
};

function ThemesPage() {
  const { lang } = useLang();
  return (
    <main className="min-h-dvh bg-paper px-5 py-10 text-ink sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 grid gap-4">
          <Link to="/" className="w-fit text-sm text-muted hover:text-ink">← {lang === "ar" ? "العودة للرئيسية" : "Back home"}</Link>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="grid gap-3">
              <p className="text-sm font-medium text-accent">Menu V3 Visual Themes</p>
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {lang === "ar" ? "اختر شخصية المنيو، لا مجرد لونه." : "Choose a menu personality, not just a color."}
              </h1>
              <p className="max-w-2xl leading-7 text-ink-soft">
                {lang === "ar" ? "ثماني تجارب تصميم مختلفة تعمل على نفس بيانات المطعم. افتح أي قالب لتجربته مباشرة على منيو نَفَس." : "Eight distinct compositions powered by the same restaurant data. Open any theme to preview it on the Nafas demo."}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-xs text-muted"><Check className="size-3.5 text-good" /> {lang === "ar" ? "Mobile-first · RTL · سريع" : "Mobile-first · RTL · Fast"}</span>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MENU_THEMES.map((theme, index) => {
            const d = descriptions[theme.key];
            return (
              <article key={theme.key} className="group overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`menu-theme-preview ${theme.preview.className}`}>
                  <div className="preview-orb" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{lang === "ar" ? theme.name.ar : theme.name.en}</strong>
                </div>
                <div className="grid gap-3 p-5">
                  <div><h2 className="font-semibold">{lang === "ar" ? theme.name.ar : theme.name.en}</h2><p className="mt-1 text-sm leading-6 text-muted">{lang === "ar" ? d.ar : d.en}</p></div>
                  <a href={`/m/nafas?theme=${theme.key}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-paper">{lang === "ar" ? "تجربة القالب" : "Try theme"}<ArrowUpLeft className="size-4" /></a>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
