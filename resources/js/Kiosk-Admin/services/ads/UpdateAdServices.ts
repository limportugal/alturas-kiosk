import { uploadApi } from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { UpdateAdPayload, AdsList } from '@/Kiosk-Admin/types/ads-types';

export const UpdateAdServices = async ({
    id,
    data,
}: {
    id: number;
    data: UpdateAdPayload;
}): Promise<{ updated: AdsList }> => {
    const formData = new FormData();
    formData.append('title',      data.title);
    formData.append('sort_order', String(data.sort_order));
    formData.append('duration',   String(data.duration));
    formData.append('status',     data.status);
    if (data.file_path instanceof File) {
        formData.append('file_path', data.file_path);
    }
    formData.append('_method', 'PUT');
    const response = await uploadApi.post(relativeRoute('ads-update', id), formData);
    return response.data;
};
