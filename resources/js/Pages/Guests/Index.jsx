import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import FlashMessage from '@/Components/FlashMessage';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Index({ guests, filters }) {
    const [guestToDelete, setGuestToDelete] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');
    const timeoutRef = useRef(null);
    const { delete: destroy, processing } = useForm({});

    const closeModal = () => setGuestToDelete(null);

    const deleteGuest = (e) => {
        e.preventDefault();

        destroy(route('guests.destroy', guestToDelete.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const handleSearch = (value) => {
        setSearch(value);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            router.get(
                route('guests.index'),
                { search: value },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Huéspedes
                </h2>
            }
        >
            <Head title="Huéspedes" />

            <FlashMessage />

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {guests.total} huéspedes
                </p>
                <Link href={route('guests.create')} className="btn-primary">
                    Nuevo huésped
                </Link>
            </div>

            <div className="mt-4">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por nombre, documento, teléfono o email..."
                    className="input block w-full sm:max-w-sm"
                />
            </div>

            <div className="card mt-4 overflow-hidden">
                {guests.data.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">
                        No hay huéspedes registrados.
                    </p>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nombre</th>
                                <th className="px-4 py-3 font-medium">
                                    Documento
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Teléfono
                                </th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 text-end font-medium">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {guests.data.map((guest) => (
                                <tr key={guest.id}>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {guest.first_name} {guest.last_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {guest.document_id ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {guest.phone ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {guest.email ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route(
                                                    'guests.edit',
                                                    guest.id,
                                                )}
                                                className="btn-secondary px-3 py-1.5"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setGuestToDelete(guest)
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

            <Pagination paginator={guests} />

            <Modal show={!!guestToDelete} onClose={closeModal}>
                <form onSubmit={deleteGuest} className="p-6">
                    <h2 className="text-lg font-medium text-foreground">
                        ¿Eliminar huésped?
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Se eliminará a{' '}
                        <strong>
                            {guestToDelete?.first_name}{' '}
                            {guestToDelete?.last_name}
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
