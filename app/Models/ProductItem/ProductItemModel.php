<?php

namespace App\Models\ProductItem;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category\ItemCategoryModel;
use App\Models\ProductItem\ProductItemImage;
use App\Models\ProductItem\ProductColorVariant;

class ProductItemModel extends Model
{
    protected $table = 'product_items';

    
    protected $fillable = [
        'item_code', 
        'name',
        'sku',
        'item_category_id',
        'sub_category_id',
        'price',
        'quantity',
        'item_description',
        'status'
    ];

    public function images()
    {
        return $this->hasMany(ProductItemImage::class, 'product_item_id');
    }

    public function colorVariants()
    {
        return $this->hasMany(ProductColorVariant::class, 'product_item_id');
    }

    public function category()
    {
        return $this->belongsTo(ItemCategoryModel::class, 'item_category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(\App\Models\SubCategory\SubCategoryModel::class, 'sub_category_id');
    }
}

