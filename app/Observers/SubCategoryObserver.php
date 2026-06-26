<?php

namespace App\Observers;

use App\Models\SubCategory\SubCategoryModel;
use App\Observers\Concerns\LogsActivity;

class SubCategoryObserver
{
    use LogsActivity;

    public function created(SubCategoryModel $model): void  { $this->logCreated($model, 'Sub Category'); }
    public function updated(SubCategoryModel $model): void  { $this->logUpdated($model, 'Sub Category'); }
    public function deleted(SubCategoryModel $model): void  { $this->logDeleted($model, 'Sub Category'); }
}
