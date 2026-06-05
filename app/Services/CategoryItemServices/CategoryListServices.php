<?php

namespace App\Services\CategoryItemServices;
use App\Models\Category\ItemCategoryModel;

class CategoryListServices{
    public function getCategoryList(){
        return ItemCategoryModel::query()
            ->select([
                'id',
                'name',
                'image_path',
                'status'
        ])
            
            ->latest('id')
            ->paginate(10);
    }

    public function getPublicCategoryList(){
        return ItemCategoryModel::query()
            ->select([
                'id',
                'name',
                'image_path',
                'status'
        ])
            ->where('status','Active')
            ->latest('id')
            ->get();
    }
}
