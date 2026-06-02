import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const updateSubCatStatus = async (subCatId: number) => {
    const response = await api.put(relativeRoute('sub-category-status', subCatId));
    return response.data;
};
