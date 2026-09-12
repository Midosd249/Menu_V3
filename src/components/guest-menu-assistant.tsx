import { Bot, LoaderCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { askGuestMenuAssistant } from "@/lib/menu/guest-assistant";
import { getGuestSessionId } from "@/lib/menu/session";
import { useLang } from "@/lib/lang";
import type { PublicMenu } from "@/lib/menu/types";
import { Button } from "@/components/ui/button";

const suggestions = {
  ar: ["ما الذي تنصحني به؟", "ما الأصناف المتاحة؟", "ما الخيارات الخفيفة؟"],
  en: ["What do you recommend?", "What is available?", "What are the lighter options?"],
};

export function GuestMenuAssistant({ menu }: { menu: PublicMenu }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ ar: string; en: string; productIds: string[] } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const products = useMemo(() => new Map(menu.products.map((p) => [p.id, p])), [menu.products]);
  const visibleAnswer = lang === "ar" ? answer?.ar : answer?.en;

  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not(:disabled),textarea:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),[tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      (previousActive ?? triggerRef.current)?.focus();
    };
  }, [open]);

  async function ask(value = question) {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    setQuestion(trimmed);
    setLoading(true);
    setError("");
    try {
      const result = await askGuestMenuAssistant({
        data: {
          slug: menu.tenant.slug,
          branchSlug: menu.branch.slug,
          sessionId: getGuestSessionId(),
          lang,
          question: trimmed,
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setAnswer({ ar: result.data.answerAr, en: result.data.answerEn, productIds: result.data.productIds });
      setQuestion("");
    } catch {
      setError(lang === "ar" ? "تعذر تشغيل المساعد حالياً." : "The assistant is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        size="default"
        variant="solid"
        aria-label={lang === "ar" ? "اسأل عن القائمة" : "Ask about the menu"}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-public-menu-assistant-launcher="true"
        onClick={() => { setOpen(true); setError(""); }}
        className="fixed bottom-[calc(7rem+env(safe-area-inset-bottom))] start-4 z-[45] min-h-11 rounded-full px-4 shadow-lg sm:bottom-6"
      >
        <Sparkles aria-hidden="true" />
        {lang === "ar" ? "اسأل عن القائمة" : "Ask the menu"}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6" role="presentation">
          <button className="absolute inset-0 cursor-default bg-black/40" aria-label={lang === "ar" ? "إغلاق" : "Close"} onClick={() => setOpen(false)} />
          <section ref={dialogRef} tabIndex={-1} className="relative flex max-h-[82dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="guest-menu-assistant-title">
            <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-sand text-ink"><Bot aria-hidden="true" /></span>
                <div>
                  <h2 id="guest-menu-assistant-title" className="font-semibold text-ink">{lang === "ar" ? "مساعد القائمة" : "Menu assistant"}</h2>
                  <p className="text-xs text-muted">{lang === "ar" ? "إجابات مبنية على الأصناف المتاحة فقط" : "Answers grounded in available menu items"}</p>
                </div>
              </div>
              <Button ref={closeRef} type="button" size="icon" variant="ghost" aria-label={lang === "ar" ? "إغلاق المساعد" : "Close assistant"} onClick={() => setOpen(false)}><X aria-hidden="true" /></Button>
            </header>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
              {!answer && !loading && !error && (
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-muted">{lang === "ar" ? "اسأل عن الأصناف أو الأسعار أو ما هو متاح. إذا لم تكن المعلومة موجودة في القائمة، سيخبرك المساعد بذلك." : "Ask about items, prices, or availability. If the menu does not contain the information, the assistant will say so."}</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions[lang].map((item) => <button key={item} type="button" onClick={() => void ask(item)} className="rounded-full border border-line px-3 py-2 text-sm text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item}</button>)}
                  </div>
                </div>
              )}

              {answer && (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-sand px-4 py-3 text-sm leading-6 text-ink" dir="auto">{visibleAnswer}</div>
                  {answer.productIds.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted">{lang === "ar" ? "أصناف مرتبطة بالإجابة" : "Related menu items"}</p>
                      <div className="grid gap-2">
                        {answer.productIds.map((id) => {
                          const product = products.get(id);
                          if (!product) return null;
                          return <div key={id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 text-sm"><span dir="auto" className="min-w-0 truncate text-ink">{lang === "ar" ? product.nameAr : product.nameEn || product.nameAr}</span><span className="shrink-0 font-semibold text-ink"><bdi dir="ltr">{product.price} {product.currency}</bdi></span></div>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {loading && <div className="flex items-center gap-2 rounded-2xl bg-sand px-4 py-3 text-sm text-muted" role="status"><LoaderCircle className="animate-spin" aria-hidden="true" />{lang === "ar" ? "أتحقق من القائمة..." : "Checking the menu..."}</div>}
              {error && <div role="alert" className="rounded-2xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm leading-6 text-bad">{error}</div>}
            </div>

            <form className="border-t border-line p-3" onSubmit={(event) => { event.preventDefault(); void ask(); }}>
              <div className="flex items-end gap-2">
                <textarea value={question} onChange={(event) => setQuestion(event.target.value.slice(0, 500))} rows={2} maxLength={500} placeholder={lang === "ar" ? "اكتب سؤالك عن القائمة..." : "Ask about the menu..."} aria-label={lang === "ar" ? "سؤالك" : "Your question"} className="min-h-11 flex-1 resize-none rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
                <Button type="submit" size="icon" disabled={loading || !question.trim()} aria-label={lang === "ar" ? "إرسال السؤال" : "Send question"}><Send aria-hidden="true" /></Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
