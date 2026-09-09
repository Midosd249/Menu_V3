import { createHash } from "node:crypto";
import type { z } from "zod";
import type { submitOrderSchema } from "./order-security-types";

export const normalizeOrderPhone = (phone: string) => phone.replace(/[^0-9+]/g, "");

const sha256Hex = (value: string) => createHash("sha256").update(value).digest("hex");

export const orderRateKey = (tenantId: string, branchId: string, phone: string) =>
  sha256Hex(`${tenantId}:${branchId}:${normalizeOrderPhone(phone)}`);

export const orderFingerprint = (
  data: z.infer<typeof submitOrderSchema>,
  tenantId: string,
  branchId: string,
) =>
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
