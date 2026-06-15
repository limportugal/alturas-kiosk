<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KioskSetting extends Model
{
    protected $table    = 'kiosk_settings';
    protected $fillable = ['key', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        $row = static::where('key', $key)->first();
        return $row ? $row->value : $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], 
        ['value' => is_bool($value) ? ($value ? '1' : '0') : (string) $value]);
    }
}
