<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoomCategoryController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return Inertia::render('Dashboard');
    }

    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('room-categories', RoomCategoryController::class)->except(['show', 'destroy']);
    Route::patch('room-categories/{room_category}/toggle', [RoomCategoryController::class, 'toggle'])
        ->name('room-categories.toggle');

    Route::resource('rooms', RoomController::class)->except(['show']);
});

require __DIR__.'/auth.php';
