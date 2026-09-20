<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $room = $this->route('room');

        return [
            'number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rooms', 'number')->ignore($room?->id),
            ],
            'room_category_id' => ['required', 'integer', Rule::exists('room_categories', 'id')],
            'price_per_person' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(Room::STATUSES)],
        ];
    }
}
