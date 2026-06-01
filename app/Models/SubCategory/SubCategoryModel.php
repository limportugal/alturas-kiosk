<?php

namespace App\Models\SubCategory;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category\ItemCategoryModel;
use App\Models\ProductItem\ProductItemModel;

class SubCategoryModel extends Model
{
    protected $table = 'sub_categories';

    protected $fillable = [
        'item_category_id',
        'name',
        'image_path',
        'status',
    ];

    public function category()
    {
        return $this->belongsTo(ItemCategoryModel::class, 'item_category_id');
    }

    public function products()
    {
        return $this->hasMany(ProductItemModel::class, 'sub_category_id');
    }
}
