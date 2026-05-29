<?php

namespace App\Services\CategoryItemServices;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

use App\Services\Shared\DuplicateCheckerService;

use App\Models\Category\ItemCategoryModel;

class CategoryStoreServices {

    protected DuplicateCheckerService $duplicateCheckerService;

    public function __construct(
        DuplicateCheckerService $duplicateCheckerService
    ) {
        $this->duplicateCheckerService = $duplicateCheckerService;
    }


    public function store(array $data){

        $this->duplicateCheckerService->check([
            'name' => [
                'model' => ItemCategoryModel::class,
                'value' => $data['name'],
                'message' => 'Category name already exists'
            ],
        ]);

        return DB::transaction(function() use ($data) {

            $imagePath = null;

            //check if image exists 
            if (isset($data['image_path']) && $data['image_path']){                
                $imagePath = $data['image_path']->store('categories', 'public');
            }

            $category = ItemCategoryModel::create([
                'name' => $data['name'],
                'image_path' => $imagePath,
                'status' => $data['status'] ?? 'Active',
            ]); 
            return ($category);
        });
    }
}