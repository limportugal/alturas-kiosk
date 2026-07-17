import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { VariationList, PaginatedResponse } from '@/Kiosk-Admin/types/variation-types';

export const VariationListServices = async (): Promise<VariationList[]> => {
    const response = await api.get(relativeRoute('variation-list'));
    console.log(response.data);
    return response.data;
};
