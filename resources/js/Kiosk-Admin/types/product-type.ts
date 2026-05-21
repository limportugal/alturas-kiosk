export interface ProductItem {
  id: number;
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  item_description?: string;
}


export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}