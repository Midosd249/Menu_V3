import type { ImportRow } from "./types";

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) { cells.push(cell); cell = ""; }
    else cell += ch;
  }
  cells.push(cell);
  return cells;
}

const list = (value: string) => value.split(/[|،;]/).map((x) => x.trim()).filter(Boolean);
const truthy = (value: string) => ["1", "true", "yes", "y", "نعم", "متاح", "مميز"].includes(value.toLowerCase());

export function parseMenuCsv(csv: string): ImportRow[] {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((x) => x.trim().toLowerCase());
  const idx = (names: string[]) => names.map((name) => headers.indexOf(name.toLowerCase())).find((i) => i >= 0) ?? -1;
  const col = {
    nameAr: idx(["name_ar", "name", "الاسم", "الاسم_العربي"]), nameEn: idx(["name_en", "الاسم_الانجليزي"]),
    categoryAr: idx(["category_ar", "category", "التصنيف", "الفئة"]), categoryEn: idx(["category_en", "التصنيف_الانجليزي"]),
    descriptionAr: idx(["description_ar", "description", "الوصف"]), descriptionEn: idx(["description_en", "الوصف_الانجليزي"]),
    price: idx(["price", "السعر"]), imageUrl: idx(["image_url", "image", "الصورة"]), calories: idx(["calories", "سعرات"]),
    featured: idx(["featured", "is_featured", "مميز"]), available: idx(["available", "is_available", "متاح"]),
    tags: idx(["tags", "الوسوم", "tag"]), dietaryLabels: idx(["dietary_labels", "dietary", "الحمية", "التصنيف_الغذائي"]),
  };
  const rows: ImportRow[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const at = (i: number) => (i >= 0 ? (cells[i] ?? "").trim() : "");
    const nameAr = at(col.nameAr), categoryAr = at(col.categoryAr), priceRaw = at(col.price).replace(",", ".");
    const price = Number(priceRaw), caloriesRaw = at(col.calories), calories = caloriesRaw === "" ? null : Number(caloriesRaw);
    const issues: string[] = [];
    if (!nameAr) issues.push("الاسم العربي مطلوب");
    if (!categoryAr) issues.push("التصنيف مطلوب");
    if (!Number.isFinite(price) || price < 0) issues.push("السعر غير صالح");
    if (caloriesRaw && (calories == null || !Number.isFinite(calories) || calories < 0)) issues.push("السعرات غير صالحة");
    rows.push({ nameAr, nameEn: at(col.nameEn), categoryAr, categoryEn: at(col.categoryEn), descriptionAr: at(col.descriptionAr), descriptionEn: at(col.descriptionEn), price: Number.isFinite(price) ? price : 0, imageUrl: at(col.imageUrl), calories: calories == null || Number.isFinite(calories) ? calories : null, isFeatured: truthy(at(col.featured)), isAvailable: at(col.available) === "" ? true : truthy(at(col.available)), tags: list(at(col.tags)), dietaryLabels: list(at(col.dietaryLabels)), issues });
  }
  return rows;
}
