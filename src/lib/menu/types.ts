import type { ThemeKey } from "@/lib/theme";

export type Lang = "ar" | "en";
export type Role = "owner" | "admin" | "editor" | "staff";
export type AccessRole = "tenant_owner" | "branch_manager" | "staff" | "editor";

export function accessRoleToRole(accessRole: AccessRole): Role {
  switch (accessRole) {
    case "tenant_owner": return "owner";
    case "branch_manager": return "admin";
    case "editor": return "editor";
    case "staff": return "staff";
  }
}

export function roleToAccessRole(role: Role): AccessRole {
  switch (role) {
    case "owner": return "tenant_owner";
    case "admin": return "branch_manager";
    case "editor": return "editor";
    case "staff": return "staff";
  }
}

export type EventType = "visit" | "product_view" | "qr_scan" | "whatsapp";
export type FnOk<T> = { ok: true; data: T };
export type FnErr = { ok: false; error: string; code: "not_found" | "unauthorized" | "forbidden" | "unavailable" | "invalid" };
export type FnResult<T> = FnOk<T> | FnErr;
export type Tenant = { id: string; ownerUserId: string; slug: string; nameAr: string; nameEn: string; taglineAr: string; taglineEn: string; logoUrl: string; coverUrl: string; instagramUrl: string; whatsapp: string; whatsappTemplate: string; primaryColor: string; accentColor: string; themeKey: ThemeKey; currency: string; city: string; country: string; isPublished: boolean; isActive: boolean; createdAt: string; updatedAt: string };
export type Branch = { id: string; tenantId: string; slug: string; nameAr: string; nameEn: string; addressAr: string; addressEn: string; mapsUrl: string; phone: string; isActive: boolean };
export type BranchHour = { branchId: string; weekday: number; opensAt: string | null; closesAt: string | null; isClosed: boolean };
export type Category = { id: string; tenantId: string; sortOrder: number; nameAr: string; nameEn: string; isActive: boolean };
export type Product = { id: string; tenantId: string; categoryId: string | null; sortOrder: number; nameAr: string; nameEn: string; descriptionAr: string; descriptionEn: string; price: number; currency: string; imageUrl: string; calories: number | null; isAvailable: boolean; isFeatured: boolean; allergens: string; tags: string[]; dietaryLabels: string[] };
export type ProductVariant = { id: string; tenantId: string; productId: string; nameAr: string; nameEn: string; price: number; sortOrder: number; isAvailable: boolean };
export type ModifierGroup = { id: string; tenantId: string; nameAr: string; nameEn: string; minSelect: number; maxSelect: number; sortOrder: number; isRequired: boolean; isActive: boolean };
export type ModifierOption = { id: string; tenantId: string; groupId: string; nameAr: string; nameEn: string; priceDelta: number; sortOrder: number; isAvailable: boolean };
export type ProductOptions = { variants: ProductVariant[]; groups: ModifierGroup[]; options: ModifierOption[] };
export type Membership = { tenantId: string; userId: string; role: Role };
export type PublicMenu = { tenant: Tenant; branch: Branch; branches: Branch[]; hours: BranchHour[]; categories: Category[]; products: Product[]; productOptions?: Record<string, ProductOptions> };
export type AttentionItem = { key: string; severity: "high" | "medium" | "low"; titleAr: string; titleEn: string; href: string };
export type MenuHealth = { score: number; checks: Array<{ key: string; ok: boolean; labelAr: string; labelEn: string }>; attention: AttentionItem[] };
export type AnalyticsPoint = { day: string; visits: number; views: number };
export type AnalyticsTop = { id: string; nameAr: string; nameEn: string; count: number };
export type OwnerAnalytics = { rangeDays: number; visits: number; uniqueSessions: number; productViews: number; qrScans: number; whatsappClicks: number; langAr: number; langEn: number; series: AnalyticsPoint[]; topProducts: AnalyticsTop[]; byCategory: AnalyticsTop[]; byBranch: AnalyticsTop[] };
export type StudioSnapshot = { tenant: Tenant; role: Role; branches: Branch[]; categories: Category[]; products: Product[]; members: Array<{ userId: string; role: Role }>; health: MenuHealth };
export type ImportRow = { nameAr: string; nameEn: string; categoryAr: string; categoryEn: string; descriptionAr: string; descriptionEn: string; price: number; imageUrl: string; calories: number | null; isFeatured: boolean; isAvailable: boolean; tags?: string[]; dietaryLabels?: string[]; issues: string[] };
