<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\CartServices\CartStoreService;
use App\Services\CartServices\CartUpdateService;
use App\Services\CartServices\CartConfirmService;
use App\Services\CartServices\CartDeactivateService;
use App\Services\CartServices\CartGetService;
use App\Services\CartServices\StockCheckService;

class CartController extends Controller
{
    private array $storeRules = [
        'cart_items'              => ['required', 'array', 'min:1'],
        'cart_items.*.product_id' => ['required', 'integer'],
        'cart_items.*.name'       => ['required', 'string'],
        'cart_items.*.sku'        => ['required', 'string'],
        'cart_items.*.price'      => ['required', 'numeric'],
        'cart_items.*.quantity'   => ['required', 'integer', 'min:1'],
        'cart_items.*.stock'      => ['required', 'integer', 'min:0'],
        'cart_items.*.color'      => ['nullable', 'string'],
        'cart_items.*.image'      => ['nullable', 'string'],
        'cart_items.*.subtotal'   => ['required', 'numeric'],
    ];

    private array $updateRules = [
        'cart_items'              => ['required', 'array', 'min:1'],
        'cart_items.*.product_id' => ['required', 'integer'],
        'cart_items.*.name'       => ['required', 'string'],
        'cart_items.*.sku'        => ['required', 'string'],
        'cart_items.*.price'      => ['required', 'numeric'],
        'cart_items.*.quantity'   => ['required', 'integer', 'min:1'],
        'cart_items.*.stock'      => ['required', 'integer', 'min:0'],
        'cart_items.*.color'      => ['nullable', 'string'],
        'cart_items.*.image'      => ['nullable', 'string'],
        'cart_items.*.subtotal'   => ['required', 'numeric'],
    ];

    public function store(Request $request, CartStoreService $service)
    {
        $validated = $request->validate($this->storeRules);
        $result = $service->store($validated);
        return response()->json($result);
    }

    public function update(Request $request, CartUpdateService $service, $id)
    {
        $validated = $request->validate($this->updateRules);
        $result = $service->update($validated, (int) $id);
        return response()->json($result);
    }

    public function confirm(CartConfirmService $service, $id)
    {
        $result = $service->confirm((int) $id);
        return response()->json($result);
    }

    public function deactivate(CartDeactivateService $service, $id)
    {
        $result = $service->deactivate((int) $id);
        return response()->json($result);
    }

    public function getActiveCart(CartGetService $service)
    {
        $cart = $service->getActiveCart();
        return response()->json(['data' => $cart]);
    }

    public function checkStock(Request $request, StockCheckService $service){
        
        $validated = $request->validate([
        'product_id' => ['required', 'integer'],
        'color'      => ['nullable', 'string'],
    ]);

    $result = $service->check(
        product_id: $validated['product_id'],
        color:      $validated['color'] ?? null,
    );

    return response()->json($result);
    }
}
