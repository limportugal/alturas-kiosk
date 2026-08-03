import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { LogoUpdatePayload, LogoList } from '@/Kiosk-Admin/types/logo-types';

export const UpdateLogoService = async ({
    id,
    payload,
}: {
    id: number;
    payload: LogoUpdatePayload;
}): Promise<{ updated: LogoList }> => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('status', payload.status);
    formData.append('_method', 'PUT');

    if (payload.image) {
        formData.append('image', payload.image);
    }

    const response = await api.post(relativeRoute('logos.update', { id }), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
