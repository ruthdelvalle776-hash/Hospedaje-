import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function GuestSelect({ selectedGuest = null, onChange }) {
    const [selected, setSelected] = useState(selectedGuest);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);
    const rootRef = useRef(null);

    useEffect(() => {
        setSelected(selectedGuest);
    }, [selectedGuest?.id]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInput = (value) => {
        setQuery(value);
        setSelected(null);
        onChange(null);

        clearTimeout(timeoutRef.current);

        if (!value.trim()) {
            setResults([]);
            setOpen(false);

            return;
        }

        timeoutRef.current = setTimeout(async () => {
            const response = await fetch(
                route('guests.search', { q: value }),
                { headers: { Accept: 'application/json' } },
            );

            if (response.ok) {
                setResults(await response.json());
                setOpen(true);
            }
        }, 250);
    };

    const handleSelect = (guest) => {
        setSelected(guest);
        setQuery('');
        setOpen(false);
        onChange(guest.id);
    };

    const displayValue =
        query !== ''
            ? query
            : selected
              ? `${selected.first_name} ${selected.last_name}`
              : '';

    return (
        <div ref={rootRef} className="relative">
            <input
                type="text"
                value={displayValue}
                onChange={(e) => handleInput(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder="Buscar huésped por nombre o documento..."
                className="input block w-full"
            />

            {open && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border bg-card shadow-lg">
                    {results.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-muted-foreground">
                            Sin resultados.
                        </p>
                    ) : (
                        <ul className="max-h-56 overflow-y-auto">
                            {results.map((guest) => (
                                <li key={guest.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(guest)}
                                        className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                                    >
                                        <span className="font-medium text-foreground">
                                            {guest.first_name} {guest.last_name}
                                        </span>
                                        {guest.document_id && (
                                            <span className="ml-2 text-muted-foreground">
                                                CI: {guest.document_id}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="border-t px-3 py-2">
                        <Link
                            href={route('guests.create')}
                            className="text-sm text-primary hover:underline"
                        >
                            + Crear nuevo huésped
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
