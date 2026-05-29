<?php

namespace App\Services\Shared;

use Illuminate\Validation\ValidationException;

class DuplicateCheckerService
{
    public function check(array $checks): void
    {
        $errors = [];

        foreach ($checks as $field => $config) {

            $model = $config['model'];
            $value = $config['value'];
            $message = $config['message'] ?? "{$field} already exists";

            $query = $model::where($field, $value);

            // optional ignore id (for updates)
            if (isset($config['ignore_id'])) {
                $query->where('id', '!=', $config['ignore_id']);
            }

            if ($query->exists()) {
                $errors[$field] = $message;
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }
}