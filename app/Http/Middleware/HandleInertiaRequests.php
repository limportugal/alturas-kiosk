<?php

namespace App\Http\Middleware;

use App\Models\KioskSetting;
use App\Models\KioskLogo;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $activeLogo = KioskLogo::where('status', 'Active')->first();
        $logoURL = null;
        $appName = 'Please Add Name'; // Default name if no active logo exists


        if($activeLogo){
            $appName = $activeLogo->name;
            $path = $activeLogo->image_path;

            if($path){
            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https:://')) {
                $logoURL = $path;
            } elseif (str_starts_with($path, '/')) {
                $logoURL = $path;
            } elseif (str_starts_with($path, 'storage/')) {
                $logoURL = '/' . $path;
            }else {
                $logoURL = '/'. $path; 
            }
        }
    } else {
        // Fallback sa Dating configuration kapag walang active kiosk logo
           $logoPath = KioskSetting::get('app_logo');
           if($logoPath) {
              $logoURL = asset('storage/' . $logoPath);
           }
    }
       
        return [
            ...parent::share($request),
            'app' => [
                'name' => $appName,
                'logo' => $logoURL,
            ],
            'auth' => [
                'user' => $request->user()
                ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->getRoleNames()->first(),
                    'permission' => $request->user()->getPermissionNames(),
                ]: null,

            ],
        ];
    }
}
