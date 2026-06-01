<?php

namespace App\Models\Category;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductItem\ProductItemModel;

class ItemCategoryModel extends Model
{
    protected $table = 'item_categories';

    protected $fillable = [
        'name',
        'image_path',
        'status',  
    ];

    public function products()
    {
        return $this->hasMany(ProductItemModel::class, 'item_category_id');
    }

    public function subCategories()
    {
        return $this->hasMany(\App\Models\SubCategory\SubCategoryModel::class, 'item_category_id');
    }
}
