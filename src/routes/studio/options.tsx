import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
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
import type { ModifierGroup, ProductVariant, ModifierOption } from "@/lib/menu/types";
import { cn, formatSar } from "@/lib/utils";

export const Route = createFileRoute("/studio/options")({ component: OptionsPage });

type VariantDraft = { id?: string; nameAr: string; nameEn: string; price: string; isAvailable: boolean };
type GroupDraft = { id?: string; nameAr: string; nameEn: string; minSelect: string; maxSelect: string; isRequired: boolean };
type OptionDraft = { id?: string; groupId: string; nameAr: string; nameEn: string; priceDelta: string; isAvailable: boolean };

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

  async function saveVariant() {
    if (!variantDraft || !productId) return;
    const result = await flash.run(() => saveProductVariant({
      data: {
        id: variantDraft.id,
        productId,
        nameAr: variantDraft.nameAr.trim(),
        nameEn: variantDraft.nameEn.trim(),
        price: Number(variantDraft.price),
        isAvailable: variantDraft.isAvailable,
      },
    }));
    if (result) { setVariantDraft(null); await refresh(); }
  }

  async function saveGroup() {
    if (!groupDraft) return;
    const minSelect = Number(groupDraft.minSelect);
    const maxSelect = Number(groupDraft.maxSelect);
    const result = await flash.run(() => saveModifierGroup({ data: {
      id: groupDraft.id, nameAr: groupDraft.nameAr.trim(), nameEn: groupDraft.nameEn.trim(),
      minSelect, maxSelect, isRequired: groupDraft.isRequired,
    } }));
    if (result) { setGroupDraft(null); await loadGroups(); }
  }

  async function saveOption() {
    if (!optionDraft) return;
    const result = await flash.run(() => saveModifierOption({ data: {
      id: optionDraft.id, groupId: optionDraft.groupId, nameAr: optionDraft.nameAr.trim(),
      nameEn: optionDraft.nameEn.trim(), priceDelta: Number(optionDraft.priceDelta), isAvailable: optionDraft.isAvailable,
    } }));
    if (result) { setOptionDraft(null); await refresh(); }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-6">
      <header className="grid gap-2">
        <p className="text-sm font-medium text-accent">{lang === "ar" ? "تجربة المنيو" : "Menu experience"}</p>
        <h1 className="font-display text-3xl font-semibold">{lang === "ar" ? "أحجام وإضافات الأصناف" : "Variants & add-ons"}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          {lang === "ar" ? "أنشئ أحجاماً وإضافات قابلة لإعادة الاستخدام، واربطها بكل صنف دون إدخال منطق الطلبات بعد." : "Create reusable sizes and add-ons, then attach them to each item without coupling the menu to ordering yet."}
        </p>
      </header>

      <Flash error={flash.error} ok={flash.ok} />

      <section className="grid gap-3 rounded-2xl border border-line bg-paper p-4">
        <Field label={lang === "ar" ? "الصنف" : "Product"}>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm">
            {snapshot.products.map((p) => <option key={p.id} value={p.id}>{lang === "ar" ? p.nameAr : p.nameEn || p.nameAr}</option>)}
          </select>
        </Field>
        {product ? <p className="text-xs text-muted">{product.isAvailable ? (lang === "ar" ? "الصنف متاح" : "Item available") : (lang === "ar" ? "الصنف غير متاح" : "Item unavailable")}</p> : null}
      </section>

      <section className="grid gap-4 rounded-2xl border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><h2 className="font-semibold">{lang === "ar" ? "الأحجام / المتغيرات" : "Sizes / variants"}</h2><p className="text-xs text-muted">{variants.length} {lang === "ar" ? "متغير" : "variants"}</p></div>
          <Button type="button" onClick={() => setVariantDraft({ nameAr: "", nameEn: "", price: product ? String(product.price) : "0", isAvailable: true })}><Plus className="size-4" />{lang === "ar" ? "إضافة حجم" : "Add variant"}</Button>
        </div>
        <div className="grid gap-2">
          {variants.map((v) => <div key={v.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-line p-3">
            <div className="min-w-0 flex-1"><p className="font-medium">{lang === "ar" ? v.nameAr : v.nameEn || v.nameAr}</p><p className="text-sm text-accent">{formatSar(v.price, lang)}</p></div>
            <Button type="button" size="sm" variant="outline" onClick={() => setVariantDraft({ id: v.id, nameAr: v.nameAr, nameEn: v.nameEn, price: String(v.price), isAvailable: v.isAvailable })}>{lang === "ar" ? "تعديل" : "Edit"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={async () => { const ok = await flash.run(() => deleteProductVariant({ data: { id: v.id, productId } })); if (ok) await refresh(); }}><Trash2 className="size-4" /></Button>
          </div>)}
          {!variants.length ? <p className="text-sm text-muted">{lang === "ar" ? "لا توجد أحجام بعد." : "No variants yet."}</p> : null}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><h2 className="font-semibold">{lang === "ar" ? "مجموعات الإضافات" : "Modifier groups"}</h2><p className="text-xs text-muted">{lang === "ar" ? "مثل: الحليب، الإضافات، مستوى السكر" : "For example: milk, toppings, sugar level"}</p></div>
          <Button type="button" onClick={() => setGroupDraft({ nameAr: "", nameEn: "", minSelect: "0", maxSelect: "1", isRequired: false })}><Plus className="size-4" />{lang === "ar" ? "مجموعة جديدة" : "New group"}</Button>
        </div>

        <div className="grid gap-3">
          {groups.map((g) => {
            const attachedOptions = options.filter((o) => o.groupId === g.id);
            return <article key={g.id} className="grid gap-3 rounded-xl border border-line p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><p className="font-medium">{lang === "ar" ? g.nameAr : g.nameEn || g.nameAr}</p><p className="text-xs text-muted">{g.minSelect}–{g.maxSelect} {g.isRequired ? (lang === "ar" ? "مطلوب" : "required") : ""}</p></div>
                <div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => setOptionDraft({ groupId: g.id, nameAr: "", nameEn: "", priceDelta: "0", isAvailable: true })}><Plus className="size-4" />{lang === "ar" ? "إضافة" : "Add"}</Button><Button type="button" size="sm" variant="ghost" onClick={async () => { const ok = await flash.run(() => detachModifierGroup({ data: { productId, groupId: g.id } })); if (ok) await refresh(); }}>{lang === "ar" ? "فك" : "Detach"}</Button></div>
              </div>
              <div className="grid gap-2">
                {attachedOptions.map((o) => <div key={o.id} className="flex items-center gap-2 rounded-lg bg-sand px-3 py-2 text-sm"><span className="min-w-0 flex-1">{lang === "ar" ? o.nameAr : o.nameEn || o.nameAr}</span><span className="text-accent">{o.priceDelta === 0 ? "—" : `${o.priceDelta > 0 ? "+" : ""}${formatSar(o.priceDelta, lang)}`}</span><Button type="button" size="sm" variant="ghost" onClick={async () => { const ok = await flash.run(() => deleteModifierOption({ data: { id: o.id, groupId: g.id } })); if (ok) await refresh(); }}><Trash2 className="size-4" /></Button></div>)}
                {!attachedOptions.length ? <p className="text-xs text-muted">{lang === "ar" ? "لا توجد إضافات." : "No options yet."}</p> : null}
              </div>
            </article>;
          })}
        </div>

        <div className="grid gap-2 rounded-xl bg-sand p-3">
          <p className="text-sm font-medium">{lang === "ar" ? "ربط مجموعة موجودة" : "Attach an existing group"}</p>
          <div className="flex flex-wrap gap-2">
            {allGroups.filter((g) => !groups.some((x) => x.id === g.id)).map((g) => <Button key={g.id} type="button" size="sm" variant="outline" onClick={async () => { const ok = await flash.run(() => attachModifierGroup({ data: { productId, groupId: g.id } })); if (ok) await refresh(); }}>{lang === "ar" ? g.nameAr : g.nameEn || g.nameAr}</Button>)}
            {!allGroups.filter((g) => !groups.some((x) => x.id === g.id)).length ? <p className="text-xs text-muted">{lang === "ar" ? "لا توجد مجموعات أخرى." : "No other groups available."}</p> : null}
          </div>
        </div>
      </section>

      {variantDraft ? <Sheet title={variantDraft.id ? (lang === "ar" ? "تعديل حجم" : "Edit variant") : (lang === "ar" ? "حجم جديد" : "New variant")} onClose={() => setVariantDraft(null)}><div className="grid gap-3"><Field label={lang === "ar" ? "الاسم بالعربية" : "Arabic name"}><Input value={variantDraft.nameAr} onChange={(e) => setVariantDraft({ ...variantDraft, nameAr: e.target.value })} /></Field><Field label={lang === "ar" ? "الاسم بالإنجليزية" : "English name"}><Input value={variantDraft.nameEn} onChange={(e) => setVariantDraft({ ...variantDraft, nameEn: e.target.value })} /></Field><Field label={lang === "ar" ? "السعر" : "Price"}><Input inputMode="decimal" value={variantDraft.price} onChange={(e) => setVariantDraft({ ...variantDraft, price: e.target.value })} /></Field><label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={variantDraft.isAvailable} onChange={(e) => setVariantDraft({ ...variantDraft, isAvailable: e.target.checked })} />{lang === "ar" ? "متاح" : "Available"}</label><Button type="button" disabled={flash.busy} onClick={() => void saveVariant()}>{lang === "ar" ? "حفظ" : "Save"}</Button></div></Sheet> : null}
      {groupDraft ? <Sheet title={groupDraft.id ? (lang === "ar" ? "تعديل مجموعة" : "Edit group") : (lang === "ar" ? "مجموعة جديدة" : "New group")} onClose={() => setGroupDraft(null)}><div className="grid gap-3"><Field label={lang === "ar" ? "الاسم بالعربية" : "Arabic name"}><Input value={groupDraft.nameAr} onChange={(e) => setGroupDraft({ ...groupDraft, nameAr: e.target.value })} /></Field><Field label={lang === "ar" ? "الاسم بالإنجليزية" : "English name"}><Input value={groupDraft.nameEn} onChange={(e) => setGroupDraft({ ...groupDraft, nameEn: e.target.value })} /></Field><div className="grid grid-cols-2 gap-2"><Field label={lang === "ar" ? "الحد الأدنى" : "Min"}><Input inputMode="numeric" value={groupDraft.minSelect} onChange={(e) => setGroupDraft({ ...groupDraft, minSelect: e.target.value })} /></Field><Field label={lang === "ar" ? "الحد الأقصى" : "Max"}><Input inputMode="numeric" value={groupDraft.maxSelect} onChange={(e) => setGroupDraft({ ...groupDraft, maxSelect: e.target.value })} /></Field></div><label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={groupDraft.isRequired} onChange={(e) => setGroupDraft({ ...groupDraft, isRequired: e.target.checked })} />{lang === "ar" ? "اختيار مطلوب" : "Required"}</label><Button type="button" disabled={flash.busy} onClick={() => void saveGroup()}>{lang === "ar" ? "حفظ" : "Save"}</Button></div></Sheet> : null}
      {optionDraft ? <Sheet title={lang === "ar" ? "إضافة خيار" : "Add option"} onClose={() => setOptionDraft(null)}><div className="grid gap-3"><Field label={lang === "ar" ? "الاسم بالعربية" : "Arabic name"}><Input value={optionDraft.nameAr} onChange={(e) => setOptionDraft({ ...optionDraft, nameAr: e.target.value })} /></Field><Field label={lang === "ar" ? "الاسم بالإنجليزية" : "English name"}><Input value={optionDraft.nameEn} onChange={(e) => setOptionDraft({ ...optionDraft, nameEn: e.target.value })} /></Field><Field label={lang === "ar" ? "فرق السعر" : "Price delta"}><Input inputMode="decimal" value={optionDraft.priceDelta} onChange={(e) => setOptionDraft({ ...optionDraft, priceDelta: e.target.value })} /></Field><label className="flex h-11 items-center gap-2 text-sm"><input type="checkbox" checked={optionDraft.isAvailable} onChange={(e) => setOptionDraft({ ...optionDraft, isAvailable: e.target.checked })} />{lang === "ar" ? "متاح" : "Available"}</label><Button type="button" disabled={flash.busy} onClick={() => void saveOption()}>{lang === "ar" ? "حفظ" : "Save"}</Button></div></Sheet> : null}
    </main>
  );
}
