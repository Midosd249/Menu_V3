import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as importProducts } from "./owner-FHUt_4Qp.mjs";
import { n as useStudio } from "./studio-Cc4LhrBg.mjs";
import { f as Button, g as useLang, h as t, l as Flash, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-BGG18MJb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function splitCsvLine(line) {
	const out = [];
	let current = "";
	let quoted = false;
	for (let i = 0; i < line.length; i += 1) {
		const ch = line[i];
		if (quoted) {
			if (ch === "\"" && line[i + 1] === "\"") {
				current += "\"";
				i += 1;
			} else if (ch === "\"") quoted = false;
			else current += ch;
		} else if (ch === "\"") quoted = true;
		else if (ch === ",") {
			out.push(current.trim());
			current = "";
		} else current += ch;
	}
	out.push(current.trim());
	return out;
}
function truthy(value) {
	const v = value.trim().toLowerCase();
	return v === "1" || v === "true" || v === "yes" || v === "نعم";
}
function parseMenuCsv(text) {
	const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim());
	if (lines.length < 2) return [];
	const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
	const idx = (names) => names.map((n) => header.indexOf(n)).find((i) => i >= 0) ?? -1;
	const col = {
		nameAr: idx([
			"name_ar",
			"الاسم",
			"namear"
		]),
		nameEn: idx([
			"name_en",
			"name",
			"nameen"
		]),
		categoryAr: idx([
			"category_ar",
			"التصنيف",
			"categoryar"
		]),
		categoryEn: idx([
			"category_en",
			"category",
			"categoryen"
		]),
		descriptionAr: idx([
			"description_ar",
			"الوصف",
			"descriptionar"
		]),
		descriptionEn: idx([
			"description_en",
			"description",
			"descriptionen"
		]),
		price: idx(["price", "السعر"]),
		imageUrl: idx([
			"image_url",
			"image",
			"الصورة"
		]),
		calories: idx(["calories", "سعرات"]),
		featured: idx([
			"featured",
			"is_featured",
			"مميز"
		]),
		available: idx([
			"available",
			"is_available",
			"متاح"
		])
	};
	const rows = [];
	for (const line of lines.slice(1)) {
		const cells = splitCsvLine(line);
		const at = (i) => i >= 0 ? (cells[i] ?? "").trim() : "";
		const nameAr = at(col.nameAr);
		const categoryAr = at(col.categoryAr);
		const priceRaw = at(col.price).replace(",", ".");
		const price = Number(priceRaw);
		const caloriesRaw = at(col.calories);
		const issues = [];
		if (!nameAr) issues.push("الاسم العربي مطلوب");
		if (!categoryAr) issues.push("التصنيف مطلوب");
		if (!Number.isFinite(price) || price < 0) issues.push("السعر غير صالح");
		const calories = caloriesRaw === "" ? null : Number.isFinite(Number(caloriesRaw)) ? Number(caloriesRaw) : NaN;
		if (caloriesRaw && !Number.isFinite(calories)) issues.push("السعرات غير صالحة");
		rows.push({
			nameAr,
			nameEn: at(col.nameEn),
			categoryAr,
			categoryEn: at(col.categoryEn),
			descriptionAr: at(col.descriptionAr),
			descriptionEn: at(col.descriptionEn),
			price: Number.isFinite(price) ? price : 0,
			imageUrl: at(col.imageUrl),
			calories: Number.isFinite(calories) ? calories : null,
			isFeatured: truthy(at(col.featured)),
			isAvailable: at(col.available) === "" ? true : truthy(at(col.available)),
			issues
		});
	}
	return rows;
}
var CSV_TEMPLATE = `name_ar,name_en,category_ar,category_en,description_ar,description_en,price,image_url,calories,featured,available
فلت وايت,Flat White,القهوة,Coffee,حليب مبخر فوق إسبرسو,Steamed milk over espresso,18,,140,true,true
كرواسون,Croissant,المخبوزات,Bakery,طبقات زبدة يومية,Daily butter layers,14,,280,false,true
`;
function ImportPage() {
	const { lang } = useLang();
	const { setSnapshot } = useStudio();
	const [rows, setRows] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [ok, setOk] = (0, import_react.useState)(false);
	const [imported, setImported] = (0, import_react.useState)(null);
	const valid = rows?.filter((r) => r.issues.length === 0) ?? [];
	const invalid = rows?.filter((r) => r.issues.length > 0) ?? [];
	function onFile(file) {
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
			const result = await importProducts({ data: { rows: valid.map(({ issues: _i, ...row }) => row) } });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-3xl gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: t(copy.import.title, lang)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: t(copy.import.hint, lang)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: downloadTemplate,
					children: t(copy.import.template, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex h-11 cursor-pointer items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground",
					children: [lang === "ar" ? "اختيار ملف CSV" : "Choose CSV file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".csv,text/csv",
						className: "sr-only",
						onChange: (e) => onFile(e.target.files?.[0] ?? null)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flash, {
				error,
				ok
			}),
			imported != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-good",
				children: lang === "ar" ? `تم تثبيت ${imported} صنفاً.` : `Imported ${imported} items.`
			}) : null,
			rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							valid.length,
							" ",
							t(copy.import.valid, lang),
							" · ",
							invalid.length,
							" ",
							t(copy.import.invalid, lang)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-sand/60 text-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: t(copy.studio.nameAr, lang)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: t(copy.studio.categories, lang)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: t(copy.studio.price, lang)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: lang === "ar" ? "الحالة" : "Status"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: row.nameAr || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: row.categoryAr || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: row.price
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: `px-3 py-2 ${row.issues.length ? "text-bad" : "text-good"}`,
										children: row.issues.length ? row.issues.join(" · ") : lang === "ar" ? "جاهز" : "Ready"
									})
								]
							}, i)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						disabled: busy || valid.length === 0,
						onClick: () => void commit(),
						children: busy ? t(copy.state.loading, lang) : t(copy.import.commit, lang)
					}),
					valid.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-bad",
						children: lang === "ar" ? "لا صفوف صالحة للتثبيت. لم يُحفظ شيء." : "No valid rows. Nothing was saved."
					}) : null
				]
			}) : null
		]
	});
}
//#endregion
export { ImportPage as component };
