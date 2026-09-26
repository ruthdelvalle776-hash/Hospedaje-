<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Display a listing of the reservations.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $reservations = Reservation::with(['guest', 'room.category'])
            ->when($status, fn ($query, $status) => $query->where('status', $status))
            ->when($search, fn ($query, $search) => $query->whereHas(
                'guest',
                fn ($query) => $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('document_id', 'like', "%{$search}%"),
            ))
            ->orderByDesc('check_in_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Reservations/Index', [
            'reservations' => $reservations,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new reservation.
     */
    public function create(): Response
    {
        return Inertia::render('Reservations/Create', [
            'rooms' => Room::with('category')
                ->orderBy('number')
                ->get(),
        ]);
    }

    /**
     * Store a newly created reservation.
     */
    public function store(StoreReservationRequest $request): RedirectResponse
    {
        Reservation::create($this->withPricing($request->validated()));

        return Redirect::route('reservations.index')
            ->with('success', 'Reserva creada correctamente.');
    }

    /**
     * Show the form for editing the reservation.
     */
    public function edit(Reservation $reservation): Response
    {
        return Inertia::render('Reservations/Edit', [
            'reservation' => $reservation->load(['guest', 'room.category']),
            'rooms' => Room::with('category')
                ->orderBy('number')
                ->get(),
        ]);
    }

    /**
     * Update the reservation.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation): RedirectResponse
    {
        $reservation->update($this->withPricing($request->validated()));

        return Redirect::route('reservations.index')
            ->with('success', 'Reserva actualizada correctamente.');
    }

    /**
     * Soft delete the reservation.
     */
    public function destroy(Reservation $reservation): RedirectResponse
    {
        $reservation->delete();

        return Redirect::route('reservations.index')
            ->with('success', 'Reserva eliminada.');
    }

    /**
     * Cancel the reservation.
     */
    public function cancel(Reservation $reservation): RedirectResponse
    {
        if (! $reservation->isCancellable()) {
            return Redirect::back()
                ->with('error', 'La reserva no puede cancelarse en su estado actual.');
        }

        $reservation->update(['status' => Reservation::STATUS_CANCELLED]);

        return Redirect::back()
            ->with('success', 'Reserva cancelada.');
    }

    /**
     * Compute the number of nights and the total for the reservation.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function withPricing(array $data): array
    {
        $checkIn = Carbon::parse($data['check_in_date']);
        $checkOut = Carbon::parse($data['check_out_date']);

        $data['number_of_nights'] = $checkIn->diffInDays($checkOut);
        $data['total'] = round($data['number_of_people'] * $data['price_per_person'] * $data['number_of_nights'], 2);

        return $data;
    }
}
