<?php

namespace App\Services\AdsServices;
use App\Models\Ad;

use Illuminate\Support\Facades\DB;

class AdsRowReorderingServices {

      public function reorderRows(array $ids): array {
        DB::transaction(function () use ($ids) {
            foreach (array_values($ids) as $index => $id) {
                Ad::whereKey($id)->update([
                    'sort_order' => $index + 1,
                ]);
            }
        });

        return [
            'message' => 'Sort order updated successfully',
        ];
    }
}
 