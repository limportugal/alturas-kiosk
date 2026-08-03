import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { LogoList } from '@/Kiosk-Admin/types/logo-types';

export const GetLogosListServices = async (): Promise<{ data: LogoList[] }> => {
    const response = await api.get(relativeRoute('logos.list'));
    return response.data;
};
