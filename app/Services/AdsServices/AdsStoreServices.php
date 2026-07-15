<?php

namespace App\Services\AdsServices;

use App\Models\Ad;
use Illuminate\Http\UploadedFile;

class AdsStoreServices
{
    public function store(array $validated, UploadedFile $file): array
    {
        $ext      = $file->getClientOriginalExtension();
        $type     = in_array(strtolower($ext), ['mp4', 'webm']) ? 'video' : 'image';
        $fileName = time() . '_' . uniqid() . '.' . $ext;
        $file->move(public_path('ads'), $fileName);

        $nextSortOrder = (Ad::max('sort_order') ?? 0) + 1;

        $ad = Ad::create([
            'title'      => $validated['title'],
            'file_path'  => 'ads/' . $fileName,
            'type'       => $type,
            'sort_order' => $nextSortOrder,
            'duration'   => $validated['duration'],
            'status'     => $validated['status'],
        ]);

        return ['created' => $ad];
    }
}