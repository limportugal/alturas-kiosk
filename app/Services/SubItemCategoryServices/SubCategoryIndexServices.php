<?php

namespace App\Services\SubItemCategoryServices;

use App\Models\SubCategory\SubCategoryModel;

class SubCategoryIndexServices
{
    public function getSubCategoryIndex()
    {
        return SubCategoryModel::with('category:id,name')->get();
    }
}
