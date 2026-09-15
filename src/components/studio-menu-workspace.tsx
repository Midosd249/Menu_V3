import { Link } from "@tanstack/react-router";
import { CheckCircle2, Eye, FileUp, Plus, Settings2, SlidersHorizontal, UtensilsCrossed, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy, t } from "@/lib/menu/i18n";
import type { Product, StudioSnapshot } from "@/lib/menu/types";
import { cn, formatSar } from "@/lib/utils";
import type { Lang } from "@/lib/menu/types";

type AvailabilityFilter = "all" | "available" | "unavailable";

type Props = {
  lang: Lang;
  snapshot: StudioSnapshot;
  products: Product[];
  query: string;
  catFilter: string;
  availabilityFilter: AvailabilityFilter;
  menuQaBusy: boolean;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  onAddProduct: () => void;
  onAddCategory: () => void;
  onReviewMenu: () => void;
  onEditProduct: (product: Product) => void;
  onToggleAvailability: (product: Product) => void;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
};

function ActionLink({ to, icon: Icon, label }: { to: "/studio/options" | "/studio/import" | "/studio/preview" | "/studio/qr"; icon: typeof SlidersHorizontal; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line bg-paper px-3 text-sm font-medium text-ink-soft transition hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

export function StudioMenuWorkspace({
  lang,
  snapshot,
  products,
  query,
  catFilter,
  availabilityFilter,
  menuQaBusy,
  onQueryChange,
  onCategoryChange,
  onAvailabilityChange,
  onAddProduct,
  onAddCategory,
  onReviewMenu,
  onEditProduct,
  onToggleAvailability,
  onEditCategory,
  onDeleteCategory,
}: Props) {
  const unavailableCount = snapshot.products.filter((product) => !product.isAvailable).length;
  const attentionCount = snapshot.health.attention.length;
  const publicationLabel = snapshot.tenant.isPublished
    ? lang === "ar" ? "منشور" : "Published"
    : lang === "ar" ? "مسودة" : "Draft";
  const readinessLabel = attentionCount > 0
    ? lang === "ar" ? "يحتاج مراجعة" : "Needs review"
    : lang === "ar" ? "لا توجد ملاحظات" : "No attention items";

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <header className="grid gap-4 rounded-2xl border border-line bg-paper p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              <UtensilsCrossed className="size-4" />
              {lang === "ar" ? "مساحة عمل القائمة" : "Menu Workspace"}
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{t(copy.nav.menu, lang)}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
              {lang === "ar" ? "أدر ما يراه الضيوف، راجع جاهزية القائمة، ونفّذ التغييرات اليومية من مكان واحد." : "Manage what guests see, review menu readiness, and handle daily changes from one focused workspace."}
            </p>
            <p className="mt-2 text-xs text-muted">
              {lang === "ar" ? snapshot.tenant.nameAr : snapshot.tenant.nameEn || snapshot.tenant.nameAr}
              {snapshot.branches[0] ? ` · ${lang === "ar" ? snapshot.branches[0].nameAr : snapshot.branches[0].nameEn || snapshot.branches[0].nameAr}` : ""}
            </p>
          </div>
          <div className="flex w-full min-w-0 max-w-full flex-wrap gap-2 sm:w-auto">
            <Button type="button" variant="outline" disabled={menuQaBusy} onClick={onReviewMenu}>
              {menuQaBusy ? t(copy.state.loading, lang) : lang === "ar" ? "مراجعة القائمة" : "Review menu"}
            </Button>
            <Button type="button" variant="outline" onClick={onAddCategory}>
              {t(copy.studio.addCategory, lang)}
            </Button>
            <Button type="button" onClick={onAddProduct}>
              <Plus className="size-4" />
              {t(copy.studio.addProduct, lang)}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-4">
          <div className="min-w-0">
            <p className="text-xs text-muted">{t(copy.studio.products, lang)}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{snapshot.products.length}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted">{t(copy.studio.categories, lang)}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{snapshot.categories.length}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted">{lang === "ar" ? "غير متاح" : "Unavailable"}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{unavailableCount}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted">{lang === "ar" ? "حالة القائمة" : "Menu state"}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold">
              {snapshot.tenant.isPublished ? <CheckCircle2 className="size-4 text-good" /> : <XCircle className="size-4 text-warn" />}
              <span>{publicationLabel}</span>
              <span className="font-normal text-muted">· {readinessLabel}</span>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label={lang === "ar" ? "أدوات القائمة" : "Menu tools"} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <ActionLink to="/studio/options" icon={SlidersHorizontal} label={lang === "ar" ? "الخيارات" : "Options"} />
        <ActionLink to="/studio/import" icon={FileUp} label={lang === "ar" ? "الاستيراد" : "Import"} />
        <ActionLink to="/studio/preview" icon={Eye} label={lang === "ar" ? "المعاينة" : "Preview"} />
        <ActionLink to="/studio/qr" icon={Settings2} label={lang === "ar" ? "رمز QR" : "QR"} />
      </nav>

      <section aria-labelledby="menu-items-heading" className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="menu-items-heading" className="font-display text-xl font-semibold">{lang === "ar" ? "الأصناف" : "Items"}</h2>
            <p className="text-sm text-muted">{lang === "ar" ? "ابحث، صفِّ حسب التصنيف والتوفر، ثم عدّل الصنف من التدفق الحالي." : "Search, filter by category and availability, then edit items using the existing flow."}</p>
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap justify-end gap-2 sm:flex-none">
            <label className="min-w-[15rem] flex-1 sm:flex-none">
              <span className="sr-only">{t(copy.studio.searchItems, lang)}</span>
              <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={t(copy.studio.searchItems, lang)} aria-label={t(copy.studio.searchItems, lang)} />
            </label>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar" aria-label={lang === "ar" ? "التصنيفات" : "Categories"}>
          <button type="button" onClick={() => onCategoryChange("all")} aria-pressed={catFilter === "all"} className={cn("min-h-10 shrink-0 rounded-full px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", catFilter === "all" ? "bg-ink text-paper" : "bg-sand text-ink-soft")}>{t(copy.menu.all, lang)}</button>
          {snapshot.categories.map((category) => (
            <button key={category.id} type="button" onClick={() => onCategoryChange(category.id)} aria-pressed={catFilter === category.id} className={cn("min-h-10 shrink-0 rounded-full px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", catFilter === category.id ? "bg-ink text-paper" : "bg-sand text-ink-soft")}>{lang === "ar" ? category.nameAr : category.nameEn || category.nameAr}</button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" aria-label={lang === "ar" ? "حالة التوفر" : "Availability"}>
          {(["all", "available", "unavailable"] as AvailabilityFilter[]).map((value) => {
            const label = value === "all" ? lang === "ar" ? "الكل" : "All" : value === "available" ? lang === "ar" ? "متاح" : "Available" : lang === "ar" ? "غير متاح" : "Unavailable";
            return <button key={value} type="button" onClick={() => onAvailabilityChange(value)} aria-pressed={availabilityFilter === value} className={cn("min-h-10 rounded-lg border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", availabilityFilter === value ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft hover:bg-sand")}>{label}</button>;
          })}
        </div>

        {snapshot.categories.length === 0 ? (
          <div className="rounded-2xl border border-line bg-sand/40 p-5">
            <h3 className="font-medium">{lang === "ar" ? "ابدأ ببناء هيكل القائمة" : "Start with your menu structure"}</h3>
            <p className="mt-1 text-sm leading-6 text-muted">{lang === "ar" ? "أضف تصنيفاً أولاً، ثم أنشئ الأصناف داخله. لا توجد بيانات افتراضية معروضة هنا." : "Add a category first, then create items inside it. No sample production data is shown here."}</p>
            <Button type="button" className="mt-3" variant="outline" onClick={onAddCategory}>{t(copy.studio.addCategory, lang)}</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-line p-5">
            <h3 className="font-medium">{lang === "ar" ? "لا توجد أصناف مطابقة" : "No matching items"}</h3>
            <p className="mt-1 text-sm text-muted">{lang === "ar" ? "جرّب تغيير البحث أو الفلاتر، أو أضف صنفاً جديداً." : "Try changing the search or filters, or add a new item."}</p>
            <Button type="button" className="mt-3" variant="outline" onClick={onAddProduct}>{t(copy.studio.addProduct, lang)}</Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead className="bg-sand/40 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-start font-medium">{lang === "ar" ? "الصنف" : "Item"}</th>
                  <th scope="col" className="px-4 py-3 text-start font-medium">{t(copy.studio.categories, lang)}</th>
                  <th scope="col" className="px-4 py-3 text-start font-medium">{t(copy.studio.price, lang)}</th>
                  <th scope="col" className="px-4 py-3 text-start font-medium">{lang === "ar" ? "التوفر" : "Availability"}</th>
                  <th scope="col" className="px-4 py-3 text-end font-medium">{lang === "ar" ? "الإجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const category = snapshot.categories.find((item) => item.id === product.categoryId);
                  return (
                    <tr key={product.id} className="border-t border-line align-middle">
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          {product.imageUrl ? <img src={product.imageUrl} alt="" className="size-12 shrink-0 rounded-lg object-cover" /> : <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-sand text-[10px] text-muted">{t(copy.studio.noImage, lang)}</div>}
                          <div className="min-w-0">
                            <p className="truncate font-medium">{lang === "ar" ? product.nameAr : product.nameEn || product.nameAr}</p>
                            {product.nameAr && product.nameEn && lang === "ar" ? <p dir="ltr" className="truncate text-xs text-muted">{product.nameEn}</p> : null}
                            {product.isFeatured ? <span className="text-[11px] text-accent">{lang === "ar" ? "مميز" : "Featured"}</span> : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{category ? lang === "ar" ? category.nameAr : category.nameEn || category.nameAr : lang === "ar" ? "بدون تصنيف" : "No category"}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium tabular-nums">{formatSar(product.price, lang)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium", product.isAvailable ? "border-good/30 bg-good/10 text-good" : "border-bad/30 bg-bad/10 text-bad")}>
                          {product.isAvailable ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                          {product.isAvailable ? t(copy.studio.available, lang) : t(copy.studio.unavailable, lang)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => onEditProduct(product)}>{lang === "ar" ? "تعديل" : "Edit"}</Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => onToggleAvailability(product)}>{product.isAvailable ? lang === "ar" ? "إخفاء" : "Hide" : lang === "ar" ? "إتاحة" : "Make available"}</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {catFilter !== "all" && snapshot.categories.some((category) => category.id === catFilter) ? (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-sand/30 p-4" aria-label={lang === "ar" ? "إجراءات التصنيف" : "Category actions"}>
          <div>
            <p className="text-sm font-medium">{lang === "ar" ? "إدارة التصنيف الحالي" : "Manage current category"}</p>
            <p className="text-xs text-muted">{lang === "ar" ? "استخدم التدفق الحالي للتعديل أو الحذف." : "Use the existing edit or delete flow."}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onEditCategory}>{lang === "ar" ? "تعديل التصنيف" : "Edit category"}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={onDeleteCategory}>{t(copy.studio.delete, lang)}</Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
