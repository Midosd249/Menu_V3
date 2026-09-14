import { useMemo, useState } from "react";
import { Plus, Sparkles, Star } from "lucide-react";
import { Flash, Sheet } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { StudioMenuWorkspace } from "@/components/studio-menu-workspace";
import { useLang } from "@/lib/lang";
import { compressImageFile } from "@/lib/menu/image";
import { copy, t } from "@/lib/menu/i18n";
import { generateMenuAi, runMenuQa, type MenuQaResult } from "@/lib/menu/ai";
import { deleteCategory, deleteProduct, saveCategory, saveProduct, toggleProduct } from "@/lib/menu/owner";
import { useStudio, useStudioFlash } from "@/lib/menu/studio";
import type { Product } from "@/lib/menu/types";
import { formatSar } from "@/lib/utils";

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
  sodiumMg: string;
  caffeineMg: string;
  caffeineBasis: "per_100ml" | "per_cup";
  allergens: string;
  isAvailable: boolean;
  isFeatured: boolean;
};

type AiOperation = "description" | "english" | "category" | "tags" | "allergens" | "price";
type AiAllergens = { allergens: string[]; disclaimerAr: string; disclaimerEn: string };
type AiPrice = { price: number | null; cleanedNameAr: string };

function emptyDraft(categoryId: string | null): ProductDraft {
  return { categoryId, nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "", price: "", imageUrl: "", calories: "", sodiumMg: "", caffeineMg: "", caffeineBasis: "per_cup", allergens: "", isAvailable: true, isFeatured: false };
}

function fromProduct(product: Product): ProductDraft {
  return { id: product.id, categoryId: product.categoryId, nameAr: product.nameAr, nameEn: product.nameEn, descriptionAr: product.descriptionAr, descriptionEn: product.descriptionEn, price: String(product.price), imageUrl: product.imageUrl, calories: product.calories == null ? "" : String(product.calories), sodiumMg: product.sodiumMg == null ? "" : String(product.sodiumMg), caffeineMg: product.caffeineMg == null ? "" : String(product.caffeineMg), caffeineBasis: product.caffeineBasis ?? "per_cup", allergens: product.allergens, isAvailable: product.isAvailable, isFeatured: product.isFeatured };
}

export function StudioMenuWorkspacePage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const flash = useStudioFlash();
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [catDraft, setCatDraft] = useState<{ id?: string; nameAr: string; nameEn: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ type: "product" | "category"; id: string } | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState<AiOperation | null>(null);
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [aiAllergens, setAiAllergens] = useState<AiAllergens | null>(null);
  const [aiPrice, setAiPrice] = useState<AiPrice | null>(null);
  const [menuQaBusy, setMenuQaBusy] = useState(false);
  const [menuQa, setMenuQa] = useState<MenuQaResult | null>(null);

  const products = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return snapshot.products.filter((product) => {
      if (catFilter !== "all" && product.categoryId !== catFilter) return false;
      if (availabilityFilter === "available" && !product.isAvailable) return false;
      if (availabilityFilter === "unavailable" && product.isAvailable) return false;
      if (!normalized) return true;
      return [product.nameAr, product.nameEn, product.descriptionAr, product.descriptionEn].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [snapshot.products, catFilter, availabilityFilter, query]);

  async function saveItem() {
    if (!draft) return;
    const price = Number(draft.price);
    const calories = draft.calories === "" ? null : Number(draft.calories);
    const sodiumMg = draft.sodiumMg === "" ? null : Number(draft.sodiumMg);
    const caffeineMg = draft.caffeineMg === "" ? null : Number(draft.caffeineMg);
    if (!draft.nameAr.trim() || !Number.isFinite(price) || price < 0) {
      flash.setError(lang === "ar" ? "الاسم والسعر مطلوبان" : "Name and price are required");
      return;
    }
    if (calories != null && !Number.isFinite(calories)) {
      flash.setError(lang === "ar" ? "السعرات غير صالحة" : "Calories must be a number");
      return;
    }
    if ((sodiumMg != null && (!Number.isFinite(sodiumMg) || sodiumMg < 0)) || (caffeineMg != null && (!Number.isFinite(caffeineMg) || caffeineMg < 0))) {
      flash.setError(lang === "ar" ? "بيانات الإفصاح الغذائي غير صالحة" : "Disclosure values must be non-negative numbers");
      return;
    }
    const saved = await flash.run(() => saveProduct({ data: { id: draft.id, categoryId: draft.categoryId, nameAr: draft.nameAr.trim(), nameEn: draft.nameEn.trim(), descriptionAr: draft.descriptionAr.trim(), descriptionEn: draft.descriptionEn.trim(), price, imageUrl: draft.imageUrl.trim(), calories, sodiumMg, caffeineMg, caffeineBasis: caffeineMg == null ? null : draft.caffeineBasis, allergens: draft.allergens.trim(), isAvailable: draft.isAvailable, isFeatured: draft.isFeatured } }));
    if (saved) setDraft(null);
  }

  async function onImage(file: File | null) {
    if (!file || !draft) return;
    setImageBusy(true);
    flash.setError("");
    try {
      setDraft({ ...draft, imageUrl: await compressImageFile(file) });
    } catch (error) {
      flash.setError(error instanceof Error ? error.message : t(copy.state.error, lang));
    } finally {
      setImageBusy(false);
    }
  }

  async function runAi(operation: AiOperation) {
    if (!draft || aiBusy) return;
    if (!draft.nameAr.trim()) {
      flash.setError(lang === "ar" ? "اكتب اسم المنتج أولاً" : "Enter the product name first");
      return;
    }
    setAiBusy(operation);
    setAiTags([]);
    setAiAllergens(null);
    setAiPrice(null);
    flash.setError("");
    try {
      const result = await generateMenuAi({ data: { operation, nameAr: draft.nameAr.trim(), nameEn: draft.nameEn.trim() || undefined, descriptionAr: draft.descriptionAr.trim() || undefined, descriptionEn: draft.descriptionEn.trim() || undefined, categoryId: draft.categoryId, categoryOptions: snapshot.categories.map((category) => ({ id: category.id, nameAr: category.nameAr, nameEn: category.nameEn })) } });
      if (!result.ok) {
        flash.setError(result.error);
        return;
      }
      const value = result.data;
      if (value.operation === "description") setDraft((current) => current ? { ...current, descriptionAr: value.descriptionAr } : current);
      if (value.operation === "english") setDraft((current) => current ? { ...current, nameEn: value.nameEn, descriptionEn: value.descriptionEn } : current);
      if (value.operation === "category") setDraft((current) => current ? { ...current, categoryId: value.categoryId } : current);
      if (value.operation === "tags") setAiTags(value.tags);
      if (value.operation === "allergens") setAiAllergens({ allergens: value.allergens, disclaimerAr: value.disclaimerAr, disclaimerEn: value.disclaimerEn });
      if (value.operation === "price") setAiPrice({ price: value.price, cleanedNameAr: value.cleanedNameAr });
    } catch (error) {
      flash.setError(error instanceof Error ? error.message : t(copy.state.error, lang));
    } finally {
      setAiBusy(null);
    }
  }

  function applyAiPrice() {
    if (!draft || !aiPrice) return;
    setDraft({ ...draft, nameAr: aiPrice.cleanedNameAr || draft.nameAr, price: aiPrice.price == null ? draft.price : String(aiPrice.price) });
  }

  function applyAiAllergens() {
    if (!draft || !aiAllergens?.allergens.length) return;
    const existing = draft.allergens.split(/[،,;]+/).map((value) => value.trim()).filter(Boolean);
    setDraft({ ...draft, allergens: [...new Set([...existing, ...aiAllergens.allergens])].join("، ") });
  }

  async function reviewMenu() {
    if (menuQaBusy) return;
    setMenuQaBusy(true);
    setMenuQa(null);
    flash.setError("");
    try {
      const result = await runMenuQa();
      if (!result.ok) flash.setError(result.error);
      else setMenuQa(result.data);
    } catch (error) {
      flash.setError(error instanceof Error ? error.message : t(copy.state.error, lang));
    } finally {
      setMenuQaBusy(false);
    }
  }

  const addProduct = () => setDraft(emptyDraft(catFilter === "all" ? snapshot.categories[0]?.id ?? null : catFilter));
  const addCategory = () => setCatDraft({ nameAr: "", nameEn: "" });
  const editCategory = () => {
    const category = snapshot.categories.find((item) => item.id === catFilter);
    if (category) setCatDraft({ id: category.id, nameAr: category.nameAr, nameEn: category.nameEn });
  };

  return (
    <>
      <StudioMenuWorkspace
        lang={lang}
        snapshot={snapshot}
        products={products}
        query={query}
        catFilter={catFilter}
        availabilityFilter={availabilityFilter}
        menuQaBusy={menuQaBusy}
        onQueryChange={setQuery}
        onCategoryChange={setCatFilter}
        onAvailabilityChange={setAvailabilityFilter}
        onAddProduct={addProduct}
        onAddCategory={addCategory}
        onReviewMenu={() => void reviewMenu()}
        onEditProduct={setDraft ? (product) => setDraft(fromProduct(product)) : undefined}
        onToggleAvailability={(product) => void flash.run(() => toggleProduct({ data: { id: product.id, field: "isAvailable", value: !product.isAvailable } }))}
        onEditCategory={editCategory}
        onDeleteCategory={() => { if (catFilter !== "all") setPendingDelete({ type: "category", id: catFilter }); }}
      />
      <Flash error={flash.error} ok={flash.ok} />

      {draft ? (
        <Sheet title={draft.id ? (lang === "ar" ? "تعديل صنف" : "Edit item") : t(copy.studio.addProduct, lang)} onClose={() => setDraft(null)}>
          <div className="grid gap-3">
            <Field label={t(copy.studio.nameAr, lang)}><Input value={draft.nameAr} onChange={(event) => setDraft({ ...draft, nameAr: event.target.value })} /></Field>
            <div className="rounded-xl border border-line bg-sand/50 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Sparkles className="size-4 text-accent" /><span>{lang === "ar" ? "مساعد الذكاء الاصطناعي" : "AI Assist"}</span></div>
              <p className="mb-3 text-xs text-muted">{lang === "ar" ? "الاقتراحات تُطبّق على المسودة فقط ولا تحفظ تلقائياً." : "Suggestions apply to the draft only and never save automatically."}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["description", "english", "category", "tags", "allergens", "price"] as AiOperation[]).map((operation) => {
                  const labels: Record<AiOperation, string> = { description: lang === "ar" ? "وصف عربي" : "Arabic description", english: lang === "ar" ? "إنشاء الإنجليزية" : "Generate English", category: lang === "ar" ? "اقتراح التصنيف" : "Suggest category", tags: lang === "ar" ? "اقتراح الوسوم" : "Suggest tags", allergens: lang === "ar" ? "اقتراح الحساسية" : "Suggest allergens", price: lang === "ar" ? "استخراج الاسم والسعر" : "Extract name & price" };
                  return <Button key={operation} type="button" variant="outline" disabled={aiBusy !== null} onClick={() => void runAi(operation)}><Sparkles className="size-4" />{aiBusy === operation ? t(copy.state.loading, lang) : labels[operation]}</Button>;
                })}
              </div>
              {aiPrice ? <div className="mt-3 rounded-lg border border-line bg-paper p-3 text-sm"><p className="font-medium">{lang === "ar" ? "الاسم والسعر المستخرجان" : "Extracted name and price"}</p><p className="mt-2">{aiPrice.cleanedNameAr}</p><p className="mt-1">{aiPrice.price == null ? (lang === "ar" ? "السعر غير موجود" : "Price not found") : formatSar(aiPrice.price, lang)}</p><Button type="button" size="sm" className="mt-3" onClick={applyAiPrice}>{lang === "ar" ? "تطبيق على المسودة" : "Apply to draft"}</Button></div> : null}
              {aiTags.length > 0 ? <div className="mt-3 rounded-lg border border-line bg-paper p-3"><p className="mb-2 text-xs font-medium">{lang === "ar" ? "الوسوم المقترحة" : "Suggested tags"}</p><div className="flex flex-wrap gap-2">{aiTags.map((tag) => <span key={tag} className="rounded-full bg-sand px-2.5 py-1 text-xs">{tag}</span>)}</div></div> : null}
              {aiAllergens ? <div className="mt-3 rounded-lg border border-line bg-paper p-3"><p className="mb-2 text-xs font-medium">{lang === "ar" ? "الحساسية المحتملة" : "Potential allergens"}</p>{aiAllergens.allergens.length ? <><div className="flex flex-wrap gap-2">{aiAllergens.allergens.map((allergen) => <span key={allergen} className="rounded-full bg-sand px-2.5 py-1 text-xs">{allergen}</span>)}</div><Button type="button" size="sm" className="mt-3" onClick={applyAiAllergens}>{lang === "ar" ? "إضافة إلى حقل الحساسية" : "Apply to allergen field"}</Button></> : <p className="text-xs text-muted">{lang === "ar" ? "لا توجد معلومات صريحة كافية لاقتراح حساسية." : "There is not enough explicit information to suggest allergens."}</p>}<p className="mt-3 text-[11px] leading-5 text-muted">{lang === "ar" ? aiAllergens.disclaimerAr : aiAllergens.disclaimerEn}</p></div> : null}
            </div>
            <Field label={t(copy.studio.nameEn, lang)}><Input value={draft.nameEn} onChange={(event) => setDraft({ ...draft, nameEn: event.target.value })} /></Field>
            <Field label={t(copy.studio.categories, lang)}><select className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm" value={draft.categoryId ?? ""} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value || null })}><option value="">{lang === "ar" ? "بدون تصنيف" : "No category"}</option>{snapshot.categories.map((category) => <option key={category.id} value={category.id}>{lang === "ar" ? category.nameAr : category.nameEn || category.nameAr}</option>)}</select></Field>
            <div className="grid grid-cols-2 gap-2"><Field label={t(copy.studio.price, lang)}><Input inputMode="decimal" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></Field><Field label={t(copy.studio.calories, lang)}><Input inputMode="numeric" value={draft.calories} onChange={(event) => setDraft({ ...draft, calories: event.target.value })} /></Field></div>
            <div className="grid gap-3 rounded-xl border border-line bg-sand/50 p-3"><div><p className="text-sm font-medium">{lang === "ar" ? "الإفصاح الغذائي السعودي" : "Saudi food disclosure"}</p><p className="mt-1 text-xs leading-5 text-muted">{lang === "ar" ? "أدخل القيم الموثقة فقط. لا تُنشئ Menu V3 قيماً غذائية تلقائياً." : "Enter verified values only. Menu V3 never invents nutrition values."}</p></div><div className="grid grid-cols-2 gap-2"><Field label={lang === "ar" ? "الصوديوم (ملغ)" : "Sodium (mg)"}><Input inputMode="decimal" value={draft.sodiumMg} onChange={(event) => setDraft({ ...draft, sodiumMg: event.target.value })} /></Field><Field label={lang === "ar" ? "الكافيين (ملغ)" : "Caffeine (mg)"}><Input inputMode="decimal" value={draft.caffeineMg} onChange={(event) => setDraft({ ...draft, caffeineMg: event.target.value })} /></Field></div><label className="grid gap-1 text-sm"><span>{lang === "ar" ? "أساس قياس الكافيين" : "Caffeine basis"}</span><select className="h-11 rounded-xl border border-line bg-paper px-3 text-sm" value={draft.caffeineBasis} onChange={(event) => setDraft({ ...draft, caffeineBasis: event.target.value as ProductDraft["caffeineBasis"] })}><option value="per_cup">{lang === "ar" ? "لكل كوب" : "Per cup"}</option><option value="per_100ml">{lang === "ar" ? "لكل 100 مل" : "Per 100 ml"}</option></select></label></div>
            <Field label={t(copy.studio.descAr, lang)}><Textarea value={draft.descriptionAr} onChange={(event) => setDraft({ ...draft, descriptionAr: event.target.value })} /></Field>
            <Field label={t(copy.studio.descEn, lang)}><Textarea value={draft.descriptionEn} onChange={(event) => setDraft({ ...draft, descriptionEn: event.target.value })} /></Field>
            <Field label={t(copy.studio.allergens, lang)}><Input value={draft.allergens} onChange={(event) => setDraft({ ...draft, allergens: event.target.value })} /></Field>
            <Field label={t(copy.studio.imageUrl, lang)}><Input value={draft.imageUrl.startsWith("data:") ? "" : draft.imageUrl} placeholder="https://..." onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} /></Field>
            <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-line text-sm">{imageBusy ? t(copy.state.loading, lang) : t(copy.studio.uploadImage, lang)}<input type="file" accept="image/*" className="sr-only" onChange={(event) => void onImage(event.target.files?.[0] ?? null)} /></label>
            {draft.imageUrl ? <img src={draft.imageUrl} alt="" className="h-32 w-full rounded-md object-cover" /> : null}
            <label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={draft.isAvailable} onChange={(event) => setDraft({ ...draft, isAvailable: event.target.checked })} />{t(copy.studio.available, lang)}</label>
            <label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={draft.isFeatured} onChange={(event) => setDraft({ ...draft, isFeatured: event.target.checked })} />{t(copy.studio.featured, lang)}</label>
            <div className="flex flex-wrap gap-2"><Button type="button" disabled={flash.busy || aiBusy !== null} onClick={() => void saveItem()}>{flash.busy ? t(copy.state.loading, lang) : t(copy.studio.save, lang)}</Button>{draft.id ? <Button type="button" variant="danger" onClick={() => setPendingDelete({ type: "product", id: draft.id! })}>{t(copy.studio.delete, lang)}</Button> : null}<Button type="button" variant="ghost" onClick={() => setDraft(null)}>{t(copy.studio.cancel, lang)}</Button></div>
          </div>
        </Sheet>
      ) : null}

      {catDraft ? <Sheet title={catDraft.id ? (lang === "ar" ? "تعديل تصنيف" : "Edit category") : t(copy.studio.addCategory, lang)} onClose={() => setCatDraft(null)}><div className="grid gap-3"><Field label={t(copy.studio.nameAr, lang)}><Input value={catDraft.nameAr} onChange={(event) => setCatDraft({ ...catDraft, nameAr: event.target.value })} /></Field><Field label={t(copy.studio.nameEn, lang)}><Input value={catDraft.nameEn} onChange={(event) => setCatDraft({ ...catDraft, nameEn: event.target.value })} /></Field><Button type="button" disabled={flash.busy || !catDraft.nameAr.trim()} onClick={async () => { const ok = await flash.run(() => saveCategory({ data: { id: catDraft.id, nameAr: catDraft.nameAr.trim(), nameEn: catDraft.nameEn.trim() } })); if (ok) setCatDraft(null); }}>{t(copy.studio.save, lang)}</Button></div></Sheet> : null}

      {pendingDelete ? <Sheet title={t(copy.studio.confirmDelete, lang)} onClose={() => setPendingDelete(null)}><div className="flex flex-wrap gap-2"><Button type="button" variant="danger" disabled={flash.busy} onClick={async () => { const ok = await flash.run(() => pendingDelete.type === "product" ? deleteProduct({ data: { id: pendingDelete.id } }) : deleteCategory({ data: { id: pendingDelete.id } })); if (ok) { setPendingDelete(null); setDraft(null); if (pendingDelete.type === "category") setCatFilter("all"); } }}>{t(copy.studio.yesDelete, lang)}</Button><Button type="button" variant="outline" onClick={() => setPendingDelete(null)}>{t(copy.studio.cancel, lang)}</Button></div></Sheet> : null}

      {menuQa ? <Sheet title={lang === "ar" ? "مراجعة جودة القائمة" : "Menu quality audit"} onClose={() => setMenuQa(null)}><div className="grid gap-4"><div className="rounded-xl border border-line bg-sand/50 p-4"><div className="flex items-end justify-between gap-3"><div><p className="text-xs text-muted">{lang === "ar" ? "درجة الجودة" : "Quality score"}</p><p className="font-display text-4xl font-semibold">{menuQa.score}<span className="text-base text-muted">/100</span></p></div><p className="text-xs text-muted">{menuQa.analyzedProducts} {lang === "ar" ? "صنفاً تم تحليله" : "products analyzed"}</p></div><p className="mt-3 text-sm leading-6">{lang === "ar" ? menuQa.summaryAr : menuQa.summaryEn}</p></div>{menuQa.issues.length === 0 ? <div className="rounded-xl border border-line p-4 text-sm">{lang === "ar" ? "لم تُكتشف مشكلات تستحق العرض في هذه المراجعة." : "No issues worth surfacing were found in this audit."}</div> : <div className="grid gap-3">{menuQa.issues.map((issue, index) => <article key={`${issue.key}-${index}`} className="rounded-xl border border-line p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-medium">{lang === "ar" ? issue.titleAr : issue.titleEn}</h2><span className="rounded-full bg-sand px-2.5 py-1 text-[11px]">{lang === "en" ? issue.severity : issue.severity === "high" ? "عالية" : issue.severity === "medium" ? "متوسطة" : "منخفضة"}</span></div>{issue.productNameAr ? <p className="mt-1 text-xs text-accent">{issue.productNameAr}</p> : null}<p className="mt-2 text-sm leading-6">{lang === "ar" ? issue.detailsAr : issue.detailsEn}</p><p className="mt-2 text-xs leading-5 text-muted">{lang === "ar" ? "الإجراء المقترح: " : "Recommended action: "}{lang === "ar" ? issue.recommendationAr : issue.recommendationEn}</p></article>)}</div>}<p className="text-[11px] leading-5 text-muted">{lang === "ar" ? "هذه مراجعة جودة محتوى مبنية على بيانات القائمة المحفوظة وليست شهادة سلامة غذائية." : "This is a content-quality review of saved menu data, not a food-safety certification."}</p></div></Sheet> : null}
    </>
  );
}
