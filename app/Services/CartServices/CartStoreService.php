<?php

namespace App\Services\CartServices;

use Illuminate\Support\Facades\DB;
use App\Models\Cart\CartModel;

class CartStoreService
{
    public function store(array $data): array
    {
        return DB::transaction(function () use ($data) {

            // Reuse the most recent inactive cart instead of creating a new one
            $existing = CartModel::where('status', 'inactive')->latest()->first();

            if ($existing) {
                $existing->update([
                    'cart_items' => $data['cart_items'],
                    'status'     => 'active',
                ]);

                return [
                    'message' => 'Cart reactivated',
                    'data'    => $existing->fresh(),
                ];
            }

            $cart = CartModel::create([
                'cart_number' => $this->generateCartNumber(),
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
        $today  = now()->format('Ymd');
        $prefix = 'CART-' . $today . '-';
        $count  = CartModel::whereDate('created_at', now()->toDateString())->count();

        return $prefix . str_pad($count + 1, 4, '0', STR_PAD_LEFT);
    }
}
