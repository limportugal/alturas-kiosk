import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const ToggleLogoStatusService = async (
    id: number
): Promise<{ toggle: any }> => {
    const response = await api.patch(relativeRoute('logos.status', { id }));
    return response.data;
};
