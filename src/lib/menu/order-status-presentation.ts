export const ORDER_STATUS_PRESENTATION = {
  new: { label: { ar: "جديد", en: "New" }, tone: "info", icon: "sparkles" },
  confirmed: { label: { ar: "مؤكد", en: "Confirmed" }, tone: "indigo", icon: "circle-check" },
  preparing: { label: { ar: "قيد التحضير", en: "Preparing" }, tone: "warning", icon: "clock" },
  ready: { label: { ar: "جاهز", en: "Ready" }, tone: "success", icon: "package-check" },
  completed: { label: { ar: "مكتمل", en: "Completed" }, tone: "neutral", icon: "check-circle" },
  cancelled: { label: { ar: "ملغى", en: "Cancelled" }, tone: "danger", icon: "circle-x" },
} as const;

export type OrderStatusPresentation = (typeof ORDER_STATUS_PRESENTATION)[keyof typeof ORDER_STATUS_PRESENTATION];

export function getOrderStatusPresentation(status: string): OrderStatusPresentation | null {
  return ORDER_STATUS_PRESENTATION[status as keyof typeof ORDER_STATUS_PRESENTATION] ?? null;
}
