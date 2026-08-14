import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap mt-6 -mb-1 justify-center gap-1">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <div
                            key={key}
                            className="px-4 py-2 text-sm text-gray-400 border rounded-md"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm border rounded-md hover:bg-gray-100 ${
                            link.active ? 'bg-[#eaae36] text-white border-[#eaae36] hover:bg-yellow-600' : 'text-[#1a1a1a]'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
