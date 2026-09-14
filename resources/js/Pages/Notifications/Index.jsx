import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link, router, usePage } from '@inertiajs/react';

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
    const { auth } = usePage().props;
    const canCreate = auth.permissions.includes('notifications.create');

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
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1a1a1a]">Notifikasi</h2>
                        <p className="text-sm text-zinc-500 mt-1">Kelola dan lihat semua pemberitahuan Anda di sini.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {notifications.data.length > 0 && notifications.data.some(n => !n.is_read) && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] bg-[#ffffff] border border-zinc-200 rounded-xl hover:bg-[#f8f8f8] transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5 text-[#eaae36]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Tandai Semua Dibaca
                            </button>
                        )}
                        {canCreate && (
                            <Link
                                href={route('notifications.create')}
                                className="px-4 py-2.5 text-sm font-semibold text-white bg-[#1a1a1a] rounded-xl hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Buat Notifikasi
                            </Link>
                        )}
                    </div>
                </div>

                <div className="bg-[#ffffff] rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                    {notifications.data.length === 0 ? (
                        <div className="p-16 text-center text-zinc-500 flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#f8f8f8] rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Belum ada notifikasi</h3>
                            <p className="text-sm">Anda akan melihat pemberitahuan di sini ketika ada aktivitas baru.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-zinc-100">
                            {notifications.data.map((item) => (
                                <li 
                                    key={item.id} 
                                    className={`group p-6 transition-all duration-200 border-l-4 ${item.is_read ? 'bg-[#ffffff] hover:bg-[#f8f8f8] border-transparent' : 'bg-[#ffffff] hover:bg-[#f8f8f8] border-[#eaae36]'}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {!item.is_read && (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#eaae36] shadow-sm flex-shrink-0 animate-pulse"></span>
                                                )}
                                                <h3 className={`font-semibold text-lg ${item.is_read ? 'text-zinc-600' : 'text-[#1a1a1a]'}`}>
                                                    {item.notification.title}
                                                </h3>
                                            </div>
                                            <p className={`text-base leading-relaxed pl-5.5 ${item.is_read ? 'text-zinc-500' : 'text-zinc-600'}`}>
                                                {item.notification.body}
                                            </p>
                                            
                                            <div className="mt-4 flex items-center gap-4 pl-5.5">
                                                {item.notification.url && (
                                                    <a 
                                                        href={item.notification.url}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1a1a1a] bg-[#f8f8f8] border border-zinc-200 rounded-lg hover:border-[#eaae36] hover:text-[#eaae36] transition-all"
                                                    >
                                                        Lihat Detail
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                )}
                                                <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-md">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {timeAgo(item.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {!item.is_read && (
                                            <button
                                                onClick={() => markAsRead(item.id)}
                                                className="p-2.5 text-zinc-400 hover:text-[#eaae36] rounded-full hover:bg-[#f8f8f8] transition-all opacity-0 group-hover:opacity-100"
                                                title="Tandai dibaca"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="flex justify-center pt-4">
                        <div className="flex gap-1 bg-[#ffffff] rounded-xl p-1.5 shadow-sm border border-zinc-200">
                            {notifications.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                        link.active 
                                            ? 'bg-[#1a1a1a] text-[#ffffff] shadow-sm' 
                                            : link.url 
                                                ? 'bg-transparent text-zinc-600 hover:bg-[#f8f8f8] hover:text-[#1a1a1a]' 
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
