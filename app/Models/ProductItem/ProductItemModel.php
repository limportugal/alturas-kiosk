<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;


class ProductItemModel extends Model
{
    protected $table = 'product_items';

    
    protected $fillable = [
        'id',
        'item_code', 
        'name',
        'sku',
        'categoryId', 
        'price',
        'quantity',
        'item_description',
        'status'

    ];

    public $timestamps = false;

     public function images()
    {
        return $this->hasMany(ProductItemImage::class, 'product_item_id');
    }
}

