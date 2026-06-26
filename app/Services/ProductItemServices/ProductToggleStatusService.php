<?php

namespace App\Services\ProductItemServices;

use App\Models\ProductItem\ProductItemModel;

class ProductToggleStatusService
{
    public function toggleStatus($id){
       $product = ProductItemModel::findOrFail($id);

       $product->status = $product->status === 'Active'
            ? 'Inactive' 
            : 'Active';

        $product->save();

        
       return $product->fresh(); 
    }
}