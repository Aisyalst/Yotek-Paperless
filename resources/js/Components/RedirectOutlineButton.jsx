import { Link, usePage } from '@inertiajs/react';

export default function RedirectOutlineButton({
    text,
    href,
    className = '',
    routeName = '',
}) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    // If routeName is provided and user doesn't have it, do not render
    if (routeName && !permissions.includes(routeName)) {
        return null;
    }

    return (
        <Link href={href} className={`
            px-3 py-1 border-2 border-blue-500 bg-blue-500/10 text-blue-400 text-semibold rounded hover:bg-blue-600 hover:text-white transition-colors rounded-md text-xs font-medium shadow-sm
            ${className}
        `}>
            {text}
        </Link>
    );
}

