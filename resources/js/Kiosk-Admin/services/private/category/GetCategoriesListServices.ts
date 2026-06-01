import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { CategoryList,PaginatedResponse } from '@/Kiosk-Admin/types/category-types';

export const CategoriesServices = async():Promise<PaginatedResponse<CategoryList>> => {
    const response = await api.get(route('category-list'));
    return response.data;
}
