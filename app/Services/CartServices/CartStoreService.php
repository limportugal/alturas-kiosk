<?php

namespace App\Services\CartServices;

use Illuminate\Support\Facades\DB;
use App\Models\Cart\CartModel;

class CartStoreService
{
    public function store(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $cartNumber = $this->generateCartNumber();

            $cart = CartModel::create([
                'cart_number' => $cartNumber,
                'cart_items'  => $data['cart_items'],
                'status'      => 'active',
            ]);

            return [
                'message' => 'Cart created successfully',
                'data'    => $cart,
            ];
        });
    }

    private function generateCartNumber(): string
    {
        $today = now()->format('Ymd');
        $prefix = 'CART-' . $today . '-';

        $count = CartModel::whereDate('created_at', now()->toDateString())->count();
        $sequence = str_pad($count + 1, 4, '0', STR_PAD_LEFT);

        return $prefix . $sequence;
    }
}
