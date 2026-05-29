<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;


use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return view('kiosk_screen_saver');
});

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

    Route::prefix('category')->controller(CategoryController::class)->group(function () {
        Route::get('/categories', 'index')->name('categories');
        Route::get('/category-list', 'CategoriesList')->name('category-list');
        Route::get('/category-item', 'dropdown')->name('category');
        Route::post('/category-store', 'saveCategory')->name('category-store');
        Route::put('/{id}/category-status', 'CatToggleStatus')->name('category-status');
        Route::post('/store', 'storeCategory')->name('category.store');
        Route::get('/{id}/edit', 'edit');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

});

require __DIR__.'/auth.php';
