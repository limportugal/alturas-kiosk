<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductItem\ProductItemModel;


class ProductItemImage extends Model
{
    protected $table = 'product_item_images';

    
    protected $fillable = [
        'id',
        'product_item_id',
        'item_category_id',
        'image_path',
        'is_primary',
        'sort_order'

    ];

    public $timestamps = true;

    public function product()
    {
        return $this->belongsTo(ProductItemModel::class, 'product_item_id');
    }

    // public function category()
    // {
    //     return $this->belongsTo(ItemCategory::class, 'item_category_id');
    // }
}

