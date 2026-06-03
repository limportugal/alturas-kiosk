import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { ProductItem , PaginatedResponse} from '@/Kiosk-Admin/types/product-type';

export const ProductPublicServices = async():Promise<PaginatedResponse<ProductItem>> => {
    const response = await api.get(relativeRoute('product-public-list'));
    return response.data;
};
 