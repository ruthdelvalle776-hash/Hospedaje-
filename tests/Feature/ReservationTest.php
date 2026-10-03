<?php

namespace Tests\Feature;

use App\Models\Guest;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    private function makeRoom(int $capacity = 4): Room
    {
        $category = RoomCategory::factory()->create(['capacity' => $capacity]);

        return Room::factory()->create(['room_category_id' => $category->id]);
    }

    public function test_reservations_page_is_displayed(): void
    {
        $response = $this->actingAs(User::factory()->create())->get('/reservations');

        $response->assertOk();
    }

    public function test_reservation_can_be_created(): void
    {
        $guest = Guest::factory()->create();
        $room = $this->makeRoom();

        $response = $this->actingAs(User::factory()->create())->post('/reservations', [
            'guest_id' => $guest->id,
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-04',
            'number_of_people' => 2,
            'price_per_person' => 100000,
            'status' => 'pendiente',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/reservations');

        $this->assertDatabaseHas('reservations', [
            'guest_id' => $guest->id,
            'room_id' => $room->id,
            'status' => 'pendiente',
        ]);
    }

    public function test_reservation_calculates_nights_and_total(): void
    {
        $guest = Guest::factory()->create();
        $room = $this->makeRoom();

        $this->actingAs(User::factory()->create())->post('/reservations', [
            'guest_id' => $guest->id,
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-04',
            'number_of_people' => 2,
            'price_per_person' => 100000,
            'status' => 'pendiente',
        ]);

        $this->assertDatabaseHas('reservations', [
            'number_of_nights' => 3,
            'total' => 600000,
        ]);
    }

    public function test_reservation_requires_check_out_after_check_in(): void
    {
        $guest = Guest::factory()->create();
        $room = $this->makeRoom();

        $response = $this->actingAs(User::factory()->create())->post('/reservations', [
            'guest_id' => $guest->id,
            'room_id' => $room->id,
            'check_in_date' => '2026-10-05',
            'check_out_date' => '2026-10-04',
            'number_of_people' => 2,
            'price_per_person' => 100000,
            'status' => 'pendiente',
        ]);

        $response->assertSessionHasErrors('check_out_date');
    }

    public function test_reservation_rejects_exceeding_capacity(): void
    {
        $guest = Guest::factory()->create();
        $room = $this->makeRoom(2);

        $response = $this->actingAs(User::factory()->create())->post('/reservations', [
            'guest_id' => $guest->id,
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-04',
            'number_of_people' => 3,
            'price_per_person' => 100000,
            'status' => 'pendiente',
        ]);

        $response->assertSessionHasErrors('number_of_people');
    }

    public function test_reservation_can_be_updated(): void
    {
        $reservation = Reservation::factory()->create(['status' => 'pendiente']);
        $room = $this->makeRoom();

        $response = $this->actingAs(User::factory()->create())->put("/reservations/{$reservation->id}", [
            'guest_id' => $reservation->guest_id,
            'room_id' => $room->id,
            'check_in_date' => '2026-11-01',
            'check_out_date' => '2026-11-05',
            'number_of_people' => 2,
            'price_per_person' => 90000,
            'status' => 'confirmada',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/reservations');

        $reservation->refresh();

        $this->assertSame('confirmada', $reservation->status);
        $this->assertSame(4, $reservation->number_of_nights);
        $this->assertEquals(720000, $reservation->total);
    }

    public function test_reservation_can_be_cancelled(): void
    {
        $reservation = Reservation::factory()->create(['status' => 'pendiente']);

        $response = $this->actingAs(User::factory()->create())
            ->patch("/reservations/{$reservation->id}/cancel");

        $response->assertSessionHas('success');

        $this->assertSame('cancelada', $reservation->fresh()->status);
    }

    public function test_completed_reservation_cannot_be_cancelled(): void
    {
        $reservation = Reservation::factory()->create([
            'status' => Reservation::STATUS_COMPLETED,
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->patch("/reservations/{$reservation->id}/cancel");

        $response->assertSessionHas('error');

        $this->assertSame('finalizada', $reservation->fresh()->status);
    }

    public function test_reservation_can_be_soft_deleted(): void
    {
        $reservation = Reservation::factory()->create();

        $response = $this->actingAs(User::factory()->create())->delete("/reservations/{$reservation->id}");

        $response->assertRedirect('/reservations');

        $this->assertSoftDeleted('reservations', ['id' => $reservation->id]);
    }

    public function test_reservation_rejects_overlapping_dates(): void
    {
        $room = $this->makeRoom();

        Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
            'status' => 'confirmada',
        ]);

        $response = $this->actingAs(User::factory()->create())->post('/reservations', [
            'guest_id' => Guest::factory()->create()->id,
            'room_id' => $room->id,
            'check_in_date' => '2026-10-03',
            'check_out_date' => '2026-10-07',
            'number_of_people' => 2,
            'price_per_person' => 100000,
            'status' => 'pendiente',
        ]);

        $response->assertSessionHasErrors('check_out_date');
    }

    public function test_reservation_allows_back_to_back_dates(): void
    {
        $room = $this->makeRoom();

        Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
            'status' => 'confirmada',
        ]);

        $response = $this->actingAs(User::factory()->create())->post('/reservations', [
            'guest_id' => Guest::factory()->create()->id,
            'room_id' => $room->id,
            'check_in_date' => '2026-10-05',
            'check_out_date' => '2026-10-08',
            'number_of_people' => 2,
            'price_per_person' => 100000,
            'status' => 'pendiente',
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_reservation_update_rejects_overlapping_dates(): void
    {
        $room = $this->makeRoom();

        Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-11-01',
            'check_out_date' => '2026-11-10',
            'status' => 'confirmada',
        ]);

        $reservation = Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-12-01',
            'check_out_date' => '2026-12-05',
            'status' => 'pendiente',
        ]);

        $response = $this->actingAs(User::factory()->create())->put("/reservations/{$reservation->id}", [
            'guest_id' => $reservation->guest_id,
            'room_id' => $room->id,
            'check_in_date' => '2026-11-05',
            'check_out_date' => '2026-11-12',
            'number_of_people' => 2,
            'price_per_person' => 100000,
            'status' => 'confirmada',
        ]);

        $response->assertSessionHasErrors('check_out_date');
    }

    public function test_reservation_update_does_not_conflict_with_itself(): void
    {
        $room = $this->makeRoom();

        $reservation = Reservation::factory()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
            'number_of_people' => 2,
            'status' => 'pendiente',
        ]);

        $response = $this->actingAs(User::factory()->create())->put("/reservations/{$reservation->id}", [
            'guest_id' => $reservation->guest_id,
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
            'number_of_people' => 2,
            'price_per_person' => 100000,
            'status' => 'confirmada',
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_cancelled_reservation_does_not_block_availability(): void
    {
        $room = $this->makeRoom();

        Reservation::factory()->cancelled()->create([
            'room_id' => $room->id,
            'check_in_date' => '2026-10-01',
            'check_out_date' => '2026-10-05',
        ]);

        $response = $this->actingAs(User::factory()->create())->post('/reservations', [
            'guest_id' => Guest::factory()->create()->id,
            'room_id' => $room->id,
            'check_in_date' => '2026-10-02',
            'check_out_date' => '2026-10-06',
            'number_of_people' => 2,
            'price_per_person' => 100000,
            'status' => 'pendiente',
        ]);

        $response->assertSessionHasNoErrors();
    }
}
