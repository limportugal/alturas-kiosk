import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { CategoryList, CreateCategoryPayload } from '@/Kiosk-Admin/types/category-types'

export const CreateCategortServices = async (payload: CreateCategoryPayload): Promise<{ message: string; data: CategoryList}> => {
    const formData = new FormData();
    
    formData.append('name', payload.name);

    if (payload.image_path instanceof File) {
        formData.append('image_path', payload.image_path);
        }
    formData.append('status', payload.status);

    const response = await api.post(route('category-store'), formData, {
         headers: {
      'Content-Type': 'multipart/form-data',
    },
    });
    return response.data;
}