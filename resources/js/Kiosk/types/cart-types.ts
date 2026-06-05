export interface CartItem {
  product_id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  color?: string | null;
  image?: string | null;
  subtotal: number;
}

export interface Cart {
  id: number;
  cart_number: string;
  cart_items: CartItem[];
  status: 'active' | 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}
