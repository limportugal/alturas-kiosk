<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class AdsStoreRequestValidations extends FormRequest
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
            'title'      => ['required', 'string', 'max:255'],
            'file_path'  => ['required', 'file', 'mimes:jpg,jpeg,png,webp,avif,mp4,webm', 'max:51200'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'duration'   => ['required', 'integer', 'min:3', 'max:120'],
            'status'     => ['required', Rule::in(['Active', 'Inactive'])],
        ];
    }
}
