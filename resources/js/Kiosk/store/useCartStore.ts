import { create } from 'zustand';
import { CartItem } from '@/Kiosk/types/cart-types';

interface CartStore {
    cartId:     number | null;
    cartNumber: string;
    cartItems:  CartItem[];
    status:     string;

    setCartId:     (cartId: number | null)  => void;
    setCartNumber: (cartNumber: string)     => void;
    setCartItems:  (cartItems: CartItem[])  => void;
    setStatus:     (status: string)         => void;

    addItem:       (item: CartItem)                        => void;
    removeItem:    (product_id: number)                    => void;
    updateItemQty: (product_id: number, quantity: number)  => void;
    clearCart:     ()                                      => void;
    getTotalAmount: ()                                     => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    cartId:     null,
    cartNumber: '',
    cartItems:  [],
    status:     'active',

    setCartId:     (cartId)     => set((state) => ({ ...state, cartId })),
    setCartNumber: (cartNumber) => set((state) => ({ ...state, cartNumber })),
    setCartItems:  (cartItems)  => set((state) => ({ ...state, cartItems })),
    setStatus:     (status)     => set((state) => ({ ...state, status })),

    addItem: (item) =>
        set((state) => {
            const existing = state.cartItems.find(
                (i) => i.product_id === item.product_id
            );

            if (existing) {
                const newQty = existing.quantity + item.quantity;
                return {
                    cartItems: state.cartItems.map((i) =>
                        i.product_id === item.product_id
                            ? { ...i, quantity: newQty, subtotal: i.price * newQty }
                            : i
                    ),
                };
            }

            return { cartItems: [...state.cartItems, item] };
        }),

    removeItem: (product_id) =>
        set((state) => ({
            cartItems: state.cartItems.filter((i) => i.product_id !== product_id),
        })),

    updateItemQty: (product_id, quantity) =>
        set((state) => ({
            cartItems: state.cartItems.map((i) =>
                i.product_id === product_id
                    ? { ...i, quantity, subtotal: i.price * quantity }
                    : i
            ),
        })),

    clearCart: () =>
        set({
            cartId:     null,
            cartNumber: '',
            cartItems:  [],
            status:     'active',
        }),

    getTotalAmount: () =>
        get().cartItems.reduce((sum, item) => sum + item.subtotal, 0),
}));
