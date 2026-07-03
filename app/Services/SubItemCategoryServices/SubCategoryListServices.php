<?php

namespace App\Services\SubItemCategoryServices;

use App\Models\SubCategory\SubCategoryModel;

class SubCategoryListServices
{
    public function getSubCategoryList()
    {
        return SubCategoryModel::query()
            ->select(['id', 'item_category_id', 'name', 'sort_order', 'image_path', 'status'])
            ->with('category:id,name')
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('id')
            ->get();
    }

     public function getPublicSubCategoryList()
    {
        return SubCategoryModel::query()
            ->select(['id', 'item_category_id', 'name', 'image_path', 'status'])
            ->where('status', 'Active')
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('id')
            ->get();
    } 
}
