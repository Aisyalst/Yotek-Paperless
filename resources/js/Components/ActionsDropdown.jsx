import React, { useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function UserActionsDropdown({ data, baseLink, view }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    // Extract prefix from baseLink (e.g. "/posts" -> "posts")
    const prefix = baseLink.replace(/^\//, '');

    // Check permissions
    const hasViewPermission = view === "true" && permissions.includes(`${prefix}.show`);
    const hasEditPermission = permissions.includes(`${prefix}.edit`);
    const hasDeletePermission = permissions.includes(`${prefix}.destroy`);

    // If the user has no permissions to perform any action, don't show the button at all
    if (!hasViewPermission && !hasEditPermission && !hasDeletePermission) {
        return null;
    }

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

    // Helper to determine rounding classes based on rendered items
    const activeKeys = [];
    if (hasViewPermission) activeKeys.push('view');
    if (hasEditPermission) activeKeys.push('edit');
    if (hasDeletePermission) activeKeys.push('delete');

    const getRoundClass = (key) => {
        const isFirst = activeKeys[0] === key;
        const isLast = activeKeys[activeKeys.length - 1] === key;
        if (isFirst && isLast) return 'rounded';
        if (isFirst) return 'rounded-t';
        if (isLast) return 'rounded-b';
        return '';
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="text-gray-400 hover:text-white font-bold text-lg p-2 rounded transition-colors"
                title="Actions"
            >
                ...
            </button>

            {isOpen && (
                <div
                    className="fixed bg-blue-900/80 backdrop-blur-md border border-blue-500 rounded shadow-lg z-50 w-32"
                    style={{
                        top: `${dropdownPos.top}px`,
                        left: `${dropdownPos.left}px`
                    }}
                >
                    {hasViewPermission && (
                        <Link
                            href={`${baseLink}/${data.id}`}
                            className={`text-left block px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 transition-colors ${getRoundClass('view')}`}
                            onClick={closeDropdown}
                        >
                            View
                        </Link>
                    )}
                    {hasEditPermission && (
                        <Link
                            href={`${baseLink}/${data.id}/edit`}
                            className={`text-left block px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 transition-colors ${getRoundClass('edit')}`}
                            onClick={closeDropdown}
                        >
                            Edit
                        </Link>
                    )}
                    {hasDeletePermission && (
                        <form action={`${baseLink}/${data.id}`} method="POST">
                            <input type="hidden" name="_method" value="DELETE" />
                            <button
                                type="submit"
                                className={`block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-blue-500/20 hover:text-red-300 transition-colors ${getRoundClass('delete')}`}
                            >
                                Delete
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

