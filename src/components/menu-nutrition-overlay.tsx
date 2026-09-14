import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Coffee, Flame, Footprints, Salt } from "lucide-react";
import type { Lang, Product } from "@/lib/menu/types";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar : en;

function NutritionPanel({ product, lang }: { product: Product; lang: Lang }) {
  const items = [
    product.calories != null ? { icon: Flame, label: text(lang, "السعرات", "Calories"), value: `${product.calories} ${text(lang, "سعرة", "kcal")}` } : null,
    product.sodiumMg != null ? { icon: Salt, label: text(lang, "الصوديوم", "Sodium"), value: `${product.sodiumMg} mg` } : null,
    product.caffeineMg != null ? { icon: Coffee, label: text(lang, "الكافيين", "Caffeine"), value: `${product.caffeineMg} mg` } : null,
  ].filter(Boolean) as Array<{ icon: typeof Flame; label: string; value: string }>;
  if (!items.length && !product.allergens) return null;
  return (
    <section data-menu-nutrition="true" aria-label={text(lang, "المعلومات الغذائية", "Nutrition information")} className="mt-3 grid gap-3 rounded-2xl border border-line bg-sand/60 p-3">
      {items.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => <div key={label} className="flex min-h-12 items-center gap-2 rounded-xl bg-paper/70 px-3 py-2 text-xs"><Icon className="size-4 shrink-0 text-accent" aria-hidden="true" /><span className="min-w-0"><span className="block text-muted">{label}</span><bdi dir="ltr" className="tabular bidi-isolate font-medium">{value}</bdi></span></div>)}
      </div> : null}
      {product.allergens ? <p className="text-xs leading-5" dir="auto"><strong>{text(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</p> : null}
      {product.sodiumMg != null && product.sodiumMg >= 2000 ? <p role="note" className="flex items-center gap-2 text-xs font-medium text-bad"><Salt className="size-4 shrink-0" aria-hidden="true" />{text(lang, "تنبيه: هذا الصنف مرتفع الملح.", "Salt warning: this item is high in salt.")}</p> : null}
      <p className="flex items-center gap-2 text-[11px] leading-5 text-muted"><Footprints className="size-4 shrink-0" aria-hidden="true" />{text(lang, "المشي: لا نعرض مدة حرق تقديرية دون قيمة موثقة للصنف.", "Walking: no estimated burn time is shown without a verified item value.")}</p>
    </section>
  );
}

export function MenuNutritionOverlay({ products, lang }: { products: Product[]; lang: Lang }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    const sync = () => {
      const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'));
      const candidate = dialogs.find((dialog) => {
        const heading = dialog.querySelector("h1,h2,h3");
        if (!heading?.textContent?.trim()) return false;
        return products.some((item) => text(lang, item.nameAr, item.nameEn).trim() === heading.textContent.trim());
      });
      if (!candidate) { setTarget(null); setProduct(null); return; }
      const heading = candidate.querySelector("h1,h2,h3");
      const name = heading?.textContent?.trim() ?? "";
      const match = products.find((item) => text(lang, item.nameAr, item.nameEn).trim() === name) ?? null;
      setTarget(candidate.querySelector(".taste-dialog-body") ?? candidate.querySelector("[class*='dialog-body']") ?? candidate);
      setProduct(match);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [products, lang]);
  if (!target || !product) return null;
  return createPortal(<NutritionPanel product={product} lang={lang} />, target);
}
