import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';

export default function UserActionsDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const handleClick = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 5,
                left: rect.left - 100
            });
        }
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="text-zinc-500 hover:text-zinc-700 font-bold text-lg p-2 rounded transition-colors"
                title="Actions"
            >
                ...
            </button>

            {isOpen && (
                <div
                    className="fixed bg-white border border-zinc-200 rounded shadow-lg z-50 w-32"
                    style={{
                        top: `${dropdownPos.top}px`,
                        left: `${dropdownPos.left}px`
                    }}
                >
                    <Link
                        href={`/users/${user.id}`}
                        className="text-left block px-4 py-2 text-sm text-blue-700 hover:bg-zinc-100 hover:text-yellow-600 transition-colors first:rounded-t"
                        onClick={closeDropdown}
                    >
                        View
                    </Link>
                    <Link
                        href={`/users/${user.id}/edit`}
                        className="text-left block px-4 py-2 text-sm text-blue-500 hover:bg-zinc-100 hover:text-blue-600 transition-colors"
                        onClick={closeDropdown}
                    >
                        Edit
                    </Link>
                    <form action={`/users/${user.id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <button
                             type="submit"
                             className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-100 hover:text-red-600 transition-colors last:rounded-b"
                        >
                            Delete
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
