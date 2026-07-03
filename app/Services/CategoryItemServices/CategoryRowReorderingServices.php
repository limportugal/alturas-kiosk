<?php

namespace App\Services\CategoryItemServices;
use App\Models\Category\ItemCategoryModel;

use Illuminate\Support\Facades\DB;

class CategoryRowReorderingServices {

    public function reorderRows(array $ids): array {
        DB::transaction(function () use ($ids) {
            foreach ($ids as $index => $id) {
                ItemCategoryModel::whereKey($id)->update([
                    'sort_order' => $index + 1,
                ]);
            }
        });

        return [
            'message' => 'Sort order updated successfully',
        ];
    }
}
