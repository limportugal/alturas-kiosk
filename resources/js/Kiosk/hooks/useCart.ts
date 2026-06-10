import { useEffect } from 'react';
import { useCartStore } from '@/Kiosk/store/useCartStore';
import { CartItem } from '@/Kiosk/types/cart-types';

import { CartStoreService }      from '@/Kiosk/services/cart/CartStoreService';
import { CartUpdateService }     from '@/Kiosk/services/cart/CartUpdateService';
import { CartConfirmService }    from '@/Kiosk/services/cart/CartConfirmService';
import { CartDeactivateService } from '@/Kiosk/services/cart/CartDeactivateService';
import { GetActiveCartService }  from '@/Kiosk/services/cart/GetActiveCartService';

// ── No StockReserveService / StockReleaseService ──────────────────────────────
// Stock is NOT reserved on add/remove/update.
// Stock is only validated on Place Order (backend final check).
// Stock display is kept fresh via useStockPolling (silent background fetch).

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

    const getItems  = () => useCartStore.getState().cartItems;
    const getCartId = () => useCartStore.getState().cartId;

    // Restore active cart on mount
    useEffect(() => {
        const fetchActiveCart = async () => {
            try {
                const response = await GetActiveCartService();
                const cart = response.data;

                if (cart?.cart_items?.length > 0) {
                    setCartId(cart.id);
                    setCartNumber(cart.cart_number);
                    setCartItems(cart.cart_items);
                    setStatus(cart.status);
                }
            } catch {
                // No active cart, start fresh
            }
        };

        if (cartId === null) fetchActiveCart();
    }, []);

    // ── addItem ───────────────────────────────────────────────────────────────
    // No stock reserve — just update store and sync cart to DB
    const addItem = async (item: CartItem) => {
        storeAddItem(item);

        const currentItems  = getItems();
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
            // Keep local cart state
        }
    };

    // ── removeCartItem ────────────────────────────────────────────────────────
    // No stock release — just remove from store and sync cart to DB
    const removeCartItem = async (product_id: number, color: string | null) => {
        removeItem(product_id, color);

        const updatedItems  = getItems();
        const currentCartId = getCartId();

        if (currentCartId !== null) {
            if (updatedItems.length === 0) {
                await CartDeactivateService(currentCartId);
                clearCart();
            } else {
                await CartUpdateService(currentCartId, updatedItems);
            }
        }
    };

    // ── updateQty ─────────────────────────────────────────────────────────────
    // No stock reserve/release — just update store and sync cart to DB
    const updateQty = async (product_id: number, color: string | null, quantity: number) => {
        updateItemQty(product_id, color, quantity);

        const updatedItems  = getItems();
        const currentCartId = getCartId();

        if (currentCartId !== null) {
            await CartUpdateService(currentCartId, updatedItems);
        }
    };

    // ── confirmCart ───────────────────────────────────────────────────────────
    // Final stock validation happens here on the backend
    const confirmCart = async () => {
        const currentCartId = getCartId();
        if (currentCartId === null) return;

        await CartConfirmService(currentCartId);
        clearCart();
    };

    // ── clearCartWithDB ───────────────────────────────────────────────────────
    // No stock release needed — stock was never reserved
    const clearCartWithDB = async () => {
        const currentCartId = getCartId();
        if (currentCartId !== null) {
            await CartDeactivateService(currentCartId);
        }
        clearCart();
    };

    return {
        cartId,
        cartNumber,
        cartItems,
        status,
        addItem,
        removeItem:  removeCartItem,
        updateQty,
        confirmCart,
        clearCart:   clearCartWithDB,
        getTotalAmount,
    };
};
