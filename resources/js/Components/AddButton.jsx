import { Link, usePage } from '@inertiajs/react';
import { HiPlus } from 'react-icons/hi';

/**
 * Tombol "Tambah" seragam untuk seluruh aplikasi.
 *
 * Props:
 * - text      : label tombol (default "Tambah")
 * - href      : bila diisi -> dirender sebagai <Link> (navigasi)
 * - onClick   : bila diisi -> dirender sebagai <button> (mis. buka modal)
 * - routeName : permission yang dibutuhkan; tombol disembunyikan bila user tak punya
 * - showPlus  : tampilkan ikon plus (default true)
 * - className : kelas tambahan
 */
export default function AddButton({
    text = 'Tambah',
    href,
    onClick,
    routeName = '',
    showPlus = true,
    type = 'button',
    className = '',
    ...props
}) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    // Sembunyikan tombol bila routeName diminta tapi user tidak punya permission-nya.
    if (routeName && !permissions.includes(routeName)) {
        return null;
    }

    const baseClass = `inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-semibold hover:bg-[#eaae36] transition-colors ${className}`;

    const content = (
        <>
            {showPlus && <HiPlus className="w-4 h-4" />}
            {text}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={baseClass} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={baseClass} {...props}>
            {content}
        </button>
    );
}
