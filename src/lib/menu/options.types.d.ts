declare module "./types" {
  export interface ProductVariant {
    id: string;
    tenantId: string;
    productId: string;
    nameAr: string;
    nameEn: string;
    price: number;
    sortOrder: number;
    isAvailable: boolean;
  }

  export interface ModifierGroup {
    id: string;
    tenantId: string;
    nameAr: string;
    nameEn: string;
    minSelect: number;
    maxSelect: number;
    sortOrder: number;
    isRequired: boolean;
    isActive: boolean;
  }

  export interface ModifierOption {
    id: string;
    tenantId: string;
    groupId: string;
    nameAr: string;
    nameEn: string;
    priceDelta: number;
    sortOrder: number;
    isAvailable: boolean;
  }
}
