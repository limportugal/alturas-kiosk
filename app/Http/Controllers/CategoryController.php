<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

//Validations
use App\Http\Requests\CategoryStoreValidations;

// Services
use App\Services\CategoryItemServices\CategoryIndexServices;
use App\Services\CategoryItemServices\CategoryListServices;
use App\Services\CategoryItemServices\CategoryDropDownServices;
use App\Services\CategoryItemServices\CategoryToggleStatusServices;
use App\Services\CategoryItemServices\CategoryStoreServices;



class CategoryController extends Controller{
    
    public function index(CategoryIndexServices $service){
        $category=$service->getCategoryIndex();
        return Inertia::render('Admin/Categories', [
            'category'=>$category
        ]);
    }
    
    public function CategoriesList(CategoryListServices $service){
        $category=$service->getCategoryList();
        return response()->json($category);

    }
    
    public function dropdown(CategoryDropDownServices $service){
        $category=$service->getCategoryDropDown();
        return response()->json($category);
    }
    
    public function CatToggleStatus(CategoryToggleStatusServices $service, $id){
        $category=$service->toggleStatus($id);
        return response()->json($category);
    }

    public function saveCategory(CategoryStoreValidations $request, CategoryStoreServices $service){
        $category = $service->store($request->validated());
        return response()->json($category);
    }
}