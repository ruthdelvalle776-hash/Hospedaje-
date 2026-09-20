import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import FlashMessage from '@/Components/FlashMessage';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import SecondaryButton from '@/Components/SecondaryButton';
import { roomStatusBadge, roomStatusLabel } from '@/Config/rooms';
import { formatGs } from '@/Utils/format';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ rooms }) {
    const [roomToDelete, setRoomToDelete] = useState(null);
    const { delete: destroy, processing } = useForm({});

    const closeModal = () => setRoomToDelete(null);

    const deleteRoom = (e) => {
        e.preventDefault();

        destroy(route('rooms.destroy', roomToDelete.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Habitaciones
                </h2>
            }
        >
            <Head title="Habitaciones" />

            <FlashMessage />

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {rooms.total} habitaciones
                </p>
                <Link href={route('rooms.create')} className="btn-primary">
                    Nueva habitación
                </Link>
            </div>

            <div className="card mt-4 overflow-hidden">
                {rooms.data.length === 0 ? (
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
                                    Capacidad
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Precio/persona
                                </th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                                <th className="px-4 py-3 text-end font-medium">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rooms.data.map((room) => (
                                <tr key={room.id}>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {room.number}
                                    </td>
                                    <td className="px-4 py-3">
                                        {room.category?.name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {room.category
                                            ? `${room.category.capacity} pers.`
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatGs(room.price_per_person)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roomStatusBadge(
                                                room.status,
                                            )}`}
                                        >
                                            {roomStatusLabel(room.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route(
                                                    'rooms.edit',
                                                    room.id,
                                                )}
                                                className="btn-secondary px-3 py-1.5"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setRoomToDelete(room)
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

            <Pagination paginator={rooms} />

            <Modal show={!!roomToDelete} onClose={closeModal}>
                <form onSubmit={deleteRoom} className="p-6">
                    <h2 className="text-lg font-medium text-foreground">
                        ¿Eliminar habitación?
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Se eliminará la habitación{' '}
                        <strong>{roomToDelete?.number}</strong>. El borrado es
                        lógico, por lo que podrá recuperarse más adelante.
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
