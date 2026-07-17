<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VariationStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:product_variations,name'],
            'sub_category_id' => ['nullable', 'integer', 'exists:sub_categories,id'],
            'image_path' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
        ];
    }
}
