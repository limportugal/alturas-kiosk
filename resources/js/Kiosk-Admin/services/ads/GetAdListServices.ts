import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { AdsList } from '@/Kiosk-Admin/types/ads-types';


export const GetAdListServices = async (): Promise<AdsList[]> => {
    const response = await api.get(relativeRoute('ads-list'));
    //  console.log(response.data);
    return response.data;
};
