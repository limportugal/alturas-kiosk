<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryReOrderValidations extends FormRequest{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow all authenticated users to update holidays
    }
    public function rules(): array{
        return[
        'ids' => ['required', 'array'],
        'ids.*' => ['required', 'integer', 'exists:item_categories,id'],
        ];
    }

}