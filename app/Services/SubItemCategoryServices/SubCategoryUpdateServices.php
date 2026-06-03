<?php

namespace App\Services\SubItemCategoryServices;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\SubCategory\SubCategoryModel;

class SubCategoryUpdateServices
{
    public function update(array $data, $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $sub = SubCategoryModel::findOrFail($id);

            $imagePath = $sub->image_path;

            $removeImage = filter_var(
                $data['remove_image'] ?? false,
                FILTER_VALIDATE_BOOLEAN
            );

            if ($removeImage && $sub->image_path) {
                // if (Storage::disk('public')->exists($sub->image_path)) {
                //     Storage::disk('public')->delete($sub->image_path);
                // }

                if(file_exists(public_path($sub->image_path))) {
                    unlink(public_path($sub->image_path));
                }

                $imagePath = null;
            }

            // if (isset($data['image_path']) && $data['image_path']) {
            //     if ($sub->image_path && $imagePath !== null && Storage::disk('public')->exists($sub->image_path)) {
            //         Storage::disk('public')->delete($sub->image_path);
            //     }
            if(isset($data['image_path']) && $data['image_path']){
              if (
                    $sub->image_path &&
                    file_exists(public_path($sub->image_path))
                ){
                    unlink(public_path($suby->image_path));
                }

                $file = $data['image_path'];
                $imageName = time().'_'.$file->getClientOriginalName();
                $file->move(public_path('sub-categories'), $imageName);

                $imagePath = 'sub-categories/' .$imageName;
            }

            $sub->update([
                'item_category_id' => $data['item_category_id'] ?? $sub->item_category_id,
                'name'             => $data['name']             ?? $sub->name,
                'image_path'       => $imagePath,
                'status'           => $data['status']           ?? $sub->status,
            ]);

            return $sub->fresh();
        });
    }
}
