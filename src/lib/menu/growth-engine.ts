import type { OwnerAnalytics, StudioSnapshot } from "./types";

export type GrowthEvidenceLevel = "verified" | "insufficient";
export type GrowthActionKind = "content" | "presentation" | "distribution" | "measurement";

export type GrowthRecommendation = {
  key: string;
  priority: "high" | "medium" | "low";
  kind: GrowthActionKind;
  titleAr: string;
  titleEn: string;
  evidenceAr: string;
  evidenceEn: string;
  recommendationAr: string;
  recommendationEn: string;
  href: "/studio/menu" | "/studio/brand" | "/studio/qr" | "/studio/intelligence";
};

export type GrowthLoop = {
  currentStage: "observe" | "act" | "measure";
  stageAr: string;
  stageEn: string;
  nextAr: string;
  nextEn: string;
  evidence: GrowthEvidenceLevel;
};

export type ExperimentOpportunity = {
  key: string;
  titleAr: string;
  titleEn: string;
  hypothesisAr: string;
  hypothesisEn: string;
  primaryMetricAr: string;
  primaryMetricEn: string;
  guardrailAr: string;
  guardrailEn: string;
  eligibilityAr: string;
  eligibilityEn: string;
  status: "active" | "ready" | "insufficient-evidence";
};

export type MenuGrowthEngine = {
  loop: GrowthLoop;
  recommendations: GrowthRecommendation[];
  experiments: ExperimentOpportunity[];
};

function addRecommendation(items: GrowthRecommendation[], item: GrowthRecommendation) {
  if (!items.some((existing) => existing.key === item.key)) items.push(item);
}

function buildRecommendations(snapshot: StudioSnapshot, analytics: OwnerAnalytics | null) {
  const recommendations: GrowthRecommendation[] = [];
  const products = snapshot.products;
  const incomplete = products.filter(
    (product) => !product.nameEn.trim() || !product.descriptionAr.trim() || !product.descriptionEn.trim(),
  );
  const missingImages = products.filter((product) => !product.imageUrl.trim());

  if (!snapshot.tenant.isPublished) {
    addRecommendation(recommendations, {
      key: "publish-menu",
      priority: "high",
      kind: "distribution",
      titleAr: "فعّل نقطة الدخول العامة",
      titleEn: "Activate the public entry point",
      evidenceAr: "القائمة الحالية غير منشورة.",
      evidenceEn: "The current menu is not published.",
      recommendationAr: "راجع القائمة وانشرها قبل توجيه أي زيارات إليها.",
      recommendationEn: "Review and publish the menu before directing traffic to it.",
      href: "/studio/brand",
    });
  }

  if (incomplete.length > 0) {
    addRecommendation(recommendations, {
      key: "complete-content",
      priority: incomplete.length >= Math.max(3, Math.ceil(Math.max(products.length, 1) * 0.35)) ? "high" : "medium",
      kind: "content",
      titleAr: "أكمل المحتوى قبل تحسين التحويل",
      titleEn: "Complete content before optimizing conversion",
      evidenceAr: `${incomplete.length} من ${products.length} صنفًا تحتاج محتوى عربي/إنجليزي مكتملًا.`,
      evidenceEn: `${incomplete.length} of ${products.length} products need complete Arabic/English content.`,
      recommendationAr: "ابدأ بالأصناف البارزة أو الأكثر مشاهدة، ثم أعد فحص صحة القائمة.",
      recommendationEn: "Start with featured or most-viewed items, then re-check menu health.",
      href: "/studio/menu",
    });
  }

  if (missingImages.length > 0) {
    addRecommendation(recommendations, {
      key: "priority-images",
      priority: missingImages.length >= 3 ? "medium" : "low",
      kind: "presentation",
      titleAr: "حسّن عرض الأصناف ذات الأولوية",
      titleEn: "Improve priority item presentation",
      evidenceAr: `${missingImages.length} صنفًا بلا صورة في البيانات الحالية.`,
      evidenceEn: `${missingImages.length} items have no image in the current data.`,
      recommendationAr: "أضف صورًا للأصناف التي تريد إبرازها أولًا، لا لكل الأصناف عشوائيًا.",
      recommendationEn: "Add images to the items you want to feature first rather than treating every item equally.",
      href: "/studio/menu",
    });
  }

  if (!analytics || analytics.uniqueSessions < 10) {
    addRecommendation(recommendations, {
      key: "collect-evidence",
      priority: "medium",
      kind: "measurement",
      titleAr: "اجمع دليلًا قبل اتخاذ قرار نمو",
      titleEn: "Collect evidence before making a growth decision",
      evidenceAr: analytics ? `${analytics.uniqueSessions} جلسة فقط مسجلة في نافذة التحليل.` : "لا توجد بيانات تحليلات متاحة.",
      evidenceEn: analytics ? `Only ${analytics.uniqueSessions} sessions are recorded in the analysis window.` : "Analytics data is not available.",
      recommendationAr: "اترك القائمة تعمل واجمع زيارات حقيقية قبل الحكم على اتجاه الأداء.",
      recommendationEn: "Keep the menu live and collect real traffic before judging performance direction.",
      href: "/studio/intelligence",
    });
  }

  if (analytics && analytics.uniqueSessions >= 10 && analytics.productViews > 0) {
    addRecommendation(recommendations, {
      key: "browse-depth",
      priority: analytics.productViews / analytics.uniqueSessions < 2 ? "medium" : "low",
      kind: "presentation",
      titleAr: "اختبر تحسين الانتقال من الدخول إلى استكشاف الأصناف",
      titleEn: "Improve the path from entry to product exploration",
      evidenceAr: `${analytics.productViews} مشاهدة منتج عبر ${analytics.uniqueSessions} جلسة في النافذة الحالية.`,
      evidenceEn: `${analytics.productViews} product views across ${analytics.uniqueSessions} sessions in the current window.`,
      recommendationAr: "راجع وضوح التصنيفات والأصناف البارزة، ثم قارن الإشارة بعد التغيير.",
      recommendationEn: "Review category clarity and featured items, then compare the signal after the change.",
      href: "/studio/intelligence",
    });
  }

  if (analytics && analytics.qrScans > 0) {
    addRecommendation(recommendations, {
      key: "qr-distribution",
      priority: "low",
      kind: "distribution",
      titleAr: "حسّن نقاط توزيع القائمة",
      titleEn: "Improve menu distribution points",
      evidenceAr: `${analytics.qrScans} مسح QR مسجل في نافذة التحليل.`,
      evidenceEn: `${analytics.qrScans} QR scans are recorded in the analysis window.`,
      recommendationAr: "استخدم QR في نقاط دخول واضحة، ثم راقب الزيارات الناتجة بمرور الوقت.",
      recommendationEn: "Use QR codes at clear entry points, then monitor resulting visits over time.",
      href: "/studio/qr",
    });
  }

  return recommendations.slice(0, 6);
}

function buildLoop(snapshot: StudioSnapshot, analytics: OwnerAnalytics | null): GrowthLoop {
  if (!snapshot.tenant.isPublished || snapshot.health.score < 80) {
    return {
      currentStage: "act",
      stageAr: "إجراء",
      stageEn: "Act",
      nextAr: "أكمل أولويات صحة القائمة ثم أعد القياس.",
      nextEn: "Complete menu-health priorities, then measure again.",
      evidence: "verified",
    };
  }
  if (!analytics || analytics.uniqueSessions < 10) {
    return {
      currentStage: "observe",
      stageAr: "مراقبة",
      stageEn: "Observe",
      nextAr: "اترك القائمة تجمع زيارات حقيقية قبل اختبار تغيير جديد.",
      nextEn: "Let the menu collect real traffic before testing another change.",
      evidence: "insufficient",
    };
  }
  return {
    currentStage: "measure",
    stageAr: "قياس",
    stageEn: "Measure",
    nextAr: "اختر توصية واحدة قابلة للعزل ثم راقب أثرها.",
    nextEn: "Choose one isolatable recommendation and monitor its effect.",
    evidence: "verified",
  };
}

function buildExperiments(analytics: OwnerAnalytics | null): ExperimentOpportunity[] {
  const enoughTraffic = Boolean(analytics && analytics.uniqueSessions >= 50);
  return [
    {
      key: "whatsapp-cta-v1",
      titleAr: "WhatsApp CTA — التجربة الحالية",
      titleEn: "WhatsApp CTA — current experiment",
      hypothesisAr: "زيادة وضوح إجراء واتساب قد تزيد جلسات النقر دون تقليل استكشاف الأصناف.",
      hypothesisEn: "Making the WhatsApp action more prominent may increase click-intent sessions without reducing product exploration.",
      primaryMetricAr: "جلسات WhatsApp-click ÷ الجلسات المعرّضة",
      primaryMetricEn: "WhatsApp-click sessions / exposed sessions",
      guardrailAr: "جلسات product-view ÷ الجلسات المعرّضة",
      guardrailEn: "Product-view sessions / exposed sessions",
      eligibilityAr: "تُحسم فقط بعد 50 جلسة معرّضة لكل متغير.",
      eligibilityEn: "Decision requires 50 exposed sessions per variant.",
      status: "active",
    },
    {
      key: "featured-item-order",
      titleAr: "ترتيب الصنف البارز",
      titleEn: "Featured-item ordering",
      hypothesisAr: "إبراز صنف مثبت بالأدلة في بداية التصفح قد يزيد استكشافه دون إضعاف عمق التصفح.",
      hypothesisEn: "Placing an evidence-backed featured item earlier may increase its exploration without reducing browse depth.",
      primaryMetricAr: "جلسات مشاهدة الصنف ÷ الجلسات المعرّضة",
      primaryMetricEn: "Item-view sessions / exposed sessions",
      guardrailAr: "متوسط مشاهدات المنتجات لكل جلسة",
      guardrailEn: "Average product views per session",
      eligibilityAr: enoughTraffic ? "جاهز لتصميم تجربة؛ يجب تحديد صنف واضح ومتغير واحد قبل التفعيل." : "يحتاج حركة حقيقية إضافية قبل التفعيل.",
      eligibilityEn: enoughTraffic ? "Ready for experiment design; define one item and one isolated change before activation." : "Needs more real traffic before activation.",
      status: enoughTraffic ? "ready" : "insufficient-evidence",
    },
    {
      key: "category-entry",
      titleAr: "وضوح مدخل التصنيف",
      titleEn: "Category-entry clarity",
      hypothesisAr: "تحسين ترتيب/وضوح مدخل التصنيفات قد يرفع انتقال الجلسات إلى مشاهدة الأصناف.",
      hypothesisEn: "Improving category-entry clarity may increase movement from menu entry to product exploration.",
      primaryMetricAr: "جلسات product-view ÷ جلسات الزيارة",
      primaryMetricEn: "Product-view sessions / visit sessions",
      guardrailAr: "عمق التصفح لكل جلسة",
      guardrailEn: "Browse depth per session",
      eligibilityAr: analytics && analytics.visits >= 50 ? "جاهز لتصميم تجربة؛ لا تُفعل تجربة قبل تثبيت baseline." : "ينتظر baseline حقيقيًا كافيًا.",
      eligibilityEn: analytics && analytics.visits >= 50 ? "Ready for experiment design; establish a baseline before activation." : "Waiting for enough real baseline traffic.",
      status: analytics && analytics.visits >= 50 ? "ready" : "insufficient-evidence",
    },
  ];
}

export function buildMenuGrowthEngine(snapshot: StudioSnapshot, analytics: OwnerAnalytics | null): MenuGrowthEngine {
  return {
    loop: buildLoop(snapshot, analytics),
    recommendations: buildRecommendations(snapshot, analytics),
    experiments: buildExperiments(analytics),
  };
}
