import { Link, usePage } from '@inertiajs/react';

export default function SidebarMenuDash({ link, label, svg }) {
    const { url } = usePage();

    // Convert absolute URL to relative pathname if applicable (e.g. from Ziggy)
    let relativeLink = link;
    try {
        if (link.startsWith('http://') || link.startsWith('https://')) {
            relativeLink = new URL(link).pathname;
        }
    } catch (e) { }

    // Cek apakah menu ini active berdasarkan URL saat ini
    const cleanUrl = url.split('?')[0];
    const cleanLink = relativeLink.split('?')[0];
    const isActive = cleanLink === '/'
        ? cleanUrl === '/'
        : (cleanUrl === cleanLink || (cleanUrl.startsWith(cleanLink + '/') && !cleanUrl.startsWith(cleanLink + '/create')));

    return (
        <li>
            <Link
                href={link}
                className={`transition duration-300 ease-in-out block mx-5 my-2 ps-[5%] py-2 text-sm font-semibold transition-colors rounded-md hover:translate-x-2 flex items-center ${isActive
                        ? 'bg-[#162032] text-white border border-blue-500'
                        : 'text-white border border-transparent hover:border-blue-500 hover:bg-blue-500/30 hover:text-white'
                    }`}
            >
                <span className="flex items-center">
                    {svg}
                </span>
                {label}
            </Link>
        </li>
    );
}