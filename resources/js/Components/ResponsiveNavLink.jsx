import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-primary bg-accent text-primary focus:border-primary focus:bg-accent focus:text-primary'
                    : 'border-transparent text-muted-foreground hover:border-input hover:bg-accent hover:text-foreground focus:border-input focus:bg-accent focus:text-foreground'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
