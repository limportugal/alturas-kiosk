import { uploadApi } from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { UpdateCategoryPayload } from '@/Kiosk-Admin/types/category-types';

export const UpdateCategoryServices = async ({ id,data}:
    { id: number, data: UpdateCategoryPayload }) => {
        const formData = new FormData();

        formData.append('name', data.name);

        formData.append('description', data.description);
                // console.log('is active:', data.description);
        formData.append('status', data.status);
        formData.append('remove_image', data.remove_image ? '1' : '0');

        if (data.image_path && data.image_path instanceof File) {
            console.log('image_path:', data.image_path);

            formData.append('image_path', data.image_path);
        }

        formData.append('_method', 'PUT');

        const response = await uploadApi.post(relativeRoute('category-update', id), formData);
    return response.data;
};
