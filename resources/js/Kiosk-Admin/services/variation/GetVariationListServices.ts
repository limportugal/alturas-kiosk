import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { VariationList } from '@/Kiosk-Admin/types/variation-types';
import { PaginatedResponse } from '@/Kiosk-Admin/types/category-types';

export const VariationListServices = async (): Promise<PaginatedResponse<VariationList>> => {
    const response = await api.get(relativeRoute('variation-list'));
    return response.data;
};
