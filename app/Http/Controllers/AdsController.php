<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use Inertia\Inertia;

use App\Http\Requests\AdsReOrderValidations;
use App\Http\Requests\AdsStoreRequestValidations;
use App\Http\Requests\AdsUpdateValidations;

use App\Services\AdsServices\AdsIndexServices;
use App\Services\AdsServices\AdsPublicListServices;
use App\Services\AdsServices\AdsRowReorderingServices;
use App\Services\AdsServices\AdsStoreServices;
use App\Services\AdsServices\AdsUpdateServices;
use App\Services\AdsServices\AdsToggleStatusServices;

class AdsController extends Controller
{
    /** Admin page */
    public function page()
    {
        return Inertia::render('Admin/Ads');
    }

    public function index(AdsIndexServices $service) {
        $ads = $service->adminList();
        return response()->json($ads);
    }

    /** Active ads for the kiosk screensaver (public) */
    public function publicList(AdsPublicListServices $service){
        $ads = $service->PubList();
        return response()->json(['data' => $ads]);
    }

    /** Store a new ad */
    public function store(AdsStoreRequestValidations $request, AdsStoreServices $service)
    {
        $validated = $request->validated();
        $result = $service->store($validated, $request->file('file_path'));
        return response()->json($result, 201);
    }

    /** Update an existing ad */

    public function update (AdsUpdateServices $service, $id, AdsUpdateValidations $request){
        $ad = $service->Adsupdate($request->validated(), $id);
        response()->json($ad);
    }

    /** Toggle Active / Inactive */
     public function toggleStatus(AdsToggleStatusServices $service, $id){
        $ad = $service->Status($id);
        return response()->json($ad, 200);
     }

    /** Delete an ad and its file */
    public function destroy($id)
    {
        $ad = Ad::findOrFail($id);
        if ($ad->file_path && file_exists(public_path($ad->file_path))) {
            unlink(public_path($ad->file_path));
        }
        $ad->delete();
        return response()->json(['deleted' => true]);
    }

    public function reorderRow(AdsReOrderValidations $request, AdsRowReorderingServices $service)
    {
        $ad = $service->reorderRows($request->validated('ids'));
        return response()->json($ad);
    }
}
