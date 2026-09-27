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
