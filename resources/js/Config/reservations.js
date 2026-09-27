export const RESERVATION_STATUSES = [
    {
        value: 'pendiente',
        label: 'Pendiente',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    },
    {
        value: 'confirmada',
        label: 'Confirmada',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    {
        value: 'check-in',
        label: 'Check-in',
        badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    },
    {
        value: 'en hospedaje',
        label: 'En hospedaje',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    },
    {
        value: 'finalizada',
        label: 'Finalizada',
        badge: 'bg-muted text-muted-foreground',
    },
    {
        value: 'cancelada',
        label: 'Cancelada',
        badge: 'bg-destructive/10 text-destructive',
    },
];

export const MANAGEABLE_RESERVATION_STATUSES = RESERVATION_STATUSES.filter(
    (item) => item.value === 'pendiente' || item.value === 'confirmada',
);

export const CANCELLABLE_RESERVATION_STATUSES = ['pendiente', 'confirmada'];

export function reservationStatusLabel(status) {
    return (
        RESERVATION_STATUSES.find((item) => item.value === status)?.label ??
        status
    );
}

export function reservationStatusBadge(status) {
    return (
        RESERVATION_STATUSES.find((item) => item.value === status)?.badge ??
        'bg-muted text-muted-foreground'
    );
}
