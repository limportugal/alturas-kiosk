<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;

class ProductListServices{

    public function showProductList(){
         return ProductItemModel::query()
        ->select('id' , 'item_code', 'name', 'sku', 'categoryId', 'price', 'quantity', 'item_description', 'status',)
        ->latest()
        ->paginate(10);
    }

 }