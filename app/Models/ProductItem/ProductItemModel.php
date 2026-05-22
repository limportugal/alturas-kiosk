<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category\ItemCategory;

class ProductItemModel extends Model
{
    protected $table = 'product_items';

    
    protected $fillable = [
        'id',
        'item_code', 
        'name',
        'sku',
        'item_category_id',
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

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'item_category_id');
    }
}

