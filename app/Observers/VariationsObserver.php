<?php

namespace App\Observers;

use App\Models\ProductItem\ProductVariations;
use App\Observers\Concerns\LogsActivity;

class VariationsObserver
{
    use LogsActivity;

    public function created(ProductVariations $model): void  { $this->logCreated($model, 'Variation'); }
    public function updated(ProductVariations $model): void  { $this->logUpdated($model, 'Variation'); }
    public function deleted(ProductVariations $model): void  { $this->logDeleted($model, 'Variation'); }
}
