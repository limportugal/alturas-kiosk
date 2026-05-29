import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { UpdateCategoryPayload } from '@/Kiosk-Admin/types/category-types';

export const UpdateCategoryServices = async ({ id,data}:
    { id: number, data: UpdateCategoryPayload }) => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('status', data.status);
        formData.append('remove_image', data.remove_image ? '1' : '0');

        if (data.image_path instanceof File) {
            formData.append('image_path', data.image_path);
        }

        formData.append('_method', 'PUT');

        const response = await api.post(route('category-update', id), formData, {
            headers: {
              'Content-Type': 'multipart/form-data',  
            },
        }
    );
    return response.data;
};
