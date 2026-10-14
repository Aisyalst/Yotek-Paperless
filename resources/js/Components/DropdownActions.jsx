import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

/**
 * Dropdown aksi generik untuk kolom "Aksi" pada tabel index.
 *
 * Pemakaian:
 *   <DropdownActions items={[
 *       { label: 'Lihat',  href: route('x.show', row.id),  permission: 'x.show' },
 *       { label: 'Edit',   href: route('x.edit', row.id),  permission: 'x.edit' },
 *       { label: 'Hapus',  onClick: () => hapus(row),      permission: 'x.destroy', danger: true },
 *   ]} />
 *
 * Item bisa berupa:
 *   - href          : navigasi link (Inertia <Link>)
 *   - method + href : kirim request Inertia (mis. method="delete", href=route('x.destroy', id))
 *   - onClick       : aksi JS (buka modal / confirm)
 *   - permission    : nama permission; item disembunyikan bila user tak punya
 *   - danger        : warna merah (untuk hapus)
 *   - icon          : komponen ikon react-icons (opsional)
 *
 * Bila tidak ada satu pun item yang lolos permission, komponen render null.
 */
export default function DropdownActions({ items = [], align = 'right' }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    // Filter item berdasarkan permission.
    const visibleItems = items.filter((it) => !it.permission || permissions.includes(it.permission));

    useEffect(() => {
        if (!isOpen) return;
        const close = () => setIsOpen(false);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [isOpen]);

    if (visibleItems.length === 0) {
        return null;
    }

    const handleClick = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const width = 144; // w-36
            const left = align === 'right' ? rect.right - width : rect.left;
            setPos({ top: rect.bottom + 5, left: Math.max(8, left) });
        }
        setIsOpen((v) => !v);
    };

    const close = () => setIsOpen(false);

    const handleItem = (it) => {
        close();
        if (it.confirm && !window.confirm(it.confirm)) {
            return;
        }
        if (typeof it.onClick === 'function') {
            it.onClick();
        } else if (it.href && it.method && it.method.toLowerCase() !== 'get') {
            router[it.method.toLowerCase()](it.href);
        }
    };

    const roundClass = (idx) => {
        const isFirst = idx === 0;
        const isLast = idx === visibleItems.length - 1;
        if (isFirst && isLast) return 'rounded';
        if (isFirst) return 'rounded-t';
        if (isLast) return 'rounded-b';
        return '';
    };

    const itemClass = (it, idx) =>
        `flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors ${roundClass(idx)} ${
            it.danger
                ? 'text-red-400 hover:bg-[#252526] hover:text-red-300'
                : 'text-[#1a1a1a] hover:bg-[#252526] hover:text-gray-300'
        }`;

    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={handleClick}
                type="button"
                className="text-gray-400 hover:text-white font-bold text-lg p-2 rounded transition-colors leading-none"
                title="Aksi"
            >
                ...
            </button>

            {isOpen && (
                <>
                    {/* Backdrop transparan untuk klik-di-luar */}
                    <div className="fixed inset-0 z-40" onClick={close} />
                    <div
                        className="fixed bg-[#252526]/5 backdrop-blur-md border border-[#252526] rounded shadow-lg z-50 w-36"
                        style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
                    >
                        {visibleItems.map((it, idx) => {
                            const Icon = it.icon;
                            const content = (
                                <>
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {it.label}
                                </>
                            );

                            if (it.href && (!it.method || it.method.toLowerCase() === 'get')) {
                                return (
                                    <Link key={idx} href={it.href} className={itemClass(it, idx)} onClick={close}>
                                        {content}
                                    </Link>
                                );
                            }

                            return (
                                <button key={idx} type="button" className={itemClass(it, idx)} onClick={() => handleItem(it)}>
                                    {content}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
