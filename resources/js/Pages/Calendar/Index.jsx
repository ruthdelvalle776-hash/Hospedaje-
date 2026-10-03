import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const MONTHS = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

const pad = (value) => String(value).padStart(2, '0');

export default function Index({ month, rooms, reservations }) {
    const prefix = `${month.year}-${pad(month.month)}-`;
    const days = Array.from({ length: month.days }, (_, i) => i + 1);

    const dayNumInMonth = (date) =>
        date.startsWith(prefix) ? Number(date.slice(8, 10)) : null;

    const occupancy = {};
    rooms.forEach((room) => {
        occupancy[room.id] = {};
    });

    reservations.forEach((reservation) => {
        const inDay = dayNumInMonth(reservation.check_in_date);
        const outDay = dayNumInMonth(reservation.check_out_date);

        const start = inDay ?? 1;
        const end = (outDay ?? month.days + 1) - 1;

        if (end < start) {
            return;
        }

        for (let day = start; day <= end; day++) {
            let kind = 'stay';

            if (inDay !== null && day === inDay) {
                kind = 'start';
            } else if (outDay !== null && day === end) {
                kind = 'end';
            }

            occupancy[reservation.room_id][day] = {
                kind,
                guest: reservation.guest,
            };
        }
    });

    const goTo = (value) =>
        router.get(
            route('calendar.index'),
            { month: value },
            { preserveState: true, preserveScroll: true },
        );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Calendario
                </h2>
            }
        >
            <Head title="Calendario" />

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                    {MONTHS[month.month - 1]} {month.year}
                </h3>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => goTo(month.prev)}
                        className="btn-secondary px-3 py-1.5"
                    >
                        ← Anterior
                    </button>
                    <button
                        type="button"
                        onClick={() => goTo(month.next)}
                        className="btn-secondary px-3 py-1.5"
                    >
                        Siguiente →
                    </button>
                </div>
            </div>

            <div className="card mt-4 overflow-hidden">
                <div className="border-b px-4 py-3 text-sm font-medium text-muted-foreground">
                    Llegadas y salidas
                </div>

                <div className="grid grid-cols-7 border-b bg-muted/30">
                    {WEEKDAYS.map((weekday) => (
                        <div
                            key={weekday}
                            className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
                        >
                            {weekday}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {Array.from({ length: month.first_weekday }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="min-h-20 border-b border-r"
                        />
                    ))}

                    {days.map((day) => {
                        const dayDate = `${prefix}${pad(day)}`;
                        const arrivals = reservations.filter(
                            (r) => r.check_in_date === dayDate,
                        );
                        const departures = reservations.filter(
                            (r) => r.check_out_date === dayDate,
                        );

                        return (
                            <div
                                key={day}
                                className="min-h-20 border-b border-r p-1.5 text-xs"
                            >
                                <div className="font-medium text-foreground">
                                    {day}
                                </div>

                                {arrivals.map((reservation) => (
                                    <div
                                        key={`in-${reservation.id}`}
                                        className="mt-0.5 truncate text-emerald-600 dark:text-emerald-400"
                                        title={`Llegada: ${reservation.guest}`}
                                    >
                                        ↓ {reservation.guest}
                                    </div>
                                ))}

                                {departures.map((reservation) => (
                                    <div
                                        key={`out-${reservation.id}`}
                                        className="mt-0.5 truncate text-amber-600 dark:text-amber-400"
                                        title={`Salida: ${reservation.guest}`}
                                    >
                                        ↑ {reservation.guest}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="card mt-6 overflow-hidden">
                <div className="border-b px-4 py-3 text-sm font-medium text-muted-foreground">
                    Ocupación por habitación
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-10 bg-card px-3 py-2 font-medium text-muted-foreground">
                                    Habitación
                                </th>
                                {days.map((day) => (
                                    <th
                                        key={day}
                                        className="px-1 py-2 text-center text-xs font-medium text-muted-foreground"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rooms.map((room) => (
                                <tr key={room.id}>
                                    <td className="sticky left-0 z-10 whitespace-nowrap bg-card px-3 py-2 font-medium text-foreground">
                                        {room.number}
                                        {room.category
                                            ? ` · ${room.category}`
                                            : ''}
                                    </td>

                                    {days.map((day) => {
                                        const cell = occupancy[room.id][day];

                                        if (!cell) {
                                            return (
                                                <td key={day} className="p-0.5" />
                                            );
                                        }

                                        const rounding =
                                            cell.kind === 'start'
                                                ? 'rounded-l-md'
                                                : cell.kind === 'end'
                                                  ? 'rounded-r-md'
                                                  : '';

                                        return (
                                            <td key={day} className="p-0.5">
                                                <div
                                                    className={`h-6 bg-sky-500/70 ${rounding}`}
                                                    title={cell.guest}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t px-4 py-2 text-xs text-muted-foreground">
                    Los bloques azules indican ocupación; el inicio y el fin de
                    cada reserva se marcan con bordes redondeados.
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
