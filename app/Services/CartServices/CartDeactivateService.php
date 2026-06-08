<?php

namespace App\Services\CartServices;

use Illuminate\Support\Facades\DB;
use App\Models\Cart\CartModel;

class CartDeactivateService
{
    public function deactivate(int $id): array
    {
        return DB::transaction(function () use ($id) {
            $cart = CartModel::findOrFail($id);

            $cart->update([
                'status'     => 'inactive',
                'cart_items' => [],
            ]);

            return [
                'message' => 'Cart cleared',
                'data'    => $cart->fresh(),
            ];
        });
    }
}
