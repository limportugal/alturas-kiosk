import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const updateCatStatus = async (catId: number) => {
        const response = await api.put(relativeRoute('category-status', catId));
        return response.data;
};
