<?php

namespace App\Services\ProductItemServices;
use App\Models\ProductItem\ProductItemModel;

use Illuminate\Support\Facades\DB;

class ProductRowReorderingServices {

      public function reorderRows(array $ids): array {
        DB::transaction(function () use ($ids) {
            foreach (array_values($ids) as $index => $id) {
                ProductItemModel::whereKey($id)->update([
                    'sort_order' => $index + 1,
                ]);
            }
        });

        return [
            'message' => 'Sort order updated successfully',
        ];
    }
}
