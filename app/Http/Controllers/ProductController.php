<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

// Services
use App\Services\ProductItemServices\ProductItemService;

class ProductController extends Controller {

    public function index(ProductItemService $service) {
        $products = $service->index(); 

        return Inertia::render('Admin', [
            'products' => $products,
        ]);
    }
}