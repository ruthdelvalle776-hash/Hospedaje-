import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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

const STATUS_CLASSES = {
    pendiente: 'fc-status-pendiente',
    confirmada: 'fc-status-confirmada',
    'check-in': 'fc-status-check-in',
    'en hospedaje': 'fc-status-en-hospedaje',
    finalizada: 'fc-status-finalizada',
    cancelada: 'fc-status-cancelada',
};

const pad = (value) => String(value).padStart(2, '0');

export default function Index({ rooms, reservations }) {
    const [visibleMonth, setVisibleMonth] = useState(() => {
        const now = new Date();

        return { year: now.getFullYear(), month: now.getMonth() + 1 };
    });

    const events = reservations.map((reservation) => ({
        id: reservation.id,
        title: reservation.guest,
        start: reservation.check_in_date,
        end: reservation.check_out_date,
        allDay: true,
        extendedProps: { status: reservation.status },
    }));

    const { year, month } = visibleMonth;
    const daysInMonth = new Date(year, month, 0).getDate();
    const prefix = `${year}-${pad(month)}-`;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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
        const end = (outDay ?? daysInMonth + 1) - 1;

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Calendario
                </h2>
            }
        >
            <Head title="Calendario" />

            <div className="card overflow-hidden p-2">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={esLocale}
                    events={events}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: '',
                    }}
                    eventClassNames={(arg) => [
                        STATUS_CLASSES[arg.event.extendedProps.status] ??
                            'fc-status-default',
                    ]}
                    eventContent={(arg) => (
                        <div className="flex items-center gap-1 overflow-hidden px-1.5 text-xs leading-5">
                            {arg.isStart && (
                                <span className="shrink-0">↓</span>
                            )}
                            <span className="truncate">{arg.event.title}</span>
                            {arg.isEnd && <span className="shrink-0">↑</span>}
                        </div>
                    )}
                    eventClick={(info) =>
                        router.visit(route('reservations.edit', info.event.id))
                    }
                    datesSet={(arg) =>
                        setVisibleMonth({
                            year: arg.view.currentStart.getFullYear(),
                            month: arg.view.currentStart.getMonth() + 1,
                        })
                    }
                    dayMaxEvents
                    fixedWeekCount={false}
                    height="auto"
                />
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>↓ llegada</span>
                <span>↑ salida</span>
            </div>

            <div className="card mt-6 overflow-hidden">
                <div className="border-b px-4 py-3 text-sm font-medium text-muted-foreground">
                    Ocupación por habitación — {MONTHS[month - 1]} {year}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-10 bg-card px-3 py-2 font-medium text-muted-foreground">
                                    Habitación
                                </th>
                                {days.map((day) => (
                                    <th
                                        key={day}
                                        className="min-w-6 px-1 py-2 text-center text-xs font-medium text-muted-foreground"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.id} className="border-t">
                                    <td className="sticky left-0 z-10 whitespace-nowrap bg-card px-3 py-1.5 font-medium text-foreground">
                                        {room.number}
                                        {room.category
                                            ? ` · ${room.category}`
                                            : ''}
                                    </td>

                                    {days.map((day) => {
                                        const cell = occupancy[room.id][day];

                                        if (!cell) {
                                            return (
                                                <td
                                                    key={day}
                                                    className="p-0.5"
                                                />
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
