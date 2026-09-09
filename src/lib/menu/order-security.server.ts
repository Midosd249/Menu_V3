import { createHash } from "node:crypto";

type OrderFingerprintInput = {
  slug: string;
  source: "web" | "qr";
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  items: unknown;
};

export const normalizeOrderPhone = (phone: string) => phone.replace(/[^0-9+]/g, "");
const sha256Hex = (value: string) => createHash("sha256").update(value).digest("hex");

export const orderRateKey = (tenantId: string, branchId: string, phone: string) =>
  sha256Hex(`${tenantId}:${branchId}:${normalizeOrderPhone(phone)}`);

export const orderFingerprint = (data: OrderFingerprintInput, tenantId: string, branchId: string) =>
  sha256Hex(JSON.stringify({
    tenantId,
    branchId,
    slug: data.slug,
    source: data.source,
    customerName: data.customerName,
    customerPhone: normalizeOrderPhone(data.customerPhone),
    customerEmail: data.customerEmail || "",
    notes: data.notes || "",
    items: data.items,
  }));
