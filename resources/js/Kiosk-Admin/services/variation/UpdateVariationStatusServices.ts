import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const updateVariationStatus = async (variationId: number) => {
    const response = await api.put(relativeRoute('variation-status', variationId));
    return response.data;
};
