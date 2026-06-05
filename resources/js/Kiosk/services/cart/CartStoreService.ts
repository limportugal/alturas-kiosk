import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { Cart, CartItem } from '@/Kiosk/types/cart-types';

export const CartStoreService = async (
    cart_items: CartItem[]
): Promise<{ message: string; data: Cart }> => {
    const response = await api.post(relativeRoute('cart.store'), { cart_items });
    return response.data;
};
