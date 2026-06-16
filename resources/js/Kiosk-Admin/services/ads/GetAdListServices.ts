import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { AdsList } from '@/Kiosk-Admin/types/ads-types';
import { PaginatedResponse } from '@/Kiosk-Admin/types/category-types';

export const GetAdListServices = async (): Promise<PaginatedResponse<AdsList>> => {
    const response = await api.get(relativeRoute('ads-list'));
    return response.data;
};
