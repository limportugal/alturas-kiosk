<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CartUpdateRequestValidations extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'cart_items'              => ['required', 'array', 'min:1'],
        'cart_items.*.product_id' => ['required', 'integer'],
        'cart_items.*.name'       => ['required', 'string'],
        'cart_items.*.sku'        => ['required', 'string'],
        'cart_items.*.price'      => ['required', 'numeric'],
        'cart_items.*.quantity'   => ['required', 'integer', 'min:1'],
        'cart_items.*.stock'      => ['required', 'integer', 'min:0'],
        'cart_items.*.color'      => ['nullable', 'string'],
        'cart_items.*.image'      => ['nullable', 'string'],
        'cart_items.*.subtotal'   => ['required', 'numeric'],
        ];
    }
}
