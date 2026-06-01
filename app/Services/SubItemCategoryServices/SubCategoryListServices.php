<?php

namespace App\Services\SubItemCategoryServices;

use App\Models\SubCategory\SubCategoryModel;

class SubCategoryListServices
{
    public function getSubCategoryList()
    {
        return SubCategoryModel::query()
            ->select(['id', 'item_category_id', 'name', 'image_path', 'status'])
            ->with('category:id,name')
            ->latest('id')
            ->paginate(10);
    }
}
