import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { CategoryList,PaginatedResponse } from '@/Kiosk-Admin/types/category-types';

export const CategoriesServices = async():Promise<PaginatedResponse<CategoryList>> => {
    const response = await api.get(relativeRoute('category-list'));
    return response.data;
}
