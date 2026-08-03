<?php

namespace App\Http\Controllers;

use App\Models\KioskLogo;
use Inertia\Inertia;
use App\Http\Requests\LogoStoreValidations;
use App\Http\Requests\LogoUpdateValidations;

use App\Services\LogoServices\LogoListServices;
use App\Services\LogoServices\LogoStoreServices;
use App\Services\LogoServices\LogoUpdateServices;
use App\Services\LogoServices\LogoToggleStatusServices;

class LogoController extends Controller
{
    /** Admin page */
    public function page()
    {
        return Inertia::render('Admin/Logos');
    }

    /** Datatable list */
    public function list(LogoListServices $service)
    {
        $logos = $service->list();

        return response()->json([
            'data' => $logos,
        ]);
    }

    /** Store new logo */
    public function store(LogoStoreValidations $request, LogoStoreServices $service)
    {
        $logo = $service->store($request->validated(), $request->file('image'));

        return response()->json([
            'created' => $logo,
        ], 201);
    }

    /** Update logo */
    public function update(LogoUpdateValidations $request, LogoUpdateServices $service, $id)
    {
        $logo = $service->update($request->validated(), $request->file('image'), (int) $id);

        return response()->json([
            'updated' => $logo,
        ]);
    }

    /** Toggle logo active status */
    public function toggle(LogoToggleStatusServices $service, $id)
    {
        $logoToggle = $service->toggleStatus((int) $id);

        return response()->json([
            'toggle' => $logoToggle,
        ]);
    }

    /** Public active logo endpoint for customer kiosk UI */
    public function publicActiveLogo()
    {
        $activeLogo = KioskLogo::where('status', 'Active')->first();

        $logoUrl = '/images/LegacyFurniture-removebg-preview(1).png';
        if ($activeLogo && $activeLogo->image_path) {
            $path = $activeLogo->image_path;
            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                $logoUrl = $path;
            } elseif (str_starts_with($path, '/')) {
                $logoUrl = $path;
            } elseif (str_starts_with($path, 'storage/')) {
                $logoUrl = '/' . $path;
            } elseif (str_starts_with($path, 'images/') || str_starts_with($path, 'logos/')) {
                $logoUrl = '/' . $path;
            } else {
                $logoUrl = '/' . $path;
            }
        }

        return response()->json([
            'logo_url' => $logoUrl,
        ]);
    }
}
