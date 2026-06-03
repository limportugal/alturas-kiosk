<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreValidations extends FormRequest{
    
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow all authenticated users to update holidays
    }

    public function rules(): array{
        return[
        'item_code' => '|required|string',
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'sku' =>  'required|string|unique:product_items,sku',
        'item_description' => ['nullable', 'string'],
        'item_category_id' => ['required', 'exists:item_categories,id'],
        'sub_category_id'  => ['nullable', 'exists:sub_categories,id'],
        'quantity' => ['required', 'integer', 'min:0'],
        
        'images' => ['nullable', 'array', 'max:5'],
        'images.*' => ['file', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],

        'color_variants'               => ['nullable', 'array'],
        'color_variants.*.color_name'  => ['required_with:color_variants.*', 'string', 'max:50'],
        'color_variants.*.image_path'   => ['sometimes', 'nullable','file', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
        ]; 
    }

}
