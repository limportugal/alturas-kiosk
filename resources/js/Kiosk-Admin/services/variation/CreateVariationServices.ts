import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { VariationList, CreateVariationPayload } from '@/Kiosk-Admin/types/variation-types';

export const CreateVariationServices = async (
    payload: CreateVariationPayload
): Promise<{ message: string; data: VariationList }> => {
    const formData = new FormData();

    formData.append('name',   payload.name);
    formData.append('status', payload.status);

    if (payload.sub_category_id != null) {
        formData.append('sub_category_id', String(payload.sub_category_id));
    }

    if (payload.image_path instanceof File) {
        formData.append('image_path', payload.image_path);
    }
  

    const response = await api.post(relativeRoute('variation-store'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
