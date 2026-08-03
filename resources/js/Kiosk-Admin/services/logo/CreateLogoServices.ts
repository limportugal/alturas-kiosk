import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { LogoStorePayload, LogoList } from '@/Kiosk-Admin/types/logo-types';

export const CreateLogoService = async (
    payload: LogoStorePayload
): Promise<{ created: LogoList }> => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('image', payload.image);
    formData.append('status', payload.status);

    const response = await api.post(relativeRoute('logos.store'), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
