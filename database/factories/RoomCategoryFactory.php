<?php

namespace Database\Factories;

use App\Models\RoomCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomCategoryFactory extends Factory
{
    protected $model = RoomCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'capacity' => fake()->numberBetween(1, 6),
            'is_active' => true,
        ];
    }
}
