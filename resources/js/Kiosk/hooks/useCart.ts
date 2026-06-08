import { useEffect } from 'react';
import { useCartStore } from '@/Kiosk/store/useCartStore';
import { CartItem } from '@/Kiosk/types/cart-types';

import { CartStoreService }      from '@/Kiosk/services/cart/CartStoreService';
import { CartUpdateService }     from '@/Kiosk/services/cart/CartUpdateService';
import { CartConfirmService }    from '@/Kiosk/services/cart/CartConfirmService';
import { CartDeactivateService } from '@/Kiosk/services/cart/CartDeactivateService';
import { GetActiveCartService }  from '@/Kiosk/services/cart/GetActiveCartService';

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

    // Read fresh state from store (avoids stale closure bugs)
    const getItems  = () => useCartStore.getState().cartItems;
    const getCartId = () => useCartStore.getState().cartId;

    // Restore active cart on mount
    useEffect(() => {
        const fetchActiveCart = async () => {
            try {
                const response = await GetActiveCartService();
                const cart = response.data;

                if (cart && cart.cart_items && cart.cart_items.length > 0) {
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
        // Update store first, then sync to API in the background
        storeAddItem(item);

        const currentItems = getItems();
        const currentCartId = getCartId();

        try {
            if (currentCartId === null) {
                const result = await CartStoreService(currentItems);
                setCartId(result.data.id);
                setCartNumber(result.data.cart_number);
            } else {
                await CartUpdateService(currentCartId, currentItems);
            }
        } catch {
            // Keep local cart state; API sync can retry on next action
        }
    };

    const removeCartItem = async (product_id: number, color: string | null) => {
        // Update store first, then read fresh state
        removeItem(product_id, color);

        const updatedItems  = getItems();
        const currentCartId = getCartId();

        if (currentCartId !== null) {
            if (updatedItems.length === 0) {
                // Last item removed — deactivate the cart instead of sending empty array
                await CartDeactivateService(currentCartId);
                clearCart(); // resets cartId to null → reactivate path on next addItem
            } else {
                await CartUpdateService(currentCartId, updatedItems);
            }
        }
    };

    const updateQty = async (product_id: number, color: string | null, quantity: number) => {
        // Update store first, then read fresh state
        updateItemQty(product_id, color, quantity);

        const updatedItems  = getItems();
        const currentCartId = getCartId();

        if (currentCartId !== null) {
            await CartUpdateService(currentCartId, updatedItems);
        }
    };

    const confirmCart = async () => {
        const currentCartId = getCartId();
        if (currentCartId === null) return;

        await CartConfirmService(currentCartId);
        clearCart();
    };

    const clearCartWithDB = async () => {
        const currentCartId = getCartId();
        if (currentCartId !== null) {
            // Set status to inactive in DB — keeps the row, clears items
            // Next addItem will reactivate this same row instead of creating a new one
            await CartDeactivateService(currentCartId);
        }
        clearCart(); // resets cartId to null in store → triggers reactivate path on next addItem
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
        clearCart: clearCartWithDB,
        getTotalAmount,
    };
};
