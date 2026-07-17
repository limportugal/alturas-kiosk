<?php 

namespace App\Services\VariationsServices;
use Illuminate\Http\UploadedFile;

use App\Models\ProductItem\ProductVariations;
use App\Services\Shared\ImageUploaderService;


class VariationsStore{

    public function __construct(
        private ImageUploaderService $imageUploaderService
    ) {}

    public function storeVariation(array $data, ?UploadedFile $image){
   
        $nextSortOrder = (ProductVariations::max('sort_order') ?? 0) + 1;

        return ProductVariations::create([
            'sub_category_id' => $data['sub_category_id'] ?? null,
            'name' => $data['name'],
            'sort_order' => $nextSortOrder,
            'image_path' => $this->imageUploaderService->upload($image, 'variations'),
            'status' => $data['status'],
        ]);
    }
}