<?php

namespace App\Services\CartServices;

use App\Models\Cart\CartModel;

class CartGetService
{
    public function getActiveCart(): ?CartModel
    {
        return CartModel::where('status', 'active')
            ->latest()
            ->first();
    }
}
