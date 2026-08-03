<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use App\Models\ActivityLog;
use App\Models\Category\ItemCategoryModel;
use App\Models\ProductItem\ProductItemModel;
use App\Models\SubCategory\SubCategoryModel;
use App\Models\ProductItem\ProductVariations;
use App\Models\KioskSetting;
use App\Models\User;
use App\Models\Ad;


use App\Observers\CategoryObserver;
use App\Observers\ProductObserver;
use App\Observers\SubCategoryObserver;
use App\Observers\VariationsObserver;
use App\Observers\AdsObserver;
use App\Observers\ScreenSaverObserver;
use App\Observers\UsersObserver;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
  
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
        Vite::prefetch(concurrency: 3);

        Gate::before(function ($user, $ability) {
            return $user->hasRole('super-admin') ? true : null;
        });
        ItemCategoryModel::observe(CategoryObserver::class);
        ProductItemModel::observe(ProductObserver::class);
        SubCategoryModel::observe(SubCategoryObserver::class);
        ProductVariations::observe(VariationsObserver::class);
        KioskSetting::observe(ScreenSaverObserver::class);
        User::observe(UsersObserver::class);
        Ad::observe(AdsObserver::class);


    \Event::listen(\Illuminate\Auth\Events\Login::class, function ($event) {
        ActivityLog::record(
            'login',
            'Auth',
            "User logged in: {$event->user->name}"
        );
    });

    \Event::listen(\Illuminate\Auth\Events\Logout::class, function ($event) {
    ActivityLog::record(
        'logout',
        'Auth',
        "User log out: {$event->user->name}"
        );
    });

    }
}
