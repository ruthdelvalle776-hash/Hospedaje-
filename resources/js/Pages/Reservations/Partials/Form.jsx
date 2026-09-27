import GuestSelect from '@/Components/GuestSelect';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { MANAGEABLE_RESERVATION_STATUSES } from '@/Config/reservations';
import { formatGs } from '@/Utils/format';
import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';

function toDateInput(value) {
    return value ? String(value).slice(0, 10) : '';
}

export default function ReservationForm({ reservation = null, rooms = [] }) {
    const { data, setData, post, put, processing, errors } = useForm({
        guest_id: reservation?.guest_id ?? '',
        room_id: reservation?.room_id ?? '',
        check_in_date: toDateInput(reservation?.check_in_date),
        check_out_date: toDateInput(reservation?.check_out_date),
        number_of_people: reservation?.number_of_people ?? 1,
        price_per_person: reservation?.price_per_person ?? '',
        status: reservation?.status ?? 'pendiente',
        observations: reservation?.observations ?? '',
    });

    const selectedRoom = rooms.find(
        (room) => room.id === Number(data.room_id),
    );
    const capacity = selectedRoom?.category?.capacity;

    const numberOfNights = useMemo(() => {
        if (!data.check_in_date || !data.check_out_date) {
            return 0;
        }

        const diff =
            (new Date(data.check_out_date) - new Date(data.check_in_date)) /
            (1000 * 60 * 60 * 24);

        return diff > 0 ? diff : 0;
    }, [data.check_in_date, data.check_out_date]);

    const numberOfPeople = Number(data.number_of_people) || 0;
    const pricePerPerson = Number(data.price_per_person) || 0;
    const total = numberOfPeople * pricePerPerson * numberOfNights;
    const overCapacity = capacity ? numberOfPeople > capacity : false;

    const handleRoomChange = (roomId) => {
        setData('room_id', roomId);

        const room = rooms.find((item) => item.id === Number(roomId));

        if (room) {
            setData('price_per_person', room.price_per_person);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (reservation) {
            put(route('reservations.update', reservation.id));
        } else {
            post(route('reservations.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="guest_id" value="Huésped principal" />

                <div className="mt-1">
                    <GuestSelect
                        selectedGuest={reservation?.guest ?? null}
                        onChange={(id) => setData('guest_id', id ?? '')}
                    />
                </div>

                <InputError message={errors.guest_id} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="room_id" value="Habitación" />

                <select
                    id="room_id"
                    value={data.room_id}
                    onChange={(e) => handleRoomChange(e.target.value)}
                    className="input mt-1 block w-full"
                    required
                >
                    <option value="">Selecciona una habitación</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.number} — {room.category?.name ?? 'Sin categoría'}
                            {room.category
                                ? ` (${room.category.capacity} pers.)`
                                : ''}
                        </option>
                    ))}
                </select>

                <InputError message={errors.room_id} className="mt-2" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="check_in_date" value="Fecha de entrada" />

                    <TextInput
                        id="check_in_date"
                        type="date"
                        value={data.check_in_date}
                        onChange={(e) => setData('check_in_date', e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />

                    <InputError message={errors.check_in_date} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="check_out_date" value="Fecha de salida" />

                    <TextInput
                        id="check_out_date"
                        type="date"
                        value={data.check_out_date}
                        onChange={(e) => setData('check_out_date', e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />

                    <InputError message={errors.check_out_date} className="mt-2" />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="number_of_people" value="Cantidad de personas" />

                    <TextInput
                        id="number_of_people"
                        type="number"
                        min="1"
                        value={data.number_of_people}
                        onChange={(e) => setData('number_of_people', e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />

                    {overCapacity && (
                        <p className="mt-2 text-sm text-destructive">
                            La cantidad de personas excede la capacidad de la
                            habitación ({capacity} personas).
                        </p>
                    )}

                    <InputError message={errors.number_of_people} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="price_per_person" value="Precio por persona" />

                    <TextInput
                        id="price_per_person"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price_per_person}
                        onChange={(e) => setData('price_per_person', e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />

                    <InputError message={errors.price_per_person} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="status" value="Estado" />

                <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="input mt-1 block w-full"
                >
                    {MANAGEABLE_RESERVATION_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>

                <InputError message={errors.status} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="observations" value="Observaciones (opcional)" />

                <textarea
                    id="observations"
                    value={data.observations}
                    onChange={(e) => setData('observations', e.target.value)}
                    className="input mt-1 block w-full"
                    rows={3}
                />

                <InputError message={errors.observations} className="mt-2" />
            </div>

            <div className="rounded-md border bg-muted/30 px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Noches</span>
                    <span className="font-medium text-foreground">
                        {numberOfNights}
                    </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold text-foreground">
                        {formatGs(total)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>
                    {reservation ? 'Guardar cambios' : 'Crear reserva'}
                </PrimaryButton>
            </div>
        </form>
    );
}
