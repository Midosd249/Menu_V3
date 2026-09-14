import { Coffee, Flame, Footprints } from "lucide-react";
import { hasHighSalt, type Lang, type Product } from "@/lib/menu/types";

const WALKING_WEIGHT_KG = 70;
const WALKING_EFFORT = 3.3;
const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar : en;

function SaltIcon({ className = "size-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true"><path d="M12 2.8 21 19H3L12 2.8Z" fill="currentColor" opacity=".18" /><path d="M12 2.8 21 19H3L12 2.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M9 13.2h6l-.7 3H9.7l-.7-3Z" fill="currentColor" opacity=".9" /><path d="M9.7 13.2V10h4.6v3.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="11" cy="11" r=".45" fill="currentColor" /><circle cx="13" cy="11" r=".45" fill="currentColor" /></svg>;
}

function walkingMinutes(calories: number) {
  return Math.max(1, Math.round((60 * calories) / (WALKING_EFFORT * WALKING_WEIGHT_KG)));
}

const itemClass = "menu-nutrition-item rounded-xl px-3 py-2 text-xs leading-5";
const valueClass = "bidi-isolate tabular font-semibold";

export function MenuNutritionDisclosure({ product, lang }: { product: Product; lang: Lang }) {
  const walking = product.calories == null ? null : walkingMinutes(product.calories);
  const hasCore = product.calories != null || product.sodiumMg != null || product.caffeineMg != null;
  const hasCaffeine = product.caffeineMg != null;
  if (!hasCore && !product.allergens) return null;

  return <section data-menu-nutrition="true" aria-label={text(lang, "المعلومات الغذائية", "Nutrition information")} className="menu-nutrition-disclosure mt-3 grid gap-2">
    {product.allergens ? <div className={itemClass + " bg-sand text-ink"} dir="auto"><strong>{text(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</div> : null}
    {product.calories != null ? <div className={itemClass + " flex items-center gap-2 bg-sand text-ink"}>
      <Flame className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <span><strong>{text(lang, "السعرات الحرارية:", "Calories:")}</strong> <bdi dir="ltr" className={valueClass}>{product.calories} {text(lang, "سعرة", "kcal")}</bdi></span>
    </div> : null}
    {product.sodiumMg != null ? <div className={itemClass + " flex items-center gap-2 bg-sand text-ink"}>
      <SaltIcon className="size-5 shrink-0 text-accent" />
      <span><strong>{text(lang, "الصوديوم:", "Sodium:")}</strong> <bdi dir="ltr" className={valueClass}>{product.sodiumMg} mg</bdi></span>
    </div> : null}
    {hasCaffeine ? <div className={itemClass + " flex items-center gap-2 bg-sand text-ink"}>
      <Coffee className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <span><strong>{text(lang, "الكافيين:", "Caffeine:")}</strong> <bdi dir="ltr" className={valueClass}>{product.caffeineMg} mg {product.caffeineBasis === "per_100ml" ? text(lang, "لكل 100 مل", "per 100 ml") : text(lang, "لكل كوب", "per cup")}</bdi></span>
    </div> : null}
    {product.sodiumMg != null && hasHighSalt(product) ? <div role="note" className={itemClass + " flex items-start gap-2 bg-bad/10 font-semibold text-bad"}>
      <SaltIcon className="mt-0.5 size-5 shrink-0" />
      <span>{text(lang, "تنبيه: هذا الصنف مرتفع الملح (2000 ملغ صوديوم أو أكثر).", "Salt warning: this item contains 2,000 mg sodium or more.")}</span>
    </div> : null}
    {walking != null ? <div className={itemClass + " flex items-start gap-2 bg-sand text-muted"}>
      <Footprints className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{text(lang, `تقدير تقريبي: ${walking} دقيقة مشي لشخص بوزن 70 كجم.`, `Approximate: ${walking} min walking for a 70 kg adult.`)}<span className="block opacity-75">{text(lang, "محسوبة وفق معادلة وسم النشاط البدني في قوائم الطعام: 70 كجم ومتوسط جهد 3.3. المدة تقديرية وليست ادعاءً صحياً.", "Calculated using the menu physical-activity labeling formula: 70 kg average weight and 3.3 effort factor. The duration is an estimate, not a health claim.")}</span></span>
    </div> : null}
    {hasCaffeine ? <p className="menu-nutrition-note text-[11px] leading-5 text-muted">{text(lang, "يجب ألا يتجاوز استهلاك الفرد البالغ من الكافيين 400 ملغ يومياً.", "Adults should not consume more than 400 mg of caffeine per day.")}</p> : null}
  </section>;
}
