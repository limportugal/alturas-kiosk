import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { Cart, CartItem } from '@/Kiosk/types/cart-types';

export const CartUpdateService = async (
    id: number,
    cart_items: CartItem[]
): Promise<{ message: string; data: Cart }> => {
    const response = await api.put(relativeRoute('cart.update', id), { cart_items });
    return response.data;
};
