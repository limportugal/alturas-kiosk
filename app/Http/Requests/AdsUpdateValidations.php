<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdsUpdateValidations extends FormRequest
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
            'title' => ['sometimes', 'string', 'max:255'],
            'file_path' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,avif,mp4,webm', 'max:51200'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'duration' => ['sometimes', 'integer', 'min:3', 'max:120'],
            'status' => ['sometimes', Rule::in(['Active', 'Inactive'])],
        ];
    }
}
