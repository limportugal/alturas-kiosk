<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryUpdateValidations extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
             'name'         => ['sometimes', 'nullable', 'string'],
             'image_path'   => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
             'remove_image' => ['sometimes', 'boolean'],
        ];
    }
}