import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ReservationForm from './Partials/Form';

export default function Create({ rooms }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Nueva reserva
                </h2>
            }
        >
            <Head title="Nueva reserva" />

            {rooms.length === 0 ? (
                <div className="card p-6">
                    <p className="text-sm text-muted-foreground">
                        Primero debes crear al menos una habitación para poder
                        registrar reservas.
                    </p>
                    <Link
                        href={route('rooms.create')}
                        className="btn-primary mt-4"
                    >
                        Crear habitación
                    </Link>
                </div>
            ) : (
                <div className="card p-6 sm:max-w-xl">
                    <ReservationForm rooms={rooms} />
                </div>
            )}

            <Link
                href={route('reservations.index')}
                className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
                ← Volver a reservas
            </Link>
        </AuthenticatedLayout>
    );
}
