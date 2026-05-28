<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateValidations extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_code'         => ['sometimes', 'nullable', 'string'],
            'name'              => ['sometimes', 'nullable', 'string'],
            'sku'               => ['sometimes', 'nullable', 'string'],
            'item_category_id'  => ['sometimes', 'nullable'],
            'price'             => ['sometimes', 'nullable'],
            'quantity'          => ['sometimes', 'nullable'],
            'item_description'  => ['sometimes', 'nullable'],
            'status'            => ['sometimes', 'nullable'],

            // new image uploads
            'images'            => ['sometimes', 'array'],
            'images.*'          => ['image', 'mimes:jpg,jpeg,png,webp'],

            // ids of existing images to delete ← bago
            'removed_image_ids'   => ['sometimes', 'nullable', 'array'],
            'removed_image_ids.*' => ['integer', 'exists:product_item_images,id'],
        ];
    }
}