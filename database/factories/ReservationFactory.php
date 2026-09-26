<?php

namespace Database\Factories;

use App\Models\Guest;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('-30 days', '+30 days');
        $numberOfNights = fake()->numberBetween(1, 5);
        $checkOut = (clone $checkIn)->modify("+{$numberOfNights} days");
        $numberOfPeople = fake()->numberBetween(1, 4);
        $pricePerPerson = fake()->numberBetween(50000, 200000);

        return [
            'guest_id' => Guest::factory(),
            'room_id' => Room::factory(),
            'check_in_date' => $checkIn->format('Y-m-d'),
            'check_out_date' => $checkOut->format('Y-m-d'),
            'number_of_people' => $numberOfPeople,
            'price_per_person' => $pricePerPerson,
            'number_of_nights' => $numberOfNights,
            'total' => $numberOfPeople * $pricePerPerson * $numberOfNights,
            'status' => Reservation::STATUS_PENDING,
            'observations' => null,
        ];
    }

    /**
     * Indicate that the reservation is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Reservation::STATUS_CONFIRMED,
        ]);
    }

    /**
     * Indicate that the reservation is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Reservation::STATUS_CANCELLED,
        ]);
    }
}
