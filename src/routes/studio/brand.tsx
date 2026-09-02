import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Flash } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { compressImageFile } from "@/lib/menu/image";
import { copy, t } from "@/lib/menu/i18n";
import { updateTenant } from "@/lib/menu/owner";
import { useStudio, useStudioFlash } from "@/lib/menu/studio";

export const Route = createFileRoute("/studio/brand")({ component: BrandPage });

function BrandPage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const flash = useStudioFlash();
  const tenant = snapshot.tenant;
  const [form, setForm] = useState({
    nameAr: tenant.nameAr,
    nameEn: tenant.nameEn,
    taglineAr: tenant.taglineAr,
    taglineEn: tenant.taglineEn,
    city: tenant.city,
    whatsapp: tenant.whatsapp,
    whatsappTemplate: tenant.whatsappTemplate,
    instagramUrl: tenant.instagramUrl,
    logoUrl: tenant.logoUrl,
    coverUrl: tenant.coverUrl,
    primaryColor: tenant.primaryColor,
    accentColor: tenant.accentColor,
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onFile(key: "logoUrl" | "coverUrl", file: File | null) {
    if (!file) return;
    try {
      set(key, await compressImageFile(file));
    } catch (err) {
      flash.setError(err instanceof Error ? err.message : t(copy.state.error, lang));
    }
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t(copy.nav.brand, lang)}</h1>
        <p className="text-sm text-muted">{lang === "ar" ? "ما يراه الضيف في رأس المنيو." : "What guests see at the top of the menu."}</p>
      </div>
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void flash.run(() => updateTenant({ data: { ...form } }));
        }}
      >
        <Field label={t(copy.studio.nameAr, lang)}>
          <Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} required />
        </Field>
        <Field label={t(copy.studio.nameEn, lang)}>
          <Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
        </Field>
        <Field label={t(copy.studio.descAr, lang)}>
          <Input value={form.taglineAr} onChange={(e) => set("taglineAr", e.target.value)} />
        </Field>
        <Field label={t(copy.studio.descEn, lang)}>
          <Input value={form.taglineEn} onChange={(e) => set("taglineEn", e.target.value)} />
        </Field>
        <Field label={t(copy.studio.city, lang)}>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label={t(copy.studio.whatsapp, lang)}>
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} inputMode="tel" placeholder="9665XXXXXXXX" />
        </Field>
        <Field label={t(copy.studio.whatsappTpl, lang)}>
          <Textarea value={form.whatsappTemplate} onChange={(e) => set("whatsappTemplate", e.target.value)} />
        </Field>
        <Field label={t(copy.studio.instagram, lang)}>
          <Input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t(copy.studio.primaryColor, lang)}>
            <Input type="color" value={form.primaryColor || "#171411"} onChange={(e) => set("primaryColor", e.target.value)} />
          </Field>
          <Field label={t(copy.studio.accentColor, lang)}>
            <Input type="color" value={form.accentColor || "#8f4e32"} onChange={(e) => set("accentColor", e.target.value)} />
          </Field>
        </div>
        <Field label={t(copy.studio.logoUrl, lang)}>
          <Input value={form.logoUrl.startsWith("data:") ? "" : form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} />
        </Field>
        <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-line text-sm">
          {lang === "ar" ? "رفع شعار" : "Upload logo"}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => void onFile("logoUrl", e.target.files?.[0] ?? null)} />
        </label>
        {form.logoUrl ? <img src={form.logoUrl} alt="" className="size-20 rounded-md object-cover" /> : null}
        <Field label={t(copy.studio.coverUrl, lang)}>
          <Input value={form.coverUrl.startsWith("data:") ? "" : form.coverUrl} onChange={(e) => set("coverUrl", e.target.value)} />
        </Field>
        <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-line text-sm">
          {lang === "ar" ? "رفع غلاف" : "Upload cover"}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => void onFile("coverUrl", e.target.files?.[0] ?? null)} />
        </label>
        {form.coverUrl ? <img src={form.coverUrl} alt="" className="h-32 w-full rounded-md object-cover" /> : null}
        <Flash error={flash.error} ok={flash.ok} />
        <Button type="submit" disabled={flash.busy}>
          {flash.busy ? t(copy.state.loading, lang) : t(copy.studio.save, lang)}
        </Button>
      </form>
    </div>
  );
}
