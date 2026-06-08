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
            'sub_category_id'   => ['sometimes', 'nullable', 'exists:sub_categories,id'],
            'price'             => ['sometimes', 'nullable'],
            'quantity'          => ['sometimes', 'nullable'],
            'item_description'  => ['sometimes', 'nullable'],
            'variation_type_id' => ['sometimes', 'nullable', 'exists:product_variations,id'],
            'status'            => ['sometimes', 'nullable'],

            // new image uploads
            'images'            => ['sometimes', 'array'],
            'images.*'          => ['file', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],

            // ids of existing images to delete
            'removed_image_ids'   => ['sometimes', 'nullable', 'array'],
            'removed_image_ids.*' => ['integer', 'exists:product_item_images,id'],

            // color variants
            'color_variants'                  => ['sometimes', 'nullable', 'array'],
            'color_variants.*.id'             => ['sometimes', 'nullable', 'integer', 'exists:product_color_variants,id'],
            'color_variants.*.color_name'     => ['required_with:color_variants.*', 'string', 'max:50'],
            'color_variants.*.quantity'       => ['required', 'integer', 'min:0'],
            'color_variants.*.image_path'     => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
            'removed_variant_ids'             => ['sometimes', 'nullable', 'array'],
            'removed_variant_ids.*'           => ['integer', 'exists:product_color_variants,id'],
        ];
    }
}