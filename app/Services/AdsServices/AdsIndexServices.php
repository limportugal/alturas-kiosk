<?php

namespace App\Services\AdsServices;

use App\Models\Ad;

class AdsIndexServices {

    public function adminList () {
       return Ad::query()
       ->orderByRaw('sort_order IS NULL, sort_order ASC')
       ->orderBy('sort_order', 'asc')
       ->orderBy('id', 'asc')
       ->get(); 
    }

    
}