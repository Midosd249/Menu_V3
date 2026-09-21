import { useEffect, useMemo, useState } from "react";
import { ArrowUpLeft, Sparkles } from "lucide-react";
import { getPublicUpsells, recordUpsellEvent, type ApprovedUpsell } from "@/lib/menu/upsell";
import { getGuestSessionId } from "@/lib/menu/session";
import type { Lang, PublicMenu } from "@/lib/menu/types";
import { cn } from "@/lib/utils";

function text(lang: Lang, ar: string, en: string): string {
  return lang === "ar" ? ar || en : en || ar;
}

export function PublicUpsellPanel({ menu, lang, className }: { menu: PublicMenu; lang: Lang; className?: string }) {
  const [items, setItems] = useState<ApprovedUpsell[]>([]);
  const sessionId = useMemo(() => getGuestSessionId(), []);

  useEffect(() => {
    let cancelled = false;
    getPublicUpsells({ data: { slug: menu.tenant.slug, branchSlug: menu.branch.slug } }).then((result) => {
      if (cancelled || !result.ok) return;
      setItems(result.data);
      for (const item of result.data) {
        void recordUpsellEvent({ data: { slug: menu.tenant.slug, branchSlug: menu.branch.slug, productId: item.recommendedProductId, eventType: "upsell_impression", sessionId } });
      }
    });
    return () => { cancelled = true; };
  }, [menu.branch.slug, menu.tenant.slug, sessionId]);

  if (!items.length) return null;

  return (
    <section aria-labelledby="menu-v3-upsell-heading" className={cn("mx-auto w-full max-w-6xl px-4 py-8", className)}>
      <div className="rounded-3xl border border-line bg-paper p-5 shadow-sm md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-sand text-accent" aria-hidden="true"><Sparkles className="size-5" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{text(lang, "اقتراح مبني على الاستخدام", "Evidence-based pairing")}</p>
            <h2 id="menu-v3-upsell-heading" className="mt-1 text-xl font-semibold">{text(lang, "قد يناسب طلبك", "You may also like")}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">{text(lang, "اقتراحات اعتمدها صاحب المطعم بعد مراجعة أنماط التصفح والطلبات. لا تُعرض الاقتراحات غير المعتمدة.", "Suggestions approved by the restaurant owner after reviewing browsing and order patterns. Unapproved recommendations stay hidden.")}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="group flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-4 text-start transition hover:border-accent hover:bg-sand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              onClick={() => {
                void recordUpsellEvent({ data: { slug: menu.tenant.slug, branchSlug: menu.branch.slug, productId: item.recommendedProductId, eventType: "upsell_click", sessionId } });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label={text(lang, `استكشف ${item.recommendedNameAr}`, `Explore ${item.recommendedNameEn}`)}
            >
              <span className="min-w-0">
                <span className="block text-xs text-muted">{text(lang, `مع ${item.sourceNameAr}`, `Pairs with ${item.sourceNameEn}`)}</span>
                <span className="mt-1 block truncate font-medium">{text(lang, item.recommendedNameAr, item.recommendedNameEn)}</span>
              </span>
              <ArrowUpLeft className="size-5 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
