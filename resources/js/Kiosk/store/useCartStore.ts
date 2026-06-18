import { create } from 'zustand';
import { CartItem } from '@/Kiosk/types/cart-types';

const ItemKey = (product_id: number, color?: string | null) =>
    `${product_id}::${color ?? '__none__'}`;

interface CartStore {
    cartId:     number | null;
    cartNumber: string;
    cartItems:  CartItem[];
    status:     string;
    isClearing: boolean;

    setCartId:     (cartId: number | null)  => void;
    setCartNumber: (cartNumber: string)     => void;
    setCartItems:  (cartItems: CartItem[])  => void;
    setStatus:     (status: string)         => void;
    setIsClearing: (isClearing: boolean)    => void;

    addItem: (item: CartItem) => void;
    removeItem: (product_id: number, color: string | null) => void;
    updateItemQty: (product_id: number, color: string | null, quantity: number) => void;
    clearCart: () => void;
    getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    cartId: null,
    cartNumber: '',
    cartItems: [],
    status: 'active',
    isClearing: false,

    setCartId:     (cartId)         => set((state) => ({ ...state, cartId })),
    setCartNumber: (cartNumber)     => set((state) => ({ ...state, cartNumber })),
    setCartItems:  (cartItems)      => set((state) => ({ ...state, cartItems })),
    setStatus:     (status)         => set((state) => ({ ...state, status })),
    setIsClearing: (isClearing)     => set((state) => ({ ...state, isClearing })),

    addItem: (item) =>
        set((state) => {
            const key = ItemKey(item.product_id, item.color);
            const existing = state.cartItems.find(
                (i) => ItemKey(i.product_id, i.color) === key
            );

            if (existing) {
                const newQty = existing.quantity + item.quantity;
                return {
                    cartItems: state.cartItems.map((i) =>
                        ItemKey(i.product_id, i.color) === key
                            ? { ...i, quantity: newQty, subtotal: i.price * newQty }
                            : i
                    ),
                };
            }

            return { cartItems: [...state.cartItems, item] };
        }),

    removeItem: (product_id: number, color: string | null) =>
        set((state) => {
            const key = ItemKey(product_id, color);
            return {
                cartItems: state.cartItems.filter(
                    (i) => ItemKey(i.product_id, i.color) !== key
                ),
            };
        }),

    updateItemQty: (product_id: number, color: string | null, quantity: number) =>
        set((state) => {
            const key = ItemKey(product_id, color);
            return {
                cartItems: state.cartItems.map((i) =>
                    ItemKey(i.product_id, i.color) === key
                        ? { ...i, quantity, subtotal: i.price * quantity }
                        : i
                ),
            };
        }),

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
