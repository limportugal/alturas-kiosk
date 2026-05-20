<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;

class ProductItemService{
    
    public function index()
    {
        return ProductItemModel::all();
    }

}