import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { SubCategoryList } from '@/Kiosk-Admin/types/subcategory-types';

export const getSubCategories = async (): Promise<SubCategoryList[]> => {
    const response = await api.get(route('sub-category-dropdown'));
    return response.data;
};
