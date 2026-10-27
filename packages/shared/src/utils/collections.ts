import type {
  Carrier,
  Product,
  ProductCategory,
  ProductStatus,
  WarehouseLocation,
} from "../types/models";

export type SortOrder = "asc" | "desc";
export interface ProductFilters {
  warehouse?: WarehouseLocation;
  category?: ProductCategory;
  status?: ProductStatus;
  minStock?: number;
  maxStock?: number;
  lowStockOnly?: boolean;
}
export interface ProductSortField {
  field:
    | "sku"
    | "name"
    | "warehouse"
    | "category"
    | "stockQuantity"
    | "weightKg"
    | "unitCostUSD";
  order: SortOrder;
}

export function filterProductsByWarehouse(
  products: Product[],
  warehouse: WarehouseLocation,
): Product[] {
  return products.filter(
    (product: Product): boolean => product.warehouse === warehouse,
  );
}

export function filterProductsByCategory(
  products: Product[],
  category: ProductCategory,
): Product[] {
  return products.filter(
    (product: Product): boolean => product.category === category,
  );
}

export function filterLowStockProducts(products: Product[]): Product[] {
  return products.filter(
    (product: Product): boolean =>
      product.stockQuantity <= product.minStockThreshold,
  );
}

export function sortProductsByStock(
  products: Product[],
  order: SortOrder,
): Product[] {
  return [...products].sort(
    (a: Product, b: Product): number =>
      (a.stockQuantity - b.stockQuantity) * (order === "asc" ? 1 : -1),
  );
}

export function sortCarriersByReliability(
  carriers: Carrier[],
  order: SortOrder,
): Carrier[] {
  return [...carriers].sort(
    (a: Carrier, b: Carrier): number =>
      (a.onTimeRate - b.onTimeRate) * (order === "asc" ? 1 : -1),
  );
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  return products.filter(
    (product: Product): boolean =>
      (filters.warehouse === undefined ||
        product.warehouse === filters.warehouse) &&
      (filters.category === undefined ||
        product.category === filters.category) &&
      (filters.status === undefined || product.status === filters.status) &&
      (filters.minStock === undefined ||
        product.stockQuantity >= filters.minStock) &&
      (filters.maxStock === undefined ||
        product.stockQuantity <= filters.maxStock) &&
      (!filters.lowStockOnly ||
        product.stockQuantity <= product.minStockThreshold),
  );
}

export function sortProductsByFields(
  products: Product[],
  fields: ProductSortField[],
): Product[] {
  return [...products].sort((a: Product, b: Product): number => {
    for (const { field, order } of fields) {
      const left = a[field];
      const right = b[field];
      const comparison =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      if (comparison !== 0) return comparison * (order === "asc" ? 1 : -1);
    }
    return 0;
  });
}
