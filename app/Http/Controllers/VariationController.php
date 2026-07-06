<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProductItem\ProductVariations;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

use App\Http\Requests\VariationsReOrderValidations;

use App\Services\VariationsServices\VariationsRowReorderingServices;

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
    public function index()
    {
        $variations = ProductVariations::with('subCategory:id,name')
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('id')
            ->paginate(15);
        return response()->json($variations);
    }

    /**
     * Return all active variations for dropdowns.
     */
    public function dropdown()
    {
        $variations = ProductVariations::where('status', 'Active')
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('id')
            ->get(['id', 'name', 'image_path']);

        return response()->json($variations);
    }

    /**
     * Store a new variation type. 
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => ['required', 'string', 'max:255', 'unique:product_variations,name'],
            'sub_category_id' => ['nullable', 'integer', 'exists:sub_categories,id'],
            'image_path'      => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
            'status'          => ['required', Rule::in(['Active', 'Inactive'])],
        ]);

        $imagePath = null;
        $nextSortOrder = (ProductVariations::max('sort_order') ?? 0) + 1;
        if ($request->hasFile('image_path')) {
            $file     = $request->file('image_path');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('variations'), $fileName);
            $imagePath = 'variations/' . $fileName;
        }

        $variation = ProductVariations::create([
            'sub_category_id' => $data['sub_category_id'] ?? null,
            'name'            => $data['name'],
            'sort_order'      => $nextSortOrder,
            'image_path'      => $imagePath,
            'status'          => $data['status'],
        ]);

        return response()->json(['created' => $variation], 201);
    }

    /**
     * Update an existing variation type.
     */
    public function update(Request $request, $id)
    {
        $variation = ProductVariations::findOrFail($id);

        $data = $request->validate([
            'name'            => ['sometimes', 'string', 'max:255', Rule::unique('product_variations', 'name')->ignore($id)],
            'sub_category_id' => ['nullable', 'integer', 'exists:sub_categories,id'],
            'image_path'      => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
            'status'          => ['sometimes', Rule::in(['Active', 'Inactive'])],
            'remove_image'    => ['sometimes', 'boolean'],
        ]);

        // Remove old image if flagged
        if (!empty($data['remove_image'])) {
            if ($variation->image_path && file_exists(public_path($variation->image_path))) {
                unlink(public_path($variation->image_path));
            }
            $data['image_path'] = null;
        } elseif ($request->hasFile('image_path')) {
            // Remove old image if exists
            if ($variation->image_path && file_exists(public_path($variation->image_path))) {
                unlink(public_path($variation->image_path));
            }

            $file     = $request->file('image_path');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('variations'), $fileName);
            $data['image_path'] = 'variations/' . $fileName;
        } else {
            unset($data['image_path'], $data['remove_image']); // keep existing if no new file uploaded
        }

        $variation->update($data);

        return response()->json(['updated' => $variation]);
    }

    /**
     * Toggle Active/Inactive status.
     */
    public function toggleStatus($id)
    {
        $variation = ProductVariations::findOrFail($id);
        $variation->status = $variation->status === 'Active' ? 'Inactive' : 'Active';
        $variation->save();

        return response()->json(['toggled' => $variation]);
    }


    public function reorderRow(VariationsReOrderValidations $request, VariationsRowReorderingServices $service ){
        $variation = $service->reorderRows($request->validated('ids'));
        return response()->json($variation);
    }
}
