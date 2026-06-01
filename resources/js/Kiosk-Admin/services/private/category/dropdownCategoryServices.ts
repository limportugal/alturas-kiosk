import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { DropdownCategory } from '@/Kiosk-Admin/types/category-types';

export const getCategories = async (): Promise<DropdownCategory[]> => {
    const response = await api.get(route('category'));
    return response.data;
};
