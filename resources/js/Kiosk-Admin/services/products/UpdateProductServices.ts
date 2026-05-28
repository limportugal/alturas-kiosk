import api from '@/lib/axios';
import { route } from 'ziggy-js';
import { UpdateProductPayload } from '@/Kiosk-Admin/types/product-type';

export const UpdateProductServices = async ({
    id,
    data,
}: {
    id: number;
    data: UpdateProductPayload;
}) => {
    const response = await api.put(route('product.update-item', id), data,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};