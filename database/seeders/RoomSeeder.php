<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomCategory;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $matrimonial = RoomCategory::where('name', 'Matrimonial')->first();
        $triple = RoomCategory::where('name', 'Triple')->first();
        $cuadruple = RoomCategory::where('name', 'Cuádruple')->first();

        $rooms = [
            ['number' => '01', 'room_category_id' => $matrimonial?->id, 'price_per_person' => 100000, 'status' => 'disponible'],
            ['number' => '02', 'room_category_id' => $matrimonial?->id, 'price_per_person' => 100000, 'status' => 'disponible'],
            ['number' => '03', 'room_category_id' => $triple?->id, 'price_per_person' => 80000, 'status' => 'disponible'],
            ['number' => '04', 'room_category_id' => $triple?->id, 'price_per_person' => 80000, 'status' => 'ocupada'],
            ['number' => '05', 'room_category_id' => $cuadruple?->id, 'price_per_person' => 70000, 'status' => 'disponible'],
            ['number' => '06', 'room_category_id' => $cuadruple?->id, 'price_per_person' => 70000, 'status' => 'mantenimiento'],
        ];

        foreach ($rooms as $room) {
            Room::updateOrCreate(
                ['number' => $room['number']],
                $room,
            );
        }
    }
}
