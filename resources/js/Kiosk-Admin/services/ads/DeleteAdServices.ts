import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const DeleteAdServices = async (id: number): Promise<{ deleted: boolean }> => {
    const response = await api.delete(relativeRoute('ads-delete', id));
    return response.data;
};
