<?php

namespace App\Services\VariationsServices;
use App\Models\ProductItem\ProductVariations;

use Illuminate\Support\Facades\DB;

class VariationsRowReorderingServices {

      public function reorderRows(array $ids): array {
        DB::transaction(function () use ($ids) {
            foreach (array_values($ids) as $index => $id) {
                ProductVariations::whereKey($id)->update([
                    'sort_order' => $index + 1,
                ]);
            }
        });

        return [
            'message' => 'Sort order updated successfully',
        ];
    }
}
 