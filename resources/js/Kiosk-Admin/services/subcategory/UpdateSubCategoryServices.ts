import { uploadApi } from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { UpdateSubCategoryPayload } from '@/Kiosk-Admin/types/subcategory-types';

export const UpdateSubCategoryServices = async ({
    id,
    data,
}: {
    id: number;
    data: UpdateSubCategoryPayload;
}) => {
    const formData = new FormData();

    formData.append('item_category_id', String(data.item_category_id));
    formData.append('name', data.name);
    formData.append('status', data.status);
    formData.append('remove_image', data.remove_image ? '1' : '0');

    if (data.image_path instanceof File) {
        formData.append('image_path', data.image_path);
    }

    formData.append('_method', 'PUT');

    const response = await uploadApi.post(relativeRoute('sub-category-update', id), formData);
    return response.data;
};
