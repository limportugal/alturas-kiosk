<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;
use App\Models\SubCategory\SubCategoryModel;

class ProductVariations extends Model
{
    protected $table = 'product_variations';

    protected $fillable = [
        'sub_category_id',
        'name',
        'sort_order',
        'image_path',
        'status',
    ];

    public function subCategory()
    {
        return $this->belongsTo(SubCategoryModel::class, 'sub_category_id');
    }

    /**
     * Product items that use this variation type.
     */
    public function productItems()
    {
        return $this->hasMany(ProductItemModel::class, 'variation_type_id');
    }
}
