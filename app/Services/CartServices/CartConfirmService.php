<?php

namespace App\Services\CartServices;

use Illuminate\Support\Facades\DB;
use App\Models\Cart\CartModel;

class CartConfirmService
{
    public function confirm(int $id): array
    {
        return DB::transaction(function () use ($id) {
            $cart = CartModel::findOrFail($id);

            $cart->update(['status' => 'confirmed']);

            return [
                'message' => 'Cart confirmed successfully',
                'data'    => $cart->fresh(),
            ];
        });
    }
}
