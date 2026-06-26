<?php

namespace App\Observers;

use App\Models\Category\ItemCategoryModel;
use App\Observers\Concerns\LogsActivity;

class CategoryObserver
{
    use LogsActivity;

    public function created(ItemCategoryModel $model): void  { $this->logCreated($model, 'Category'); }
    public function updated(ItemCategoryModel $model): void  { $this->logUpdated($model, 'Category'); }
    public function deleted(ItemCategoryModel $model): void  { $this->logDeleted($model, 'Category'); }
}
