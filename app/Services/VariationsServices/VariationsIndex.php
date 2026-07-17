<?php 

namespace App\Services\VariationsServices;

use App\Models\ProductItem\ProductVariations;

class VariationsIndex
{
    public function getVariationIndex() {
        return ProductVariations::with('subCategory:id,name')
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('id')
            ->get();
    }
}