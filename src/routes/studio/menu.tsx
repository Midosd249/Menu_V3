import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { Flash, Sheet } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { compressImageFile } from "@/lib/menu/image";
import { copy, t } from "@/lib/menu/i18n";
import { deleteCategory, deleteProduct, saveCategory, saveProduct, toggleProduct } from "@/lib/menu/owner";
import { useStudio, useStudioFlash } from "@/lib/menu/studio";
import type { Product } from "@/lib/menu/types";
import { cn, formatSar } from "@/lib/utils";

export const Route = createFileRoute("/studio/menu")({ component: MenuStudio });

type ProductDraft = {
  id?: string;
  categoryId: string | null;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: string;
  imageUrl: string;
  calories: string;
  allergens: string;
  isAvailable: boolean;
  isFeatured: boolean;
};

function emptyDraft(categoryId: string | null): ProductDraft {
  return {
    categoryId,
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    price: "",
    imageUrl: "",
    calories: "",
    allergens: "",
    isAvailable: true,
    isFeatured: false,
  };
}

function fromProduct(p: Product): ProductDraft {
  return {
    id: p.id,
    categoryId: p.categoryId,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    descriptionAr: p.descriptionAr,
    descriptionEn: p.descriptionEn,
    price: String(p.price),
    imageUrl: p.imageUrl,
    calories: p.calories == null ? "" : String(p.calories),
    allergens: p.allergens,
    isAvailable: p.isAvailable,
    isFeatured: p.isFeatured,
  };
}

function MenuStudio() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const flash = useStudioFlash();
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [catDraft, setCatDraft] = useState<{ id?: string; nameAr: string; nameEn: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ type: "product" | "category"; id: string } | null>(null);
  const [imageBusy, setImageBusy] = useState(false);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return snapshot.products.filter((p) => {
      if (catFilter !== "all" && p.categoryId !== catFilter) return false;
      if (!q) return true;
      return [p.nameAr, p.nameEn, p.descriptionAr].some((v) => v.toLowerCase().includes(q));
    });
  }, [snapshot.products, catFilter, query]);

  async function saveItem() {
    if (!draft) return;
    const price = Number(draft.price);
    const calories = draft.calories === "" ? null : Number(draft.calories);
    if (!draft.nameAr.trim() || !Number.isFinite(price) || price < 0) {
      flash.setError(lang === "ar" ? "الاسم والسعر مطلوبان" : "Name and price are required");
      return;
    }
    if (calories != null && !Number.isFinite(calories)) {
      flash.setError(lang === "ar" ? "السعرات غير صالحة" : "Calories must be a number");
      return;
    }
    const saved = await flash.run(() =>
      saveProduct({
        data: {
          id: draft.id,
          categoryId: draft.categoryId,
          nameAr: draft.nameAr.trim(),
          nameEn: draft.nameEn.trim(),
          descriptionAr: draft.descriptionAr.trim(),
          descriptionEn: draft.descriptionEn.trim(),
          price,
          imageUrl: draft.imageUrl.trim(),
          calories,
          allergens: draft.allergens.trim(),
          isAvailable: draft.isAvailable,
          isFeatured: draft.isFeatured,
        },
      }),
    );
    if (saved) setDraft(null);
  }

  async function onImage(file: File | null) {
    if (!file || !draft) return;
    setImageBusy(true);
    flash.setError("");
    try {
      const url = await compressImageFile(file);
      setDraft({ ...draft, imageUrl: url });
    } catch (err) {
      flash.setError(err instanceof Error ? err.message : t(copy.state.error, lang));
    } finally {
      setImageBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t(copy.nav.menu, lang)}</h1>
          <p className="text-sm text-muted">
            {snapshot.products.length} {t(copy.studio.products, lang)} · {snapshot.categories.length}{" "}
            {t(copy.studio.categories, lang)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setCatDraft({ nameAr: "", nameEn: "" })}>
            {t(copy.studio.addCategory, lang)}
          </Button>
          <Button type="button" onClick={() => setDraft(emptyDraft(catFilter === "all" ? snapshot.categories[0]?.id ?? null : catFilter))}>
            <Plus className="size-4" />
            {t(copy.studio.addProduct, lang)}
          </Button>
        </div>
      </div>

      <Flash error={flash.error} ok={flash.ok} />

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setCatFilter("all")}
          className={cn("h-10 shrink-0 rounded-full px-3 text-sm", catFilter === "all" ? "bg-ink text-paper" : "bg-sand")}
        >
          {t(copy.menu.all, lang)}
        </button>
        {snapshot.categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCatFilter(c.id)}
            className={cn("h-10 shrink-0 rounded-full px-3 text-sm", catFilter === c.id ? "bg-ink text-paper" : "bg-sand")}
          >
            {lang === "ar" ? c.nameAr : c.nameEn || c.nameAr}
          </button>
        ))}
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(copy.studio.searchItems, lang)}
      />

      {snapshot.categories.length === 0 ? (
        <p className="text-sm text-muted">{lang === "ar" ? "أضف تصنيفاً أولاً، ثم الأصناف." : "Add a category first, then items."}</p>
      ) : null}

      <ul className="grid gap-2">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl border border-line p-2">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt="" className="size-16 shrink-0 rounded-md object-cover" />
            ) : (
              <div className="grid size-16 shrink-0 place-items-center rounded-md bg-sand text-xs text-muted">
                {t(copy.studio.noImage, lang)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 font-medium">
                {lang === "ar" ? p.nameAr : p.nameEn || p.nameAr}
                {p.isFeatured ? <Star className="size-3 text-accent" /> : null}
              </p>
              <p className="text-sm text-accent">{formatSar(p.price, lang)}</p>
              <p className={cn("text-xs", p.isAvailable ? "text-good" : "text-bad")}>
                {p.isAvailable ? t(copy.studio.available, lang) : t(copy.studio.unavailable, lang)}
              </p>
            </div>
            <div className="grid shrink-0 gap-1">
              <Button type="button" size="sm" variant="outline" onClick={() => setDraft(fromProduct(p))}>
                {lang === "ar" ? "تعديل" : "Edit"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={flash.busy}
                onClick={() => void flash.run(() => toggleProduct({ data: { id: p.id, field: "isAvailable", value: !p.isAvailable } }))}
              >
                {p.isAvailable ? t(copy.studio.unavailable, lang) : t(copy.studio.available, lang)}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {catFilter !== "all" ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const c = snapshot.categories.find((x) => x.id === catFilter);
              if (c) setCatDraft({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn });
            }}
          >
            {lang === "ar" ? "تعديل التصنيف" : "Edit category"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setPendingDelete({ type: "category", id: catFilter })}>
            {t(copy.studio.delete, lang)}
          </Button>
        </div>
      ) : null}

      {draft ? (
        <Sheet title={draft.id ? (lang === "ar" ? "تعديل صنف" : "Edit item") : t(copy.studio.addProduct, lang)} onClose={() => setDraft(null)}>
          <div className="grid gap-3">
            <Field label={t(copy.studio.nameAr, lang)}>
              <Input value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} />
            </Field>
            <Field label={t(copy.studio.nameEn, lang)}>
              <Input value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
            </Field>
            <Field label={t(copy.studio.categories, lang)}>
              <select
                className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
                value={draft.categoryId ?? ""}
                onChange={(e) => setDraft({ ...draft, categoryId: e.target.value || null })}
              >
                <option value="">{lang === "ar" ? "بدون تصنيف" : "No category"}</option>
                {snapshot.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === "ar" ? c.nameAr : c.nameEn || c.nameAr}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label={t(copy.studio.price, lang)}>
                <Input inputMode="decimal" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
              </Field>
              <Field label={t(copy.studio.calories, lang)}>
                <Input inputMode="numeric" value={draft.calories} onChange={(e) => setDraft({ ...draft, calories: e.target.value })} />
              </Field>
            </div>
            <Field label={t(copy.studio.descAr, lang)}>
              <Textarea value={draft.descriptionAr} onChange={(e) => setDraft({ ...draft, descriptionAr: e.target.value })} />
            </Field>
            <Field label={t(copy.studio.descEn, lang)}>
              <Textarea value={draft.descriptionEn} onChange={(e) => setDraft({ ...draft, descriptionEn: e.target.value })} />
            </Field>
            <Field label={t(copy.studio.allergens, lang)}>
              <Input value={draft.allergens} onChange={(e) => setDraft({ ...draft, allergens: e.target.value })} />
            </Field>
            <Field label={t(copy.studio.imageUrl, lang)}>
              <Input value={draft.imageUrl.startsWith("data:") ? "" : draft.imageUrl} placeholder="https://..." onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} />
            </Field>
            <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-line text-sm">
              {imageBusy ? t(copy.state.loading, lang) : t(copy.studio.uploadImage, lang)}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => void onImage(e.target.files?.[0] ?? null)} />
            </label>
            <p className="text-xs text-muted">{t(copy.studio.imageHint, lang)}</p>
            {draft.imageUrl ? <img src={draft.imageUrl} alt="" className="h-32 w-full rounded-md object-cover" /> : null}
            <label className="flex h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.isAvailable} onChange={(e) => setDraft({ ...draft, isAvailable: e.target.checked })} />
              {t(copy.studio.available, lang)}
            </label>
            <label className="flex h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.isFeatured} onChange={(e) => setDraft({ ...draft, isFeatured: e.target.checked })} />
              {t(copy.studio.featured, lang)}
            </label>
            <Flash error={flash.error} ok={flash.ok} />
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={flash.busy} onClick={() => void saveItem()}>
                {flash.busy ? t(copy.state.loading, lang) : t(copy.studio.save, lang)}
              </Button>
              {draft.id ? (
                <Button type="button" variant="danger" onClick={() => setPendingDelete({ type: "product", id: draft.id! })}>
                  {t(copy.studio.delete, lang)}
                </Button>
              ) : null}
              <Button type="button" variant="ghost" onClick={() => setDraft(null)}>
                {t(copy.studio.cancel, lang)}
              </Button>
            </div>
          </div>
        </Sheet>
      ) : null}

      {catDraft ? (
        <Sheet title={catDraft.id ? (lang === "ar" ? "تعديل تصنيف" : "Edit category") : t(copy.studio.addCategory, lang)} onClose={() => setCatDraft(null)}>
          <div className="grid gap-3">
            <Field label={t(copy.studio.nameAr, lang)}>
              <Input value={catDraft.nameAr} onChange={(e) => setCatDraft({ ...catDraft, nameAr: e.target.value })} />
            </Field>
            <Field label={t(copy.studio.nameEn, lang)}>
              <Input value={catDraft.nameEn} onChange={(e) => setCatDraft({ ...catDraft, nameEn: e.target.value })} />
            </Field>
            <Button
              type="button"
              disabled={flash.busy || !catDraft.nameAr.trim()}
              onClick={async () => {
                const ok = await flash.run(() =>
                  saveCategory({ data: { id: catDraft.id, nameAr: catDraft.nameAr.trim(), nameEn: catDraft.nameEn.trim() } }),
                );
                if (ok) setCatDraft(null);
              }}
            >
              {t(copy.studio.save, lang)}
            </Button>
          </div>
        </Sheet>
      ) : null}

      {pendingDelete ? (
        <Sheet title={t(copy.studio.confirmDelete, lang)} onClose={() => setPendingDelete(null)}>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="danger"
              disabled={flash.busy}
              onClick={async () => {
                const ok = await flash.run(() =>
                  pendingDelete.type === "product"
                    ? deleteProduct({ data: { id: pendingDelete.id } })
                    : deleteCategory({ data: { id: pendingDelete.id } }),
                );
                if (ok) {
                  setPendingDelete(null);
                  setDraft(null);
                  if (pendingDelete.type === "category") setCatFilter("all");
                }
              }}
            >
              {t(copy.studio.yesDelete, lang)}
            </Button>
            <Button type="button" variant="outline" onClick={() => setPendingDelete(null)}>
              {t(copy.studio.cancel, lang)}
            </Button>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}
