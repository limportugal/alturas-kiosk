<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KioskLogo extends Model
{
    use HasFactory;

    protected $table = 'kiosk_logos';

    protected $fillable = [
        'name',
        'image_path',
        'status',
    ];
}
