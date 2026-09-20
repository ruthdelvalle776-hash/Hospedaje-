<?php

namespace Tests\Feature;

use App\Models\RoomCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_page_is_displayed(): void
    {
        $response = $this->actingAs(User::factory()->create())->get('/room-categories');

        $response->assertOk();
    }

    public function test_category_can_be_created(): void
    {
        $response = $this->actingAs(User::factory()->create())->post('/room-categories', [
            'name' => 'Matrimonial',
            'capacity' => 2,
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/room-categories');

        $this->assertDatabaseHas('room_categories', [
            'name' => 'Matrimonial',
            'capacity' => 2,
        ]);
    }

    public function test_category_can_be_updated(): void
    {
        $category = RoomCategory::factory()->create(['name' => 'Matrimonial']);

        $response = $this->actingAs(User::factory()->create())->put("/room-categories/{$category->id}", [
            'name' => 'Doble',
            'capacity' => 2,
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/room-categories');

        $this->assertSame('Doble', $category->fresh()->name);
    }

    public function test_category_requires_a_unique_name(): void
    {
        RoomCategory::factory()->create(['name' => 'Triple']);

        $response = $this->actingAs(User::factory()->create())->post('/room-categories', [
            'name' => 'Triple',
            'capacity' => 3,
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_category_can_be_deactivated_and_reactivated(): void
    {
        $category = RoomCategory::factory()->create(['is_active' => true]);
        $user = User::factory()->create();

        $this->actingAs($user)->patch("/room-categories/{$category->id}/toggle");
        $this->assertFalse($category->fresh()->is_active);

        $this->actingAs($user)->patch("/room-categories/{$category->id}/toggle");
        $this->assertTrue($category->fresh()->is_active);
    }
}
