import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useDynamicQuery from '@/hooks/useDynamicQuery';
import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useCartStore } from '@/Kiosk/store/useCartStore';
import { CartItem } from '@/Kiosk/types/cart-types';

import { CartStoreService } from '@/Kiosk/services/cart/CartStoreService';
import { CartUpdateService } from '@/Kiosk/services/cart/CartUpdateService';
import { CartConfirmService } from '@/Kiosk/services/cart/CartConfirmService';
import { CartDeactivateService } from '@/Kiosk/services/cart/CartDeactivateService';
import { GetActiveCartService } from '@/Kiosk/services/cart/GetActiveCartService';
import { StockCheckService } from '@/Kiosk/services/stock/StockCheckService';

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
        clearCart: clearCartStore,
        getTotalAmount,
    } = useCartStore();

    const queryClient = useQueryClient();

    const getItems = () => useCartStore.getState().cartItems;
    const getCartId = () => useCartStore.getState().cartId;

    const { data: activeCartResponse } = useDynamicQuery(
        ['active-cart'],
        GetActiveCartService,
        {
            enabled: cartId === null,
            staleTime: 0,
            refetchInterval: false,
            refetchOnWindowFocus: false,
        }
    );

    const storeCartMutation = useDynamicMutation({
        mutationKey: ['active-cart'],
        mutationFn: (items: CartItem[]) => CartStoreService(items),
    });

    const updateCartMutation = useDynamicMutation({
        mutationKey: ['active-cart'],
        mutationFn: ({ id, items }: { id: number; items: CartItem[] }) =>
            CartUpdateService(id, items),
    });

    const confirmCartMutation = useDynamicMutation({
        mutationKey: ['product-list', 'screensaver-products'],
        mutationFn: (id: number) => CartConfirmService(id),
    });

    const deactivateCartMutation = useDynamicMutation({
        mutationKey: ['active-cart'],
        mutationFn: (id: number) => CartDeactivateService(id),
    });

    useEffect(() => {
        const syncActiveCart = async () => {
            const cart = activeCartResponse?.data;
            if (!cart?.cart_items?.length || cartId !== null) return;

            try {
                const cartItemsWithStock = await Promise.all(
                    cart.cart_items.map(async (item) => {
                        try {
                            const stock = await StockCheckService(
                                item.product_id,
                                item.color ?? null
                            );

                            return {
                                ...item,
                                stock: item.color
                                    ? (stock.variant_quantity ?? stock.product_quantity)
                                    : stock.product_quantity,
                            };
                        } catch {
                            return item;
                        }
                    })
                );

                setCartId(cart.id);
                setCartNumber(cart.cart_number);
                setCartItems(cartItemsWithStock);
                setStatus(cart.status);
            } catch {
                // No active cart, start fresh
            }
        };

        void syncActiveCart();
    }, [activeCartResponse, cartId, setCartId, setCartNumber, setCartItems, setStatus]);

    const addItem = async (item: CartItem) => {
        storeAddItem(item);

        const currentItems = getItems();
        const currentCartId = getCartId();

        try {
            if (currentCartId === null) {
                const result = await storeCartMutation.mutateAsync(currentItems);
                setCartId(result.data.id);
                setCartNumber(result.data.cart_number);
            } else {
                await updateCartMutation.mutateAsync({ id: currentCartId, items: currentItems });
            }
        } catch {
            // Keep local cart state
        }
    };

    const removeCartItem = async (product_id: number, color: string | null) => {
        removeItem(product_id, color);

        const updatedItems = getItems();
        const currentCartId = getCartId();

        if (currentCartId !== null) {
            if (updatedItems.length === 0) {
                await deactivateCartMutation.mutateAsync(currentCartId);
                clearCartStore();
            } else {
                await updateCartMutation.mutateAsync({ id: currentCartId, items: updatedItems });
            }
        }
    };

    const updateQty = async (product_id: number, color: string | null, quantity: number) => {
        updateItemQty(product_id, color, quantity);

        const updatedItems = getItems();
        const currentCartId = getCartId();

        if (currentCartId !== null) {
            await updateCartMutation.mutateAsync({ id: currentCartId, items: updatedItems });
        }
    };

    const confirmCart = async () => {
        const currentCartId = getCartId();
        if (currentCartId === null) return null;

        const result = await confirmCartMutation.mutateAsync(currentCartId);
        // Remove the active-cart cache BEFORE clearing store so the
        // useEffect sync doesn't re-populate from stale cache data
        queryClient.removeQueries({ queryKey: ['active-cart'] });
        clearCartStore();
        return result;
    };

    const clearCartWithDB = async () => {
        const currentCartId = getCartId();
        if (currentCartId !== null) {
            await deactivateCartMutation.mutateAsync(currentCartId);
        }
        clearCartStore();
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
