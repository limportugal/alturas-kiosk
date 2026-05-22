<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;


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
        Route::get('/{id}/edit','edit');
        Route::put('/{id}','update');
        Route::delete('/{id}','destroy');
    });

});

require __DIR__.'/auth.php';
