import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Flash } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { CSV_TEMPLATE, parseMenuCsv } from "@/lib/menu/csv";
import { copy, t } from "@/lib/menu/i18n";
import { importProducts } from "@/lib/menu/owner";
import { useStudio } from "@/lib/menu/studio";
import type { ImportRow } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/import")({ component: ImportPage });

function ImportPage() {
  const { lang } = useLang();
  const { setSnapshot } = useStudio();
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [imported, setImported] = useState<number | null>(null);

  const valid = rows?.filter((r) => r.issues.length === 0) ?? [];
  const invalid = rows?.filter((r) => r.issues.length > 0) ?? [];

  function onFile(file: File | null) {
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
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "menu-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function commit() {
    if (!valid.length) return;
    setBusy(true);
    setError("");
    setOk(false);
    try {
      const result = await importProducts({
        data: {
          rows: valid.map(({ issues: _i, ...row }) => row),
        },
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
      setError(err instanceof Error ? err.message : t(copy.state.error, lang));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t(copy.import.title, lang)}</h1>
        <p className="text-sm text-muted">{t(copy.import.hint, lang)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={downloadTemplate}>
          {t(copy.import.template, lang)}
        </Button>
        <label className="inline-flex h-11 cursor-pointer items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground">
          {lang === "ar" ? "اختيار ملف CSV" : "Choose CSV file"}
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <Flash error={error} ok={ok} />
      {imported != null ? (
        <p className="text-sm text-good">
          {lang === "ar" ? `تم تثبيت ${imported} صنفاً.` : `Imported ${imported} items.`}
        </p>
      ) : null}
      {rows ? (
        <div className="grid gap-4">
          <p className="text-sm">
            {valid.length} {t(copy.import.valid, lang)} · {invalid.length} {t(copy.import.invalid, lang)}
          </p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-sand/60 text-start">
                <tr>
                  <th className="px-3 py-2 font-medium">{t(copy.studio.nameAr, lang)}</th>
                  <th className="px-3 py-2 font-medium">{t(copy.studio.categories, lang)}</th>
                  <th className="px-3 py-2 font-medium">{t(copy.studio.price, lang)}</th>
                  <th className="px-3 py-2 font-medium">{lang === "ar" ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="px-3 py-2">{row.nameAr || "—"}</td>
                    <td className="px-3 py-2">{row.categoryAr || "—"}</td>
                    <td className="px-3 py-2">{row.price}</td>
                    <td className={`px-3 py-2 ${row.issues.length ? "text-bad" : "text-good"}`}>
                      {row.issues.length ? row.issues.join(" · ") : (lang === "ar" ? "جاهز" : "Ready")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button type="button" disabled={busy || valid.length === 0} onClick={() => void commit()}>
            {busy ? t(copy.state.loading, lang) : t(copy.import.commit, lang)}
          </Button>
          {valid.length === 0 ? (
            <p className="text-sm text-bad">{lang === "ar" ? "لا صفوف صالحة للتثبيت. لم يُحفظ شيء." : "No valid rows. Nothing was saved."}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
