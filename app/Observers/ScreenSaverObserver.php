<?php

namespace App\Observers;

use App\Models\KioskSetting;
use App\Observers\Concerns\LogsActivity;
use App\Models\ActivityLog;

class ScreenSaverObserver {
    use LogsActivity;


    public function created(KioskSetting $model): void  { $this->logCreated($model, 'ScreenSaver'); }
    public function updated(KioskSetting $model): void  { 
        
        if($model->wasChanged('value')) {
            $key = $model->key;
            $old = $model->getOriginal('value');
            $new = $model->value;
            
            //Make the Description readable 
            $description = match($key) {
                'idle_timeout_seconds' => "Screen saver idle timeout changed : {$old}s -> {$new}s",
                'idle_enabled'         => "Screen saver status changed : " . ($old == '1' ? 'enabled' : 'disabled') .
                                            " -> " . 
                                            ($new == '1' ? 'enabled' : 'disabled'),
                'app_logo'             => "Application logo updated: {$new}",
                default                =>  "Kiosk Setting '{$key}' changed: '{$old}' -> '{$new}'",
            };

            ActivityLog::record('Updated', 'ScreenSaver', $description);
        
        }
    }
    public function deleted(KioskSetting $model): void  { $this->logDeleted($model, 'ScreenSaver'); }
}