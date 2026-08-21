import React from 'react';
import { Link } from '@inertiajs/react';

export default function PremiumTable({ 
    columns, 
    data, 
    emptyStateTitle = "Tidak Ada Data", 
    emptyStateMessage = "Belum ada data yang ditemukan dalam sistem.", 
    emptyStateActionText = "Buat Baru",
    emptyStateActionRoute = null
}) {
    return (
        <div className="bg-white backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-white/60 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            {columns.map((col, index) => (
                                <th 
                                    key={index} 
                                    scope="col" 
                                    className={`px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data && data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="group hover:bg-white/60 transition-colors duration-200">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className={`px-6 py-6 ${col.cellClassName || ''}`}>
                                            {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-[#f8f8f8] rounded-2xl flex items-center justify-center mb-4 text-gray-300 shadow-inner">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1a1a1a]">{emptyStateTitle}</h3>
                                        <p className="text-gray-500 mt-1 max-w-sm">
                                            {emptyStateMessage}
                                        </p>
                                        {emptyStateActionRoute && (
                                            <Link
                                                href={route(emptyStateActionRoute)}
                                                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#eaae36] hover:text-[#d49929] transition-colors"
                                            >
                                                {emptyStateActionText}
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
