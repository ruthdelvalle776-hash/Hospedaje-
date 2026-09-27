import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import FlashMessage from '@/Components/FlashMessage';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    CANCELLABLE_RESERVATION_STATUSES,
    RESERVATION_STATUSES,
    reservationStatusBadge,
    reservationStatusLabel,
} from '@/Config/reservations';
import { formatDate, formatGs } from '@/Utils/format';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Index({ reservations, filters }) {
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');
    const timeoutRef = useRef(null);
    const { delete: destroy, processing } = useForm({});

    const closeModal = () => setReservationToDelete(null);

    const deleteReservation = (e) => {
        e.preventDefault();

        destroy(route('reservations.destroy', reservationToDelete.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const applyFilters = ({ status = filters?.status ?? '', searchValue = search }) => {
        router.get(
            route('reservations.index'),
            { status, search: searchValue },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleSearch = (value) => {
        setSearch(value);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            applyFilters({ searchValue: value });
        }, 300);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Reservas
                </h2>
            }
        >
            <Head title="Reservas" />

            <FlashMessage />

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {reservations.total} reservas
                </p>
                <Link href={route('reservations.create')} className="btn-primary">
                    Nueva reserva
                </Link>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por huésped o documento..."
                    className="input block w-full sm:max-w-sm"
                />

                <select
                    value={filters?.status ?? ''}
                    onChange={(e) =>
                        applyFilters({ status: e.target.value })
                    }
                    className="input block w-full sm:w-48"
                >
                    <option value="">Todos los estados</option>
                    {RESERVATION_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="card mt-4 overflow-hidden">
                {reservations.data.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">
                        No hay reservas registradas.
                    </p>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Huésped</th>
                                <th className="px-4 py-3 font-medium">
                                    Habitación
                                </th>
                                <th className="px-4 py-3 font-medium">Entrada</th>
                                <th className="px-4 py-3 font-medium">Salida</th>
                                <th className="px-4 py-3 font-medium">Total</th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                                <th className="px-4 py-3 text-end font-medium">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reservations.data.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {reservation.guest?.first_name}{' '}
                                        {reservation.guest?.last_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {reservation.room?.number ?? '—'}
                                        {reservation.room?.category
                                            ? ` (${reservation.room.category.name})`
                                            : ''}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatDate(reservation.check_in_date)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatDate(reservation.check_out_date)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatGs(reservation.total)}
                                    </td>
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
                                    <td className="px-4 py-3 text-end">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route(
                                                    'reservations.edit',
                                                    reservation.id,
                                                )}
                                                className="btn-secondary px-3 py-1.5"
                                            >
                                                Editar
                                            </Link>
                                            {CANCELLABLE_RESERVATION_STATUSES.includes(
                                                reservation.status,
                                            ) && (
                                                <Link
                                                    href={route(
                                                        'reservations.cancel',
                                                        reservation.id,
                                                    )}
                                                    method="patch"
                                                    as="button"
                                                    className="btn-secondary px-3 py-1.5"
                                                >
                                                    Cancelar
                                                </Link>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setReservationToDelete(
                                                        reservation,
                                                    )
                                                }
                                                className="btn-danger px-3 py-1.5"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination paginator={reservations} />

            <Modal show={!!reservationToDelete} onClose={closeModal}>
                <form onSubmit={deleteReservation} className="p-6">
                    <h2 className="text-lg font-medium text-foreground">
                        ¿Eliminar reserva?
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Se eliminará la reserva de{' '}
                        <strong>
                            {reservationToDelete?.guest?.first_name}{' '}
                            {reservationToDelete?.guest?.last_name}
                        </strong>
                        . El borrado es lógico, por lo que podrá recuperarse
                        más adelante.
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton disabled={processing}>
                            Eliminar
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
