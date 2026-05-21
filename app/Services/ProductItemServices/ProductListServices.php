<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;

class ProductListServices{

    public function showProductList(){
         return ProductItemModel::query()
        ->select('id', 'name', 'sku', 'categoryId', 'price', 'item_description',)
        ->latest()
        ->paginate(10);
    }

 }