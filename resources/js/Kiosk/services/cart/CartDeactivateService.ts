import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { Cart } from '@/Kiosk/types/cart-types';

export const CartDeactivateService = async (
    id: number
): Promise<{ message: string; data: Cart }> => {
    const response = await api.put(relativeRoute('cart.deactivate', id));
    return response.data;
};
