import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate, formatGs } from '@/Utils/format';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ rooms, dates }) {
    const [checkIn, setCheckIn] = useState(dates.check_in ?? '');
    const [checkOut, setCheckOut] = useState(dates.check_out ?? '');

    const availableCount = rooms.filter((room) => room.available).length;
    const occupiedCount = rooms.length - availableCount;

    const consult = (e) => {
        e.preventDefault();

        router.get(
            route('availability.index'),
            { check_in_date: checkIn, check_out_date: checkOut },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Disponibilidad
                </h2>
            }
        >
            <Head title="Disponibilidad" />

            <form onSubmit={consult} className="card p-6">
                <div className="grid items-end gap-6 sm:grid-cols-3">
                    <div>
                        <label htmlFor="check_in_date" className="label">
                            Fecha de entrada
                        </label>
                        <input
                            id="check_in_date"
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="input mt-1 block w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="check_out_date" className="label">
                            Fecha de salida
                        </label>
                        <input
                            id="check_out_date"
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="input mt-1 block w-full"
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Consultar
                    </button>
                </div>
            </form>

            <div className="mt-6 flex items-center gap-6 text-sm">
                <p className="text-muted-foreground">
                    {availableCount}{' '}
                    {availableCount === 1 ? 'disponible' : 'disponibles'}
                </p>
                <p className="text-muted-foreground">
                    {occupiedCount}{' '}
                    {occupiedCount === 1 ? 'no disponible' : 'no disponibles'}
                </p>
                <p className="text-muted-foreground">
                    {formatDate(checkIn)} — {formatDate(checkOut)}
                </p>
            </div>

            <div className="card mt-4 overflow-hidden">
                {rooms.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">
                        No hay habitaciones registradas.
                    </p>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Número</th>
                                <th className="px-4 py-3 font-medium">
                                    Categoría
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Precio/persona
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Disponibilidad
                                </th>
                                <th className="px-4 py-3 font-medium">Detalle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rooms.map((room) => (
                                <tr key={room.id}>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {room.number}
                                    </td>
                                    <td className="px-4 py-3">
                                        {room.category ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatGs(room.price_per_person)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                room.available
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                    : 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300'
                                            }`}
                                        >
                                            {room.available
                                                ? 'Disponible'
                                                : 'No disponible'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {room.reservation
                                            ? `${room.reservation.guest} — ${formatDate(
                                                  room.reservation.check_in_date,
                                              )} a ${formatDate(
                                                  room.reservation.check_out_date,
                                              )}`
                                            : room.status === 'mantenimiento'
                                              ? 'En mantenimiento'
                                              : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
