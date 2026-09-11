import type { OwnerAnalytics, Product, StudioSnapshot } from "./types";

export type AdvisorPriority = "high" | "medium" | "low";
export type AdvisorAction = {
  key: string;
  priority: AdvisorPriority;
  titleAr: string;
  titleEn: string;
  reasonAr: string;
  reasonEn: string;
  metricAr: string;
  metricEn: string;
  href: "/studio/menu" | "/studio/brand" | "/studio/branches" | "/studio/intelligence";
};

export type MenuGrowthAdvisor = {
  summaryAr: string;
  summaryEn: string;
  actions: AdvisorAction[];
};

function add(actions: AdvisorAction[], action: AdvisorAction) {
  if (!actions.some((item) => item.key === action.key)) actions.push(action);
}

export function buildMenuGrowthAdvisor(snapshot: StudioSnapshot, analytics: OwnerAnalytics | null): MenuGrowthAdvisor {
  const actions: AdvisorAction[] = [];
  const { products, categories, branches, tenant } = snapshot;
  const available = products.filter((product) => product.isAvailable);

  if (!tenant.isPublished) {
    add(actions, {
      key: "publish-menu", priority: "high", titleAr: "انشر القائمة العامة", titleEn: "Publish the public menu",
      reasonAr: "القائمة موجودة لكن حالة النشر غير مفعلة؛ راجعها قبل توجيه العملاء إليها.", reasonEn: "The menu exists but publishing is off; review it before directing guests to it.",
      metricAr: "الحالة: غير منشورة", metricEn: "Status: unpublished", href: "/studio/brand",
    });
  }
  if (products.length > 0 && available.length === 0) {
    add(actions, {
      key: "availability", priority: "high", titleAr: "راجع توفر الأصناف", titleEn: "Review item availability",
      reasonAr: "لا توجد أصناف متاحة حاليًا للضيف.", reasonEn: "No items are currently available to guests.",
      metricAr: `المتاح: 0 من ${products.length}`, metricEn: `Available: 0 of ${products.length}`, href: "/studio/menu",
    });
  }

  const missingImages = products.filter((product) => !product.imageUrl.trim());
  if (missingImages.length > 0) {
    add(actions, {
      key: "images", priority: missingImages.length >= Math.max(3, Math.ceil(products.length * 0.4)) ? "medium" : "low",
      titleAr: "ارفع صورًا للأصناف الأهم", titleEn: "Add images to priority items",
      reasonAr: "هناك أصناف بلا صور؛ ابدأ بالأصناف التي تريد إبرازها بدل إضافة صور عشوائية.", reasonEn: "Some items have no images; start with the items you want to feature instead of adding images randomly.",
      metricAr: `${missingImages.length} صنف بلا صورة`, metricEn: `${missingImages.length} items without images`, href: "/studio/menu",
    });
  }

  const incompleteBilingual = products.filter((product) => !product.nameEn.trim() || !product.descriptionAr.trim() || !product.descriptionEn.trim());
  if (incompleteBilingual.length > 0) {
    add(actions, {
      key: "bilingual-content", priority: "medium", titleAr: "أكمل المحتوى الثنائي اللغة", titleEn: "Complete bilingual content",
      reasonAr: "بعض الأصناف لا تملك الاسم أو الوصف الكامل بالعربية والإنجليزية.", reasonEn: "Some items are missing complete Arabic or English naming and descriptions.",
      metricAr: `${incompleteBilingual.length} صنف يحتاج محتوى`, metricEn: `${incompleteBilingual.length} items need content`, href: "/studio/menu",
    });
  }

  if (categories.length > 0 && products.length > 0) {
    const uncategorized = products.filter((product) => !product.categoryId).length;
    if (uncategorized > 0) {
      add(actions, {
        key: "categories", priority: "high", titleAr: "رتّب الأصناف داخل التصنيفات", titleEn: "Organize items into categories",
        reasonAr: "أصناف بلا تصنيف واضح قد تجعل التصفح أقل وضوحًا.", reasonEn: "Uncategorized items can make browsing less clear.",
        metricAr: `${uncategorized} صنف بلا تصنيف`, metricEn: `${uncategorized} uncategorized items`, href: "/studio/menu",
      });
    }
  }

  const activeBranch = branches.some((branch) => branch.isActive);
  if (!activeBranch) {
    add(actions, {
      key: "active-branch", priority: "high", titleAr: "فعّل فرعًا للقائمة", titleEn: "Activate a menu branch",
      reasonAr: "لا يوجد فرع نشط حاليًا؛ راجع إعدادات الفروع قبل مشاركة القائمة.", reasonEn: "There is no active branch; review branch settings before sharing the menu.",
      metricAr: "الفروع النشطة: 0", metricEn: "Active branches: 0", href: "/studio/branches",
    });
  }

  if (analytics?.topProducts[0]) {
    const top = analytics.topProducts[0];
    const topProduct = products.find((product) => product.id === top.id);
    if (topProduct && (!topProduct.imageUrl.trim() || !topProduct.descriptionAr.trim() || !topProduct.descriptionEn.trim())) {
      add(actions, {
        key: "top-product", priority: "high", titleAr: "حسّن الصنف الأكثر مشاهدة أولًا", titleEn: "Improve the most-viewed item first",
        reasonAr: `الصنف ${topProduct.nameAr} هو الأكثر مشاهدة في الفترة الحالية، لكنه لا يزال يملك محتوى ناقصًا.`, reasonEn: `${topProduct.nameEn || topProduct.nameAr} is the most-viewed item in the current period but still has incomplete content.`,
        metricAr: `${top.count} مشاهدة`, metricEn: `${top.count} views`, href: "/studio/menu",
      });
    }
  }

  if (analytics && analytics.uniqueSessions > 0 && analytics.whatsappClicks === 0 && tenant.whatsapp.trim()) {
    add(actions, {
      key: "whatsapp", priority: "medium", titleAr: "راجع وضوح مسار واتساب", titleEn: "Review WhatsApp action visibility",
      reasonAr: "توجد جلسات مسجلة لكن لا توجد نقرات واتساب في الفترة الحالية؛ راجع أن الإجراء ظاهر ومفهوم للضيف.", reasonEn: "Sessions are recorded but no WhatsApp clicks appear in the current period; review whether the action is visible and understandable.",
      metricAr: `${analytics.uniqueSessions} جلسة · 0 نقرة واتساب`, metricEn: `${analytics.uniqueSessions} sessions · 0 WhatsApp clicks`, href: "/studio/brand",
    });
  }

  const summaryAr = actions.length === 0
    ? "لا توجد أولوية واضحة الآن. استمر في مراقبة بيانات القائمة وحسّن الأصناف عند ظهور إشارة جديدة."
    : `لديك ${actions.length} خطوة عملية مرتبة حسب الأولوية. ابدأ بأول خطوة ثم أعد الفحص.`;
  const summaryEn = actions.length === 0
    ? "There is no clear priority right now. Keep monitoring menu data and improve items as new signals appear."
    : `${actions.length} practical actions are prioritized for you. Start with the first one, then recheck.`;

  const rank: Record<AdvisorPriority, number> = { high: 0, medium: 1, low: 2 };
  actions.sort((a, b) => rank[a.priority] - rank[b.priority]);
  return { summaryAr, summaryEn, actions: actions.slice(0, 6) };
}
