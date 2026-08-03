<?php

namespace App\Services\LogoServices;

use App\Models\KioskLogo;
use App\Services\Shared\ImageUploaderService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class LogoUpdateServices
{
    protected ImageUploaderService $uploader;

    public function __construct(ImageUploaderService $uploader)
    {
        $this->uploader = $uploader;
    }

    public function update(array $data, ?UploadedFile $file, int $id): KioskLogo
    {
        return DB::transaction(function () use ($data, $file, $id) {
            $logo = KioskLogo::findOrFail($id);

            if ($data['status'] === 'Active' && $logo->status !== 'Active') {
                KioskLogo::where('id', '!=', $id)->update(['status' => 'Inactive']);
            }

            $logo->name = $data['name'];
            $logo->status = $data['status'];

            if ($file) {
                $logo->image_path = $this->uploader->replace($file, $logo->image_path, 'images/logos');
            }

            $logo->save();

            return $logo;
        });
    }
}
