import type { OwnerAnalytics, Product, StudioSnapshot } from "./types";
import { buildGrowthMetrics, type GrowthMetrics } from "./growth";

export type AdvisorPriority = "high" | "medium" | "low";
export type VerifiedAnalyticsInsight = {
  key: string;
  priority: AdvisorPriority;
  titleAr: string;
  titleEn: string;
  evidenceAr: string;
  evidenceEn: string;
  interpretationAr: string;
  interpretationEn: string;
  recommendationAr: string;
  recommendationEn: string;
};

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
  insights: VerifiedAnalyticsInsight[];
  actions: AdvisorAction[];
};

function add(actions: AdvisorAction[], action: AdvisorAction) {
  if (!actions.some((item) => item.key === action.key)) actions.push(action);
}

function addInsight(insights: VerifiedAnalyticsInsight[], insight: VerifiedAnalyticsInsight) {
  if (!insights.some((item) => item.key === insight.key)) insights.push(insight);
}

function buildVerifiedAnalyticsInsights(analytics: OwnerAnalytics | null): VerifiedAnalyticsInsight[] {
  if (!analytics) return [];

  const insights: VerifiedAnalyticsInsight[] = [];
  const metrics: GrowthMetrics = buildGrowthMetrics(analytics);

  if (analytics.uniqueSessions === 0 && analytics.visits === 0 && analytics.productViews === 0) {
    addInsight(insights, {
      key: "analytics-baseline",
      priority: "medium",
      titleAr: "البيانات ما زالت في مرحلة خط الأساس",
      titleEn: "Analytics is still at baseline",
      evidenceAr: "لا توجد جلسات أو زيارات أو مشاهدات منتجات مسجلة في الفترة المحددة.",
      evidenceEn: "No sessions, visits, or product views are recorded in the selected period.",
      interpretationAr: "لا توجد عينة تشغيلية كافية لاستخلاص اتجاه أداء موثوق بعد.",
      interpretationEn: "There is not enough observed activity yet to establish a reliable performance direction.",
      recommendationAr: "شارك القائمة وابدأ بجمع بيانات فعلية قبل تقييم الأداء.",
      recommendationEn: "Share the menu and collect observed activity before evaluating performance.",
    });
    return insights;
  }

  if (analytics.visits > 0 && analytics.productViews === 0) {
    addInsight(insights, {
      key: "discovery-gap",
      priority: "high",
      titleAr: "الزيارة موجودة لكن تفاعل الأصناف غير مسجل",
      titleEn: "Visits are present but product interest is not",
      evidenceAr: `${analytics.visits} زيارة و0 مشاهدة منتج في الفترة المحددة.`,
      evidenceEn: `${analytics.visits} visits and 0 product views in the selected period.`,
      interpretationAr: "هذه إشارة إلى ضعف في الانتقال من دخول القائمة إلى استكشاف الأصناف، وليست نسبة تحويل.",
      interpretationEn: "This is a signal about movement from menu entry to product exploration, not a conversion rate.",
      recommendationAr: "راجع وضوح التصنيفات، الأصناف البارزة، ونقاط الدخول إلى المحتوى.",
      recommendationEn: "Review category clarity, featured items, and entry points into product content.",
    });
  }

  if (analytics.productViews > 0 && analytics.uniqueSessions > 0) {
    addInsight(insights, {
      key: "browse-depth",
      priority: metrics.averageViewsPerSession >= 2 ? "low" : "medium",
      titleAr: "عمق التصفح أصبح إشارة قابلة للمتابعة",
      titleEn: "Browse depth is now a trackable signal",
      evidenceAr: `${analytics.productViews} مشاهدة منتج عبر ${analytics.uniqueSessions} جلسة، بمتوسط ${metrics.averageViewsPerSession.toFixed(1)} مشاهدة لكل جلسة.`,
      evidenceEn: `${analytics.productViews} product views across ${analytics.uniqueSessions} sessions, averaging ${metrics.averageViewsPerSession.toFixed(1)} views per session.`,
      interpretationAr: "هذا يصف كثافة التصفح المسجلة فقط ولا يثبت نية شراء أو رضا العميل.",
      interpretationEn: "This describes recorded browsing depth only; it does not establish purchase intent or customer satisfaction.",
      recommendationAr: "راقب هذا المؤشر مع تغييرات القائمة بدل الحكم عليه منفردًا.",
      recommendationEn: "Monitor this signal alongside menu changes rather than judging it in isolation.",
    });
  }

  if (analytics.qrScans > 0) {
    addInsight(insights, {
      key: "qr-distribution",
      priority: analytics.visits === 0 ? "high" : "low",
      titleAr: "إشارة QR متاحة للمتابعة",
      titleEn: "QR distribution signal is available",
      evidenceAr: `${analytics.qrScans} عملية مسح QR و${analytics.visits} زيارة مسجلة في الفترة المحددة.`,
      evidenceEn: `${analytics.qrScans} QR scans and ${analytics.visits} recorded visits in the selected period.`,
      interpretationAr: "النسبة هنا علاقة بين أحداث مسجلة وليست قياسًا لمستخدمين فريدين أو لحملات تسويقية.",
      interpretationEn: "This is a relationship between recorded events, not a unique-user or campaign performance measure.",
      recommendationAr: "استخدمها لمقارنة نشاط نقاط الدخول إلى القائمة مع الوقت.",
      recommendationEn: "Use it to compare menu-entry activity over time.",
    });
  }

  if (analytics.uniqueSessions > 0 && analytics.whatsappClicks > 0) {
    addInsight(insights, {
      key: "whatsapp-intent",
      priority: "low",
      titleAr: "إشارة نية تواصل مسجلة",
      titleEn: "Recorded contact-intent signal",
      evidenceAr: `${analytics.whatsappClicks} نقرة واتساب عبر ${analytics.uniqueSessions} جلسة.`,
      evidenceEn: `${analytics.whatsappClicks} WhatsApp clicks across ${analytics.uniqueSessions} sessions.`,
      interpretationAr: "نقرات واتساب مؤشر على تفاعل عالي النية، لكنها لا تثبت إتمام طلب أو عملية بيع.",
      interpretationEn: "WhatsApp clicks indicate high-intent interaction, but do not prove an order or sale.",
      recommendationAr: "حافظ على وضوح إجراء التواصل وراقب التغير في هذا المؤشر مع الوقت.",
      recommendationEn: "Keep the contact action clear and monitor how this signal changes over time.",
    });
  }

  if (analytics.topProducts.length > 0) {
    const top = analytics.topProducts[0];
    addInsight(insights, {
      key: "leading-product",
      priority: "low",
      titleAr: "يوجد صنف متصدر في المشاهدات",
      titleEn: "A product is leading in recorded views",
      evidenceAr: `${top.nameAr} سجل ${top.count} مشاهدة في الفترة المحددة.`,
      evidenceEn: `${top.nameEn || top.nameAr} recorded ${top.count} views in the selected period.`,
      interpretationAr: "هذا ترتيب للمشاهدات المسجلة فقط، وليس حكمًا على الربحية أو الشعبية خارج البيانات.",
      interpretationEn: "This ranks recorded views only; it is not a profitability or popularity claim beyond the observed data.",
      recommendationAr: "راجع اكتمال هذا الصنف وجودة عرضه أولًا إذا كان هدفك تحسين محتوى القائمة.",
      recommendationEn: "Review this item's completeness and presentation first if your goal is to improve menu content.",
    });
  }

  return insights.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])).slice(0, 4);
}

export function buildMenuGrowthAdvisor(snapshot: StudioSnapshot, analytics: OwnerAnalytics | null): MenuGrowthAdvisor {
  const actions: AdvisorAction[] = [];
  const insights = buildVerifiedAnalyticsInsights(analytics);
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

  const summaryAr = insights.length > 0
    ? `${insights.length} إشارة مؤكدة من بيانات القائمة. ${insights[0].interpretationAr}`
    : actions.length === 0
      ? "لا توجد أولوية واضحة الآن. استمر في مراقبة بيانات القائمة وحسّن الأصناف عند ظهور إشارة جديدة."
      : `لديك ${actions.length} خطوة عملية مرتبة حسب الأولوية. ابدأ بأول خطوة ثم أعد الفحص.`;
  const summaryEn = insights.length > 0
    ? `${insights.length} verified signals from menu analytics. ${insights[0].interpretationEn}`
    : actions.length === 0
      ? "There is no clear priority right now. Keep monitoring menu data and improve items as new signals appear."
      : `${actions.length} practical actions are prioritized for you. Start with the first one, then recheck.`;

  const rank: Record<AdvisorPriority, number> = { high: 0, medium: 1, low: 2 };
  actions.sort((a, b) => rank[a.priority] - rank[b.priority]);
  return { summaryAr, summaryEn, insights, actions: actions.slice(0, 6) };
}
