<?php

namespace App\Services\CategoryItemServices;

use App\Models\Category\ItemCategoryModel;

class CategoryToggleStatusServices{

    public function toggleStatus($id){
       $cat = ItemCategoryModel::findOrFail($id);

       $cat->status = $cat->status === 'Active'
            ? 'Inactive' 
            : 'Active';

        $cat->save();

        
       return $cat->fresh();
    }
}