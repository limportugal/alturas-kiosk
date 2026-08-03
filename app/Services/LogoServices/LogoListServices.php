<?php

namespace App\Services\LogoServices;

use App\Models\KioskLogo;

class LogoListServices
{
    public function list()
    {
        return KioskLogo::query()
            ->latest()
            ->get();
    }
}
