export const ORDER_STATUSES = ["new", "confirmed", "preparing", "ready", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  new: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function isOrderStatusTransitionAllowed(from: string, to: string): boolean {
  return from === to || (ORDER_STATUS_TRANSITIONS[from as OrderStatus] ?? []).includes(to as OrderStatus);
}

export function getOrderStatusTransitionError(from: string, to: string): { ok: false; code: "invalid"; error: string } | null {
  return isOrderStatusTransitionAllowed(from, to)
    ? null
    : { ok: false, code: "invalid", error: "لا يمكن نقل الطلب إلى الحالة المطلوبة من حالته الحالية." };
}
