<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;


use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return view('kiosk_screen_saver');
});

// Public kiosk routes (no auth required)
Route::get('/kiosk/categories', [CategoryController::class, 'CategoriesList'])->name('category-public-list');
Route::get('/kiosk/sub-categories', [SubCategoryController::class, 'SubCategoryPublicList'])->name('sub-category-public-list');
Route::get('/Kiosk/products', [ProductController::class, 'product-list'])->name('product-public-list');


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

    //Product
    Route::prefix('product')->controller(ProductController::class)->group(function () {
        Route::get('/product-item','index')->name('products');
        Route::get('/product-list','list')->name('product-list');
        Route::post('/store','storeProduct')->name('products.store');
        Route::put('/{productItemModel}/toggle-status', 'toggleStatus')->name('products.toggle-status');
        Route::put('/{id}/update-product','updateProduct')->name('product.update-item');
        Route::put('/{id}','update');
        Route::delete('/{id}','destroy');
    });
    //Category
    Route::prefix('category')->controller(CategoryController::class)->group(function () {
        Route::get('/categories', 'index')->name('categories');
        Route::get('/category-list', 'CategoriesList')->name('category-list');
        Route::get('/category-item', 'dropdown')->name('category');
        Route::post('/category-store', 'saveCategory')->name('category-store');
        Route::put('/{id}/category-update', 'updateCategory')->name('category-update');
        Route::put('/{id}/category-status', 'CatToggleStatus')->name('category-status');
        Route::post('/store', 'storeCategory')->name('category.store');
        Route::get('/{id}/edit', 'edit');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

     //Sub-Category
    Route::prefix('sub-category')->controller(SubCategoryController::class)->group(function () {
        Route::get('/sub-categories',              'index')->name('sub-categories');
        Route::get('/sub-category-list',           'SubCategoryList')->name('sub-category-list');
        Route::get('/sub-category-item',           'dropdown')->name('sub-category-dropdown');
        Route::post('/sub-category-store',         'saveSubCategory')->name('sub-category-store');
        Route::put('/{id}/sub-category-update',    'updateSubCategory')->name('sub-category-update');
        Route::put('/{id}/sub-category-status',    'SubCatToggleStatus')->name('sub-category-status');
    });

});

require __DIR__.'/auth.php';
