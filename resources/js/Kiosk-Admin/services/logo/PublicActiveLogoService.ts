import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const PublicActiveLogoService = async (): Promise<{ logo_url: string }> => {
    const response = await api.get(relativeRoute('kiosk.active-logo'));
    return response.data;
};
