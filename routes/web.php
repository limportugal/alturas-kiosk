<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\VariationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\KioskSettingController;
use App\Http\Controllers\AdsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityLogController;


use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return view('kiosk_screen_saver');
});

// Public kiosk routes (no auth required)
Route::get('/kiosk/categories', [CategoryController::class, 'publicCategoriesList'])->name('category-public-list');
Route::get('/kiosk/sub-categories', [SubCategoryController::class, 'SubCategoryPublicList'])->name('sub-category-public-list');
Route::get('/Kiosk/products', [ProductController::class, 'showPublicProduct'])->name('product-public-list');
Route::get('/kiosk/product-variations', [VariationController::class, 'index'])->name('product-variations-public-list');
Route::get('/kiosk/stock/check', [CartController::class, 'checkStock'])->name('cart.check-stock');
Route::get('/kiosk/settings', [KioskSettingController::class, 'show'])->name('kiosk.settings.show');
Route::get('/kiosk/ads', [AdsController::class, 'publicList'])->name('ads.public-list');

// Cart routes (no auth required)
Route::get('/kiosk/cart/active', [CartController::class, 'getActiveCart'])->name('cart.active');
Route::get('/kiosk/stock/check', [CartController::class, 'checkStock'])->name('stock.check');
Route::post('/kiosk/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/kiosk/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::put('/kiosk/cart/{id}/confirm', [CartController::class, 'confirm'])->name('cart.confirm');
Route::put('/kiosk/cart/{id}/deactivate', [CartController::class, 'deactivate'])->name('cart.deactivate');


Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Admin/Product-Item');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

    //Product
Route::middleware(['auth', 'permission:manage products'])->group(function () {
    Route::prefix('product')->controller(ProductController::class)->group(function () {
        Route::get('/product-item','index')->name('products');
        Route::get('/product-list','list')->name('product-list');
        Route::post('/store','storeProduct')->name('products.store');
        Route::put('/product-reorder', 'reorderRow')->name('product.reorder');
        Route::put('/{productItemModel}/toggle-status', 'toggleStatus')->name('products.toggle-status');
        Route::put('/{id}/update-product','updateProduct')->name('product.update-item');
        Route::put('/{id}','update');
        Route::delete('/{id}','destroy');
    });
});

    //Category
Route::middleware(['auth', 'permission:manage categories'])->group(function () {
    Route::prefix('category')->controller(CategoryController::class)->group(function () {
        Route::get('/categories', 'index')->name('categories');
        Route::get('/category-list', 'CategoriesList')->name('category-list');
        Route::get('/category-item', 'dropdown')->name('category');
        Route::post('/category-store', 'saveCategory')->name('category-store');
        Route::put('/{id}/category-update', 'updateCategory')->name('category-update');
        Route::put('/{id}/category-status', 'CatToggleStatus')->name('category-status');
        Route::post('/store', 'storeCategory')->name('category.store');
        Route::put('/category-reorder', 'rowReordering')->name('category.reorder');
        Route::get('/{id}/edit', 'edit');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });
});


     //Sub-Category
Route::middleware(['auth', 'permission:manage sub categories'])->group(function () {
    Route::prefix('sub-category')->controller(SubCategoryController::class)->group(function () {
        Route::get('/sub-categories',              'index')->name('sub-categories');
        Route::get('/sub-category-list',           'SubCategoryList')->name('sub-category-list');
        Route::get('/sub-category-item',           'dropdown')->name('sub-category-dropdown');
        Route::post('/sub-category-store',         'saveSubCategory')->name('sub-category-store');
        Route::put('/{id}/sub-category-update',    'updateSubCategory')->name('sub-category-update');
        Route::put('/{id}/sub-category-status',    'SubCatToggleStatus')->name('sub-category-status');
        Route::put('/sub-category-reorder', 'reOrderingRow')->name('sub-category.reorder');
    });
});

    // Variation Types
Route::middleware(['auth', 'permission:manage variations'])->group(function () {
    Route::prefix('variation')->controller(VariationController::class)->group(function () {
        Route::get('/variations',              'page')->name('variations');
        Route::get('/variation-list',          'index')->name('variation-list');
        Route::get('/variation-dropdown',      'dropdown')->name('variation-dropdown');
        Route::post('/variation-store',        'store')->name('variation-store');
        Route::put('/{id}/variation-update',   'update')->name('variation-update');
        Route::put('/{id}/variation-status',   'toggleStatus')->name('variation-status');
    });
});

    // Kiosk Settings
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::prefix('kiosk-settings')->controller(KioskSettingController::class)->group(function () {
        Route::get('/screen-saver',  'page')->name('screen-saver');
        Route::put('/update',        'update')->name('kiosk.settings.update');
    });
});

    // Ads Management
Route::middleware(['auth', 'permission:manage ads'])->group(function () {
    Route::prefix('ads')->controller(AdsController::class)->group(function () {
        Route::get('/ads-page',           'page')->name('ads');
        Route::get('/ads-list',           'index')->name('ads-list');
        Route::post('/ads-store',         'store')->name('ads-store');
        Route::put('/{id}/ads-update',    'update')->name('ads-update');
        Route::put('/{id}/ads-status',    'toggleStatus')->name('ads-status');
        Route::delete('/{id}/ads-delete', 'destroy')->name('ads-delete');
    });

});

  // Users Management
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::prefix('users')->controller(UserController::class)->group(function () {
        Route::get('/page', 'index')->name('users');
        Route::get('/list', 'list')->name('users.list');
        Route::post('/store', 'store')->name('users.store');
        Route::put('/{id}/update', 'update')->name('users.update');
        Route::patch('/{id}/toggle', 'toggle')->name('user.toggle');
    });
});

// Activiy Logs

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::prefix('activity-log')->controller(ActivityLogController::class)->group(function () {
        Route::get('/page', 'page')->name('activity-log');
        Route::get('/list', 'list')->name('activity-log.list');
    });
});



require __DIR__.'/auth.php';
