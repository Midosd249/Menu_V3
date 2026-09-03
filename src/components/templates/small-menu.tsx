import { MenuMedia } from "@/components/menu";
import { LangToggle } from "@/components/lang-toggle";
import { PublicMenuView } from "@/components/public-menu";
import { useLang } from "@/lib/lang";
import type { Lang, PublicMenu } from "@/lib/menu/types";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

export function SmallMenuTemplate({ menu, preview = false }: { menu: PublicMenu; preview?: boolean }) {
  const { lang } = useLang();
  const { tenant, branch, categories } = menu;
  const categoryCount = categories.filter((category) => category.isActive).length;
  const title = text(lang, tenant.nameAr, tenant.nameEn);
  const concept = text(lang, "قائمة مختصرة. اختيار أسرع.", "A focused menu. Faster choices.");

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {tenant.logoUrl ? (
              <MenuMedia src={tenant.logoUrl} className="size-12 shrink-0 rounded-xl" />
            ) : (
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink text-lg font-black text-paper" aria-hidden>
                {title.slice(0, 1)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{branch.city || tenant.city}</p>
              <h1 className="truncate font-display text-xl font-black">{title}</h1>
            </div>
          </div>
          <LangToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-10 pt-5 sm:px-6">
        <section className="rounded-2xl bg-ink px-5 py-6 text-paper shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/60">{text(lang, "منيو مركز", "Focused menu")}</p>
          <h2 className="mt-2 max-w-lg text-2xl font-black leading-tight sm:text-3xl">{concept}</h2>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-paper/75">
            <span className="rounded-full border border-paper/20 px-3 py-1.5">{categoryCount} {text(lang, "أقسام", "sections")}</span>
            {tenant.taglineAr || tenant.taglineEn ? <span className="rounded-full border border-paper/20 px-3 py-1.5">{text(lang, tenant.taglineAr, tenant.taglineEn)}</span> : null}
          </div>
        </section>

        <section className="mt-6">
          <PublicMenuView menu={menu} preview={preview} />
        </section>
      </main>
    </div>
  );
}
