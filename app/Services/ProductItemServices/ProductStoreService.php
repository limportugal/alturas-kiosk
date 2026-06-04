<?php

namespace App\Services\ProductItemServices;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;


use App\Services\Shared\DuplicateCheckerService;


use App\Models\ProductItem\ProductItemModel;
use App\Models\ProductItem\ProductItemImage;
use App\Models\ProductItem\ProductColorVariant;


class ProductStoreService {
    protected DuplicateCheckerService $duplicateCheckerService;

    public function __construct(
        DuplicateCheckerService $duplicateCheckerService
    ) {
        $this->duplicateCheckerService = $duplicateCheckerService;
    }


    public function store(array $data){

        return DB::transaction(function () use ($data){

        $this->duplicateCheckerService->check([
            'sku' => [
                'model' => ProductItemModel::class,
                'value' => $data['sku'],
                'message' => 'SKU already exists'
            ],
            
            'item_code' => [
                'model' => ProductItemModel::class,
                'value' => $data['item_code'],
                'message' => ' Item code already exists'
            ],
        ]);

        $images = $data['images'] ?? [];
        $colorVariants = $data['color_variants'] ?? [];
        unset($data['images'], $data['color_variants']);
    
        $product = ProductItemModel::create($data);
        
        foreach($images as $index => $image) {
            $fileName = time() . '_' . uniqid() . '_' . $image->getClientOriginalName();

            $image->move(
                    public_path('products'),
                    $fileName
                );
             $storedPath = 'products/' . $fileName;

            ProductItemImage::create([
                'product_item_id' => $product->id,
                'image_path' => $storedPath,
                'is_primary' => $index === 0,
                'sort_order' => $index
            ]);
        }

        foreach ($colorVariants as $variant) {
            $variantImagePath = null;
            if (isset($variant['image_path']) && $variant['image_path'] instanceof \Illuminate\Http\UploadedFile) {
                $file = $variant['image_path'];

                $fileName = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();

                $file->move(
                    public_path('color-variants'),
                    $fileName
                );

                $variantImagePath = 'color-variants/' . $fileName;
            }

            ProductColorVariant::create([
                'product_item_id' => $product->id,
                'color_name'      => $variant['color_name'],
                'image_path'      => $variantImagePath,
            ]);
        }

        return [
            'message' => 'product saved successfully',
            'data' => $product->load('images', 'colorVariants', 'variationType'),
        ];
    });
}



}
