<?php
namespace App\Services\CategoryItemServices;

use App\Models\Category\ItemCategoryModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CategoryUpdateServices{
	
    public function update(array $data, $id){

        return DB::transaction(function () use ($data, $id) {

            $category = ItemCategoryModel::findOrFail($id);

            $imagePath = $category->image_path;
            $removeImage = !empty($data['remove_image']);

             // remove image
             if($removeImage && $category->image_path) {

                if(Storage::disk('public')->exists($category->image_path)) {
                    Storage::disk('public')->delete($category->image_path);
                }
                $imagePath = null;
             }

             // if image upload and replace current/remove image
             if(isset($data['image_path']) && $data['image_path']){
                if(
                    $category->image_path &&
                    $imagePath !==null &&
                    Storage::disk('public')->exists($category->image_path)
                ){
                    Storage::disk('public')->delete($category->image_path);
                }
                $imagePath = $data['image_path']->store('categories', 'public');
             }

                $category->update([
                        'name' => $data['name'] ?? $category->name,
                        'image_path' => $imagePath,
                        'status' => $data['status'] ?? $category->status,
                ]);
                return $category->fresh();
        });
    }
}
