import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link, router } from '@inertiajs/react';

function timeAgo(dateParam) {
    if (!dateParam) return null;
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const today = new Date();
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 30) return `${days} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Index({ notifications }) {
    const markAsRead = (recipientId) => {
        router.patch(route('notifications.read', recipientId), {}, {
            preserveScroll: true
        });
    };

    const markAllAsRead = () => {
        router.patch(route('notifications.read-all'), {}, {
            preserveScroll: true
        });
    };

    return (
        <DashboardLayout>
            <Head title="Notifikasi" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#1a1a1a]">Semua Notifikasi</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Tandai Semua Dibaca
                        </button>
                        <Link
                            href={route('notifications.create')}
                            className="px-4 py-2 text-sm font-semibold text-white bg-[#1a1a1a] rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
                        >
                            + Buat Notifikasi
                        </Link>
                    </div>
                </div>

                <div className="bg-[#ffffff] rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                    {notifications.data.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                            <svg className="w-12 h-12 mb-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-lg">Tidak ada notifikasi saat ini.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-zinc-100">
                            {notifications.data.map((item) => (
                                <li 
                                    key={item.id} 
                                    className={`p-5 transition-all duration-200 ${item.is_read ? 'bg-[#ffffff] hover:bg-zinc-50' : 'bg-[#f0f7ff] hover:bg-[#e6f2ff]'}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                {!item.is_read && (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#eaae36] shadow-sm flex-shrink-0"></span>
                                                )}
                                                <h3 className={`font-semibold text-lg ${item.is_read ? 'text-zinc-700' : 'text-[#1a1a1a]'}`}>
                                                    {item.notification.title}
                                                </h3>
                                            </div>
                                            <p className={`text-base leading-relaxed ${item.is_read ? 'text-zinc-500' : 'text-zinc-700'}`}>
                                                {item.notification.body}
                                            </p>
                                            {item.notification.url && (
                                                <div className="mt-4">
                                                    <a 
                                                        href={item.notification.url}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#eaae36] rounded-md hover:bg-yellow-600 transition-colors"
                                                    >
                                                        Lihat Detail
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            )}
                                            
                                            <div className="text-sm text-zinc-400 mt-3 flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {timeAgo(item.created_at)}
                                            </div>
                                        </div>
                                        
                                        {!item.is_read && (
                                            <button
                                                onClick={() => markAsRead(item.id)}
                                                className="p-2 text-zinc-400 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                                                title="Tandai dibaca"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Pagination */}
                {notifications.links && notifications.links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-zinc-200">
                            {notifications.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        link.active 
                                            ? 'bg-[#1a1a1a] text-white shadow-sm' 
                                            : link.url 
                                                ? 'bg-transparent text-zinc-600 hover:bg-zinc-100' 
                                                : 'bg-transparent text-zinc-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
