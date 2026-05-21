<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

// Services
use App\Services\ProductItemServices\ProductIndexService;
use App\Services\ProductItemServices\ProductListServices;

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
}