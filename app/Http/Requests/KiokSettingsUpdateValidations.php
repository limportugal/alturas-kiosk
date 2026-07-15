<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KiokSettingsUpdateValidations extends FormRequest {
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
             'idle_timeout_seconds' => ['required', 'integer', 'min:10', 'max:3600'],
             'idle_enabled' => ['required', 'boolean'],
        ];
    }
}
