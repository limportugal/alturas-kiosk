import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { Cart } from '@/Kiosk/types/cart-types';

export const GetActiveCartService = async (): Promise<{ data: Cart | null }> => {
    const response = await api.get(relativeRoute('cart.active'));
    return response.data;
};
