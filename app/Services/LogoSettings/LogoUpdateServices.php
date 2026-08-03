<?php

namespace App\Services\LogoSettings;

use App\Models\KioskSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class LogoUpdateServices
{
    public function update(UploadedFile $file): string
    {
        // Get old logo path if exists
        $oldLogo = KioskSetting::get('app_logo');
        if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
            Storage::disk('public')->delete($oldLogo);
        }

        // Store new logo
        $path = $file->store('logos', 'public');

        // Save setting
        KioskSetting::set('app_logo', $path);

        return asset('storage/' . $path);
    }
}
