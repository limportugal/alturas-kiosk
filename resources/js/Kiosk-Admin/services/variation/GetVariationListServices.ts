import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { VariationList, PaginatedResponse } from '@/Kiosk-Admin/types/variation-types';

export const VariationListServices = async (): Promise<PaginatedResponse<VariationList>> => {
    const response = await api.get(relativeRoute('variation-list'));
    return response.data;
};
