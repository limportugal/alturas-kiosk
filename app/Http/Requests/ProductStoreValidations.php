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
        'status' => ['required', 'string', 'max:50'],
        'item_category_id' => ['required', 'exists:item_categories,id'],
        'quantity' => ['required', 'integer', 'min:0'],
        
        'images' => ['nullable', 'array', 'max:5'],
        'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]; 
    }

}
