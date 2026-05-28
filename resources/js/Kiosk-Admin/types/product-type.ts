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
  category_name?: string;
  price: number;
  quantity: number;
  item_description?: string;
  status:string;
  action: string;
  images?: ProductImage[];
}

export interface ProductPayload {
  item_code: string;
  name: string;
  sku: string;
  item_category_id: number;
  price: string;
  quantity: string;
  item_description: string;
  status: string;
  images: File[];
}


export interface CreateProductPayload
  extends ProductPayload {}

export interface UpdateProductPayload
extends ProductPayload {
  id: number;
}


export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}
