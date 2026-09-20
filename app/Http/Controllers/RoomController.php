<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Room;
use App\Models\RoomCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms.
     */
    public function index(): Response
    {
        return Inertia::render('Rooms/Index', [
            'rooms' => Room::with('category')
                ->orderBy('number')
                ->paginate(15),
        ]);
    }

    /**
     * Show the form for creating a new room.
     */
    public function create(): Response
    {
        return Inertia::render('Rooms/Create', [
            'categories' => RoomCategory::where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(StoreRoomRequest $request): RedirectResponse
    {
        Room::create($request->validated());

        return Redirect::route('rooms.index')
            ->with('success', 'Habitación creada correctamente.');
    }

    /**
     * Show the form for editing the room.
     */
    public function edit(Room $room): Response
    {
        return Inertia::render('Rooms/Edit', [
            'room' => $room,
            'categories' => RoomCategory::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the room.
     */
    public function update(UpdateRoomRequest $request, Room $room): RedirectResponse
    {
        $room->update($request->validated());

        return Redirect::route('rooms.index')
            ->with('success', 'Habitación actualizada correctamente.');
    }

    /**
     * Soft delete the room.
     */
    public function destroy(Room $room): RedirectResponse
    {
        $room->delete();

        return Redirect::route('rooms.index')
            ->with('success', 'Habitación eliminada.');
    }
}
