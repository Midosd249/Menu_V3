import { Coffee, Flame, Footprints } from "lucide-react";
import { hasHighSalt, type Lang, type Product } from "@/lib/menu/types";

const WALKING_WEIGHT_KG = 70;
const WALKING_MET = 3.8;
const KCAL_PER_MINUTE = (WALKING_MET * 3.5 * WALKING_WEIGHT_KG) / 200;
const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar : en;

function SaltIcon({ className = "size-4" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 9h8l1 10H7L8 9Z" /><path d="M9 9V6h6v3" /><path d="M10 4h4" /><circle cx="10" cy="6" r=".4" fill="currentColor" stroke="none" /><circle cx="12" cy="6" r=".4" fill="currentColor" stroke="none" /><circle cx="14" cy="6" r=".4" fill="currentColor" stroke="none" /></svg>;
}

function walkingMinutes(calories: number) {
  return Math.max(1, Math.round(calories / KCAL_PER_MINUTE));
}

export function MenuNutritionDisclosure({ product, lang }: { product: Product; lang: Lang }) {
  const walking = product.calories == null ? null : walkingMinutes(product.calories);
  const hasCore = product.calories != null || product.sodiumMg != null || product.caffeineMg != null;
  if (!hasCore && !product.allergens) return null;
  return <section data-menu-nutrition="true" aria-label={text(lang, "المعلومات الغذائية", "Nutrition information")} className="menu-nutrition-disclosure mt-3 grid gap-3 rounded-2xl border border-line bg-sand/60 p-3">
    {hasCore ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {product.calories != null ? <div className="flex min-h-12 items-center gap-2 rounded-xl bg-paper/75 px-3 py-2 text-xs"><Flame className="size-4 shrink-0 text-accent" aria-hidden="true" /><span><span className="block text-muted">{text(lang, "السعرات", "Calories")}</span><bdi dir="ltr" className="tabular bidi-isolate font-semibold">{product.calories} {text(lang, "سعرة", "kcal")}</bdi></span></div> : null}
      {product.sodiumMg != null ? <div className="flex min-h-12 items-center gap-2 rounded-xl bg-paper/75 px-3 py-2 text-xs"><SaltIcon className="size-4 shrink-0 text-accent" /><span><span className="block text-muted">{text(lang, "الصوديوم", "Sodium")}</span><bdi dir="ltr" className="tabular bidi-isolate font-semibold">{product.sodiumMg} mg</bdi></span></div> : null}
      {product.caffeineMg != null ? <div className="flex min-h-12 items-center gap-2 rounded-xl bg-paper/75 px-3 py-2 text-xs"><Coffee className="size-4 shrink-0 text-accent" aria-hidden="true" /><span><span className="block text-muted">{text(lang, "الكافيين", "Caffeine")}</span><bdi dir="ltr" className="tabular bidi-isolate font-semibold">{product.caffeineMg} mg</bdi></span></div> : null}
    </div> : null}
    {product.allergens ? <div className="rounded-xl border border-line bg-paper/55 px-3 py-2 text-xs leading-5" dir="auto"><strong>{text(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</div> : null}
    {product.sodiumMg != null && hasHighSalt(product) ? <p role="note" className="flex items-start gap-2 rounded-xl bg-bad/10 px-3 py-2 text-xs font-semibold leading-5 text-bad"><SaltIcon className="mt-0.5 size-4 shrink-0" /><span>{text(lang, "تنبيه: هذا الصنف مرتفع الملح (2000 ملغ صوديوم أو أكثر).", "Salt warning: this item has 2,000 mg sodium or more.")}</span></p> : null}
    {walking != null ? <p className="flex items-start gap-2 rounded-xl border border-line/70 bg-paper/45 px-3 py-2 text-[11px] leading-5 text-muted"><Footprints className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{text(lang, `تقدير تقريبي: ${walking} دقيقة مشي لشخص بوزن 70 كجم.`, `Approximate: ${walking} min walking for a 70 kg adult.`)}<span className="block opacity-75">{text(lang, "يعتمد على مشي معتدل 3.8 MET ومعادلة MET؛ يختلف حسب الوزن والسرعة والعمر والجنس والحالة الصحية.", "Uses moderate walking at 3.8 MET and the standard MET equation; actual energy use varies by weight, pace, age, sex, and health status.")}</span></span></p> : null}
  </section>;
}
