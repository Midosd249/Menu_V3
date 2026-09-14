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

const itemClass = "menu-nutrition-item rounded-xl px-3 py-2 text-xs leading-5";
const valueClass = "bidi-isolate tabular font-semibold";

export function MenuNutritionDisclosure({ product, lang }: { product: Product; lang: Lang }) {
  const walking = product.calories == null ? null : walkingMinutes(product.calories);
  const hasCore = product.calories != null || product.sodiumMg != null || product.caffeineMg != null;
  if (!hasCore && !product.allergens) return null;

  return <section data-menu-nutrition="true" aria-label={text(lang, "المعلومات الغذائية", "Nutrition information")} className="menu-nutrition-disclosure mt-3 grid gap-2">
    {product.allergens ? <div className={itemClass + " bg-sand text-ink"} dir="auto"><strong>{text(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</div> : null}
    {product.calories != null ? <div className={itemClass + " flex items-center gap-2 bg-sand text-ink"}>
      <Flame className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <span><strong>{text(lang, "السعرات الحرارية:", "Calories:")}</strong> <bdi dir="ltr" className={valueClass}>{product.calories} {text(lang, "سعرة", "kcal")}</bdi></span>
    </div> : null}
    {product.sodiumMg != null ? <div className={itemClass + " flex items-center gap-2 bg-sand text-ink"}>
      <SaltIcon className="size-4 shrink-0 text-accent" />
      <span><strong>{text(lang, "الصوديوم:", "Sodium:")}</strong> <bdi dir="ltr" className={valueClass}>{product.sodiumMg} mg</bdi></span>
    </div> : null}
    {product.caffeineMg != null ? <div className={itemClass + " flex items-center gap-2 bg-sand text-ink"}>
      <Coffee className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <span><strong>{text(lang, "الكافيين:", "Caffeine:")}</strong> <bdi dir="ltr" className={valueClass}>{product.caffeineMg} mg</bdi></span>
    </div> : null}
    {product.sodiumMg != null && hasHighSalt(product) ? <div role="note" className={itemClass + " flex items-start gap-2 bg-bad/10 font-semibold text-bad"}>
      <SaltIcon className="mt-0.5 size-4 shrink-0" />
      <span>{text(lang, "تنبيه: هذا الصنف مرتفع الملح (2000 ملغ صوديوم أو أكثر).", "Salt warning: this item has 2,000 mg sodium or more.")}</span>
    </div> : null}
    {walking != null ? <div className={itemClass + " flex items-start gap-2 bg-sand text-muted"}>
      <Footprints className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{text(lang, `تقدير تقريبي: ${walking} دقيقة مشي لشخص بوزن 70 كجم.`, `Approximate: ${walking} min walking for a 70 kg adult.`)}<span className="block opacity-75">{text(lang, "يعتمد على مشي معتدل 3.8 MET ومعادلة MET؛ يختلف حسب الوزن والسرعة والعمر والجنس والحالة الصحية.", "Uses moderate walking at 3.8 MET and the standard MET equation; actual energy use varies by weight, pace, age, sex, and health status.")}</span></span>
    </div> : null}
  </section>;
}
