<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ActivityLog extends Model
{
    public $timestamps  = false;
    protected $table    = 'activity_logs';
    protected $fillable = ['user_id', 'user_name', 'action', 'module', 'description'];

    /**
     * Record an activity. Automatically resolves the authenticated admin.
     */
    public static function record(string $action, string $module, string $description): void
    {
        $user = Auth::user();

        static::create([
            'user_id'     => $user?->id,
            'user_name'   => $user?->name ?? 'System',
            'action'      => $action,
            'module'      => $module,
            'description' => $description,
        ]);
    }
}
