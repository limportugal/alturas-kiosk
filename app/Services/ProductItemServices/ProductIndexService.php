<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;

class ProductIndexService{
    
    public function index()
    {
        return ProductItemModel::all();
    }

}