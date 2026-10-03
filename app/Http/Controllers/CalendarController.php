<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    /**
     * Display the reservations calendar.
     */
    public function index(): Response
    {
        $rooms = Room::with('category')
            ->orderBy('number')
            ->get();

        $reservations = Reservation::with(['guest', 'room'])
            ->where('status', '!=', Reservation::STATUS_CANCELLED)
            ->orderBy('check_in_date')
            ->get();

        return Inertia::render('Calendar/Index', [
            'rooms' => $rooms->map(fn (Room $room) => [
                'id' => $room->id,
                'number' => $room->number,
                'category' => $room->category?->name,
            ])->values(),
            'reservations' => $reservations->map(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'room_id' => $reservation->room_id,
                'guest' => $reservation->guest?->full_name,
                'check_in_date' => $reservation->check_in_date->format('Y-m-d'),
                'check_out_date' => $reservation->check_out_date->format('Y-m-d'),
                'status' => $reservation->status,
            ])->values(),
        ]);
    }
}
