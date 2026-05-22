<?php

namespace App\Http\Requests\Validations;

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
        'sku' =>  'required|string|unique:products,sku',
        'item_description' => ['nullable', 'string'],
        'status' => ['required', 'string', 'max:50'],
        

        
        'images' => ['nullable', 'array', 'max:5'],
        'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]; 
    }

}