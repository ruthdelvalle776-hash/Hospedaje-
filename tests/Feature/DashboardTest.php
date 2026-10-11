<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_page_is_displayed(): void
    {
        $response = $this->actingAs(User::factory()->create())->get('/dashboard');

        $response->assertOk()->assertInertia(fn ($page) => $page->component('Dashboard'));
    }

    public function test_dashboard_shows_room_stats(): void
    {
        Room::factory()->count(2)->create(['status' => 'disponible']);
        Room::factory()->create(['status' => 'ocupada']);
        Room::factory()->create(['status' => 'mantenimiento']);

        $response = $this->actingAs(User::factory()->create())->get('/dashboard');

        $response->assertOk()->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('stats.total', 4)
            ->where('stats.available', 2)
            ->where('stats.occupied', 1)
            ->where('stats.maintenance', 1));
    }

    public function test_active_reservation_counts_room_as_occupied(): void
    {
        $room = Room::factory()->create(['status' => 'disponible']);
        $today = Carbon::today();

        Reservation::factory()->confirmed()->create([
            'room_id' => $room->id,
            'check_in_date' => $today->copy()->subDay()->toDateString(),
            'check_out_date' => $today->copy()->addDay()->toDateString(),
        ]);

        $response = $this->actingAs(User::factory()->create())->get('/dashboard');

        $response->assertOk()->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('stats.total', 1)
            ->where('stats.available', 0)
            ->where('stats.occupied', 1));
    }

    public function test_dashboard_lists_arrivals_and_departures(): void
    {
        $today = Carbon::today();

        Reservation::factory()->confirmed()->create([
            'check_in_date' => $today->toDateString(),
            'check_out_date' => $today->copy()->addDays(2)->toDateString(),
        ]);

        Reservation::factory()->create([
            'check_in_date' => $today->copy()->subDays(2)->toDateString(),
            'check_out_date' => $today->toDateString(),
            'status' => Reservation::STATUS_IN_HOUSE,
        ]);

        $response = $this->actingAs(User::factory()->create())->get('/dashboard');

        $response->assertOk()->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('arrivalsToday', fn ($items) => count($items) === 1)
            ->where('departuresToday', fn ($items) => count($items) === 1));
    }

    public function test_cancelled_reservations_are_ignored(): void
    {
        $today = Carbon::today();

        Reservation::factory()->cancelled()->create([
            'check_in_date' => $today->toDateString(),
            'check_out_date' => $today->addDays(2)->toDateString(),
        ]);

        $response = $this->actingAs(User::factory()->create())->get('/dashboard');

        $response->assertOk()->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('arrivalsToday', fn ($items) => count($items) === 0)
            ->where('departuresToday', fn ($items) => count($items) === 0));
    }
}
