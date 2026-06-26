<?php

namespace App\Observers\Concerns;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;

trait LogsActivity
{
    // Fields to skip in change logs
    protected array $skipFields = ['image_path', 'updated_at', 'created_at', 'remember_token', 'password'];

    protected function buildChanges(Model $model): string
    {
        $changes = [];

        foreach ($model->getDirty() as $field => $newValue) {
            if (in_array($field, $this->skipFields)) continue;
            $oldValue  = $model->getOriginal($field);
            $changes[] = "{$field}: '{$oldValue}' → '{$newValue}'";
        }

        return implode(', ', $changes);
    }

    protected function logCreated(Model $model, string $module): void
    {
        ActivityLog::record('created', $module, "Created {$module}: {$model->name}");
    }

    protected function logUpdated(Model $model, string $module): void
    {
        $changes = $this->buildChanges($model);
        // Skip if only skipped fields changed (e.g. remember_token on login)
        if (!$changes) return;
        $description = "Updated {$module}: {$model->name}";
        $description .= " | {$changes}";
        ActivityLog::record('updated', $module, $description);
    }

    protected function logDeleted(Model $model, string $module): void
    {
        ActivityLog::record('deleted', $module, "Deleted {$module}: {$model->name}");
    }
}
