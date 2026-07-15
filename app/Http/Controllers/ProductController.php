<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

//Validations 
use App\Http\Requests\ProductStoreValidations;
use App\Http\Requests\ProductUpdateValidations;
use App\Http\Requests\ProductReOrderValidations;


// Services
use App\Services\ProductItemServices\ProductIndexService;
use App\Services\ProductItemServices\ProductListServices;
use App\Services\ProductItemServices\ProductStoreService;
use App\Services\ProductItemServices\ProductToggleStatusService;
use App\Services\ProductItemServices\ProductUpdateService;
use App\Services\ProductItemServices\ProductRowReorderingServices;

class ProductController extends Controller
{

    public function index(ProductIndexService $service)
    {
        $products = $service->index();
        //dd($products->toArray());
        return Inertia::render('Admin/Product-Item', [
            'products' => $products,
        ]);
    }

    public function list(ProductListServices $service)
    {
        $products = $service->showProductList();
        return response()->json([
            'data' => $products
        ]);
    }

    public function showPublicProduct(ProductListServices $service)
    {
        $product = $service->showPublicProductList();
        return response()->json([
            'data' => $product
        ]);
    }

    public function storeProduct(ProductStoreValidations $request, ProductStoreService $service)
    {
        $products = $service->store($request->validated());
        return response()->json([
            'created' => $products
        ]);
    }

    public function toggleStatus(ProductToggleStatusService $service, $id)
    {
        $toggle = $service->toggleStatus($id);
        return response()->json([
            'toggle' => $toggle
        ]);
    }

    public function updateProduct(ProductUpdateValidations $request, ProductUpdateService $service, $id)
    {
        $updated = $service->update($request->validated(), $id);
        return response()->json([
            'updated' => $updated
        ]);
    }

    public function reorderRow(ProductReOrderValidations $request, ProductRowReorderingServices $service)
    {
        $reorder = $service->reorderRows($request->validated('ids'));
        return response()->json($reorder);
    }
}