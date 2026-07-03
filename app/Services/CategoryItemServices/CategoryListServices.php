<?php

namespace App\Services\CategoryItemServices;
use App\Models\Category\ItemCategoryModel;

class CategoryListServices{
    public function getCategoryList(){
        return ItemCategoryModel::query()
            ->select([
                'id',
                'name',
                'sort_order',
                'description',
                'image_path',
                'status'
        ])
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('id')
            ->paginate(10);
    }

    public function getPublicCategoryList(){
        return ItemCategoryModel::query()
            ->select([
                'id',
                'name',
                'sort_order',
                'description',
                'image_path',
                'status'
        ])
            ->where('status','Active')
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('id')
            ->get();
    }
}
