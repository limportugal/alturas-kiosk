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
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}