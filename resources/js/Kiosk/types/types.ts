export type Screen = "home" | "category" | "subcategory" | "product";

export interface ColorVariant {
  label: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  images: string[];
  colorVariants: ColorVariant[];
  tags?: string[];
}

export interface SubCategory {
  id: string;
  label: string;
  image: string;
  column: 0 | 1 | 2;
  row: number;
}

export interface CategoryData {
  id: string;
  label: string;
  image: string;
  description: string;
  subCategories: SubCategory[];
  subCategoryTabs: string[];
  products: Record<string, Product[]>;
}
