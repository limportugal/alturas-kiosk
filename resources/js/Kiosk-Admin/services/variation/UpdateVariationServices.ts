import { uploadApi } from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { UpdateVariationPayload } from '@/Kiosk-Admin/types/variation-types';

export const UpdateVariationServices = async ({
    id,
    data,
}: {
    id: number;
    data: UpdateVariationPayload;
}) => {
    const formData = new FormData();

    formData.append('name',         data.name);
    formData.append('status',       data.status);
    formData.append('remove_image', data.remove_image ? '1' : '0');

    if (data.sub_category_id != null) {
        formData.append('sub_category_id', String(data.sub_category_id));
    }

    if (data.image_path instanceof File) {
        formData.append('image_path', data.image_path);
    }

    formData.append('_method', 'PUT');

    const response = await uploadApi.post(relativeRoute('variation-update', id), formData);
    return response.data;
};
