<?php

namespace App\Services\CartServices;

use App\Models\Cart\CartModel;

class CartGetService
{
    /**
     * Returns the most recent active cart (has items, session in progress).
     */
    public function getActiveCart(): ?CartModel
    {
        return CartModel::where('status', 'active')
            ->latest()
            ->first();
    }

    /**
     * Returns the most recent inactive cart (cleared but not confirmed).
     * Used to reactivate the session when a new item is added.
     */
    public function getInactiveCart(): ?CartModel
    {
        return CartModel::where('status', 'inactive')
            ->latest()
            ->first();
    }
}
