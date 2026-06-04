import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { DropdownVariation } from '@/Kiosk-Admin/types/variation-types';

export const getVariations = async (): Promise<DropdownVariation[]> => {
    const response = await api.get(relativeRoute('variation-dropdown'));
    return response.data;
};
