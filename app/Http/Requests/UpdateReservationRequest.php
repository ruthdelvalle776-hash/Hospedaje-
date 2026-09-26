<?php

namespace App\Http\Requests;

use App\Models\Reservation;
use App\Models\Room;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReservationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'guest_id' => ['required', 'integer', Rule::exists('guests', 'id')],
            'room_id' => ['required', 'integer', Rule::exists('rooms', 'id')],
            'check_in_date' => ['required', 'date'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'number_of_people' => [
                'required',
                'integer',
                'min:1',
                $this->capacityRule(),
            ],
            'price_per_person' => ['required', 'numeric', 'min:0'],
            'status' => [
                'required',
                Rule::in([Reservation::STATUS_PENDING, Reservation::STATUS_CONFIRMED]),
            ],
            'observations' => ['nullable', 'string'],
        ];
    }

    /**
     * Validate that the number of people does not exceed the room capacity.
     */
    private function capacityRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail) {
            $room = Room::with('category')->find($this->input('room_id'));

            if ($room?->category && $value > $room->category->capacity) {
                $fail("La cantidad de personas excede la capacidad de la habitación ({$room->category->capacity} personas).");
            }
        };
    }
}
