import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ROOM_STATUSES } from '@/Config/rooms';
import { useForm } from '@inertiajs/react';

export default function RoomForm({ room = null, categories = [] }) {
    const { data, setData, post, put, processing, errors } = useForm({
        number: room?.number ?? '',
        room_category_id: room?.room_category_id ?? categories[0]?.id ?? '',
        price_per_person: room?.price_per_person ?? '',
        status: room?.status ?? 'disponible',
    });

    const submit = (e) => {
        e.preventDefault();

        if (room) {
            put(route('rooms.update', room.id));
        } else {
            post(route('rooms.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="number" value="Número" />

                <TextInput
                    id="number"
                    value={data.number}
                    onChange={(e) => setData('number', e.target.value)}
                    className="mt-1 block w-full"
                    isFocused
                    required
                />

                <InputError message={errors.number} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="room_category_id" value="Categoría" />

                <select
                    id="room_category_id"
                    value={data.room_category_id}
                    onChange={(e) =>
                        setData('room_category_id', e.target.value)
                    }
                    className="input mt-1 block w-full"
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name} ({category.capacity} pers.)
                        </option>
                    ))}
                </select>

                <InputError
                    message={errors.room_category_id}
                    className="mt-2"
                />
            </div>

            <div>
                <InputLabel
                    htmlFor="price_per_person"
                    value="Precio por persona"
                />

                <TextInput
                    id="price_per_person"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.price_per_person}
                    onChange={(e) =>
                        setData('price_per_person', e.target.value)
                    }
                    className="mt-1 block w-full"
                    required
                />

                <InputError
                    message={errors.price_per_person}
                    className="mt-2"
                />
            </div>

            <div>
                <InputLabel htmlFor="status" value="Estado" />

                <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="input mt-1 block w-full"
                >
                    {ROOM_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>

                <InputError message={errors.status} className="mt-2" />
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>
                    {room ? 'Guardar cambios' : 'Crear habitación'}
                </PrimaryButton>
            </div>
        </form>
    );
}
