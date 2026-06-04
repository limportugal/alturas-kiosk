<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;

class ProductListServices
{
    public function showProductList()
    {
        return ProductItemModel::query()
            ->with(['images', 'colorVariants', 'variationType'])
            ->join('item_categories', 'product_items.item_category_id', '=', 'item_categories.id')
            ->leftJoin('sub_categories', 'product_items.sub_category_id', '=', 'sub_categories.id')
            ->select(
                'product_items.id',
                'product_items.item_code',
                'product_items.name',
                'product_items.sku',
                'product_items.item_category_id',
                'product_items.sub_category_id',
                'item_categories.name as category_name',
                'sub_categories.name as sub_category_name',
                'product_items.price',
                'product_items.quantity',
                'product_items.item_description',
                'product_items.variation_type_id',
                'product_items.status'
            )
            ->latest('product_items.id')
            ->paginate(10);
    }
}