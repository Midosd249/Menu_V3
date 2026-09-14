import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MenuNutritionDisclosure } from "@/components/menu-nutrition-disclosure";
import type { Lang, Product } from "@/lib/menu/types";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar : en;

export function MenuNutritionOverlay({ products, lang }: { products: Product[]; lang: Lang }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let host: HTMLDivElement | null = null;
    const sync = () => {
      if (host && !host.isConnected) host = null;
      const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'));
      const candidate = dialogs.find((dialog) => {
        if (dialog.querySelector('[data-menu-nutrition="true"]')) return false;
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
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      host?.remove();
    };
  }, [products, lang]);

  if (!target || !product) return null;
  return createPortal(<MenuNutritionDisclosure product={product} lang={lang} />, target);
}
