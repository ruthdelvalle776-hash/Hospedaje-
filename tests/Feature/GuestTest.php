<?php

namespace Tests\Feature;

use App\Models\Guest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_page_is_displayed(): void
    {
        $response = $this->actingAs(User::factory()->create())->get('/guests');

        $response->assertOk();
    }

    public function test_guest_can_be_created(): void
    {
        $response = $this->actingAs(User::factory()->create())->post('/guests', [
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'document_id' => '1234567',
            'phone' => '0981 111 111',
            'email' => 'juan@example.com',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/guests');

        $this->assertDatabaseHas('guests', [
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'document_id' => '1234567',
        ]);
    }

    public function test_guest_can_be_updated(): void
    {
        $guest = Guest::factory()->create(['first_name' => 'Juan']);

        $response = $this->actingAs(User::factory()->create())->put("/guests/{$guest->id}", [
            'first_name' => 'Carlos',
            'last_name' => 'Pérez',
            'document_id' => $guest->document_id,
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/guests');

        $this->assertSame('Carlos', $guest->fresh()->first_name);
    }

    public function test_guest_requires_a_unique_document_id(): void
    {
        Guest::factory()->create(['document_id' => '1234567']);

        $response = $this->actingAs(User::factory()->create())->post('/guests', [
            'first_name' => 'María',
            'last_name' => 'González',
            'document_id' => '1234567',
        ]);

        $response->assertSessionHasErrors('document_id');
    }

    public function test_guest_can_be_searched_by_name(): void
    {
        Guest::factory()->create(['first_name' => 'Juan', 'last_name' => 'Pérez']);
        Guest::factory()->create(['first_name' => 'María', 'last_name' => 'González']);

        $response = $this->actingAs(User::factory()->create())->get('/guests?search=Juan');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Guests/Index', false)
            ->where('guests.total', 1));
    }

    public function test_guest_search_endpoint_returns_matches(): void
    {
        Guest::factory()->create(['first_name' => 'Juan', 'last_name' => 'Pérez']);
        Guest::factory()->create(['first_name' => 'María', 'last_name' => 'González']);

        $response = $this->actingAs(User::factory()->create())->getJson('/guests/search?q=gonz');

        $response->assertOk();
        $response->assertJsonCount(1);
    }

    public function test_guest_can_be_soft_deleted(): void
    {
        $guest = Guest::factory()->create();

        $response = $this->actingAs(User::factory()->create())->delete("/guests/{$guest->id}");

        $response->assertRedirect('/guests');

        $this->assertSoftDeleted('guests', ['id' => $guest->id]);
    }
}
