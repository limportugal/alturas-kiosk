<?php

namespace App\Services\LogoServices;

use App\Models\KioskLogo;
use Illuminate\Support\Facades\DB;

class LogoToggleStatusServices
{
    public function toggleStatus(int $id): KioskLogo
    {
        return DB::transaction(function () use ($id) {
            $logo = KioskLogo::findOrFail($id);

            if ($logo->status === 'Active') {
                $logo->status = 'Inactive';
            } else {
                KioskLogo::query()->update(['status' => 'Inactive']);
                $logo->status = 'Active';
            }

            $logo->save();

            return $logo;
        });
    }
}
