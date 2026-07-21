<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProductItem\ProductVariations;

use Inertia\Inertia;


use App\Http\Requests\VariationStoreRequest;
use App\Http\Requests\VariationUpdateRequest;
use App\Http\Requests\VariationsReOrderValidations;


use App\Services\VariationsServices\VariationsRowReorderingServices;
use App\Services\VariationsServices\VariationsIndex;
use App\Services\VariationsServices\VariationsStore;
use App\Services\VariationsServices\VariationsUpdate;
class VariationController extends Controller
{
    /**
     * Render the Variations admin page.
     */
    public function page()
    {
        return Inertia::render('Admin/Variations');
    }

    /**
     * Return paginated list of variation types.
     */
    public function index(VariationsIndex $service){
        $variation = $service->getVariationIndex();
        return response()->json($variation);
    }

    /**
     * Return all active variations for dropdowns.
     */
    public function dropdown() {
        $variations = ProductVariations::where('status', 'Active')
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('id')
            ->get(['id', 'name', 'image_path']);

        return response()->json($variations);
    }

    /**
     * Store a new variation type. 
     */

     public function store(VariationStoreRequest $request, VariationsStore $service ){
        $variation = $service->storeVariation($request->validated(), $request->file('image_path'));
        return response()->json(['created' => $variation], 201);
     }

    /** 
     * Update an existing variation type.
     */
    public function update(VariationUpdateRequest $request, VariationsUpdate $service, $id ){
        $variation = $service->update($id, $request->validated(), $request->file('image_path'));
        return response()->json(['updated' => $variation], 200);
    }
    /*
     * Toggle Active/Inactive status.
     */
    public function toggleStatus($id) {
        $variation = ProductVariations::findOrFail($id);
        $variation->status = $variation->status === 'Active' ? 'Inactive' : 'Active';
        $variation->save();

        return response()->json(['toggled' => $variation]);
    }


    public function reorderRow(VariationsReOrderValidations $request, VariationsRowReorderingServices $service) {
        $variation = $service->reorderRows($request->validated('ids'));
        return response()->json($variation);
    }
}
