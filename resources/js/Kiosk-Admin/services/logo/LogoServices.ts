import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';

export const GetLogoService = async (): Promise<{ logo: string | null }> => {
    const response = await api.get(relativeRoute('logo-settings.show'));
    return response.data;
};

export const UpdateLogoService = async (
    file: File
): Promise<{ message: string; logo: string }> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await api.post(relativeRoute('logo-settings.update'), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const ResetLogoService = async (): Promise<{ message: string; logo: null }> => {
    const response = await api.delete(relativeRoute('logo-settings.reset'));
    return response.data;
};
