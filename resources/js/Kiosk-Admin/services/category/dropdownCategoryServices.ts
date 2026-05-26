import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { Category } from '@/Kiosk-Admin/types/category-types';

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get(route('category'));
    return response.data;
};