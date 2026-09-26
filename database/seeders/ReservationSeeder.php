<?php

namespace Database\Seeders;

use App\Models\Guest;
use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $guests = Guest::all();
        $rooms = Room::all();

        if ($guests->isEmpty() || $rooms->isEmpty()) {
            return;
        }

        $reservations = [
            [
                'guest_id' => $guests[0]->id,
                'room_id' => $rooms[0]->id,
                'check_in_date' => Carbon::today()->addDays(2),
                'status' => Reservation::STATUS_CONFIRMED,
            ],
            [
                'guest_id' => $guests[1]->id,
                'room_id' => $rooms[1]->id,
                'check_in_date' => Carbon::today()->addDays(5),
                'status' => Reservation::STATUS_PENDING,
            ],
        ];

        foreach ($reservations as $reservation) {
            $checkIn = $reservation['check_in_date'];
            $numberOfNights = 3;
            $checkOut = $checkIn->copy()->addDays($numberOfNights);
            $room = Room::find($reservation['room_id']);
            $numberOfPeople = 2;
            $pricePerPerson = $room?->price_per_person ?? 0;

            Reservation::updateOrCreate(
                [
                    'guest_id' => $reservation['guest_id'],
                    'room_id' => $reservation['room_id'],
                    'check_in_date' => $checkIn->toDateString(),
                ],
                [
                    'check_out_date' => $checkOut->toDateString(),
                    'number_of_people' => $numberOfPeople,
                    'price_per_person' => $pricePerPerson,
                    'number_of_nights' => $numberOfNights,
                    'total' => $numberOfPeople * $pricePerPerson * $numberOfNights,
                    'status' => $reservation['status'],
                    'observations' => null,
                ],
            );
        }
    }
}
