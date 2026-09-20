<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\RoomCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    protected $model = Room::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'number' => fake()->unique()->numerify('###'),
            'room_category_id' => RoomCategory::factory(),
            'price_per_person' => fake()->numberBetween(50000, 200000),
            'status' => 'disponible',
        ];
    }
}
