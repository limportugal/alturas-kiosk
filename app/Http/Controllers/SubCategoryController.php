<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

// Validations
use App\Http\Requests\SubCategoryStoreValidations;
use App\Http\Requests\SubCategoryUpdateValidations;

// Services
use App\Services\SubItemCategoryServices\SubCategoryIndexServices;
use App\Services\SubItemCategoryServices\SubCategoryListServices;
use App\Services\SubItemCategoryServices\SubCategoryDropDownServices;
use App\Services\SubItemCategoryServices\SubCategoryToggleStatusServices;
use App\Services\SubItemCategoryServices\SubCategoryStoreServices;
use App\Services\SubItemCategoryServices\SubCategoryUpdateServices;

class SubCategoryController extends Controller
{
    public function index(SubCategoryIndexServices $service)
    {
        $subcategory = $service->getSubCategoryIndex();
        return Inertia::render('Admin/SubCategories', [
            'subcategory' => $subcategory,
        ]);
    }

    public function SubCategoryList(SubCategoryListServices $service)
    {
        $subcategory = $service->getSubCategoryList();
        return response()->json([
            'data' => $subcategory]); 
    }

    
    public function SubCategoryPublicList(SubCategoryListServices $service){
        $subcategory = $service->getPublicSubCategoryList();
        return response()->json([ 'data' => $subcategory]);
    }


    public function dropdown(SubCategoryDropDownServices $service)
    {
        $subcategory = $service->getSubCategoryDropDown();
        return response()->json($subcategory);
    }

    public function SubCatToggleStatus(SubCategoryToggleStatusServices $service, $id)
    {
        $subcategory = $service->toggleStatus($id);
        return response()->json($subcategory);
    }

    public function saveSubCategory(SubCategoryStoreValidations $request, SubCategoryStoreServices $service)
    {
        $subcategory = $service->store($request->validated());
        return response()->json($subcategory);
    }

    public function updateSubCategory(SubCategoryUpdateValidations $request, SubCategoryUpdateServices $service, $id)
    {
        $subcategory = $service->update($request->validated(), $id);
        return response()->json($subcategory);
    }
}
