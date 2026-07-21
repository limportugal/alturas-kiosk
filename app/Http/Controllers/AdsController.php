<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

use App\Http\Requests\AdsReOrderValidations;
use App\Http\Requests\AdsStoreRequestValidations;
use App\Http\Requests\AdsUpdateValidations;

use App\Services\AdsServices\AdsIndexServices;
use App\Services\AdsServices\AdsRowReorderingServices;
use App\Services\AdsServices\AdsStoreServices;
use App\Services\AdsServices\AdsUpdateServices;

class AdsController extends Controller
{
    /** Admin page */
    public function page()
    {
        return Inertia::render('Admin/Ads');
    }

    /** Paginated list for admin table */
    // public function index()
    // {
    //     $ads = Ad::query()
    //         ->orderByRaw('sort_order IS NULL, sort_order ASC')
    //         ->orderBy('sort_order', 'asc')
    //         ->orderBy('id', 'asc')
    //         ->paginate(15);

    //     return response()->json($ads);
    // }

    public function index(AdsIndexServices $service) {
        $ads = $service->adminList();
        return response()->json($ads);
    }

    /** Active ads for the kiosk screensaver (public) */
    public function publicList()
    {
        $ads = Ad::where('status', 'Active')
            ->orderBy('sort_order')
            ->get(['id', 'title', 'file_path', 'type', 'duration', 'sort_order']);
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
    public function toggleStatus($id)
    {
        $ad = Ad::findOrFail($id);
        $ad->status = $ad->status === 'Active' ? 'Inactive' : 'Active';
        $ad->save();
        return response()->json(['toggled' => $ad]);
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
