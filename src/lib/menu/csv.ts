import type { ImportRow } from "./types";

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else current += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { out.push(current.trim()); current = ""; }
    else current += ch;
  }
  out.push(current.trim());
  return out;
}

function truthy(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "نعم";
}

function list(value: string): string[] {
  return value.split(/[|;،]/).map((v) => v.trim()).filter(Boolean).slice(0, 30);
}

export function parseMenuCsv(text: string): ImportRow[] {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];
  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const idx = (names: string[]) => names.map((n) => header.indexOf(n)).find((i) => i >= 0) ?? -1;
  const col = {
    nameAr: idx(["name_ar", "الاسم", "namear"]), nameEn: idx(["name_en", "name", "nameen"]),
    categoryAr: idx(["category_ar", "التصنيف", "categoryar"]), categoryEn: idx(["category_en", "category", "categoryen"]),
    descriptionAr: idx(["description_ar", "الوصف", "descriptionar"]), descriptionEn: idx(["description_en", "description", "descriptionen"]),
    price: idx(["price", "السعر"]), imageUrl: idx(["image_url", "image", "الصورة"]), calories: idx(["calories", "سعرات"]),
    featured: idx(["featured", "is_featured", "مميز"]), available: idx(["available", "is_available", "متاح"]),
    tags: idx(["tags", "الوسوم", "tag"]), dietaryLabels: idx(["dietary_labels", "dietary", "الحمية", "التصنيف_الغذائي"]),
  };
  const rows: ImportRow[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const at = (i: number) => (i >= 0 ? (cells[i] ?? "").trim() : "");
    const nameAr = at(col.nameAr), categoryAr = at(col.categoryAr), priceRaw = at(col.price).replace(",", "."), price = Number(priceRaw);
    const caloriesRaw = at(col.calories), calories = caloriesRaw === "" ? null : Number(caloriesRaw);
    const issues: string[] = [];
    if (!nameAr) issues.push("الاسم العربي مطلوب");
    if (!categoryAr) issues.push("التصنيف مطلوب");
    if (!Number.isFinite(price) || price < 0) issues.push("السعر غير صالح");
    if (caloriesRaw && (calories == null || !Number.isFinite(calories) || calories < 0)) issues.push("السعرات غير صالحة");
    rows.push({ nameAr, nameEn: at(col.nameEn), categoryAr, categoryEn: at(col.categoryEn), descriptionAr: at(col.descriptionAr), descriptionEn: at(col.descriptionEn), price: Number.isFinite(price) ? price : 0, imageUrl: at(col.imageUrl), calories: calories == null || Number.isFinite(calories) ? calories : null, isFeatured: truthy(at(col.featured)), isAvailable: at(col.available) === "" ? true : truthy(at(col.available)), tags: list(at(col.tags)), dietaryLabels: list(at(col.dietaryLabels)), issues });
  }
  return rows;
}

export const CSV_TEMPLATE = `name_ar,name_en,category_ar,category_en,description_ar,description_en,price,image_url,calories,featured,available,tags,dietary_labels
فلت وايت,Flat White,القهوة,Coffee,حليب مبخر فوق إسبرسو,Steamed milk over espresso,18,,140,true,true,قهوة|ساخن,نباتي
كرواسون,Croissant,المخبوزات,Bakery,طبقات زبدة يومية,Daily butter layers,14,,280,false,true,مخبوزات|فطور,يحتوي_على_جلوتين
`; 
