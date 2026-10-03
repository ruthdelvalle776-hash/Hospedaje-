<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvailabilityController extends Controller
{
    /**
     * Display the availability of the rooms for a date range.
     */
    public function index(Request $request): Response
    {
        $dates = $this->resolveDates($request);

        return Inertia::render('Availability/Index', [
            'rooms' => $this->availability($dates['check_in'], $dates['check_out']),
            'dates' => $dates,
        ]);
    }

    /**
     * Return the room IDs occupied for the given date range (JSON).
     */
    public function check(Request $request): JsonResponse
    {
        $dates = $this->resolveDates($request);
        $exclude = (int) $request->query('exclude', 0);

        $occupiedRoomIds = Reservation::query()
            ->where('status', '!=', Reservation::STATUS_CANCELLED)
            ->whereDate('check_in_date', '<', $dates['check_out'])
            ->whereDate('check_out_date', '>', $dates['check_in'])
            ->when($exclude > 0, fn ($query) => $query->where('id', '!=', $exclude))
            ->pluck('room_id')
            ->unique()
            ->values();

        return response()->json(['occupied_room_ids' => $occupiedRoomIds]);
    }

    /**
     * Resolve the date range from the request, defaulting to today and tomorrow.
     *
     * @return array{check_in: string, check_out: string}
     */
    private function resolveDates(Request $request): array
    {
        return [
            'check_in' => $request->query('check_in_date') ?: Carbon::today()->toDateString(),
            'check_out' => $request->query('check_out_date') ?: Carbon::today()->addDay()->toDateString(),
        ];
    }

    /**
     * Build the availability list for each room.
     *
     * @return array<int, array<string, mixed>>
     */
    private function availability(string $checkIn, string $checkOut): array
    {
        $rooms = Room::with('category')->orderBy('number')->get();

        $overlapping = Reservation::with('guest')
            ->where('status', '!=', Reservation::STATUS_CANCELLED)
            ->whereDate('check_in_date', '<', $checkOut)
            ->whereDate('check_out_date', '>', $checkIn)
            ->get()
            ->groupBy('room_id');

        return $rooms->map(function (Room $room) use ($overlapping) {
            $reservation = $overlapping->get($room->id)?->first();
            $available = $reservation === null && $room->status !== 'mantenimiento';

            return [
                'id' => $room->id,
                'number' => $room->number,
                'category' => $room->category?->name,
                'capacity' => $room->category?->capacity,
                'price_per_person' => $room->price_per_person,
                'status' => $room->status,
                'available' => $available,
                'reservation' => $reservation ? [
                    'id' => $reservation->id,
                    'guest' => $reservation->guest?->full_name,
                    'check_in_date' => $reservation->check_in_date->format('Y-m-d'),
                    'check_out_date' => $reservation->check_out_date->format('Y-m-d'),
                ] : null,
            ];
        })->values()->all();
    }
}
