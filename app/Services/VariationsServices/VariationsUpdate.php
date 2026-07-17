<?php

namespace App\Services\VariationsServices;
use App\Models\ProductItem\ProductVariations;
use App\Services\Shared\ImageUploaderService;
use Illuminate\Http\UploadedFile;

class VariationsUpdate {
   public function __construct(protected ImageUploaderService $imageUploaderService){}
    public function update(int $id, array $data, ?UploadedFile $image){

         $variation = ProductVariations::findOrFail($id);

         if(!empty($data['remove_image'])) {
            $this->imageUploaderService->delete(
                $variation->image_path
            );

            $data['image_path'] = null;
         }elseif ($image){

            $data['image_path'] = $this->imageUploaderService->replace(
                $image, 
                $variation->image_path,
                'variations'
            );
         }else {
            unset(
                $data['image_path'],
                $data['remove_image']
            );
         }

         $variation->update($data);

         return $variation->fresh();
    }
}