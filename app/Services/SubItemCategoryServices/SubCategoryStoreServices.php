<?php

namespace App\Services\SubItemCategoryServices;

use Illuminate\Support\Facades\DB;
use App\Services\Shared\DuplicateCheckerService;
use App\Models\SubCategory\SubCategoryModel;

class SubCategoryStoreServices
{
    protected DuplicateCheckerService $duplicateCheckerService;

    public function __construct(DuplicateCheckerService $duplicateCheckerService)
    {
        $this->duplicateCheckerService = $duplicateCheckerService;
    }

    public function store(array $data)
    {
        $this->duplicateCheckerService->check([
            'name' => [
                'model'   => SubCategoryModel::class,
                'value'   => $data['name'],
                'message' => 'Sub-category name already exists',
            ],
        ]);

        return DB::transaction(function () use ($data) {

            $imagePath = null;

            if (isset($data['image_path']) && $data['image_path']) {
                $imagePath = $data['image_path']->store('sub-categories', 'public');
            }

            return SubCategoryModel::create([
                'item_category_id' => $data['item_category_id'],
                'name'             => $data['name'],
                'image_path'       => $imagePath,
                'status'           => $data['status'] ?? 'Active',
            ]);
        });
    }
}
