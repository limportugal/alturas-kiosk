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
  item_category_id: string;
  price: number;
  quantity: number;
  item_description?: string;
  status:string;
}

export interface CreateProductPayload {
  item_code: string;
  name: string;
  sku: string;
  item_category_id: string;
  price: string;
  quantity: string;
  item_description: string;
  status: string;
  images: File[];
}


export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}
