<?php

namespace App\Observers;


use App\Models\Category\ItemCategoryModel;
use App\Models\ActivityLog;


class CategoryObserver
{
    /**
     * Handle the ItemCategoryModel "created" event.
     */
    public function created(ItemCategoryModel $itemCategoryModel): void
    {
        ActivityLog::record('created', 'Category', "Created category: {$itemCategoryModel->name}");
    }

    /**
     * Handle the ItemCategoryModel "updated" event.
     */
    public function updated(ItemCategoryModel $itemCategoryModel): void
    {
        ActivityLog::record('updated', 'Category', "updated category: {$itemCategoryModel->name}");
    }

    /**
     * Handle the ItemCategoryModel "deleted" event.
     */
    public function deleted(ItemCategoryModel $itemCategoryModel): void
    {
        ActivityLog::record('deleted', 'Category', "Created category: {$itemCategoryModel->name}");
    }

    /**
     * Handle the ItemCategoryModel "restored" event.
     */
    public function restored(ItemCategoryModel $itemCategoryModel): void
    {
        //
    }

    /**
     * Handle the ItemCategoryModel "force deleted" event.
     */
    public function forceDeleted(ItemCategoryModel $itemCategoryModel): void
    {
        //
    }
}
