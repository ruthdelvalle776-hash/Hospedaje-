import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { reservationStatusBadge, reservationStatusLabel } from '@/Config/reservations';
import { formatDate, formatGs } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';
import GuestForm from './Partials/Form';

export default function Edit({ guest, reservations }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Editar huésped
                </h2>
            }
        >
            <Head title="Editar huésped" />

            <div className="card p-6 sm:max-w-xl">
                <GuestForm guest={guest} />
            </div>

            <div className="card mt-6 overflow-hidden">
                <div className="border-b px-4 py-3 text-sm font-medium text-muted-foreground">
                    Historial de reservas
                </div>

                {reservations.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">
                        Este huésped no tiene reservas registradas.
                    </p>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Estado</th>
                                <th className="px-4 py-3 font-medium">Entrada</th>
                                <th className="px-4 py-3 font-medium">Salida</th>
                                <th className="px-4 py-3 font-medium">
                                    Habitación
                                </th>
                                <th className="px-4 py-3 text-end font-medium">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${reservationStatusBadge(
                                                reservation.status,
                                            )}`}
                                        >
                                            {reservationStatusLabel(
                                                reservation.status,
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatDate(reservation.check_in_date)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatDate(reservation.check_out_date)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {reservation.room?.number ?? '—'}
                                        {reservation.room?.category
                                            ? ` (${reservation.room.category.name})`
                                            : ''}
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        {formatGs(reservation.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Link
                href={route('guests.index')}
                className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
                ← Volver a huéspedes
            </Link>
        </AuthenticatedLayout>
    );
}
