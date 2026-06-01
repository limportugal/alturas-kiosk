<?php

namespace App\Services\SubItemCategoryServices;

use App\Models\SubCategory\SubCategoryModel;

class SubCategoryToggleStatusServices
{
    public function toggleStatus($id)
    {
        $sub = SubCategoryModel::findOrFail($id);

        $sub->status = $sub->status === 'Active'
            ? 'Inactive'
            : 'Active';

        $sub->save();

        return $sub->fresh();
    }
}
