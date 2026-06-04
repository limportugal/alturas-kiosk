import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { VariationList , PaginatedResponse} from '@/Kiosk-Admin/types/variation-types';

export const ProductVariationsPublicServices = async():Promise<PaginatedResponse<VariationList>> => {
    const response = await api.get(relativeRoute('product-variations-public-list'));
    return response.data;
};
 