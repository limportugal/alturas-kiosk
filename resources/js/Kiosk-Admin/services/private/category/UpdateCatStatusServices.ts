import api from '@/lib/axios';
import { route } from 'ziggy-js';

export const updateCatStatus = async (catId: number) => {
        const response = await api.put(route('category-status', catId));
        return response.data;
};
