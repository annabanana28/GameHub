import type { Product } from "../model/Product";

export function matchesCategory(product: Product, category?: string): boolean {
  return !category || product.category === category;
}