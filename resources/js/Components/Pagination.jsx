import { Link } from '@inertiajs/react';

export default function Pagination({ paginator }) {
    if (!paginator || paginator.last_page <= 1) {
        return null;
    }

    return (
        <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>
                Página {paginator.current_page} de {paginator.last_page} (
                {paginator.total} registros)
            </span>

            <div className="flex items-center gap-2">
                {paginator.prev_page_url ? (
                    <Link
                        href={paginator.prev_page_url}
                        className="btn-secondary px-3 py-1.5"
                    >
                        Anterior
                    </Link>
                ) : (
                    <span className="btn-secondary pointer-events-none px-3 py-1.5 opacity-50">
                        Anterior
                    </span>
                )}

                {paginator.next_page_url ? (
                    <Link
                        href={paginator.next_page_url}
                        className="btn-secondary px-3 py-1.5"
                    >
                        Siguiente
                    </Link>
                ) : (
                    <span className="btn-secondary pointer-events-none px-3 py-1.5 opacity-50">
                        Siguiente
                    </span>
                )}
            </div>
        </div>
    );
}
