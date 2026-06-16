import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { CreateAdPayload, AdsList } from '@/Kiosk-Admin/types/ads-types';

export const CreateAdServices = async (
    payload: CreateAdPayload
): Promise<{ created: AdsList }> => {
    const formData = new FormData();
    formData.append('title',      payload.title);
    formData.append('sort_order', String(payload.sort_order));
    formData.append('duration',   String(payload.duration));
    formData.append('status',     payload.status);
    if (payload.file_path instanceof File) {
        formData.append('file_path', payload.file_path);
    }
    const response = await api.post(relativeRoute('ads-store'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
