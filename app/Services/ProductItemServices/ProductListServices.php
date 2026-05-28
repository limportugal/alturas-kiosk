<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;

class ProductListServices
{
    public function showProductList()
    {
        return ProductItemModel::query()
            ->with('images')
            ->join('item_categories', 'product_items.item_category_id', '=', 'item_categories.id')
            ->select(
                'product_items.id',
                'product_items.item_code',
                'product_items.name',
                'product_items.sku',
                'product_items.item_category_id',
                'item_categories.name as category_name',
                'product_items.price',
                'product_items.quantity',
                'product_items.item_description',
                'product_items.status'
            )
            ->latest('product_items.id')
            ->paginate(10);
    }
}