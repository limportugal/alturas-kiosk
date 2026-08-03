<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LogoSettingUpdateValidations extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'logo' => ['required', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'logo.required' => 'Please select a logo image to upload.',
            'logo.image' => 'The uploaded file must be a valid image.',
            'logo.mimes' => 'The logo must be a PNG, JPG, JPEG, SVG, or WebP file.',
            'logo.max' => 'The logo file size must not exceed 2 MB.',
        ];
    }
}
