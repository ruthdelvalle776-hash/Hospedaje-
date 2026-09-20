import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import RoomForm from './Partials/Form';

export default function Create({ categories }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Nueva habitación
                </h2>
            }
        >
            <Head title="Nueva habitación" />

            {categories.length === 0 ? (
                <div className="card p-6">
                    <p className="text-sm text-muted-foreground">
                        Primero debes crear al menos una categoría para poder
                        registrar habitaciones.
                    </p>
                    <Link
                        href={route('room-categories.create')}
                        className="btn-primary mt-4"
                    >
                        Crear categoría
                    </Link>
                </div>
            ) : (
                <div className="card p-6 sm:max-w-xl">
                    <RoomForm categories={categories} />
                </div>
            )}

            <Link
                href={route('rooms.index')}
                className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
                ← Volver a habitaciones
            </Link>
        </AuthenticatedLayout>
    );
}
