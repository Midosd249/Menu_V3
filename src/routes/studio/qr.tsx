import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { useStudio } from "@/lib/menu/studio";
import { MENU_THEMES } from "@/lib/theme";
import { getPublicOrigin } from "@/lib/menu/seo-discovery";

export const Route = createFileRoute("/studio/qr")({ component: QrPage });

const DEFAULT_BATCH_COPIES = 8;
const MAX_BATCH_COPIES = 40;

function menuUrl(origin: string, slug: string, branchSlug: string) {
  return `${origin}/m/${slug}/${branchSlug}?src=qr`;
}

function themePreviewUrl(origin: string, slug: string, branchSlug: string, theme: string) {
  return `${origin}/m/${slug}/${branchSlug}?theme=${encodeURIComponent(theme)}`;
}

function QrPage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [batchCopies, setBatchCopies] = useState<Record<string, number>>({});

  useEffect(() => {
    setOrigin(getPublicOrigin() || window.location.origin);
  }, []);

  const getCopies = (branchId: string) => batchCopies[branchId] ?? DEFAULT_BATCH_COPIES;

  const setCopies = (branchId: string, value: number) => {
    const next = Number.isFinite(value) ? Math.min(MAX_BATCH_COPIES, Math.max(1, Math.round(value))) : DEFAULT_BATCH_COPIES;
    setBatchCopies((current) => ({ ...current, [branchId]: next }));
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t(copy.qr.title, lang)}</h1>
        <p className="text-sm text-muted">{t(copy.qr.hint, lang)}</p>
      </div>
      {snapshot.branches.length === 0 ? (
        <p className="rounded-xl border border-line px-4 py-6 text-sm text-muted">
          {lang === "ar" ? "أضف فرعاً أولاً حتى يتولد رمز QR." : "Add a branch first so a QR destination exists."}
        </p>
      ) : (
        <ul className="grid gap-6">
          {snapshot.branches.map((b) => {
            const url = origin ? menuUrl(origin, snapshot.tenant.slug, b.slug) : "";
            const copies = getCopies(b.id);
            const restaurant = lang === "ar" ? snapshot.tenant.nameAr : snapshot.tenant.nameEn || snapshot.tenant.nameAr;
            const branchName = lang === "ar" ? b.nameAr : b.nameEn || b.nameAr;
            return (
              <li key={b.id} className="grid gap-4 rounded-2xl border border-line bg-paper p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{branchName}</p>
                    <p className="mt-1 break-all text-xs text-muted">{url || "…"}</p>
                  </div>
                  {url ? <QrImage url={url} /> : <div className="size-32 rounded-md bg-sand" />}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard.writeText(url);
                      setCopied(b.id);
                    }}
                    disabled={!url}
                  >
                    {copied === b.id ? t(copy.qr.copied, lang) : t(copy.qr.copy, lang)}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => downloadQr(url, `${snapshot.tenant.slug}-${b.slug}`)}
                    disabled={!url}
                  >
                    {t(copy.qr.download, lang)}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void printQr(url, restaurant, branchName)}
                    disabled={!url}
                  >
                    {t(copy.qr.print, lang)}
                  </Button>
                </div>

                <div className="grid gap-3 rounded-xl border border-line bg-sand/35 p-4">
                  <div>
                    <p className="text-sm font-semibold">{lang === "ar" ? "طباعة عدة رموز" : "Print multiple codes"}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      {lang === "ar"
                        ? "يطبع عدة نسخ من نفس رابط هذا الفرع في ملف واحد، بنفس أسلوب ورقة QR الجاهزة للطباعة."
                        : "Print multiple copies of this exact branch URL in one print job, arranged as a ready-to-print QR sheet."}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex min-h-10 items-center gap-2 rounded-xl border border-line bg-paper px-3 text-sm">
                      <span className="text-muted">{lang === "ar" ? "عدد الرموز" : "Copies"}</span>
                      <input
                        type="number"
                        min={1}
                        max={MAX_BATCH_COPIES}
                        step={1}
                        value={copies}
                        onChange={(event) => setCopies(b.id, Number(event.target.value))}
                        className="h-8 w-16 rounded-lg border border-line bg-paper px-2 text-center text-sm"
                        aria-label={lang === "ar" ? "عدد رموز QR" : "QR copy count"}
                      />
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void printQrBatch(url, restaurant, branchName, copies)}
                      disabled={!url}
                    >
                      {lang === "ar" ? `طباعة ${copies} رمز` : `Print ${copies} codes`}
                    </Button>
                  </div>
                  <p className="text-[11px] leading-5 text-muted">
                    {lang === "ar" ? "الحد الأقصى 40 رمزاً في عملية واحدة. كل الرموز تفتح نفس المنيو والفرع." : "Up to 40 codes per print job. Every code opens the same menu branch."}
                  </p>
                </div>

                <div className="grid gap-3 border-t border-line pt-4">
                  <div>
                    <p className="text-sm font-semibold">{lang === "ar" ? "معاينة الثيمات خارجياً" : "External theme previews"}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      {lang === "ar"
                        ? "كل رمز يفتح نفس بيانات الفرع بهذا التصميم فقط، بدون تغيير الثيم المنشور وبدون اشتراط Premium."
                        : "Each code opens the same branch data in that theme only, without changing the published theme or requiring Premium."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {MENU_THEMES.map((theme) => {
                      const previewUrl = origin ? themePreviewUrl(origin, snapshot.tenant.slug, b.slug, theme.key) : "";
                      return (
                        <div key={theme.key} className="grid gap-2 rounded-lg border border-line bg-paper p-2">
                          <div className="flex items-center justify-between gap-2 text-xs font-medium">
                            <span>{lang === "ar" ? theme.name.ar : theme.name.en}</span>
                            <span className="text-muted">{theme.key}</span>
                          </div>
                          {previewUrl ? <QrImage url={previewUrl} /> : <div className="aspect-square rounded-md bg-sand" />}
                          <div className="flex flex-wrap gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                await navigator.clipboard.writeText(previewUrl);
                                setCopied(`${b.id}:${theme.key}`);
                              }}
                            >
                              {copied === `${b.id}:${theme.key}` ? t(copy.qr.copied, lang) : (lang === "ar" ? "نسخ" : "Copy")}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => downloadQr(previewUrl, `${snapshot.tenant.slug}-${b.slug}-${theme.key}`)}
                            >
                              {lang === "ar" ? "تنزيل" : "Download"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function QrImage({ url }: { url: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let cancelled = false;
    void import("qrcode").then((QR) =>
      QR.toDataURL(url, { width: 480, margin: 2, color: { dark: "#171411", light: "#f3eee6" } }).then((data) => {
        if (!cancelled) setSrc(data);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, [url]);
  if (!src) return <div className="aspect-square w-32 rounded-md bg-sand" />;
  return <img src={src} alt="" className="aspect-square w-32 rounded-md bg-paper object-contain" />;
}

async function downloadQr(url: string, name: string) {
  const QR = await import("qrcode");
  const data = await QR.toDataURL(url, { width: 1024, margin: 2, color: { dark: "#171411", light: "#ffffff" } });
  const a = document.createElement("a");
  a.href = data;
  a.download = `qr-${name}.png`;
  a.click();
}

async function printQr(url: string, restaurant: string, branch: string) {
  const w = window.open("", "menu-v3-qr-print");
  if (!w) return;
  try {
    const QR = await import("qrcode");
    const data = await QR.toDataURL(url, { width: 900, margin: 2, color: { dark: "#171411", light: "#ffffff" } });
    w.document.open();
    w.document.write(singlePrintHtml(data, restaurant, branch));
    w.document.close();
    w.focus();
    w.print();
  } catch {
    w.close();
  }
}

async function printQrBatch(url: string, restaurant: string, branch: string, copies: number) {
  const safeCopies = Math.min(MAX_BATCH_COPIES, Math.max(1, Math.round(copies)));
  const w = window.open("", "menu-v3-qr-batch-print");
  if (!w) return;
  try {
    const QR = await import("qrcode");
    const data = await QR.toDataURL(url, { width: 900, margin: 2, color: { dark: "#171411", light: "#ffffff" } });
    const pages: string[] = [];
    for (let offset = 0; offset < safeCopies; offset += 8) {
      const pageCopies = Math.min(8, safeCopies - offset);
      const cards = Array.from({ length: pageCopies }, (_, index) => {
        const number = String(offset + index + 1).padStart(2, "0");
        return `<article class="qr-card"><img src="${data}" alt="QR"><span class="qr-card-number">#${number}</span><span class="qr-card-hint">امسح لفتح المنيو</span></article>`;
      }).join("");
      pages.push(`<section class="qr-page"><header><strong>${escapeHtml(restaurant)}</strong><span>${escapeHtml(branch)}</span></header><div class="qr-grid">${cards}</div></section>`);
    }
    w.document.open();
    w.document.write(batchPrintHtml(pages.join("")));
    w.document.close();
    w.focus();
    w.print();
  } catch {
    w.close();
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function singlePrintHtml(data: string, restaurant: string, branch: string) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(restaurant)}</title><style>
    @page{size:letter portrait;margin:.45in}
    *{box-sizing:border-box}
    html,body{margin:0;background:#fff;color:#171411;font-family:system-ui,-apple-system,sans-serif}
    body{display:grid;min-height:100vh;place-items:center}
    .sheet{text-align:center;width:100%}
    .sheet img{display:block;width:min(3.4in,82vw);height:auto;margin:0 auto 18px}
    .sheet strong{display:block;font-size:20pt;line-height:1.2}
    .sheet span{display:block;margin-top:5px;font-size:12pt;color:#6e675f}
    .sheet small{display:block;margin-top:18px;font-size:9pt;color:#7a7268}
  </style></head><body><main class="sheet"><img src="${data}" alt="QR"><strong>${escapeHtml(restaurant)}</strong><span>${escapeHtml(branch)}</span><small>امسح لفتح المنيو</small></main></body></html>`;
}

function batchPrintHtml(pages: string) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>QR</title><style>
    @page{size:letter portrait;margin:.35in}
    *{box-sizing:border-box}
    html,body{margin:0;background:#fff;color:#171411;font-family:system-ui,-apple-system,sans-serif}
    .qr-page{height:10.3in;display:grid;grid-template-rows:auto 1fr;gap:.18in;break-after:page}
    .qr-page:last-child{break-after:auto}
    .qr-page header{display:flex;align-items:baseline;justify-content:space-between;gap:.3in;padding:0 .04in .08in;border-bottom:1px solid #ddd6ce}
    .qr-page header strong{font-size:14pt}
    .qr-page header span{font-size:9pt;color:#7a7268}
    .qr-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));gap:.16in}
    .qr-card{display:grid;place-items:center;align-content:center;gap:.06in;min-width:0;break-inside:avoid;border:1px dashed #d8d0c7;border-radius:.06in;padding:.12in;text-align:center}
    .qr-card img{display:block;width:min(2.05in,82%);height:auto;aspect-ratio:1}
    .qr-card-number{font-size:8pt;color:#8a8178}
    .qr-card-hint{font-size:7pt;color:#8a8178}
  </style></head><body>${pages}</body></html>`;
}
