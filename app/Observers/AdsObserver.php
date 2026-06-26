<?php

namespace App\Observers;

use App\Models\Ad;
use App\Observers\Concerns\LogsActivity;

class AdsObserver
{
    use LogsActivity;

    public function created(Ad $model): void  { $this->logCreated($model, 'Ad'); }
    public function updated(Ad $model): void  { $this->logUpdated($model, 'Ad'); }
    public function deleted(Ad $model): void  { $this->logDeleted($model, 'Ad'); }
}
