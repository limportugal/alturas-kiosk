import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { CategoryList,PaginatedResponse } from '@/Kiosk-Admin/types/category-types';

export const CategoriesPublicServices = async():Promise<PaginatedResponse<CategoryList>> => {
    const response = await api.get(route('category-public-list'));
    return response.data;
}