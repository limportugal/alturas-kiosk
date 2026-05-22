<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;

class ProductItemImageModel extends Model
{
    protected $table = 'product_item_images';

    protected $fillable = [
        'product_item_id',
        'image_path',
        'is_primary',
        'sort_order',
    ];

    public function product()
    {
        return $this->belongsTo(ProductItemModel::class, 'product_item_id');
    }
}