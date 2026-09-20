export const ROOM_STATUSES = [
    {
        value: 'disponible',
        label: 'Disponible',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    {
        value: 'ocupada',
        label: 'Ocupada',
        badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    },
    {
        value: 'mantenimiento',
        label: 'Mantenimiento',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    },
];

export function roomStatusLabel(status) {
    return (
        ROOM_STATUSES.find((item) => item.value === status)?.label ?? status
    );
}

export function roomStatusBadge(status) {
    return (
        ROOM_STATUSES.find((item) => item.value === status)?.badge ??
        'bg-muted text-muted-foreground'
    );
}
