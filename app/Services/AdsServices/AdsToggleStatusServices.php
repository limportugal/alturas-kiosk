<?php

namespace App\Services\AdsServices;

use App\Models\Ad;

class AdsToggleStatusServices {

    public function Status($id){
        $ad = Ad::findOrFail($id);
        $ad->status = $ad->status === 'Active' ? 'Inactive' : 'Active';
        $ad->save();
        return ['toggled' => $ad];
    }    
}