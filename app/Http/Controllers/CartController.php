<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\CartServices\CartStoreService;
use App\Services\CartServices\CartUpdateService;
use App\Services\CartServices\CartConfirmService;
use App\Services\CartServices\CartGetService;

class CartController extends Controller
{
    private array $cartItemRules = [
        'cart_items'              => ['required', 'array'],
        'cart_items.*.product_id' => ['required', 'integer'],
        'cart_items.*.name'       => ['required', 'string'],
        'cart_items.*.sku'        => ['required', 'string'],
        'cart_items.*.price'      => ['required', 'numeric'],
        'cart_items.*.quantity'   => ['required', 'integer', 'min:1'],
        'cart_items.*.color'      => ['nullable', 'string'],
        'cart_items.*.image'      => ['nullable', 'string'],
        'cart_items.*.subtotal'   => ['required', 'numeric'],
    ];

    public function store(Request $request, CartStoreService $service)
    {
        $validated = $request->validate($this->cartItemRules);

        $result = $service->store($validated);

        return response()->json($result);
    }

    public function update(Request $request, CartUpdateService $service, $id)
    {
        $validated = $request->validate($this->cartItemRules);

        $result = $service->update($validated, (int) $id);

        return response()->json($result);
    }

    public function confirm(CartConfirmService $service, $id)
    {
        $result = $service->confirm((int) $id);

        return response()->json($result);
    }

    public function getActiveCart(CartGetService $service)
    {
        $cart = $service->getActiveCart();

        return response()->json([
            'data' => $cart,
        ]);
    }
}
