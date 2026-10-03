<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    /**
     * Display the reservations calendar for the given month.
     */
    public function index(Request $request): Response
    {
        $date = $request->query('month')
            ? Carbon::parse($request->query('month').'-01')->startOfMonth()
            : Carbon::today()->startOfMonth();

        $start = $date->copy()->startOfMonth();
        $end = $date->copy()->endOfMonth();

        $rooms = Room::with('category')
            ->orderBy('number')
            ->get();

        $reservations = Reservation::with(['guest', 'room'])
            ->where('status', '!=', Reservation::STATUS_CANCELLED)
            ->whereDate('check_in_date', '<=', $end->toDateString())
            ->whereDate('check_out_date', '>', $start->toDateString())
            ->orderBy('check_in_date')
            ->get();

        return Inertia::render('Calendar/Index', [
            'month' => [
                'year' => $date->year,
                'month' => $date->month,
                'days' => $date->daysInMonth,
                'first_weekday' => $start->dayOfWeek,
                'prev' => $date->copy()->subMonth()->format('Y-m'),
                'next' => $date->copy()->addMonth()->format('Y-m'),
            ],
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
