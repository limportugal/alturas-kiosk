<?php

namespace App\Services\CategoryItemServices;

use App\Models\Category\ItemCategoryModel;

class CategoryDropDownServices{
	
    public function getCategoryDropDown()
    {
        return ItemCategoryModel::select('id','name')->get();
    }
}
