<?php

namespace App\Services\CartServices;

use Illuminate\Support\Facades\DB;
use App\Models\Cart\CartModel;

class CartUpdateService
{
    public function update(array $data, int $id): array
    {
        return DB::transaction(function () use ($data, $id) {
            $cart = CartModel::findOrFail($id);

            $cart->update([
                'cart_items' => $data['cart_items'],
            ]);

            return [
                'message' => 'Cart updated successfully',
                'data'    => $cart->fresh(),
            ];
        });
    }
}
