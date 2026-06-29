<?php

namespace App\Services\CartServices;

use App\Services\Printer\ReceiptPrinterService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

use App\Models\Cart\CartModel;
use App\Models\ProductItem\ProductItemModel;
use App\Models\ProductItem\ProductColorVariant;

class CartConfirmService
{
    public function __construct(
        private StockCheckService $stockCheck = new StockCheckService(),
        private ?ReceiptPrinterService $receiptPrinter = null,
    ) {}

    public function confirm(int $id): array
    {
        return DB::transaction(function () use ($id) {
            $cart = CartModel::findOrFail($id);

            // ── Validate and deduct stock for every item ──────────────────────
            foreach ($cart->cart_items as $item) {
                $this->validateAndDeductStock(
                    product_id: $item['product_id'],
                    color:      $item['color'] ?? null,
                    qty:        $item['quantity']
                );
            }

            $cart->update(['status' => 'confirmed']);
            $confirmedCart = $cart->refresh();

            if (config('printing.enabled')){
            try{
                ($this->receiptPrinter ?? app(ReceiptPrinterService::class))
                    ->printConfirmedCart($confirmedCart);
            } catch (\Throwable $e) {
                 \Log::error('Confirmed cart print dispatch failed', [
                    'cart_id' => $cart->id,
                    'cart_number' => $cart->cart_number,
                    'error' => $e->getMessage(),
                ]);
            }
        }

            return [
                'message' => 'Cart confirmed successfully',
                'data'    => $confirmedCart,
            ];
        });
    }

    private function validateAndDeductStock(int $product_id, ?string $color, int $qty): void
    {
        $product = ProductItemModel::lockForUpdate()->findOrFail($product_id);

        if ($color !== null) {
            $variant = ProductColorVariant::lockForUpdate()
                ->where('product_item_id', $product_id)
                ->where('color_name', $color)
                ->firstOrFail();

            if ($variant->quantity < $qty) {
                throw ValidationException::withMessages([
                    'stock' => "{$product->name} ({$color}) is no longer available.",
                ]);
            }

            $variant->decrement('quantity', $qty);

            // Bust cache so next stock check hits DB fresh
            $this->stockCheck->bustCache($product_id, $color);
            return;
        }

        // No color — deduct from base product
        if ($product->quantity < $qty) {
            throw ValidationException::withMessages([
                'stock' => "{$product->name} is no longer available.",
            ]);
        }

        $product->decrement('quantity', $qty);

        // Bust cache for product-level stock
        $this->stockCheck->bustCache($product_id);
    }
}
