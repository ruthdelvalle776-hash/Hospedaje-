import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link } from '@inertiajs/react';

export default function Index({ categories }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Categorías
                </h2>
            }
        >
            <Head title="Categorías" />

            <FlashMessage />

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {categories.length}{' '}
                    {categories.length === 1 ? 'categoría' : 'categorías'}
                </p>
                <Link
                    href={route('room-categories.create')}
                    className="btn-primary"
                >
                    Nueva categoría
                </Link>
            </div>

            <div className="card mt-4 overflow-hidden">
                {categories.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">
                        No hay categorías registradas.
                    </p>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nombre</th>
                                <th className="px-4 py-3 font-medium">
                                    Capacidad
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Habitaciones
                                </th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                                <th className="px-4 py-3 text-end font-medium">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.capacity} pers.
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.rooms_count}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                category.is_active
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {category.is_active
                                                ? 'Activa'
                                                : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route(
                                                    'room-categories.edit',
                                                    category.id,
                                                )}
                                                className="btn-secondary px-3 py-1.5"
                                            >
                                                Editar
                                            </Link>
                                            <Link
                                                href={route(
                                                    'room-categories.toggle',
                                                    category.id,
                                                )}
                                                method="patch"
                                                as="button"
                                                className="btn-secondary px-3 py-1.5"
                                            >
                                                {category.is_active
                                                    ? 'Desactivar'
                                                    : 'Activar'}
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
