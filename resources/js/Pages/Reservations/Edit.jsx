import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ReservationForm from './Partials/Form';

export default function Edit({ reservation, rooms }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Editar reserva
                </h2>
            }
        >
            <Head title="Editar reserva" />

            <div className="card p-6 sm:max-w-xl">
                <ReservationForm reservation={reservation} rooms={rooms} />
            </div>

            <Link
                href={route('reservations.index')}
                className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
                ← Volver a reservas
            </Link>
        </AuthenticatedLayout>
    );
}
