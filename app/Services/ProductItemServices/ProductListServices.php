<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;

class ProductListServices{

    public function showProductList(){
         return ProductItemModel::query()
        ->select('id' , 'item_code', 'name', 'sku', 'item_category_id', 'price', 'quantity', 'item_description', 'status',)
        ->latest()
        ->paginate(10);
    }

 }
