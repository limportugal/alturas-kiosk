<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;

class ProductColorVariant extends Model
{
    protected $table = 'product_color_variants';

    protected $fillable = [
        'product_item_id',
        'color_name',
        'image_path',
    ];

    public function product()
    {
        return $this->belongsTo(ProductItemModel::class, 'product_item_id');
    }
}
