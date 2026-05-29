<?php

namespace App\Services\ProductItemServices;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;


use App\Services\Shared\DuplicateCheckerService;


use App\Models\ProductItem\ProductItemModel;
use App\Models\ProductItem\ProductItemImage;


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
        unset($data['images']);
    
        $product = ProductItemModel::create($data);
        
        foreach($images as $index => $image) {
            $storedPath = $image->store('products', 'public');

            ProductItemImage::create([
                'product_item_id' => $product->id,
                'image_path' => $storedPath,
                'is_primary' => $index === 0,
                'sort_order' => $index
            ]);
        }
        return [
            'message' => 'product saved successfully',
            'data' => $product->load('images'),
        ];
    });
}



}
