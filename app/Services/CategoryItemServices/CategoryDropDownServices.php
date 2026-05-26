<?php

namespace App\Services\CategoryItemServices;

use App\Models\Category\ItemCategory;

class CategoryDropDownServices{
	
    public function getCategoryDropDown()
    {
        return ItemCategory::select('id','name')->get();
    }
}
