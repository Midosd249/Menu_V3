import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { useStudio } from "@/lib/menu/studio";
import { MENU_THEMES } from "@/lib/theme";

export const Route = createFileRoute("/studio/qr")({ component: QrPage });

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

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t(copy.qr.title, lang)}</h1>
        <p className="text-sm text-muted">{t(copy.qr.hint, lang)}</p>
      </div>
      {snapshot.branches.length === 0 ? (
        <p className="rounded-xl border border-line px-4 py-6 text-sm text-muted">
          {lang === "ar" ? "أضف فرعاً أولاً حتى يتولد رمز QR." : "Add a branch first so a QR destination exists."}
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {snapshot.branches.map((b) => {
            const url = origin ? menuUrl(origin, snapshot.tenant.slug, b.slug) : "";
            return (
              <li key={b.id} className="grid gap-3 rounded-xl border border-line p-5">
                <p className="font-medium">{lang === "ar" ? b.nameAr : b.nameEn || b.nameAr}</p>
                <p className="break-all text-xs text-muted">{url || "…"}</p>
                {url ? <QrImage url={url} /> : <div className="aspect-square rounded-md bg-sand" />}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard.writeText(url);
                      setCopied(b.id);
                    }}
                  >
                    {copied === b.id ? t(copy.qr.copied, lang) : t(copy.qr.copy, lang)}
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => downloadQr(url, `${snapshot.tenant.slug}-${b.slug}`)}>
                    {t(copy.qr.download, lang)}
                  </Button>
                  <Button type="button" size="sm" onClick={() => printQr(url, lang === "ar" ? snapshot.tenant.nameAr : snapshot.tenant.nameEn || snapshot.tenant.nameAr, lang === "ar" ? b.nameAr : b.nameEn || b.nameAr)}>
                    {t(copy.qr.print, lang)}
                  </Button>
                </div>

                <div className="grid gap-3 border-t border-line pt-4">
                  <div>
                    <p className="text-sm font-semibold">{lang === "ar" ? "معاينة الثيمات خارجياً" : "External theme previews"}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{lang === "ar" ? "كل رمز يفتح نفس بيانات الفرع بهذا التصميم فقط، بدون تغيير الثيم المنشور وبدون اشتراط Premium." : "Each code opens the same branch data in that theme only, without changing the published theme or requiring Premium."}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
                            <Button type="button" size="sm" variant="outline" onClick={async () => { await navigator.clipboard.writeText(previewUrl); setCopied(`${b.id}:${theme.key}`); }}>
                              {copied === `${b.id}:${theme.key}` ? t(copy.qr.copied, lang) : (lang === "ar" ? "نسخ" : "Copy")}
                            </Button>
                            <Button type="button" size="sm" onClick={() => downloadQr(previewUrl, `${snapshot.tenant.slug}-${b.slug}-${theme.key}`)}>
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
      QR.toDataURL(url, {
        width: 480,
        margin: 2,
        color: { dark: "#171411", light: "#f3eee6" },
      }).then((data) => {
        if (!cancelled) setSrc(data);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, [url]);
  if (!src) return <div className="aspect-square rounded-md bg-sand" />;
  return <img src={src} alt="" className="aspect-square w-full rounded-md bg-paper" />;
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
  const QR = await import("qrcode");
  const data = await QR.toDataURL(url, { width: 720, margin: 2, color: { dark: "#171411", light: "#ffffff" } });
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${restaurant}</title>
    <style>body{font-family:system-ui,sans-serif;text-align:center;padding:32px;color:#171411} img{width:280px;height:280px} p{margin:8px 0}</style>
    </head><body><p style="font-size:22px;font-weight:600">${restaurant}</p><p>${branch}</p>
    <img src="${data}" alt="QR"><p style="font-size:12px;color:#7a7268">امسح لفتح المنيو</p></body></html>`);
  w.document.close();
  w.focus();
  w.print();
}
