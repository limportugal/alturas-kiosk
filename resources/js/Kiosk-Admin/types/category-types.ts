export interface DropdownCategory
{
    id: number;
    name: string;
}

export interface CategoryList { 
    id: number;
    name: string;
    image_path?: string;
    status: string;
    actions: string;
}

export interface CategoryPayload {
  name: string;
  image_path?: File; // or File | null
  status: string;
}

export interface CreateCategoryPayload
  extends CategoryPayload {}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}