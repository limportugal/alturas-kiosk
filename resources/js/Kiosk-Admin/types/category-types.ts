export interface DropdownCategory
{
    id: number;
    name: string;
}

export interface CategoryList { 
    id: number;
    name: string;
    description: string;
    image_path?: string;
    status: string;
    actions?: string;
}

export interface CategoryPayload {
  name: string;
  description: string
  image_path?: File | null; // or File | null
  status: string;
}

export interface CreateCategoryPayload
  extends CategoryPayload {}

export interface UpdateCategoryPayload
  extends CategoryPayload{
  id: number;
  remove_image?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}
