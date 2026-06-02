import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { DropdownCategory } from '@/Kiosk-Admin/types/category-types';

export const getCategories = async (): Promise<DropdownCategory[]> => {
    const response = await api.get(relativeRoute('category'));
    return response.data;
};
