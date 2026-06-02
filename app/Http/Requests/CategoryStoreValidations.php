<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryStoreValidations extends FormRequest{
    
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow all authenticated users to update holidays
    }

    public function rules(): array{
        return[
        'name' => 'required|string|max:50',
         'image_path'  => ['sometimes', 'nullable','file', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
        'status' => ['nullable', 'string'],
        ]; 
    }

}
