<?php

namespace App\Services\LogoServices;

use App\Models\KioskLogo;
use App\Services\Shared\ImageUploaderService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class LogoStoreServices
{
    protected ImageUploaderService $uploader;

    public function __construct(ImageUploaderService $uploader)
    {
        $this->uploader = $uploader;
    }

    public function store(array $data, UploadedFile $file): KioskLogo
    {
        return DB::transaction(function () use ($data, $file) {
            if (($data['status'] ?? 'Active') === 'Active') {
                KioskLogo::query()->update(['status' => 'Inactive']);
            }

            $imagePath = $this->uploader->upload($file, 'images/logos');

            return KioskLogo::create([
                'name' => $data['name'],
                'image_path' => $imagePath,
                'status' => $data['status'] ?? 'Active',
            ]);
        });
    }
}
