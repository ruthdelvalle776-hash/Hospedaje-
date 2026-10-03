<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_availability_page_is_displayed(): void
    {
        $response = $this->actingAs(User::factory()->create())->get('/availability');

        $response->assertOk();
    }

    public function test_availability_lists_available_and_occupied_rooms(): void
    {
        $roomA = Room::factory()->create(['number' => '01']);
        $roomB = Room::factory()->create(['number' => '02']);

        Reservation::factory()->create([
            'room_id' => $roomA->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
            'status' => 'confirmada',
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->get('/availability?check_in_date=2026-10-02&check_out_date=2026-10-04');

        $response->assertOk()->assertInertia(fn ($page) => $page
            ->component('Availability/Index', false)
            ->where('rooms.0.available', false)
            ->where('rooms.1.available', true));
    }

    public function test_availability_check_returns_occupied_room_ids(): void
    {
        $room = Room::factory()->create();

        Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
            'status' => 'confirmada',
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->getJson('/availability/check?check_in_date=2026-10-02&check_out_date=2026-10-04');

        $response->assertOk()->assertJson(['occupied_room_ids' => [$room->id]]);
    }

    public function test_availability_check_excludes_reservation(): void
    {
        $room = Room::factory()->create();

        $reservation = Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
            'status' => 'confirmada',
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->getJson("/availability/check?check_in_date=2026-10-02&check_out_date=2026-10-04&exclude={$reservation->id}");

        $response->assertOk()->assertJson(['occupied_room_ids' => []]);
    }

    public function test_maintenance_room_is_not_available(): void
    {
        $room = Room::factory()->create(['status' => 'mantenimiento']);

        $response = $this->actingAs(User::factory()->create())
            ->get('/availability?check_in_date=2026-10-02&check_out_date=2026-10-04');

        $response->assertOk()->assertInertia(fn ($page) => $page
            ->component('Availability/Index', false)
            ->where('rooms.0.available', false));
    }
}
