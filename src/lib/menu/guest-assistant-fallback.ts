import type { Product } from "./types";

export type GuestFallbackProduct = Pick<
  Product,
  | "id"
  | "nameAr"
  | "nameEn"
  | "descriptionAr"
  | "descriptionEn"
  | "price"
  | "currency"
  | "isAvailable"
  | "isFeatured"
  | "allergens"
  | "dietaryLabels"
  | "tags"
> & {
  categoryAr?: string;
  categoryEn?: string;
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreProduct(product: GuestFallbackProduct, tokens: string[]) {
  const haystack = normalizeSearchText([
    product.nameAr,
    product.nameEn,
    product.descriptionAr,
    product.descriptionEn,
    product.categoryAr ?? "",
    product.categoryEn ?? "",
    ...(product.tags ?? []),
    ...(product.dietaryLabels ?? []),
  ].join(" "));
  const tokenScore = tokens.reduce((total, token) => total + (haystack.includes(token) ? 3 : 0), 0);
  return tokenScore + (product.isFeatured ? 1 : 0);
}

function selectProducts(question: string, products: GuestFallbackProduct[]) {
  const query = normalizeSearchText(question);
  const tokens = query.split(" ").filter((token) => token.length >= 2);
  const scored = products
    .map((product) => ({ product, score: scoreProduct(product, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price || a.product.nameAr.localeCompare(b.product.nameAr, "ar"))
    .slice(0, 5)
    .map((entry) => entry.product);

  const isRecommendation = /recommend|suggest|what should|best|تنصح|اقترح|اقتراح|اختار|اختيار|افضل|أفضل/.test(query);
  if (scored.length) return scored;
  if (isRecommendation) {
    return [...products]
      .filter((product) => product.isAvailable)
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.price - b.price)
      .slice(0, 3);
  }
  return [];
}

export function fallbackGuestAnswer(question: string, products: GuestFallbackProduct[]) {
  const query = normalizeSearchText(question);
  const matches = selectProducts(question, products);
  const isRecommendation = /recommend|suggest|what should|best|تنصح|اقترح|اقتراح|اختار|اختيار|افضل|أفضل/.test(query);
  const isAvailability = /available|availability|in stock|متاح|متوفر|موجود/.test(query);
  const isPrice = /price|cost|how much|سعر|بكم|كم/.test(query);
  const isAllergen = /allergen|allergy|حساسي|مكونات|مكوّنات/.test(query);
  const isCalories = /calorie|calories|light|خفيف|خفيفة|سعرات/.test(query);

  if (isPrice && matches.length) {
    return {
      answerAr: `السعر في القائمة: ${matches.map((p) => `${p.nameAr}: ${p.price} ${p.currency}`).join("، ")}.`,
      answerEn: `Menu prices: ${matches.map((p) => `${p.nameEn || p.nameAr}: ${p.price} ${p.currency}`).join(", ")}.`,
      productIds: matches.map((p) => p.id).slice(0, 5),
    };
  }

  if (isAvailability && matches.length) {
    const available = matches.filter((p) => p.isAvailable);
    return {
      answerAr: available.length
        ? `هذه الأصناف متاحة حالياً: ${available.map((p) => p.nameAr).join("، ")}.`
        : "لا توجد أصناف مطابقة متاحة حالياً.",
      answerEn: available.length
        ? `These items are currently available: ${available.map((p) => p.nameEn || p.nameAr).join(", ")}.`
        : "No matching items are currently available.",
      productIds: available.map((p) => p.id).slice(0, 5),
    };
  }

  if (isAllergen && matches.length) {
    const withAllergens = matches.filter((p) => p.allergens.trim());
    return {
      answerAr: withAllergens.length
        ? withAllergens.map((p) => `${p.nameAr}: ${p.allergens}`).join("؛ ")
        : "معلومات مسببات الحساسية غير محددة لهذه الأصناف في القائمة، لذلك لا يمكنني تأكيد غياب أي مسبب حساسية.",
      answerEn: withAllergens.length
        ? withAllergens.map((p) => `${p.nameEn || p.nameAr}: ${p.allergens}`).join("; ")
        : "Allergen information is not specified for these items in the menu, so I cannot confirm that any allergen is absent.",
      productIds: matches.map((p) => p.id).slice(0, 5),
    };
  }

  if (isCalories && matches.length) {
    const withCalories = matches.filter((p) => p.tags?.length || p.dietaryLabels?.length);
    const candidates = withCalories.length ? withCalories : matches;
    return {
      answerAr: `من المعلومات المتاحة في القائمة: ${candidates.map((p) => p.nameAr).join("، ")}. راجع تفاصيل كل صنف قبل الطلب؛ لا تتوفر لدي معلومات كافية لإثبات أن صنفاً معيناً "خفيف" إلا إذا كانت القائمة تصفه بذلك.`,
      answerEn: `From the menu data available: ${candidates.map((p) => p.nameEn || p.nameAr).join(", ")}. Please review each item's details before ordering; I cannot claim that an item is "light" unless the menu provides evidence.`,
      productIds: candidates.map((p) => p.id).slice(0, 5),
    };
  }

  if (matches.length) {
    const prefixAr = isRecommendation ? "بناءً على الأصناف المتاحة، يمكنك البدء بـ" : "وجدت في القائمة";
    const prefixEn = isRecommendation ? "Based on the available menu, you can start with" : "I found these menu items";
    return {
      answerAr: `${prefixAr}: ${matches.map((p) => p.nameAr).join("، ")}. اسألني عن السعر أو التوفر أو المكونات.`,
      answerEn: `${prefixEn}: ${matches.map((p) => p.nameEn || p.nameAr).join(", ")}. You can ask about price, availability, or ingredients.`,
      productIds: matches.map((p) => p.id).slice(0, 5),
    };
  }

  const sample = [...products]
    .filter((product) => product.isAvailable)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.price - b.price)
    .slice(0, 5);

  return {
    answerAr: sample.length
      ? `المساعد الذكي غير متاح الآن، لكن القائمة متاحة ويمكنني إرشادك منها. جرّب السؤال عن صنف أو سعر أو توفر. من الأصناف المتاحة: ${sample.map((p) => p.nameAr).join("، ")}.`
      : "المساعد الذكي غير متاح الآن ولا توجد أصناف متاحة يمكنني الاستناد إليها.",
    answerEn: sample.length
      ? `The AI assistant is unavailable right now, but the menu is available. Ask about an item, price, or availability. Some available items are: ${sample.map((p) => p.nameEn || p.nameAr).join(", ")}.`
      : "The AI assistant is unavailable right now and there are no available menu items to reference.",
    productIds: sample.map((p) => p.id).slice(0, 5),
  };
}
