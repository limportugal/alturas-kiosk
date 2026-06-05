import { useEffect } from 'react';
import { useCartStore } from '@/Kiosk/store/useCartStore';
import { CartItem } from '@/Kiosk/types/cart-types';

import { CartStoreService }    from '@/Kiosk/services/cart/CartStoreService';
import { CartUpdateService }   from '@/Kiosk/services/cart/CartUpdateService';
import { CartConfirmService }  from '@/Kiosk/services/cart/CartConfirmService';
import { GetActiveCartService } from '@/Kiosk/services/cart/GetActiveCartService';

export const useCart = () => {
    const {
        cartId,
        cartNumber,
        cartItems,
        status,
        setCartId,
        setCartNumber,
        setCartItems,
        setStatus,
        addItem: storeAddItem,
        removeItem,
        updateItemQty,
        clearCart,
        getTotalAmount,
    } = useCartStore();

    // Restore active cart on mount
    useEffect(() => {
        const fetchActiveCart = async () => {
            try {
                const response = await GetActiveCartService();
                const cart = response.data;

                if (cart) {
                    setCartId(cart.id);
                    setCartNumber(cart.cart_number);
                    setCartItems(cart.cart_items);
                    setStatus(cart.status);
                }
            } catch {
                // No active cart, start fresh
            }
        };

        if (cartId === null) {
            fetchActiveCart();
        }
    }, []);

    const addItem = async (item: CartItem) => {
        // Update store optimistically
        storeAddItem(item);

        const updatedItems = (() => {
            const existing = cartItems.find((i) => i.product_id === item.product_id);
            if (existing) {
                const newQty = existing.quantity + item.quantity;
                return cartItems.map((i) =>
                    i.product_id === item.product_id
                        ? { ...i, quantity: newQty, subtotal: i.price * newQty }
                        : i
                );
            }
            return [...cartItems, item];
        })();

        if (cartId === null) {
            const result = await CartStoreService(updatedItems);
            setCartId(result.data.id);
            setCartNumber(result.data.cart_number);
        } else {
            await CartUpdateService(cartId, updatedItems);
        }
    };

    const removeCartItem = async (product_id: number) => {
        removeItem(product_id);

        const updatedItems = cartItems.filter((i) => i.product_id !== product_id);

        if (cartId !== null) {
            await CartUpdateService(cartId, updatedItems);
        }
    };

    const updateQty = async (product_id: number, quantity: number) => {
        updateItemQty(product_id, quantity);

        const updatedItems = cartItems.map((i) =>
            i.product_id === product_id
                ? { ...i, quantity, subtotal: i.price * quantity }
                : i
        );

        if (cartId !== null) {
            await CartUpdateService(cartId, updatedItems);
        }
    };

    const confirmCart = async () => {
        if (cartId === null) return;

        await CartConfirmService(cartId);
        clearCart();
    };

    return {
        cartId,
        cartNumber,
        cartItems,
        status,
        addItem,
        removeItem: removeCartItem,
        updateQty,
        confirmCart,
        clearCart,
        getTotalAmount,
    };
};
