import { ArrowUpLeft, CheckCircle2, Circle, QrCode, Rocket, UtensilsCrossed } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { useStudio } from "@/lib/menu/studio";
import { MENU_THEMES } from "@/lib/theme";
import { cn } from "@/lib/utils";

type StepState = "done" | "current" | "locked";

export function StudioActivationChecklist() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const { tenant, categories, products } = snapshot;

  const menuReady = categories.some((category) => category.isActive) && products.length > 0;
  const published = tenant.isPublished;
  const currentTheme = MENU_THEMES.find((theme) => theme.key === tenant.themeKey);
  const themeNameAr = currentTheme?.name.ar ?? tenant.themeKey;
  const themeNameEn = currentTheme?.name.en ?? tenant.themeKey;

  const steps: Array<{
    key: string;
    state: StepState;
    titleAr: string;
    titleEn: string;
    bodyAr: string;
    bodyEn: string;
    href: string;
    ctaAr: string;
    ctaEn: string;
  }> = [
    {
      key: "menu",
      state: menuReady ? "done" : "current",
      titleAr: "أضف قائمتك",
      titleEn: "Add your menu",
      bodyAr: menuReady ? "لديك تصنيفات وأصناف جاهزة للعمل." : "ابدأ بتصنيف واحد وصنف واحد على الأقل. يمكنك إضافة الباقي لاحقاً.",
      bodyEn: menuReady ? "You have active categories and menu items ready to use." : "Start with one category and at least one item. You can add the rest later.",
      href: "/studio/menu",
      ctaAr: menuReady ? "مراجعة المنيو" : "إضافة أول صنف",
      ctaEn: menuReady ? "Review menu" : "Add first item",
    },
    {
      key: "design",
      state: "done",
      titleAr: "التصميم جاهز",
      titleEn: "Design is ready",
      bodyAr: "التصميم الحالي: " + themeNameAr + " — يمكنك تغييره في أي وقت.",
      bodyEn: "Current design: " + themeNameEn + ". You can change it anytime.",
      href: "/studio/design",
      ctaAr: "مراجعة التصميم",
      ctaEn: "Review design",
    },
    {
      key: "publish",
      state: published ? "done" : menuReady ? "current" : "locked",
      titleAr: "انشر المنيو",
      titleEn: "Publish the menu",
      bodyAr: published ? "المنيو منشور ويمكن للضيوف الوصول إليه." : menuReady ? "راجع المنيو ثم انشره عندما يكون جاهزاً للضيوف." : "سيصبح النشر متاحاً بعد إضافة محتوى المنيو.",
      bodyEn: published ? "Your menu is published and available to guests." : menuReady ? "Review your menu, then publish when it is ready for guests." : "Publishing comes after you add menu content.",
      href: "/studio/settings",
      ctaAr: published ? "مراجعة النشر" : "مراجعة ونشر",
      ctaEn: published ? "Review publishing" : "Review & publish",
    },
    {
      key: "share",
      state: published ? "current" : "locked",
      titleAr: "شارك قائمتك",
      titleEn: "Share your menu",
      bodyAr: published ? "أنشئ رمز QR وانسخ الرابط لمشاركته مع ضيوفك." : "بعد النشر، ستتمكن من إنشاء QR ومشاركة الرابط.",
      bodyEn: published ? "Create a QR code and copy the link to share with guests." : "After publishing, you can create a QR code and share the link.",
      href: "/studio/qr",
      ctaAr: "فتح QR والمشاركة",
      ctaEn: "Open QR & sharing",
    },
  ];

  const completed = steps.filter((step) => step.state === "done").length;
  const progress = Math.round((completed / steps.length) * 100);
  const primary = steps.find((step) => step.state === "current") ?? steps[steps.length - 1];

  return (
    <section aria-labelledby="studio-activation-title" className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-paper">
              {published ? <QrCode className="size-5" aria-hidden /> : <Rocket className="size-5" aria-hidden />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{lang === "ar" ? "ابدأ من هنا" : "Start here"}</p>
              <h2 id="studio-activation-title" className="mt-1 text-xl font-semibold tracking-tight">
                {published ? (lang === "ar" ? "منيوك جاهز — حان وقت مشاركته" : "Your menu is live — now share it") : (lang === "ar" ? "لنحوّل حسابك إلى منيو جاهز للضيوف" : "Turn your account into a guest-ready menu")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                {lang === "ar" ? "مسار قصير وواضح من دخول الاستديو إلى أول نتيجة فعلية. لا تحتاج لإكمال إعدادات ثانوية قبل أن تبدأ." : "A short path from entering Studio to a real customer-facing result. Secondary settings can wait."}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            {steps.map((step, index) => {
              const canOpen = step.state !== "locked" || step.key === "design";
              return (
                <div key={step.key} className={cn("grid gap-3 rounded-xl border p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center", step.state === "current" ? "border-ink bg-sand/30" : "border-line bg-paper")}>
                  <div className="grid size-8 place-items-center rounded-full border border-line bg-paper" aria-hidden="true">
                    {step.state === "done" ? <CheckCircle2 className="size-5 text-good" /> : <Circle className={cn("size-5", step.state === "current" ? "text-ink" : "text-muted")} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{index + 1} / {steps.length}</p>
                    <p className="mt-0.5 font-medium">{lang === "ar" ? step.titleAr : step.titleEn}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{lang === "ar" ? step.bodyAr : step.bodyEn}</p>
                  </div>
                  {canOpen ? (
                    <Link to={step.href as never} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {lang === "ar" ? step.ctaAr : step.ctaEn}
                      <ArrowUpLeft className="size-4" aria-hidden />
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-10 items-center justify-center px-3 text-xs text-muted">{lang === "ar" ? "بعد الخطوة السابقة" : "After the previous step"}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="grid gap-4 rounded-2xl border border-line bg-sand/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{lang === "ar" ? "التقدم" : "Progress"}</p>
              <p className="mt-1 text-xs text-muted">{completed} / {steps.length} {lang === "ar" ? "مراحل مكتملة" : "steps complete"}</p>
            </div>
            <span className="tabular text-2xl font-semibold">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-paper" role="progressbar" aria-label={lang === "ar" ? "تقدم التفعيل " + progress + "%" : "Activation progress " + progress + "%"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full rounded-full bg-ink" style={{ width: progress + "%" }} />
          </div>
          <div className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <UtensilsCrossed className="size-4" aria-hidden />
              {lang === "ar" ? "الخطوة التالية" : "Next step"}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{lang === "ar" ? primary.bodyAr : primary.bodyEn}</p>
            <Link to={primary.href as never} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-paper hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {lang === "ar" ? primary.ctaAr : primary.ctaEn}
              <ArrowUpLeft className="size-4" aria-hidden />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
