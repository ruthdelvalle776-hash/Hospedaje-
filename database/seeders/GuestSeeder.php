<?php

namespace Database\Seeders;

use App\Models\Guest;
use Illuminate\Database\Seeder;

class GuestSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $guests = [
            [
                'first_name' => 'Juan',
                'last_name' => 'Pérez',
                'document_id' => '1234567',
                'phone' => '0981 111 111',
                'email' => 'juan.perez@example.com',
                'notes' => null,
            ],
            [
                'first_name' => 'María',
                'last_name' => 'González',
                'document_id' => '2345678',
                'phone' => '0982 222 222',
                'email' => 'maria.gonzalez@example.com',
                'notes' => null,
            ],
            [
                'first_name' => 'Carlos',
                'last_name' => 'López',
                'document_id' => '3456789',
                'phone' => '0983 333 333',
                'email' => 'carlos.lopez@example.com',
                'notes' => null,
            ],
            [
                'first_name' => 'Ana',
                'last_name' => 'Martínez',
                'document_id' => '4567890',
                'phone' => '0984 444 444',
                'email' => 'ana.martinez@example.com',
                'notes' => null,
            ],
        ];

        foreach ($guests as $guest) {
            Guest::updateOrCreate(
                ['document_id' => $guest['document_id']],
                $guest,
            );
        }
    }
}
