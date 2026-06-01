<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubCategoryStoreValidations extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_category_id' => ['required', 'integer', 'exists:item_categories,id'],
            'name'             => ['required', 'string', 'max:50'],
            'image_path'       => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'status'           => ['nullable', 'string'],
        ];
    }
}
