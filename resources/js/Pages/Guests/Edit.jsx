import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import GuestForm from './Partials/Form';

export default function Edit({ guest }) {
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

            <Link
                href={route('guests.index')}
                className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
                ← Volver a huéspedes
            </Link>
        </AuthenticatedLayout>
    );
}
