import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
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
    websiteUrl: tenant.websiteUrl ?? "",
    snapchatUrl: tenant.snapchatUrl ?? "",
    facebookUrl: tenant.facebookUrl ?? "",
    tiktokUrl: tenant.tiktokUrl ?? "",
    vatRegistrationNumber: tenant.vatRegistrationNumber,
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
        <p className="text-sm text-muted">{lang === "ar" ? "هوية المطعم والروابط التي يراها الضيف." : "Restaurant identity and guest-facing links."}</p>
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
        <Field label={lang === "ar" ? "رقم التسجيل في ضريبة القيمة المضافة (اختياري)" : "VAT registration number (optional)"}>
          <Input value={form.vatRegistrationNumber} onChange={(e) => set("vatRegistrationNumber", e.target.value)} inputMode="numeric" placeholder={lang === "ar" ? "اتركه فارغاً إذا لم يكن لديك رقم VAT" : "Leave blank if you do not have a VAT number"} />
        </Field>
        <div className="grid gap-3 rounded-2xl border border-line bg-sand/30 p-4">
          <div>
            <h2 className="text-sm font-semibold">{lang === "ar" ? "روابط الويب والشبكات الاجتماعية" : "Website & social links"}</h2>
            <p className="mt-1 text-xs leading-5 text-muted">{lang === "ar" ? "أضف الروابط الكاملة. ستظهر للضيف فقط عندما تكون صالحة ومهيأة." : "Use full URLs. Guests only see links that are configured and valid."}</p>
          </div>
          <Field label={lang === "ar" ? "الموقع الإلكتروني" : "Website"}>
            <Input value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://example.com" inputMode="url" />
          </Field>
          <Field label={t(copy.studio.instagram, lang)}>
            <Input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." inputMode="url" />
          </Field>
          <Field label={lang === "ar" ? "سناب شات" : "Snapchat"}>
            <Input value={form.snapchatUrl} onChange={(e) => set("snapchatUrl", e.target.value)} placeholder="https://snapchat.com/..." inputMode="url" />
          </Field>
          <Field label={lang === "ar" ? "فيسبوك" : "Facebook"}>
            <Input value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} placeholder="https://facebook.com/..." inputMode="url" />
          </Field>
          <Field label={lang === "ar" ? "تيك توك" : "TikTok"}>
            <Input value={form.tiktokUrl} onChange={(e) => set("tiktokUrl", e.target.value)} placeholder="https://tiktok.com/@..." inputMode="url" />
          </Field>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-paper px-3 py-3 text-xs">
            <span className="text-muted">{lang === "ar" ? "رابط الخريطة يُحفظ لكل فرع حتى يستطيع المطعم وضع موقع مختلف لكل فرع." : "Map links are branch-specific so each location can have its own destination."}</span>
            <Link to="/studio/branches" className="font-semibold underline underline-offset-4">
              {lang === "ar" ? "إدارة الفروع والخريطة" : "Manage branches & map"}
            </Link>
          </div>
        </div>
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
