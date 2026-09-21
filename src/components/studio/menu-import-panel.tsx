import { useMemo, useState } from "react";
import { FileUp, Sparkles } from "lucide-react";
import { Flash } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { AiMenuOnboarding } from "@/components/studio/ai-menu-onboarding";
import { useLang } from "@/lib/lang";
import { CSV_TEMPLATE, parseMenuCsv } from "@/lib/menu/csv";
import { importProducts } from "@/lib/menu/owner";
import { useStudio } from "@/lib/menu/studio";
import type { ImportRow } from "@/lib/menu/types";

type Props = {
  onClose?: () => void;
  embedded?: boolean;
};

const BLOCKING_ISSUES = new Set([
  "الاسم العربي مطلوب",
  "التصنيف مطلوب",
  "السعر غير صالح",
  "السعر غير موجود في المصدر",
  "السعرات غير صالحة",
]);

function isSaveable(row: ImportRow) {
  return row.nameAr.trim().length > 0
    && row.categoryAr.trim().length > 0
    && Number.isFinite(row.price)
    && row.price >= 0
    && !row.issues.some((issue) => BLOCKING_ISSUES.has(issue));
}

export function MenuImportPanel({ onClose, embedded = false }: Props) {
  const { lang } = useLang();
  const { setSnapshot } = useStudio();
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [imported, setImported] = useState<number | null>(null);

  const saveable = useMemo(() => rows?.filter(isSaveable) ?? [], [rows]);
  const skipped = rows ? rows.length - saveable.length : 0;

  function setDraftRows(next: ImportRow[]) {
    setRows(next);
    setError("");
    setOk(false);
    setImported(null);
  }

  function onCsv(file: File | null) {
    if (!file) return;
    setError("");
    setOk(false);
    setImported(null);
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseMenuCsv(String(reader.result || ""));
      if (!parsed.length) {
        setRows(null);
        setError(lang === "ar" ? "لم نتعرف على صفوف في الملف. تحقق من العناوين." : "No rows recognized. Check the header row.");
        return;
      }
      setRows(parsed);
    };
    reader.onerror = () => setError(lang === "ar" ? "تعذر قراءة الملف" : "Could not read the file");
    reader.readAsText(file);
  }

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function commit() {
    if (!saveable.length) return;
    setBusy(true);
    setError("");
    setOk(false);
    try {
      const result = await importProducts({
        data: { rows: saveable.map(({ issues: _issues, ...row }) => row) },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSnapshot(result.data.snapshot);
      setImported(result.data.imported);
      setOk(true);
      setRows(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر حفظ الأصناف" : "Could not save items"));
    } finally {
      setBusy(false);
    }
  }

  const content = (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-line bg-sand/20 p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-paper">
            <FileUp className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold">{lang === "ar" ? "استيراد القائمة بسهولة" : "Import your menu easily"}</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              {lang === "ar"
                ? "ارفع CSV أو صورة أو PDF. سنعرض لك المسودة قبل الحفظ، ويمكنك حفظ المكتمل وتخطي ما يحتاج معلومات أساسية."
                : "Upload a CSV, image, or PDF. Review the draft first, then save what is ready and skip rows missing essential information."}
            </p>
          </div>
        </div>
      </div>

      <AiMenuOnboarding onRows={setDraftRows} busy={busy} setBusy={setBusy} />

      <div className="rounded-2xl border border-line bg-paper p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand text-ink">
            <FileUp className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold">{lang === "ar" ? "استيراد ملف CSV" : "Import CSV"}</h3>
            <p className="mt-1 text-sm text-muted">
              {lang === "ar" ? "استخدم النموذج الجاهز أو اختر ملفك مباشرة." : "Use the ready template or choose your file directly."}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={downloadTemplate}>
            {lang === "ar" ? "تنزيل نموذج CSV" : "Download CSV template"}
          </Button>
          <label className="inline-flex h-11 cursor-pointer items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground">
            {lang === "ar" ? "اختيار ملف CSV" : "Choose CSV file"}
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => onCsv(event.target.files?.[0] ?? null)} />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-sand/10 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-accent" />
          <div>
            <p className="font-medium">{lang === "ar" ? "بعد الحفظ" : "After saving"}</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {lang === "ar"
                ? "ستجد الأصناف داخل القائمة. ومن هناك يمكنك استخدام أدوات الذكاء الاصطناعي لمراجعة الوصف، الإنجليزية، التصنيف، الوسوم، والحساسية، ثم تطبيق ما تختاره بنفسك."
                : "Saved items appear in your menu. From there, the AI tools can help review descriptions, English, categories, tags, and allergen notes; you decide what to apply."}
            </p>
          </div>
        </div>
      </div>

      <Flash error={error} ok={ok} />
      {imported != null ? (
        <div className="rounded-xl border border-good/30 bg-good/5 p-3 text-sm text-good">
          {lang === "ar" ? `تم حفظ ${imported} صنفاً. ${skipped ? `تم تخطي ${skipped} صفاً يحتاج معلومات أساسية.` : ""}` : `Saved ${imported} items. ${skipped ? `${skipped} rows were skipped because essential information is missing.` : ""}`}
        </div>
      ) : null}

      {rows ? (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {lang === "ar" ? `${saveable.length} جاهز للحفظ · ${skipped} سيتم تخطيه` : `${saveable.length} ready to save · ${skipped} will be skipped`}
            </p>
            <p className="text-xs text-muted">
              {lang === "ar" ? "ملاحظات المراجعة لا تمنع الحفظ إذا كانت البيانات الأساسية مكتملة." : "Review notes do not block saving when essential fields are complete."}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-sand/60 text-start">
                <tr>
                  <th className="px-3 py-2 font-medium">{lang === "ar" ? "الاسم بالعربية" : "Arabic name"}</th>
                  <th className="px-3 py-2 font-medium">{lang === "ar" ? "التصنيف" : "Category"}</th>
                  <th className="px-3 py-2 font-medium">{lang === "ar" ? "السعر" : "Price"}</th>
                  <th className="px-3 py-2 font-medium">{lang === "ar" ? "المراجعة" : "Review"}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const ready = isSaveable(row);
                  return (
                    <tr key={`${row.nameAr}-${index}`} className="border-t border-line">
                      <td className="px-3 py-2">{row.nameAr || "—"}</td>
                      <td className="px-3 py-2">{row.categoryAr || "—"}</td>
                      <td className="px-3 py-2">{Number.isFinite(row.price) ? row.price : "—"}</td>
                      <td className={`px-3 py-2 ${ready ? "text-good" : "text-bad"}`}>
                        {ready
                          ? (row.issues.length ? (lang === "ar" ? "جاهز مع ملاحظات" : "Ready with notes") : (lang === "ar" ? "جاهز" : "Ready"))
                          : (row.issues.join(" · ") || (lang === "ar" ? "يحتاج بيانات أساسية" : "Essential data needed"))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={busy || !saveable.length} onClick={() => void commit()}>
              {busy ? (lang === "ar" ? "جارٍ الحفظ…" : "Saving…") : (lang === "ar" ? "حفظ الجاهز وتخطي الباقي" : "Save ready items & skip the rest")}
            </Button>
            {onClose ? <Button type="button" variant="outline" onClick={onClose}>{lang === "ar" ? "إغلاق" : "Close"}</Button> : null}
          </div>
          {!saveable.length ? (
            <p className="text-sm text-bad">
              {lang === "ar" ? "لا توجد صفوف مكتملة للبدء بها. أكمل الاسم والتصنيف والسعر، ثم أعد التحليل." : "No rows have the essential fields yet. Complete name, category, and price, then analyze again."}
            </p>
          ) : null}
        </div>
      ) : null}

      {!rows && onClose ? (
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>{lang === "ar" ? "إغلاق" : "Close"}</Button>
        </div>
      ) : null}
    </div>
  );

  if (embedded) return content;
  return content;
}
