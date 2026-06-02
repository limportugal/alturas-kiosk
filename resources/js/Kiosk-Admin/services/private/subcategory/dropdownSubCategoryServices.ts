import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { SubCategoryList } from '@/Kiosk-Admin/types/subcategory-types';

export const getSubCategories = async (): Promise<SubCategoryList[]> => {
    const response = await api.get(relativeRoute('sub-category-dropdown'));
    return response.data;
};
