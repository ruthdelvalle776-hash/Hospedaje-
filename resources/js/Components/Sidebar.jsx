import { Link } from '@inertiajs/react';
import { navigation } from '@/Config/navigation';

export default function Sidebar({ open = false, onClose = () => {} }) {
    return (
        <>
            {open && (
                <div
                    className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-16 bottom-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <nav className="flex flex-col gap-1 overflow-y-auto p-4">
                    {navigation.map((item) =>
                        item.route ? (
                            <Link
                                key={item.label}
                                href={route(item.route)}
                                className={`sidebar-link ${
                                    route().current(item.route)
                                        ? 'sidebar-link-active'
                                        : ''
                                }`}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                key={item.label}
                                className="sidebar-link cursor-not-allowed opacity-50"
                            >
                                {item.label}
                            </span>
                        ),
                    )}
                </nav>
            </aside>
        </>
    );
}
