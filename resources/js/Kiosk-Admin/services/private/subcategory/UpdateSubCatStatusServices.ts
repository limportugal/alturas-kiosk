import api from '@/lib/axios';
import { route } from 'ziggy-js';

export const updateSubCatStatus = async (subCatId: number) => {
    const response = await api.put(route('sub-category-status', subCatId));
    return response.data;
};
