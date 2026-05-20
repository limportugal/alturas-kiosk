<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;


class ProductItemModel extends Model
{
    protected $table = 'product_items';

    
    protected $fillable = [
        'id', 
        'name',
        'sku',
        'categoryId', 
        'price',
        'item_description'
    ];
}

