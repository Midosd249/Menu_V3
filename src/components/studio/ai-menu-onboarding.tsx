import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flash } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { generateMenuOnboardingDraft } from "@/lib/menu/ai-ingest";
import { extractMenuDocument } from "@/lib/menu/ai-document";
import type { ImportRow } from "@/lib/menu/types";

type Props = { onRows: (rows: ImportRow[]) => void; busy: boolean; setBusy: (busy: boolean) => void };

export function AiMenuOnboarding({ onRows, busy, setBusy }: Props) {
  const { lang } = useLang();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  async function analyze() {
    if (!text.trim()) return;
    setBusy(true); setError(""); setOk(false);
    try {
      const result = await generateMenuOnboardingDraft({ data: { sourceText: text, sourceType: "text" } });
      if (!result.ok) { setError(result.error); return; }
      onRows(result.data.rows); setOk(true);
    } catch (e) { setError(e instanceof Error ? e.message : "AI request failed"); }
    finally { setBusy(false); }
  }

  function upload(file: File | null) {
    if (!file) return;
    setFileName(file.name); setError(""); setOk(false);
    if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
      const reader = new FileReader(); reader.onload = () => setText(String(reader.result || "")); reader.readAsText(file); return;
    }
    if (!(file.type === "application/pdf" || file.type.startsWith("image/"))) { setError(lang === "ar" ? "نوع الملف غير مدعوم." : "Unsupported file type."); return; }
    if (file.size > 8 * 1024 * 1024) { setError(lang === "ar" ? "الحد الأقصى 8MB." : "Maximum 8MB."); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      setBusy(true);
      try {
        const result = await extractMenuDocument({ data: { mimeType: file.type as "application/pdf" | "image/jpeg" | "image/png" | "image/webp", dataUrl: String(reader.result) } });
        if (!result.ok) { setError(result.error); return; }
        setText(result.data.text);
      } catch (e) { setError(e instanceof Error ? e.message : "File extraction failed"); }
      finally { setBusy(false); }
    };
    reader.readAsDataURL(file);
  }

  return <section className="grid gap-4 rounded-2xl border border-line bg-sand/20 p-4">
    <div><h2 className="font-display text-lg font-semibold">{lang === "ar" ? "استقبال القائمة بالذكاء الاصطناعي" : "AI Menu Onboarding"}</h2><p className="mt-1 text-sm text-muted">{lang === "ar" ? "ألصق النص أو ارفع صورة/PDF. سيُنشئ النظام مسودة للمراجعة فقط." : "Paste text or upload an image/PDF. AI creates a review-only draft."}</p></div>
    <textarea className="min-h-36 w-full rounded-xl border border-line bg-background p-3 text-sm" value={text} onChange={e => setText(e.target.value)} placeholder={lang === "ar" ? "الصق قائمة الطعام هنا..." : "Paste the menu here..."} />
    <div className="flex flex-wrap gap-2">
      <label className="inline-flex h-11 cursor-pointer items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground">{lang === "ar" ? "رفع صورة أو PDF" : "Upload image or PDF"}<input type="file" accept="application/pdf,image/jpeg,image/png,image/webp,.txt" className="sr-only" onChange={e => upload(e.target.files?.[0] ?? null)} /></label>
      <Button type="button" disabled={busy || !text.trim()} onClick={() => void analyze()}>{busy ? (lang === "ar" ? "جاري التحليل..." : "Analyzing...") : (lang === "ar" ? "تحليل القائمة" : "Analyze menu")}</Button>
      {fileName ? <span className="self-center text-xs text-muted">{fileName}</span> : null}
    </div>
    <Flash error={error} ok={ok} />
    <p className="text-xs text-muted">{lang === "ar" ? "استخراج الصور وPDF يحتاج OPENAI_API_KEY على الخادم؛ Mercury يبقى محرك بناء المسودة المنظمة." : "Image/PDF extraction requires OPENAI_API_KEY on the server; Mercury remains the structured drafting engine."}</p>
  </section>;
}
