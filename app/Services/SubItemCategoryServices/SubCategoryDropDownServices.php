<?php

namespace App\Services\SubItemCategoryServices;

use App\Models\SubCategory\SubCategoryModel;

class SubCategoryDropDownServices
{
    public function getSubCategoryDropDown()
    {
        return SubCategoryModel::select('id', 'name', 'item_category_id')->get();
    }
}
