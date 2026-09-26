<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGuestRequest;
use App\Http\Requests\UpdateGuestRequest;
use App\Models\Guest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    /**
     * Display a listing of the guests.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $guests = Guest::query()
            ->when($search, fn ($query) => $this->applySearch($query, $search))
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Guests/Index', [
            'guests' => $guests,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new guest.
     */
    public function create(): Response
    {
        return Inertia::render('Guests/Create');
    }

    /**
     * Store a newly created guest.
     */
    public function store(StoreGuestRequest $request): RedirectResponse
    {
        Guest::create($request->validated());

        return Redirect::route('guests.index')
            ->with('success', 'Huésped creado correctamente.');
    }

    /**
     * Show the form for editing the guest.
     */
    public function edit(Guest $guest): Response
    {
        return Inertia::render('Guests/Edit', [
            'guest' => $guest,
        ]);
    }

    /**
     * Update the guest.
     */
    public function update(UpdateGuestRequest $request, Guest $guest): RedirectResponse
    {
        $guest->update($request->validated());

        return Redirect::route('guests.index')
            ->with('success', 'Huésped actualizado correctamente.');
    }

    /**
     * Soft delete the guest.
     */
    public function destroy(Guest $guest): RedirectResponse
    {
        $guest->delete();

        return Redirect::route('guests.index')
            ->with('success', 'Huésped eliminado.');
    }

    /**
     * Return a lightweight list of guests matching the query for the combobox.
     */
    public function search(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('q', ''));

        $guests = Guest::query()
            ->when($search !== '', fn ($query) => $this->applySearch($query, $search))
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->limit(10)
            ->get(['id', 'first_name', 'last_name', 'document_id', 'phone']);

        return response()->json($guests);
    }

    /**
     * Apply the search filter across the guest fields.
     */
    private function applySearch($query, string $search): void
    {
        $query->where(function ($query) use ($search) {
            $query->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('document_id', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });
    }
}
