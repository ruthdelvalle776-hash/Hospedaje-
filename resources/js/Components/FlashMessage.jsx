import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState({ type: 'success', message: '' });

    useEffect(() => {
        if (flash?.success) {
            setState({ type: 'success', message: flash.success });
            setVisible(true);
        } else if (flash?.error) {
            setState({ type: 'error', message: flash.error });
            setVisible(true);
        }
    }, [flash]);

    if (!visible || !state.message) {
        return null;
    }

    const styles =
        state.type === 'success'
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-destructive/40 bg-destructive/10 text-destructive';

    return (
        <div
            className={`mb-4 flex items-center justify-between gap-4 rounded-md border px-4 py-3 text-sm ${styles}`}
        >
            <span>{state.message}</span>
            <button
                type="button"
                onClick={() => setVisible(false)}
                className="shrink-0 text-current opacity-70 transition-opacity hover:opacity-100"
                aria-label="Cerrar"
            >
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}
