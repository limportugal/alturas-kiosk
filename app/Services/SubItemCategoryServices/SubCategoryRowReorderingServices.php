<?php

namespace App\Services\SubItemCategoryServices;
use App\Models\SubCategory\SubCategoryModel;

use Illuminate\Support\Facades\DB;

class SubCategoryRowReorderingServices {

      public function reorderRows(array $ids): array {
        DB::transaction(function () use ($ids) {
            foreach ($ids as $index => $id) {
                SubCategoryModel::whereKey($id)->update([
                    'sort_order' => $index + 1,
                ]);
            }
        });

        return [
            'message' => 'Sort order updated successfully',
        ];
    }
}
