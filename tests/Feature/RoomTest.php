<?php

namespace Tests\Feature;

use App\Models\Room;
use App\Models\RoomCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomTest extends TestCase
{
    use RefreshDatabase;

    public function test_rooms_page_is_displayed(): void
    {
        $response = $this->actingAs(User::factory()->create())->get('/rooms');

        $response->assertOk();
    }

    public function test_room_can_be_created(): void
    {
        $category = RoomCategory::factory()->create();

        $response = $this->actingAs(User::factory()->create())->post('/rooms', [
            'number' => '07',
            'room_category_id' => $category->id,
            'price_per_person' => 90000,
            'status' => 'disponible',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/rooms');

        $this->assertDatabaseHas('rooms', ['number' => '07']);
    }

    public function test_room_can_be_updated(): void
    {
        $room = Room::factory()->create(['status' => 'disponible']);
        $category = RoomCategory::factory()->create();

        $response = $this->actingAs(User::factory()->create())->put("/rooms/{$room->id}", [
            'number' => '08',
            'room_category_id' => $category->id,
            'price_per_person' => 85000,
            'status' => 'mantenimiento',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/rooms');

        $room->refresh();

        $this->assertSame('08', $room->number);
        $this->assertSame('mantenimiento', $room->status);
    }

    public function test_room_requires_a_unique_number(): void
    {
        Room::factory()->create(['number' => '10']);
        $category = RoomCategory::factory()->create();

        $response = $this->actingAs(User::factory()->create())->post('/rooms', [
            'number' => '10',
            'room_category_id' => $category->id,
            'price_per_person' => 100000,
            'status' => 'disponible',
        ]);

        $response->assertSessionHasErrors('number');
    }

    public function test_room_requires_a_valid_status(): void
    {
        $category = RoomCategory::factory()->create();

        $response = $this->actingAs(User::factory()->create())->post('/rooms', [
            'number' => '11',
            'room_category_id' => $category->id,
            'price_per_person' => 100000,
            'status' => 'roto',
        ]);

        $response->assertSessionHasErrors('status');
    }

    public function test_room_can_be_soft_deleted(): void
    {
        $room = Room::factory()->create();

        $response = $this->actingAs(User::factory()->create())->delete("/rooms/{$room->id}");

        $response->assertRedirect('/rooms');

        $this->assertSoftDeleted('rooms', ['id' => $room->id]);
        $this->assertDatabaseMissing('rooms', [
            'id' => $room->id,
            'deleted_at' => null,
        ]);
    }
}
