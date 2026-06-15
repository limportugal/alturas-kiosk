<?php

namespace App\Http\Controllers;

use App\Models\KioskSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KioskSettingController extends Controller
{
    /** Public — kiosk reads the idle timeout */
    public function show()
    {
        return response()->json([
            'idle_timeout_seconds' => (int) KioskSetting::get('idle_timeout_seconds', 60),
            'idle_enabled' => filter_var(
                KioskSetting::get('idle_enabled', true),
                FILTER_VALIDATE_BOOLEAN
            ),
        ]);
    }

    /** Auth — admin updates the idle timeout */
    public function update(Request $request)
    {
        $data = $request->validate([
            'idle_timeout_seconds' => ['required', 'integer', 'min:10', 'max:3600'],
            'idle_enabled' => ['required', 'boolean'],
        ]);

        KioskSetting::set('idle_timeout_seconds', $data['idle_timeout_seconds']);
        KioskSetting::set('idle_enabled', $data['idle_enabled']);

        return response()->json([
            'idle_timeout_seconds' => (int) $data['idle_timeout_seconds'],
            'idle_enabled' => (bool) $data['idle_enabled'],
        ]);
    }

    /** Admin page */
    public function page()
    {
        return Inertia::render('Admin/ScreenSaver');
    }
}
