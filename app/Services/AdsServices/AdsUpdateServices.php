<?php

namespace App\Services\AdsServices;

use App\Models\Ad;
use App\Services\Shared\ImageUploaderService;
use Illuminate\Http\UploadedFile;


class AdsUpdateServices{
    
    public function __construct(
        private ImageUploaderService $imageUploaderService,
    ){}

    public function Adsupdate(array $data, $id, ?UploadedFile $file = null): Ad{
        $ad = Ad::findOrFail($id);
        

        if($file){
            $data['file_path'] = $this->imageUploaderService->replace(
                $file,
                $ad->file_path,
                'ads'
            );

            $ext = $file->getClientOriginalExtension();
            $data['type'] = in_array(strtolower($ext), ['mp4', 'webm']) ? 'video' : 'image';
        } else {
            unset($data['file_path']);
        }

        $ad->update($data);

        return $ad->fresh();
    }

    
}