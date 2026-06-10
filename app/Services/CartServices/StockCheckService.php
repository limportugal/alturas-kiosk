<?php

namespace App\Services\CartServices;

use Illuminate\Support\Facades\Cache;
use App\Models\ProductItem\ProductItemModel;
use App\Models\ProductItem\ProductColorVariant;

class StockCheckService
{
    /**
     * Returns current stock with a 10-second cache.
     *
     * Cache key is unique per product + color combo.
     * Even if multiple kiosks request at the same time, only 1 DB query
     * fires per 10 seconds per product/variant.
     */
    public function check(int $product_id, ?string $color = null): array
    {
        $cacheKey = "stock_{$product_id}_" . ($color ?? 'no_color');

        return Cache::remember($cacheKey, 10, function () use ($product_id, $color) {

            $product    = ProductItemModel::findOrFail($product_id);
            $variantQty = null;

            if ($color !== null) {
                $variant    = ProductColorVariant::where('product_item_id', $product_id)
                    ->where('color_name', $color)
                    ->first();
                $variantQty = $variant?->quantity ?? 0;
            }

            // Color selected → variant qty is source of truth
            // No color → product qty is source of truth
            $isSoldOut = $color !== null
                ? $variantQty <= 0
                : $product->quantity <= 0;

            return [
                'product_quantity' => $product->quantity,
                'variant_quantity' => $variantQty,
                'is_sold_out'      => $isSoldOut,
            ];
        });
    }

    /**
     * Bust cache after any stock mutation (confirm order).
     * Ensures next stock check hits DB fresh.
     */
    public function bustCache(int $product_id, ?string $color = null): void
    {
        Cache::forget("stock_{$product_id}_" . ($color ?? 'no_color'));
        Cache::forget("stock_{$product_id}_no_color"); // always bust product-level too
    }
}
