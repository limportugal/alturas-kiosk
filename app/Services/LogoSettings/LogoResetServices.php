<?php

namespace App\Services\LogoSettings;

use App\Models\KioskSetting;
use Illuminate\Support\Facades\Storage;

class LogoResetServices
{
    public function reset(): void
    {
        $oldLogo = KioskSetting::get('app_logo');
        if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
            Storage::disk('public')->delete($oldLogo);
        }

        KioskSetting::where('key', 'app_logo')->delete();
    }
}
