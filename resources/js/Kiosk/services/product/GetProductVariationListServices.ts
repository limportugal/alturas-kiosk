import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { VariationList } from '@/Kiosk-Admin/types/variation-types';

export const ProductVariationsPublicServices = async():Promise<VariationList[]> => {
    const response = await api.get(relativeRoute('product-variations-public-list'));
    return response.data;
};

 