import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MenuNutritionDisclosure } from "@/components/menu-nutrition-disclosure";
import type { Lang, Product } from "@/lib/menu/types";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar : en;

function hideNativeNutrition(dialog: HTMLElement, product: Product, lang: Lang) {
  const allergenLabel = text(lang, "مسببات الحساسية:", "Allergens:");
  const calorieLabel = text(lang, "سعرة حرارية", "calories");
  const sodiumLabel = text(lang, "ملغ صوديوم", "mg sodium");
  const caffeineLabel = text(lang, "ملغ كافيين", "mg caffeine");
  for (const element of Array.from(dialog.querySelectorAll<HTMLElement>("p,div"))) {
    if (element.dataset.menuNutritionHidden === "true" || element.closest("[data-menu-nutrition=\"true\"]")) continue;
    const content = element.textContent?.trim() ?? "";
    const hide = content.includes(allergenLabel) ||
      (product.calories != null && content.includes(String(product.calories)) && content.includes(calorieLabel)) ||
      (product.sodiumMg != null && content.includes(String(product.sodiumMg)) && content.includes(sodiumLabel)) ||
      (product.caffeineMg != null && content.includes(String(product.caffeineMg)) && content.includes(caffeineLabel));
    if (hide) {
      element.dataset.menuNutritionHidden = "true";
      element.hidden = true;
    }
  }
}

export function MenuNutritionOverlay({ products, lang }: { products: Product[]; lang: Lang }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let host: HTMLDivElement | null = null;
    const sync = () => {
      if (host && !host.isConnected) host = null;
      const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'));
      const candidate = dialogs.find((dialog) => {
        const labelledBy = dialog.getAttribute("aria-labelledby");
        const labelled = labelledBy ? document.getElementById(labelledBy) : null;
        const name = labelled?.textContent?.trim() || dialog.querySelector("h1,h2,h3")?.textContent?.trim() || "";
        return products.some((item) => text(lang, item.nameAr, item.nameEn).trim() === name);
      });
      if (!candidate) {
        if (host) host.remove();
        host = null;
        setTarget(null);
        setProduct(null);
        return;
      }
      const labelledBy = candidate.getAttribute("aria-labelledby");
      const labelled = labelledBy ? document.getElementById(labelledBy) : null;
      const name = labelled?.textContent?.trim() || candidate.querySelector("h1,h2,h3")?.textContent?.trim() || "";
      const match = products.find((item) => text(lang, item.nameAr, item.nameEn).trim() === name) ?? null;
      if (!match) return;
      hideNativeNutrition(candidate, match, lang);
      const body = candidate.querySelector<HTMLElement>(".taste-dialog-body, [class*='dialog-body'], .editorial-dialog > div:not(.sticky), section[role='dialog'] > div:last-child") ?? candidate;
      if (!host || host.parentElement !== body) {
        host?.remove();
        host = document.createElement("div");
        host.dataset.menuNutritionHost = "true";
        body.appendChild(host);
      }
      setTarget(host);
      setProduct(match);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["hidden"] });
    return () => {
      observer.disconnect();
      host?.remove();
    };
  }, [products, lang]);

  if (!target || !product) return null;
  return createPortal(<MenuNutritionDisclosure product={product} lang={lang} />, target);
}
