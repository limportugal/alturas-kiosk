export interface ProductColorVariant {
  id: number;
  product_item_id: number;
  color_name: string;
  image_path?: string | null;
}

export interface ProductImage {
  id: number;
  product_item_id: number;
  image_path: string;
  is_primary: boolean;
  sort_order: number;
}


export interface ProductItem {
  id: number;
  item_code: string;
  name: string;
  sku: string;
  item_category_id: number;
  sub_category_id?: number | null;
  category_name?: string;
  sub_category_name?: string | null;
  price: number;
  quantity: number;
  item_description?: string;
  status:string;
  action: string;
  images?: ProductImage[];
  color_variants?: ProductColorVariant[];
}

// A new variant being added (no id yet)
export interface NewColorVariant {
  color_name: string;
  image_path?: File | null; 
  previewUrl?: string | null;
}

export interface ProductPayload {
  item_code: string;
  name: string;
  sku: string;
  item_category_id: number;
  sub_category_id?: number | null;
  price: string;
  quantity: string;
  item_description: string;
  status: string;
  images: File[];
  color_variants?: NewColorVariant[];
}

export interface CreateProductPayload extends ProductPayload {}

export interface UpdateProductPayload extends ProductPayload {
  id: number;
  existing_images?: ProductImage[];
  removed_image_ids?: number[];
  removed_variant_ids?: number[];
}


export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}
