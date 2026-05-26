<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

// Services
use App\Services\CategoryItemServices\CategoryDropDownServices;


class CategoryController extends Controller
{
    public function dropdown(CategoryDropDownServices $service){
        $category=$service->getCategoryDropDown();
        return response()->json($category);
    }
}