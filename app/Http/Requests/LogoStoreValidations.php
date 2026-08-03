<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LogoStoreValidations extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:2048'],
            'status' => ['required', 'in:Active,Inactive'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Logo name is required.',
            'image.required' => 'Please upload a logo image.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'The image must be a PNG, JPG, JPEG, SVG, or WebP file.',
            'image.max' => 'Image size must not exceed 2 MB.',
        ];
    }
}
