import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#1e1e1e] pt-6 sm:justify-center sm:pt-0 bg-dot-pattern">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-200" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-[#252526] px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg border border-zinc-700">
                {children}
            </div>
        </div>
    );
}
