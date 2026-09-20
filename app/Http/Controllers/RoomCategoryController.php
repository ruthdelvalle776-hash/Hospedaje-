<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomCategoryRequest;
use App\Http\Requests\UpdateRoomCategoryRequest;
use App\Models\RoomCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class RoomCategoryController extends Controller
{
    /**
     * Display a listing of the room categories.
     */
    public function index(): Response
    {
        return Inertia::render('RoomCategories/Index', [
            'categories' => RoomCategory::withCount('rooms')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new room category.
     */
    public function create(): Response
    {
        return Inertia::render('RoomCategories/Create');
    }

    /**
     * Store a newly created room category.
     */
    public function store(StoreRoomCategoryRequest $request): RedirectResponse
    {
        RoomCategory::create($request->validated());

        return Redirect::route('room-categories.index')
            ->with('success', 'Categoría creada correctamente.');
    }

    /**
     * Show the form for editing the room category.
     */
    public function edit(RoomCategory $roomCategory): Response
    {
        return Inertia::render('RoomCategories/Edit', [
            'category' => $roomCategory,
        ]);
    }

    /**
     * Update the room category.
     */
    public function update(
        UpdateRoomCategoryRequest $request,
        RoomCategory $roomCategory,
    ): RedirectResponse {
        $roomCategory->update($request->validated());

        return Redirect::route('room-categories.index')
            ->with('success', 'Categoría actualizada correctamente.');
    }

    /**
     * Toggle the active state of the room category.
     */
    public function toggle(RoomCategory $roomCategory): RedirectResponse
    {
        $roomCategory->update(['is_active' => ! $roomCategory->is_active]);

        return Redirect::back()->with(
            'success',
            $roomCategory->is_active
                ? 'Categoría activada.'
                : 'Categoría desactivada.',
        );
    }
}
