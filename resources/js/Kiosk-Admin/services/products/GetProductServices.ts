import api from '@/lib/axios';
import { ProductItem, PaginatedResponse } from '@/Kiosk-Admin/types/product-type';
import { relativeRoute } from '@/lib/relativeRoute';

export const ProductsServices = async (): Promise<PaginatedResponse<ProductItem>> => {    
    const response = await api.get(relativeRoute('product-list'));
    return response.data;
}
