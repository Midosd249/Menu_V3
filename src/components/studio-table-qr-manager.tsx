import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Copy, QrCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/lang";
import { useStudio } from "@/lib/menu/studio";
import { createRestaurantTable, listRestaurantTables, rotateRestaurantTableQr } from "@/lib/menu/table-qr-management";

type TableItem = { id: string; label: string; isActive: boolean; hasActiveToken: boolean };
type IssuedQr = { id: string; label: string; url: string; image: string };

export function StudioTableQrManager() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const branches = snapshot.branches.filter((item) => item.isActive);
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "");
  const [label, setLabel] = useState("");
  const [tables, setTables] = useState<TableItem[]>([]);
  const [issued, setIssued] = useState<IssuedQr | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const branch = branches.find((item) => item.id === branchId);
  const ar = lang === "ar";
  const copy = {
    title: ar ? "طاولات المطعم ورموز QR" : "Restaurant tables & QR codes",
    intro: ar ? "أنشئ رمزاً مستقلاً لكل طاولة. تدوير الرمز يبطل الرمز السابق." : "Create a dedicated QR per table. Rotating a code invalidates the previous one.",
    branch: ar ? "الفرع" : "Branch", label: ar ? "اسم أو رقم الطاولة" : "Table name or number",
    create: ar ? "إنشاء طاولة ورمز QR" : "Create table & QR", empty: ar ? "لا توجد طاولات لهذا الفرع بعد." : "No tables for this branch yet.",
    rotate: ar ? "تدوير الرمز" : "Rotate QR", active: ar ? "الرمز فعال" : "QR active", inactive: ar ? "لا يوجد رمز فعال" : "No active QR",
    warning: ar ? "احفظ صورة QR أو اطبعها الآن؛ الرمز السري لا يُعرض مرة أخرى." : "Save or print this QR now; the secret token will not be shown again.",
    confirm: ar ? "سيُلغى الرمز الحالي فوراً ويجب استبدال النسخ المطبوعة. هل تريد المتابعة؟" : "The current QR will be revoked immediately and printed copies must be replaced. Continue?",
    copy: ar ? "نسخ الرابط" : "Copy link", copied: ar ? "تم نسخ الرابط." : "Link copied.",
    noBranch: ar ? "أضف فرعاً نشطاً أولاً." : "Add an active branch first.",
  };
  const refresh = useCallback(async (id = branchId) => {
    if (!id) { setTables([]); return; }
    const result = await listRestaurantTables({ data: { tenantId: snapshot.tenant.id, branchId: id } });
    if (result.ok) setTables(result.data.tables); else setError(result.error);
  }, [branchId, snapshot.tenant.id]);
  useEffect(() => { void refresh(); }, [refresh]);
  const issueQr = async (id: string, tableLabel: string, token: string) => {
    if (!branch) return;
    const url = new URL(`/m/${snapshot.tenant.slug}/${branch.slug}`, window.location.origin);
    url.searchParams.set("table", token);
    const qr = await import("qrcode");
    const image = await qr.toDataURL(url.toString(), { width: 480, margin: 2 });
    setIssued({ id, label: tableLabel, url: url.toString(), image });
  };
  const create = async () => {
    if (!branchId || !label.trim()) return;
    const tableLabel = label.trim();
    setBusy(true); setError(""); setNotice(""); setIssued(null);
    try {
      const result = await createRestaurantTable({ data: { tenantId: snapshot.tenant.id, branchId, label: tableLabel } });
      if (!result.ok) setError(result.error);
      else { setLabel(""); await refresh(); await issueQr(result.data.tableId, tableLabel, result.data.plainToken); }
    } catch {
      setError(ar ? "تعذر إنشاء رمز QR. حدّث الصفحة وحاول مجدداً." : "Could not generate the QR code. Refresh and try again.");
    } finally { setBusy(false); }
  };
  const rotate = async (table: TableItem) => {
    if (!branchId || !window.confirm(copy.confirm)) return;
    setBusy(true); setError(""); setNotice(""); setIssued(null);
    try {
      const result = await rotateRestaurantTableQr({ data: { tenantId: snapshot.tenant.id, branchId, tableId: table.id } });
      if (!result.ok) setError(result.error);
      else await issueQr(table.id, table.label, result.data.plainToken);
      await refresh();
    } catch {
      setError(ar ? "تعذر تحديث رمز QR. تحقق من الاتصال ثم حاول مجدداً." : "Could not rotate the QR code. Check the connection and try again.");
      await refresh();
    } finally { setBusy(false); }
  };
  return <section className="grid gap-4 rounded-2xl border border-line bg-paper p-4 sm:p-6" aria-labelledby="table-qr-manager-title">
    <div className="flex items-start gap-3"><QrCode className="mt-1 size-5 shrink-0 text-muted" aria-hidden="true"/><div><h2 id="table-qr-manager-title" className="text-lg font-semibold">{copy.title}</h2><p className="mt-1 text-sm text-muted">{copy.intro}</p></div></div>
    {branches.length === 0 ? <p className="rounded-xl bg-sand/40 p-4 text-sm">{copy.noBranch}</p> : <>
      <label className="grid gap-1 text-sm"><span>{copy.branch}</span><select value={branchId} onChange={(event) => { setBranchId(event.target.value); setIssued(null); setError(""); }} className="min-h-11 rounded-xl border border-line bg-paper px-3">{branches.map((item) => <option key={item.id} value={item.id}>{ar ? item.nameAr || item.nameEn : item.nameEn || item.nameAr}</option>)}</select></label>
      <form className="grid gap-2 sm:grid-cols-[1fr_auto]" onSubmit={(event) => { event.preventDefault(); void create(); }}>
        <label className="grid gap-1 text-sm"><span>{copy.label}</span><Input value={label} onChange={(event) => setLabel(event.target.value)} maxLength={80} required /></label>
        <Button type="submit" disabled={busy || !label.trim()} className="min-h-11 self-end">{copy.create}</Button>
      </form>
      {error ? <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {notice ? <p role="status" className="text-sm text-muted">{notice}</p> : null}
      {issued ? <div className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-[auto_1fr]"><img src={issued.image} alt={ar ? `رمز QR للطاولة ${issued.label}` : `QR code for table ${issued.label}`} className="size-48 max-w-full rounded-lg bg-white p-2"/><div className="min-w-0"><p className="font-semibold">{issued.label}</p><p className="mt-1 text-xs text-muted">{copy.warning}</p><p className="mt-3 break-all text-xs" dir="ltr">{issued.url}</p><div className="mt-3 flex flex-wrap gap-2"><Button type="button" variant="outline" className="min-h-11" onClick={() => { void navigator.clipboard.writeText(issued.url).then(() => setNotice(copy.copied)).catch(() => setError(ar ? "تعذر النسخ من هذا المتصفح." : "Clipboard access is unavailable.")); }}><Copy className="me-2 size-4"/>{copy.copy}</Button><a href={issued.image} download={`menuun-table-${issued.id}.png`} className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-medium">{ar ? "تنزيل صورة QR" : "Download QR image"}</a></div></div></div> : null}
      <div className="grid gap-2">{tables.length === 0 ? <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">{copy.empty}</p> : tables.map((table) => <div key={table.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-3"><div className="min-w-0"><p className="font-medium">{table.label}</p><p className="mt-1 text-xs text-muted">{table.hasActiveToken ? copy.active : copy.inactive}</p></div><Button type="button" variant="outline" className="min-h-11" disabled={busy || !table.isActive} onClick={() => void rotate(table)}><RefreshCw className="me-2 size-4"/>{copy.rotate}</Button></div>)}</div>
      <p className="flex items-start gap-2 text-xs text-muted"><AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true"/>{copy.warning}</p>
    </>}
  </section>;
}
