import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Flash, Sheet } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { useStudio, useStudioFlash } from "@/lib/menu/studio";
import { listModifierGroups } from "@/lib/menu/option-groups";
import {
  attachModifierGroup,
  deleteModifierOption,
  deleteProductVariant,
  detachModifierGroup,
  listProductOptions,
  saveModifierGroup,
  saveModifierOption,
  saveProductVariant,
} from "@/lib/menu/options";
import { saveProductMetadata } from "@/lib/menu/product-metadata";
import type { ModifierGroup, ModifierOption, ProductVariant } from "@/lib/menu/types";
import { cn, formatSar } from "@/lib/utils";

export const Route = createFileRoute("/studio/options")({ component: OptionsPage });

type VariantDraft = { id?: string; nameAr: string; nameEn: string; price: string; isAvailable: boolean };
type GroupDraft = { id?: string; nameAr: string; nameEn: string; minSelect: string; maxSelect: string; isRequired: boolean };
type OptionDraft = { id?: string; groupId: string; nameAr: string; nameEn: string; priceDelta: string; isAvailable: boolean };

const splitList = (value: string) => [...new Set(value.split(/[|,،;]/).map((v) => v.trim()).filter(Boolean))].slice(0, 30);

function OptionsPage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const flash = useStudioFlash();
  const [productId, setProductId] = useState(snapshot.products[0]?.id ?? "");
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [groups, setGroups] = useState<ModifierGroup[]>([]);
  const [options, setOptions] = useState<ModifierOption[]>([]);
  const [allGroups, setAllGroups] = useState<ModifierGroup[]>([]);
  const [variantDraft, setVariantDraft] = useState<VariantDraft | null>(null);
  const [groupDraft, setGroupDraft] = useState<GroupDraft | null>(null);
  const [optionDraft, setOptionDraft] = useState<OptionDraft | null>(null);
  const product = useMemo(() => snapshot.products.find((p) => p.id === productId), [snapshot.products, productId]);
  const [tags, setTags] = useState("");
  const [dietary, setDietary] = useState("");

  useEffect(() => {
    if (!product) return;
    setTags(product.tags.join(", "));
    setDietary(product.dietaryLabels.join(", "));
  }, [product]);

  async function refresh() {
    if (!productId) return;
    const result = await listProductOptions({ data: { productId } });
    if (!result.ok) { flash.setError(result.error); return; }
    setVariants(result.data.variants);
    setGroups(result.data.groups);
    setOptions(result.data.options);
  }
  async function loadGroups() {
    const result = await listModifierGroups({ data: {} });
    if (result.ok) setAllGroups(result.data);
  }
  useEffect(() => { void refresh(); void loadGroups(); }, [productId]);

  async function saveMetadata() {
    if (!product) return;
    const result = await flash.run(() => saveProductMetadata({ data: { productId: product.id, tags: splitList(tags), dietaryLabels: splitList(dietary) } }));
    if (result) flash.setOk(lang === "ar" ? "تم حفظ بيانات الصنف" : "Product metadata saved");
  }
  async function saveVariant() {
    if (!variantDraft || !productId) return;
    const price = Number(variantDraft.price);
    if (!variantDraft.nameAr.trim() || !Number.isFinite(price) || price < 0) { flash.setError(lang === "ar" ? "اسم الحجم والسعر مطلوبان" : "Variant name and valid price are required"); return; }
    const result = await flash.run(() => saveProductVariant({ data: { id: variantDraft.id, productId, nameAr: variantDraft.nameAr.trim(), nameEn: variantDraft.nameEn.trim(), price, isAvailable: variantDraft.isAvailable } }));
    if (result) { setVariantDraft(null); await refresh(); }
  }
  async function saveGroup() {
    if (!groupDraft) return;
    const minSelect = Number(groupDraft.minSelect);
    const maxSelect = Number(groupDraft.maxSelect);
    if (!groupDraft.nameAr.trim() || !Number.isInteger(minSelect) || !Number.isInteger(maxSelect) || minSelect < 0 || maxSelect < minSelect) { flash.setError(lang === "ar" ? "تحقق من اسم المجموعة وحدود الاختيار" : "Check the group name and selection limits"); return; }
    const result = await flash.run(() => saveModifierGroup({ data: { id: groupDraft.id, nameAr: groupDraft.nameAr.trim(), nameEn: groupDraft.nameEn.trim(), minSelect, maxSelect, isRequired: groupDraft.isRequired } }));
    if (result) { setGroupDraft(null); await loadGroups(); }
  }
  async function saveOption() {
    if (!optionDraft) return;
    const priceDelta = Number(optionDraft.priceDelta);
    if (!optionDraft.nameAr.trim() || !Number.isFinite(priceDelta)) { flash.setError(lang === "ar" ? "اسم الإضافة والسعر غير صالحين" : "Option name and price are required"); return; }
    const result = await flash.run(() => saveModifierOption({ data: { id: optionDraft.id, groupId: optionDraft.groupId, nameAr: optionDraft.nameAr.trim(), nameEn: optionDraft.nameEn.trim(), priceDelta, isAvailable: optionDraft.isAvailable } }));
    if (result) { setOptionDraft(null); await refresh(); }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-6 pb-10">
      <header className="grid gap-2">
        <p className="text-sm font-medium text-accent">{lang === "ar" ? "تجربة المنيو" : "Menu experience"}</p>
        <h1 className="font-display text-3xl font-semibold">{lang === "ar" ? "تفاصيل الأصناف وخياراتها" : "Product details & options"}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted">{lang === "ar" ? "أدر الأحجام والإضافات والوسوم والتصنيفات الغذائية من مكان واحد. هذه البيانات تظهر للضيف وتبقى مستقلة عن نظام الطلبات." : "Manage sizes, add-ons, tags and dietary labels in one place. This data is guest-facing and independent from ordering."}</p>
      </header>
      <Flash error={flash.error} ok={flash.ok} />

      <section className="grid gap-4 rounded-2xl border border-line bg-paper p-4 shadow-sm">
        <Field label={lang === "ar" ? "الصنف" : "Product"}>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            {snapshot.products.map((p) => <option key={p.id} value={p.id}>{lang === "ar" ? p.nameAr : p.nameEn || p.nameAr}</option>)}
          </select>
        </Field>
        {product ? <div className="grid gap-3 sm:grid-cols-2"><Field label={lang === "ar" ? "الوسوم" : "Tags"}><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder={lang === "ar" ? "قهوة، بارد، مميز" : "coffee, cold, popular"} /><p className="mt-1 text-xs text-muted">{lang === "ar" ? "افصل بين الوسوم بفاصلة." : "Separate tags with commas."}</p></Field><Field label={lang === "ar" ? "التصنيفات الغذائية" : "Dietary labels"}><Input value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder={lang === "ar" ? "نباتي، خالٍ من المكسرات" : "Vegetarian, nut-free"} /></Field><div className="sm:col-span-2"><Button type="button" disabled={flash.busy} onClick={() => void saveMetadata()}><Save className="size-4" />{lang === "ar" ? "حفظ بيانات الصنف" : "Save product details"}</Button></div></div> : null}
      </section>

      <section className="grid gap-4 rounded-2xl border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-semibold">{lang === "ar" ? "الأحجام / المتغيرات" : "Sizes / variants"}</h2><p className="text-xs text-muted">{variants.length} {lang === "ar" ? "متغير" : "variants"}</p></div><Button type="button" onClick={() => setVariantDraft({ nameAr: "", nameEn: "", price: product ? String(product.price) : "0", isAvailable: true })}><Plus className="size-4" />{lang === "ar" ? "إضافة حجم" : "Add variant"}</Button></div>
        <div className="grid gap-2">{variants.map((v) => <div key={v.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-line p-3"><div className="min-w-0 flex-1"><p className="font-medium">{loc(lang, v.nameAr, v.nameEn)}</p><p className="text-sm text-accent">{formatSar(v.price, lang)}</p></div><span className={cn("text-xs", v.isAvailable ? "text-good" : "text-bad")}>{v.isAvailable ? (lang === "ar" ? "متاح" : "Available") : (lang === "ar" ? "غير متاح" : "Unavailable")}</span><Button type="button" size="sm" variant="outline" onClick={() => setVariantDraft({ id: v.id, nameAr: v.nameAr, nameEn: v.nameEn, price: String(v.price), isAvailable: v.isAvailable })}>{lang === "ar" ? "تعديل" : "Edit"}</Button><Button type="button" size="sm" variant="ghost" onClick={async () => { const ok = await flash.run(() => deleteProductVariant({ data: { id: v.id, productId } })); if (ok) await refresh(); }} aria-label={lang === "ar" ? "حذف الحجم" : "Delete variant"}><Trash2 className="size-4" /></Button></div>)}{!variants.length ? <p className="rounded-xl bg-sand p-4 text-sm text-muted">{lang === "ar" ? "لا توجد أحجام بعد." : "No variants yet."}</p> : null}</div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-semibold">{lang === "ar" ? "مجموعات الإضافات" : "Modifier groups"}</h2><p className="text-xs text-muted">{lang === "ar" ? "مثل الحليب، الإضافات، مستوى السكر." : "For milk, toppings, sugar level, and more."}</p></div><Button type="button" onClick={() => setGroupDraft({ nameAr: "", nameEn: "", minSelect: "0", maxSelect: "1", isRequired: false })}><Plus className="size-4" />{lang === "ar" ? "مجموعة جديدة" : "New group"}</Button></div>
        <div className="grid gap-3">{groups.map((g) => { const attached = options.filter((o) => o.groupId === g.id); return <article key={g.id} className="grid gap-3 rounded-xl border border-line p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-medium">{loc(lang, g.nameAr, g.nameEn)}</p><p className="text-xs text-muted">{g.minSelect}–{g.maxSelect}{g.isRequired ? ` · ${lang === "ar" ? "مطلوب" : "required"}` : ""}</p></div><div className="flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" onClick={() => setGroupDraft({ id: g.id, nameAr: g.nameAr, nameEn: g.nameEn, minSelect: String(g.minSelect), maxSelect: String(g.maxSelect), isRequired: g.isRequired })}>{lang === "ar" ? "تعديل المجموعة" : "Edit group"}</Button><Button type="button" size="sm" onClick={() => setOptionDraft({ groupId: g.id, nameAr: "", nameEn: "", priceDelta: "0", isAvailable: true })}><Plus className="size-4" />{lang === "ar" ? "إضافة" : "Add"}</Button><Button type="button" size="sm" variant="ghost" onClick={async () => { const ok = await flash.run(() => detachModifierGroup({ data: { productId, groupId: g.id } })); if (ok) await refresh(); }}>{lang === "ar" ? "فك الربط" : "Detach"}</Button></div></div><div className="grid gap-2">{attached.map((o) => <div key={o.id} className="flex items-center gap-2 rounded-lg bg-sand px-3 py-2 text-sm"><span className="min-w-0 flex-1">{loc(lang, o.nameAr, o.nameEn)}</span><span className="text-accent">{o.priceDelta === 0 ? "—" : `${o.priceDelta > 0 ? "+" : ""}${formatSar(o.priceDelta, lang)}`}</span><Button type="button" size="sm" variant="outline" onClick={() => setOptionDraft({ id: o.id, groupId: g.id, nameAr: o.nameAr, nameEn: o.nameEn, priceDelta: String(o.priceDelta), isAvailable: o.isAvailable })}>{lang === "ar" ? "تعديل" : "Edit"}</Button><Button type="button" size="sm" variant="ghost" onClick={async () => { const ok = await flash.run(() => deleteModifierOption({ data: { id: o.id, groupId: g.id } })); if (ok) await refresh(); }} aria-label={lang === "ar" ? "حذف الإضافة" : "Delete option"}><Trash2 className="size-4" /></Button></div>)}{!attached.length ? <p className="text-xs text-muted">{lang === "ar" ? "لا توجد إضافات مرتبطة." : "No options attached."}</p> : null}</div></article>; })}</div>
        <div className="grid gap-2 rounded-xl bg-sand p-3"><p className="text-sm font-medium">{lang === "ar" ? "ربط مجموعة موجودة" : "Attach an existing group"}</p><div className="flex flex-wrap gap-2">{allGroups.filter((g) => !groups.some((x) => x.id === g.id)).map((g) => <Button key={g.id} type="button" size="sm" variant="outline" onClick={async () => { const ok = await flash.run(() => attachModifierGroup({ data: { productId, groupId: g.id } })); if (ok) await refresh(); }}>{loc(lang, g.nameAr, g.nameEn)}</Button>)}{!allGroups.filter((g) => !groups.some((x) => x.id === g.id)).length ? <p className="text-xs text-muted">{lang === "ar" ? "لا توجد مجموعات أخرى." : "No other groups available."}</p> : null}</div></div>
      </section>

      {variantDraft ? <Sheet title={variantDraft.id ? (lang === "ar" ? "تعديل حجم" : "Edit variant") : (lang === "ar" ? "حجم جديد" : "New variant")} onClose={() => setVariantDraft(null)}><div className="grid gap-3"><Field label={lang === "ar" ? "الاسم بالعربية" : "Arabic name"}><Input value={variantDraft.nameAr} onChange={(e) => setVariantDraft({ ...variantDraft, nameAr: e.target.value })} /></Field><Field label={lang === "ar" ? "الاسم بالإنجليزية" : "English name"}><Input value={variantDraft.nameEn} onChange={(e) => setVariantDraft({ ...variantDraft, nameEn: e.target.value })} /></Field><Field label={lang === "ar" ? "السعر" : "Price"}><Input inputMode="decimal" value={variantDraft.price} onChange={(e) => setVariantDraft({ ...variantDraft, price: e.target.value })} /></Field><label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={variantDraft.isAvailable} onChange={(e) => setVariantDraft({ ...variantDraft, isAvailable: e.target.checked })} />{lang === "ar" ? "متاح" : "Available"}</label><Button type="button" disabled={flash.busy} onClick={() => void saveVariant()}>{lang === "ar" ? "حفظ" : "Save"}</Button></div></Sheet> : null}
      {groupDraft ? <Sheet title={groupDraft.id ? (lang === "ar" ? "تعديل مجموعة" : "Edit group") : (lang === "ar" ? "مجموعة جديدة" : "New group")} onClose={() => setGroupDraft(null)}><div className="grid gap-3"><Field label={lang === "ar" ? "الاسم بالعربية" : "Arabic name"}><Input value={groupDraft.nameAr} onChange={(e) => setGroupDraft({ ...groupDraft, nameAr: e.target.value })} /></Field><Field label={lang === "ar" ? "الاسم بالإنجليزية" : "English name"}><Input value={groupDraft.nameEn} onChange={(e) => setGroupDraft({ ...groupDraft, nameEn: e.target.value })} /></Field><div className="grid grid-cols-2 gap-2"><Field label={lang === "ar" ? "الحد الأدنى" : "Min"}><Input inputMode="numeric" value={groupDraft.minSelect} onChange={(e) => setGroupDraft({ ...groupDraft, minSelect: e.target.value })} /></Field><Field label={lang === "ar" ? "الحد الأقصى" : "Max"}><Input inputMode="numeric" value={groupDraft.maxSelect} onChange={(e) => setGroupDraft({ ...groupDraft, maxSelect: e.target.value })} /></Field></div><label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={groupDraft.isRequired} onChange={(e) => setGroupDraft({ ...groupDraft, isRequired: e.target.checked })} />{lang === "ar" ? "اختيار مطلوب" : "Required"}</label><Button type="button" disabled={flash.busy} onClick={() => void saveGroup()}>{lang === "ar" ? "حفظ" : "Save"}</Button></div></Sheet> : null}
      {optionDraft ? <Sheet title={optionDraft.id ? (lang === "ar" ? "تعديل إضافة" : "Edit option") : (lang === "ar" ? "إضافة جديدة" : "New option")} onClose={() => setOptionDraft(null)}><div className="grid gap-3"><Field label={lang === "ar" ? "الاسم بالعربية" : "Arabic name"}><Input value={optionDraft.nameAr} onChange={(e) => setOptionDraft({ ...optionDraft, nameAr: e.target.value })} /></Field><Field label={lang === "ar" ? "الاسم بالإنجليزية" : "English name"}><Input value={optionDraft.nameEn} onChange={(e) => setOptionDraft({ ...optionDraft, nameEn: e.target.value })} /></Field><Field label={lang === "ar" ? "فرق السعر" : "Price delta"}><Input inputMode="decimal" value={optionDraft.priceDelta} onChange={(e) => setOptionDraft({ ...optionDraft, priceDelta: e.target.value })} /></Field><label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={optionDraft.isAvailable} onChange={(e) => setOptionDraft({ ...optionDraft, isAvailable: e.target.checked })} />{lang === "ar" ? "متاح" : "Available"}</label><Button type="button" disabled={flash.busy} onClick={() => void saveOption()}>{lang === "ar" ? "حفظ" : "Save"}</Button></div></Sheet> : null}
    </main>
  );
}

function loc(lang: "ar" | "en", ar: string, en: string) { return lang === "ar" ? ar || en : en || ar; }
