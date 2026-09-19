import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const companyName = usePage().props.company_name ?? 'Hospedaje';

    return (
        <div className="flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0">
            <Link
                href="/"
                className="flex flex-col items-center gap-2"
            >
                <ApplicationLogo className="h-14 w-14" />
                <span className="text-xl font-semibold text-foreground">
                    {companyName}
                </span>
            </Link>

            <div className="card mt-6 w-full px-6 py-4 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
