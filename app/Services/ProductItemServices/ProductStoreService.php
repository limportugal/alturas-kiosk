<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;
use App\Models\ProductItem\ProductItemImage;


class ProductStoreService
{
    public function store(array $data){

        return DB::transaction(function () use ($data){
        $this->checkDuplicate(
            $data['sku'],
            $data['item_code']
        );

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
            'data' => $product->load(images),
        ];
    });
}




    public function checkDuplicate($sku, $itemCode):void{

        $errors = [];

        if(ProductItemModel::where('sku', $sku)->exists()) {
            $errors['sku'] = 'SKU already exists';
        }

        if(ProductItemModel::where('item_code', $itemCode)->exists()) {
            $errors['item_code'] = 'Item Code already exists';
        }

        if(!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

}