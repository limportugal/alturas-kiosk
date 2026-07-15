<?php

namespace App\Services\KioskSettings;

use App\Models\KioskSetting;

class KioskUpdateServices{
    public function update(array $data){
        KioskSetting::set('idle_timeout_seconds', $data['idle_timeout_seconds']);
        KioskSetting::set('idle_enabled', $data['idle_enabled']);

        return [
            'idle_timeout_seconds' => (int) $data['idle_timeout_seconds'],
            'idle_enabled' => (bool) $data['idle_enabled'],
        ];
    }
}