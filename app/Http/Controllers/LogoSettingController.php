<?php

namespace App\Http\Controllers;

use App\Models\KioskSetting;
use Inertia\Inertia;
use App\Http\Requests\LogoSettingUpdateValidations;
use App\Services\LogoSettings\LogoUpdateServices;
use App\Services\LogoSettings\LogoResetServices;

class LogoSettingController extends Controller
{
    /** Admin page */
    public function page()
    {
        return Inertia::render('Admin/LogoSettings');
    }

    /** Return current logo URL or null */
    public function show()
    {
        $logo = KioskSetting::get('app_logo');
        return response()->json([
            'logo' => $logo ? asset('storage/' . $logo) : null,
        ]);
    }

    /** Update logo */
    public function update(LogoSettingUpdateValidations $request, LogoUpdateServices $service)
    {
        $logoUrl = $service->update($request->file('logo'));
        return response()->json([
            'message' => 'Logo updated successfully',
            'logo' => $logoUrl,
        ]);
    }

    /** Reset logo to default */
    public function reset(LogoResetServices $service)
    {
        $service->reset();
        return response()->json([
            'message' => 'Logo reset to default',
            'logo' => null,
        ]);
    }
}
