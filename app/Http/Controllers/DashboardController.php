<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the administrative dashboard.
     */
    public function index(): Response
    {
        $today = Carbon::today();

        $activeRoomIds = Reservation::query()
            ->where('status', '!=', Reservation::STATUS_CANCELLED)
            ->whereDate('check_in_date', '<=', $today)
            ->whereDate('check_out_date', '>', $today)
            ->pluck('room_id')
            ->unique();

        $occupied = Room::query()
            ->where('status', '!=', 'mantenimiento')
            ->where(function ($query) use ($activeRoomIds) {
                $query->where('status', 'ocupada')
                    ->orWhereIn('id', $activeRoomIds);
            })
            ->count();

        $available = Room::query()
            ->where('status', 'disponible')
            ->whereNotIn('id', $activeRoomIds)
            ->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => Room::count(),
                'available' => $available,
                'occupied' => $occupied,
                'maintenance' => Room::where('status', 'mantenimiento')->count(),
            ],
            'arrivalsToday' => $this->mapReservations(
                Reservation::with(['guest', 'room'])
                    ->whereDate('check_in_date', $today)
                    ->where('status', '!=', Reservation::STATUS_CANCELLED)
                    ->orderBy('check_in_date')
                    ->get(),
            ),
            'departuresToday' => $this->mapReservations(
                Reservation::with(['guest', 'room'])
                    ->whereDate('check_out_date', $today)
                    ->where('status', '!=', Reservation::STATUS_CANCELLED)
                    ->orderBy('check_out_date')
                    ->get(),
            ),
            'upcomingReservations' => $this->mapReservations(
                Reservation::with(['guest', 'room'])
                    ->whereDate('check_in_date', '>', $today)
                    ->whereIn('status', [
                        Reservation::STATUS_PENDING,
                        Reservation::STATUS_CONFIRMED,
                    ])
                    ->orderBy('check_in_date')
                    ->limit(7)
                    ->get(),
            ),
            'pendingReservations' => $this->mapReservations(
                Reservation::with(['guest', 'room'])
                    ->where('status', Reservation::STATUS_PENDING)
                    ->orderBy('check_in_date')
                    ->get(),
            ),
        ]);
    }

    /**
     * Serialize reservations into a compact shape for the dashboard.
     *
     * @param  Collection<int, Reservation>  $reservations
     * @return array<int, array<string, mixed>>
     */
    private function mapReservations($reservations): array
    {
        return $reservations->map(fn (Reservation $reservation) => [
            'id' => $reservation->id,
            'guest' => $reservation->guest?->full_name,
            'room' => $reservation->room?->number,
            'check_in_date' => $reservation->check_in_date?->format('Y-m-d'),
            'check_out_date' => $reservation->check_out_date?->format('Y-m-d'),
            'status' => $reservation->status,
        ])->values()->all();
    }
}
