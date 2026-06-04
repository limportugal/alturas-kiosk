import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { VariationList } from '@/Kiosk-Admin/types/variation-types';

export const getVariations = async (): Promise<VariationList[]> => {
    const response = await api.get(relativeRoute('variation-dropdown'));
    return response.data;
};
