<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomCategoryRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $category = $this->route('room_category');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('room_categories', 'name')->ignore($category?->id),
            ],
            'capacity' => ['required', 'integer', 'min:1'],
        ];
    }
}
