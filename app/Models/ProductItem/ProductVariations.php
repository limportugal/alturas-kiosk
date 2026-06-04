<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;

class ProductVariations extends Model
{
    protected $table = 'product_variations';

    protected $fillable = [
        'name',
        'image_path',
        'status',
    ];

    /**
     * Product items that use this variation type.
     */
    public function productItems()
    {
        return $this->hasMany(ProductItemModel::class, 'variation_type_id');
    }
}
