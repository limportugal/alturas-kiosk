<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

use App\Http\Requests\AdsReOrderValidations;

use App\Services\AdsServices\AdsRowReorderingServices;

class AdsController extends Controller
{
    /** Admin page */
    public function page()
    {
        return Inertia::render('Admin/Ads');
    }

    /** Paginated list for admin table */
    public function index()
    {
        $ads = Ad::query()
        ->orderByRaw('sort_order IS NULL, sort_order ASC')
        ->orderBy('sort_order', 'asc')
        ->orderBy('id', 'asc')
        ->paginate(15);
       
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
    public function store(Request $request){
        $data = $request->validate([
            'title'      => ['required', 'string', 'max:255'],
            'file_path'  => ['required', 'file', 'mimes:jpg,jpeg,png,webp,avif,mp4,webm', 'max:51200'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'duration'   => ['required', 'integer', 'min:3', 'max:120'],
            'status'     => ['required', Rule::in(['Active', 'Inactive'])],
        ]);

        $file     = $request->file('file_path');
        $ext      = $file->getClientOriginalExtension();
        $type     = in_array(strtolower($ext), ['mp4', 'webm']) ? 'video' : 'image';
        $fileName = time() . '_' . uniqid() . '.' . $ext;
        $file->move(public_path('ads'), $fileName);

        $nextSortOrder = (Ad::max('sort_order') ?? 0) + 1;
        $ad = Ad::create([
            'title'      => $data['title'],
            'file_path'  => 'ads/' . $fileName,
            'type'       => $type,
            'sort_order' => $nextSortOrder,
            'duration'   => $data['duration'],
            'status'     => $data['status'],
        ]);

        return response()->json(['created' => $ad], 201);
    }

    /** Update an existing ad */
    public function update(Request $request, $id)
    {
        $ad   = Ad::findOrFail($id);
        $data = $request->validate([
            'title'      => ['sometimes', 'string', 'max:255'],
            'file_path'  => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,avif,mp4,webm', 'max:51200'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'duration'   => ['sometimes', 'integer', 'min:3', 'max:120'],
            'status'     => ['sometimes', Rule::in(['Active', 'Inactive'])],
        ]);

        if ($request->hasFile('file_path')) {
            if ($ad->file_path && file_exists(public_path($ad->file_path))) {
                unlink(public_path($ad->file_path));
            }
            $file     = $request->file('file_path');
            $ext      = $file->getClientOriginalExtension();
            $type     = in_array(strtolower($ext), ['mp4', 'webm']) ? 'video' : 'image';
            $fileName = time() . '_' . uniqid() . '.' . $ext;
            $file->move(public_path('ads'), $fileName);
            $data['file_path'] = 'ads/' . $fileName;
            $data['type']      = $type;
        } else {
            unset($data['file_path']);
        }

        $ad->update($data);
        return response()->json(['updated' => $ad]);
    }

    /** Toggle Active / Inactive */
    public function toggleStatus($id)
    {
        $ad         = Ad::findOrFail($id);
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

    public function reorderRow(AdsReOrderValidations $request, AdsRowReorderingServices $service) {
        $ad = $service->reorderRows($request->validated('ids'));
        return response()->json($ad);
    }
}
