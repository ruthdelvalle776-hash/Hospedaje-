import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { reservationStatusBadge, reservationStatusLabel } from '@/Config/reservations';
import { formatDate } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';

function StatCard({ label, value, tone, href }) {
    return (
        <Link
            href={href}
            className="card flex flex-col gap-1 p-5 transition-colors hover:bg-accent"
        >
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={`text-3xl font-semibold ${tone ?? 'text-foreground'}`}>
                {value}
            </span>
        </Link>
    );
}

function ReservationList({ title, items, emptyText, seeAllHref }) {
    return (
        <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <Link
                    href={seeAllHref}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Ver todas →
                </Link>
            </div>

            {items.length === 0 ? (
                <p className="px-4 py-4 text-sm text-muted-foreground">{emptyText}</p>
            ) : (
                <ul className="divide-y">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                            <div className="flex items-center gap-3">
                                <div>
                                    <Link
                                        href={route('reservations.edit', item.id)}
                                        className="font-medium text-foreground hover:underline"
                                    >
                                        {item.guest}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        Habitación {item.room} · {formatDate(item.check_in_date)}
                                        {item.check_out_date &&
                                            item.check_out_date !== item.check_in_date &&
                                            ` → ${formatDate(item.check_out_date)}`}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${reservationStatusBadge(
                                    item.status,
                                )}`}
                            >
                                {reservationStatusLabel(item.status)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function Dashboard({
    stats = { total: 0, available: 0, occupied: 0, maintenance: 0 },
    arrivalsToday = [],
    departuresToday = [],
    upcomingReservations = [],
    pendingReservations = [],
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="Habitaciones totales"
                    value={stats.total}
                    href={route('rooms.index')}
                />
                <StatCard
                    label="Disponibles"
                    value={stats.available}
                    tone="text-emerald-600 dark:text-emerald-400"
                    href={route('rooms.index', { status: 'disponible' })}
                />
                <StatCard
                    label="Ocupadas"
                    value={stats.occupied}
                    tone="text-sky-600 dark:text-sky-400"
                    href={route('rooms.index', { status: 'ocupada' })}
                />
                <StatCard
                    label="En mantenimiento"
                    value={stats.maintenance}
                    tone="text-amber-600 dark:text-amber-400"
                    href={route('rooms.index', { status: 'mantenimiento' })}
                />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <ReservationList
                    title="Llegadas de hoy"
                    items={arrivalsToday}
                    emptyText="No hay llegadas previstas para hoy."
                    seeAllHref={route('reservations.index', { filter: 'arrivals' })}
                />
                <ReservationList
                    title="Salidas de hoy"
                    items={departuresToday}
                    emptyText="No hay salidas previstas para hoy."
                    seeAllHref={route('reservations.index', { filter: 'departures' })}
                />
                <ReservationList
                    title="Próximas reservas"
                    items={upcomingReservations}
                    emptyText="No hay reservas próximas."
                    seeAllHref={route('reservations.index', { filter: 'upcoming' })}
                />
                <ReservationList
                    title="Pendientes de confirmar"
                    items={pendingReservations}
                    emptyText="No hay reservas pendientes de confirmar."
                    seeAllHref={route('reservations.index', { status: 'pendiente' })}
                />
            </div>
        </AuthenticatedLayout>
    );
}
