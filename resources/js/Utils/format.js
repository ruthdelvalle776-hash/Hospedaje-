export function formatGs(value) {
    return `Gs. ${new Intl.NumberFormat('es-PY').format(Number(value ?? 0))}`;
}

export function formatDate(value) {
    if (!value) {
        return '—';
    }

    const [year, month, day] = String(value).slice(0, 10).split('-');

    if (year && month && day) {
        return `${day}/${month}/${year}`;
    }

    return String(value);
}

export function formatDateTime(value) {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
