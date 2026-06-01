import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { SubCategoryList } from '@/Kiosk-Admin/types/subcategory-types';
import { PaginatedResponse } from '@/Kiosk-Admin/types/category-types';

export const SubCategoriesServices = async (): Promise<PaginatedResponse<SubCategoryList>> => {
    const response = await api.get(route('sub-category-list'));
    return response.data;
};
