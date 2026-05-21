import api from '@/lib/axios';
import { ProductItem, PaginatedResponse } from '@/Kiosk-Admin/types/product-type';
import { route } from 'ziggy-js';

export const ProductsServices = async (): Promise<PaginatedResponse<ProductItem>> => {    
    const response = await api.get(route('product-list'));
    return response.data;
}