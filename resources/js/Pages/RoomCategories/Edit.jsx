import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import CategoryForm from './Partials/Form';

export default function Edit({ category }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Editar categoría
                </h2>
            }
        >
            <Head title="Editar categoría" />

            <div className="card p-6 sm:max-w-xl">
                <CategoryForm category={category} />
            </div>

            <Link
                href={route('room-categories.index')}
                className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
                ← Volver a categorías
            </Link>
        </AuthenticatedLayout>
    );
}
