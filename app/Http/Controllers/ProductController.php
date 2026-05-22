<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

//Validations 
use App\Http\Requests\ProductStoreValidations;

// Services
use App\Services\ProductItemServices\ProductIndexService;
use App\Services\ProductItemServices\ProductListServices;
use App\Services\ProductItemServices\ProductStoreService;

class ProductController extends Controller {

    public function index(ProductIndexService $service) {
        $products = $service->index(); 
        //dd($products->toArray());
        return Inertia::render('Admin/Product-Item', [
            'products' => $products,
        ]);
    }

    public function list(ProductListServices $service){
        $products = $service->showProductList();
        return response()->json($products);
    }

    public function storeProduct(ProductStoreValidations $request, ProductStoreService $service ){
        $products = $service->store($request->validated());
        return response()->json([
            'created' => $products]);
    }
}