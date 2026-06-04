<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;

class ProductVariations extends  Model {

    protected $table = 'product_variations';
   
    protected $fillable = [
        'product_id', 
        'title', 
        'price', 
        'sku'
    ];

}