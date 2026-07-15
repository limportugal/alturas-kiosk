<?php

namespace App\Http\Controllers;

use App\Models\KioskSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Requests\KiokSettingsUpdateValidations;


use App\Services\KioskSettings\KioskUpdateServices;

class KioskSettingController extends Controller
{
    
    /** Admin page */
    public function page()
    {
        return Inertia::render('Admin/ScreenSaver');
    }

    /** Public — kiosk reads the idle timeout */
    public function show()
    {
        return response()->json([
            'idle_timeout_seconds' => (int) KioskSetting::get('idle_timeout_seconds'),
            'idle_enabled' => filter_var(
                KioskSetting::get('idle_enabled', true),
                FILTER_VALIDATE_BOOLEAN
            ),
        ]);
    }

    public function kioskUpdate(KiokSettingsUpdateValidations $request, KioskUpdateServices $service) {
        $kiosk = $service->update($request->validated());
        return response()->json([        
            'updated' => $kiosk 
        ]);
        
    }

}
