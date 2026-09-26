<?php

use App\Http\Controllers\GuestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
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

    Route::get('guests/search', [GuestController::class, 'search'])->name('guests.search');
    Route::resource('guests', GuestController::class)->except(['show']);

    Route::resource('reservations', ReservationController::class)->except(['show']);
    Route::patch('reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])
        ->name('reservations.cancel');
});

require __DIR__.'/auth.php';
