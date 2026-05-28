<?php

namespace App\Services\CategoryItemServices;

use App\Models\Category\ItemCategoryModel;

class CategoryIndexServices{

   public function getCategoryIndex(){
        return ItemCategoryModel::all();
    }
}
