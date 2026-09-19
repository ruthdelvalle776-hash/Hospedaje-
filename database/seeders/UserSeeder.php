<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'encargado@hospedaje.local'],
            [
                'name' => 'Encargado',
                'password' => 'password',
            ]
        );

        User::updateOrCreate(
            ['email' => 'test@hospedaje.local'],
            [
                'name' => 'Usuario de Pruebas',
                'password' => 'password',
            ]
        );
    }
}
