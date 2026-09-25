import type { AdminOrder } from "./orders";
import type { Tenant } from "./types";

export type OrderReceiptItem = {
  id: string;
  nameAr: string;
  nameEn: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  note?: string;
};

export type OrderReceiptData = {
  orderId: string;
  orderNumber: number;
  restaurantNameAr: string;
  restaurantNameEn: string;
  restaurantLogoUrl: string;
  branchNameAr: string;
  branchNameEn: string;
  createdAt: string;
  currency: string;
  customerName: string;
  items: OrderReceiptItem[];
  subtotal: number;
  total: number;
  vatRegistrationNumber: string;
};

export function buildOrderReceiptFromAdminOrder(order: AdminOrder, tenant: Tenant): OrderReceiptData {
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    restaurantNameAr: tenant.nameAr,
    restaurantNameEn: tenant.nameEn,
    restaurantLogoUrl: tenant.logoUrl,
    branchNameAr: order.branchName,
    branchNameEn: order.branchName,
    createdAt: order.createdAt,
    currency: order.currency,
    customerName: order.customerName,
    items: order.items.map((item) => ({
      id: item.id,
      nameAr: item.productNameAr,
      nameEn: item.productNameEn,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      note: item.selectedOptions.find((option) => option.type === "note")?.nameAr || undefined,
    })),
    subtotal: order.subtotal,
    total: order.total,
    vatRegistrationNumber: tenant.vatRegistrationNumber,
  };
}
