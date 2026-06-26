<?php

namespace App\Observers;

use App\Models\User;
use App\Observers\Concerns\LogsActivity;

class UsersObserver {
    use LogsActivity;

    public function created(User $model): void  { $this->logCreated($model->name); }
    public function updated(User $model): void  { $this->logUpdated($model, 'User'); }
    public function deleted(User $model): void  { $this->logDeleted($model, 'User'); }
}
