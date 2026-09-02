import { bool, num } from "@/lib/utils";
import type { Branch, BranchHour, Category, Product, Tenant } from "./types";

function str(value: unknown): string {
  return value == null ? "" : String(value);
}

export function mapTenant(row: Record<string, unknown>): Tenant {
  return {
    id: str(row.id),
    ownerUserId: str(row.owner_user_id),
    slug: str(row.slug),
    nameAr: str(row.name_ar),
    nameEn: str(row.name_en),
    taglineAr: str(row.tagline_ar),
    taglineEn: str(row.tagline_en),
    logoUrl: str(row.logo_url),
    coverUrl: str(row.cover_url),
    instagramUrl: str(row.instagram_url),
    whatsapp: str(row.whatsapp),
    whatsappTemplate: str(row.whatsapp_template) || "السلام عليكم، أريد الاستفسار عن {product} من {restaurant}.",
    primaryColor: str(row.primary_color) || "#171411",
    accentColor: str(row.accent_color) || "#8f4e32",
    currency: str(row.currency) || "SAR",
    city: str(row.city),
    country: str(row.country) || "SA",
    isPublished: bool(row.is_published),
    isActive: bool(row.is_active),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
  };
}

export function mapBranch(row: Record<string, unknown>): Branch {
  return {
    id: str(row.id),
    tenantId: str(row.tenant_id),
    slug: str(row.slug),
    nameAr: str(row.name_ar),
    nameEn: str(row.name_en),
    addressAr: str(row.address_ar),
    addressEn: str(row.address_en),
    mapsUrl: str(row.maps_url),
    phone: str(row.phone),
    isActive: bool(row.is_active),
  };
}

export function mapHour(row: Record<string, unknown>): BranchHour {
  return {
    branchId: str(row.branch_id),
    weekday: num(row.weekday),
    opensAt: row.opens_at == null ? null : str(row.opens_at).slice(0, 5),
    closesAt: row.closes_at == null ? null : str(row.closes_at).slice(0, 5),
    isClosed: bool(row.is_closed),
  };
}

export function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: str(row.id),
    tenantId: str(row.tenant_id),
    sortOrder: num(row.sort_order),
    nameAr: str(row.name_ar),
    nameEn: str(row.name_en),
    isActive: bool(row.is_active),
  };
}

export function mapProduct(row: Record<string, unknown>): Product {
  const caloriesRaw = row.calories;
  return {
    id: str(row.id),
    tenantId: str(row.tenant_id),
    categoryId: row.category_id == null ? null : str(row.category_id),
    sortOrder: num(row.sort_order),
    nameAr: str(row.name_ar),
    nameEn: str(row.name_en),
    descriptionAr: str(row.description_ar),
    descriptionEn: str(row.description_en),
    price: num(row.price),
    currency: str(row.currency) || "SAR",
    imageUrl: str(row.image_url),
    calories: caloriesRaw == null || caloriesRaw === "" ? null : num(caloriesRaw),
    isAvailable: bool(row.is_available),
    isFeatured: bool(row.is_featured),
    allergens: str(row.allergens),
  };
}
