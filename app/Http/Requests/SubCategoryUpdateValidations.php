<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubCategoryUpdateValidations extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_category_id' => ['sometimes', 'integer', 'exists:item_categories,id'],
            'name'             => ['sometimes', 'nullable', 'string'],
            'image_path'       => ['sometimes', 'nullable', 'file', 'mimes:png,avif', 'max:2048'],
            'remove_image'     => ['sometimes', 'boolean'],
        ];
    }
}
