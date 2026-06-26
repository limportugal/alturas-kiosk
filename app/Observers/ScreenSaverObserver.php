<?php

namespace App\Observers;

use App\Models\KioskSetting;
use App\Observers\Concerns\LogsActivity;

class ScreenSaverObserver {
    use LogsActivity;


    public function created(KioskSetting $model): void  { $this->logCreated($model, 'ScreenSaver'); }
    public function updated(KioskSetting $model): void  { $this->logUpdated($model, 'ScreenSaver'); }
    public function deleted(KioskSetting $model): void  { $this->logDeleted($model, 'ScreenSaver'); }
}