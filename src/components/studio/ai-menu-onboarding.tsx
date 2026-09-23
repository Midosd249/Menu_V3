import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flash } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { generateMenuOnboardingDraft, organizeMenuOnboardingDraft } from "@/lib/menu/ai-ingest";
import { extractMenuDocument } from "@/lib/menu/ai-document";
import type { ImportRow } from "@/lib/menu/types";

type Props = { onRows: (rows: ImportRow[]) => void; busy: boolean; setBusy: (busy: boolean) => void };

export function AiMenuOnboarding({ onRows, busy, setBusy }: Props) {
  const { lang } = useLang();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [sourceType, setSourceType] = useState<"text" | "image" | "pdf">("text");
  const [organization, setOrganization] = useState<{ orderedIndexes: number[]; categoryAssignments: Array<{ rowIndex: number; categoryAr: string; categoryEn: string; reasonAr: string; reasonEn: string }>; corrections: Array<{ rowIndex: number; field: string; value: string | number; reasonAr: string; reasonEn: string }> } | null>(null);

  async function requestDraft() {
    return generateMenuOnboardingDraft({ data: { sourceText: text, sourceType } });
  }

  async function analyze() {
    if (!text.trim()) return;
    setBusy(true); setError(""); setOk(false); setOrganization(null);
    try {
      let result = await requestDraft();
      if (!result.ok) {
        await new Promise((resolve) => window.setTimeout(resolve, 450));
        result = await requestDraft();
      }
      if (!result.ok) { setError(result.error); return; }
      onRows(await organizeRows(result.data.rows)); setOk(true);
    } catch (e) { setError(e instanceof Error ? e.message : "AI request failed"); }
    finally { setBusy(false); }
  }

  function upload(file: File | null) {
    setFileName(file.name); setError(""); setOk(false); setOrganization(null);
    const detectedSourceType: "text" | "image" | "pdf" = (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) ? "text" : file.type === "application/pdf" ? "pdf" : "image";
    setSourceType(detectedSourceType);
    if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
      const reader = new FileReader(); reader.onload = () => setText(String(reader.result || "")); reader.readAsText(file); return;
    }
    if (!(file.type === "application/pdf" || file.type.startsWith("image/"))) { setError(lang === "ar" ? "نوع الملف غير مدعوم." : "Unsupported file type."); return; }
    if (file.size > 8 * 1024 * 1024) { setError(lang === "ar" ? "الحد الأقصى 8MB." : "Maximum 8MB."); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      setBusy(true);
      try {
        let result = await extractMenuDocument({ data: { mimeType: file.type as "application/pdf" | "image/jpeg" | "image/png" | "image/webp", dataUrl: String(reader.result) } });
        if (!result.ok) {
          await new Promise((resolve) => window.setTimeout(resolve, 450));
          result = await extractMenuDocument({ data: { mimeType: file.type as "application/pdf" | "image/jpeg" | "image/png" | "image/webp", dataUrl: String(reader.result) } });
        }
        if (!result.ok) { setError(result.error); return; }
        setText(result.data.text);
        let draft = await generateMenuOnboardingDraft({ data: { sourceText: result.data.text, sourceType: detectedSourceType } });
        if (!draft.ok) {
          await new Promise((resolve) => window.setTimeout(resolve, 450));
          draft = await generateMenuOnboardingDraft({ data: { sourceText: result.data.text, sourceType: detectedSourceType } });
        }
        if (!draft.ok) { setError(draft.error); return; }
        onRows(await organizeRows(draft.data.rows));
        setOk(true);
      } catch (e) { setError(e instanceof Error ? e.message : "File extraction failed"); }
      finally { setBusy(false); }
    };
    reader.readAsDataURL(file);
  }

  return <section className="grid gap-4 rounded-2xl border border-line bg-sand/20 p-4">
    <div><h2 className="font-display text-lg font-semibold">{lang === "ar" ? "إدخال القائمة بذكاء" : "Smart menu import"}</h2><p className="mt-1 text-sm text-muted">{lang === "ar" ? "ألصق النص أو ارفع صورة/PDF. سيُنشئ النظام مسودة للمراجعة فقط، ثم تختار أنت ما يُحفظ." : "Paste text or upload an image/PDF. The system creates a review draft, then you choose what gets saved."}</p></div>
    <textarea className="min-h-36 w-full rounded-xl border border-line bg-background p-3 text-sm" value={text} onChange={e => setText(e.target.value)} placeholder={lang === "ar" ? "الصق قائمة الطعام هنا..." : "Paste the menu here..."} />
    <div className="flex flex-wrap gap-2">
      <label className="inline-flex h-11 cursor-pointer items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground">{lang === "ar" ? "رفع صورة أو PDF" : "Upload image or PDF"}<input type="file" accept="application/pdf,image/jpeg,image/png,image/webp,.txt" className="sr-only" onChange={e => upload(e.target.files?.[0] ?? null)} /></label>
      <Button type="button" disabled={busy || !text.trim()} onClick={() => void analyze()}>{busy ? (lang === "ar" ? "جاري المعالجة..." : "Processing...") : (lang === "ar" ? "تحليل القائمة" : "Analyze menu")}</Button>
      {organization ? <span className="self-center text-xs text-muted">{lang === "ar" ? `تم اقتراح تنظيم ${organization.categoryAssignments.length} تصنيفًا و${organization.corrections.length} تصحيحًا` : `${organization.categoryAssignments.length} category changes and ${organization.corrections.length} corrections suggested`}</span> : null}
      {fileName ? <span className="self-center text-xs text-muted">{fileName}</span> : null}
    </div>
    {organization ? (
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-3 text-sm">
        <p className="font-medium">{lang === "ar" ? "تنظيم ذكي مقترح" : "Smart organization proposed"}</p>
        <p className="mt-1 text-xs leading-5 text-muted">{lang === "ar" ? "تم ترتيب الأصناف واقتراح التصنيفات والتصحيحات قبل الحفظ. لا يتم تعديل القائمة المحفوظة تلقائيًا." : "Items are grouped and corrections are proposed before saving. Saved menu data is never changed automatically."}</p>
        {organization.categoryAssignments.length > 0 ? <p className="mt-2 text-xs">{lang === "ar" ? `${organization.categoryAssignments.length} أصناف لها تصنيف مقترح.` : `${organization.categoryAssignments.length} category assignments proposed.`}</p> : null}
        {organization.corrections.length > 0 ? <p className="mt-1 text-xs">{lang === "ar" ? `${organization.corrections.length} تصحيح محتمل يحتاج مراجعة.` : `${organization.corrections.length} possible corrections need review.`}</p> : null}
      </div>
    ) : null}
    <Flash error={error} ok={ok} />
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" disabled={busy || !text.trim()} onClick={() => void analyze()}>
        {lang === "ar" ? "إعادة التحليل" : "Re-analyze"}
      </Button>
    </div>
    <div className="rounded-xl border border-line bg-paper/70 p-3 text-xs leading-6 text-muted">
      {lang === "ar"
        ? "الخطوات: ارفع القائمة ← راجع المسودة ← احفظ المكتمل وتخطَّ ما ينقصه بيانات أساسية ← أكمل التحسينات من صفحة القائمة. لا تحتاج لمعرفة أي إعدادات تقنية."
        : "Steps: upload the menu → review the draft → save what is complete and skip rows missing essential data → finish improvements from the Menu page. No technical setup is needed."}
    </div>
  </section>;
}
