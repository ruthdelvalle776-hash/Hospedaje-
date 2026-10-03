<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalendarTest extends TestCase
{
    use RefreshDatabase;

    public function test_calendar_page_is_displayed(): void
    {
        $response = $this->actingAs(User::factory()->create())->get('/calendar');

        $response->assertOk();
    }

    public function test_calendar_returns_reservations_in_month(): void
    {
        $room = Room::factory()->create();

        Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
            'status' => 'confirmada',
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->get('/calendar?month=2026-10');

        $response->assertOk()->assertInertia(fn ($page) => $page
            ->component('Calendar/Index', false)
            ->has('reservations', 1)
            ->where('month.year', 2026)
            ->where('month.month', 10));
    }

    public function test_calendar_excludes_reservations_outside_month(): void
    {
        $room = Room::factory()->create();

        Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-08-01',
            'check_out_date' => '2026-08-05',
            'status' => 'confirmada',
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->get('/calendar?month=2026-10');

        $response->assertOk()->assertInertia(fn ($page) => $page
            ->component('Calendar/Index', false)
            ->has('reservations', 0));
    }
}
