<?php

namespace App\Models\Category;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductItem\ProductItemModel;

class ItemCategory extends Model
{
    protected $table = 'item_categories';

    protected $fillable = [
        'name',
    ];

    public function products()
    {
        return $this->hasMany(ProductItemModel::class, 'item_category_id');
    }
}
