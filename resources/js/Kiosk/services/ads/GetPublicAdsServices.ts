import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { AdsList } from '@/Kiosk-Admin/types/ads-types';

export interface PublicAdsResponse {
    data: AdsList[];
}

export const GetPublicAdsServices = async (): Promise<PublicAdsResponse> => {
    const response = await api.get(relativeRoute('ads.public-list'));
    return response.data;
};
