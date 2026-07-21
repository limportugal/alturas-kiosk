<?php

namespace App\Services\AdsServices;

use App\Models\Ad;

class AdsPublicListServices {

    public function PubList(){
        return Ad::where('status', 'Active')
            ->orderBy('sort_order')
            ->get(['id', 'title', 'file_path', 'type', 'duration', 'sort_order']);
    }

}