import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { SubCategoryList, CreateSubCategoryPayload } from '@/Kiosk-Admin/types/subcategory-types';

export const CreateSubCategoryServices = async (
    payload: CreateSubCategoryPayload
): Promise<{ message: string; data: SubCategoryList }> => {
    const formData = new FormData();

    formData.append('item_category_id', String(payload.item_category_id));
    formData.append('name', payload.name);
    formData.append('status', payload.status);

    if (payload.image_path instanceof File) {
        formData.append('image_path', payload.image_path);
    }

    const response = await api.post(relativeRoute('sub-category-store'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
