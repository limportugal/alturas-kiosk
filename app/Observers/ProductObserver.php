<?php

namespace App\Observers;

use App\Models\ProductItem\ProductItemModel;
use App\Observers\Concerns\LogsActivity;

class ProductObserver
{
    use LogsActivity;

    public function created(ProductItemModel $model): void  { $this->logCreated($model, 'Product'); }
    public function updated(ProductItemModel $model): void  { $this->logUpdated($model, 'Product'); }
    public function deleted(ProductItemModel $model): void  { $this->logDeleted($model, 'Product'); }
}
