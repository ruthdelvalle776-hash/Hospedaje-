<?php

namespace Database\Seeders;

use App\Models\RoomCategory;
use Illuminate\Database\Seeder;

class RoomCategorySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Matrimonial', 'capacity' => 2],
            ['name' => 'Triple', 'capacity' => 3],
            ['name' => 'Cuádruple', 'capacity' => 4],
        ];

        foreach ($categories as $category) {
            RoomCategory::updateOrCreate(
                ['name' => $category['name']],
                $category,
            );
        }
    }
}
