import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import RoomForm from './Partials/Form';

export default function Edit({ room, categories }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Editar habitación
                </h2>
            }
        >
            <Head title="Editar habitación" />

            <div className="card p-6 sm:max-w-xl">
                <RoomForm room={room} categories={categories} />
            </div>

            <Link
                href={route('rooms.index')}
                className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
                ← Volver a habitaciones
            </Link>
        </AuthenticatedLayout>
    );
}
